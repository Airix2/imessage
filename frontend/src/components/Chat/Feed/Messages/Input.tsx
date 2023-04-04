import { SendMessageArgs } from "@/../backend/src/util/types";
import { MessagesData } from "@/src/util/types";
import { useMutation } from "@apollo/client";
import { Box, Input } from "@chakra-ui/react";
import ObjectID from "bson-objectid";
import { Session } from "next-auth";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import MessageOperations from "../../../../graphql/operations/message";
import { MessagePopulated } from "@/../backend/src/util/types";

interface MessageInputProps {
	session: Session;
	conversationId: string;
}

const getNewObjectId = () => {
	let id = ObjectID().toString();
	return id;
};

const MessageInput = ({ session, conversationId }: MessageInputProps) => {
	const [messageBody, setMessageBody] = useState("");
	const [sendMessage] = useMutation<
		{ sendMessage: boolean },
		SendMessageArgs
	>(MessageOperations.Mutations.sendMessage);

	const onSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			// send the msg
			const { id: senderId } = session.user;
			const messageId = getNewObjectId();
			const newMessage: SendMessageArgs = {
				id: messageId,
				senderId,
				conversationId,
				body: messageBody,
			};
			const { data, errors } = await sendMessage({
				variables: { ...newMessage },
				optimisticResponse: {
					sendMessage: true,
				},
				update: (cache) => {
					const existing = cache.readQuery<MessagesData>({
						query: MessageOperations.Query.messages,
						variables: { conversationId },
					}) as MessagesData;
					cache.writeQuery<MessagesData, { conversationId: string }>({
						query: MessageOperations.Query.messages,
						variables: { conversationId },
						data: {
							...existing,
							// @ts-ignore
							messages: [
								{
									id: messageId,
									body: messageBody,
									senderId: session.user.id,
									conversationId,
									sender: {
										id: session.user.id,
										username: session.user.username,
									},
									createdAt: new Date(Date.now()),
									updatedAt: new Date(Date.now()),
								},
								...existing.messages,
							],
						},
					});
				},
			});
			if (!data?.sendMessage || errors) {
				throw new Error("Failed to send a message");
			}
			setMessageBody("");
		} catch (error: any) {
			console.log("onsendmsg error", error);
			toast.error(error?.message);
		}
	};

	return (
		<Box px={4} py={6} width="100%">
			<form onSubmit={onSendMessage}>
				<Input
					value={messageBody}
					onChange={(e) => setMessageBody(e.target.value)}
					placeholder="New Message"
					size="md"
					resize="none"
					_focus={{
						boxShadow: "none",
						border: "1px solid",
						borderColor: "whiteAlpha.300",
					}}
				/>
			</form>
		</Box>
	);
};

export default MessageInput;
