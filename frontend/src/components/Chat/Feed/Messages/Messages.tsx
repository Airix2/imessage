import {
	MessagesData,
	MessageSubscriptionData,
	MessagesVariables,
} from "@/src/util/types";
import { useQuery } from "@apollo/client";
import { Flex, Stack } from "@chakra-ui/react";
import MessageOperations from "../../../../graphql/operations/message";
import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import SkeletonLoader from "@/src/components/common/SkeletonLoader";
import MessageItem from "./MessageItem";

interface MessagesProps {
	conversationId: string;
	userId: string;
}

const Messages = ({ conversationId, userId }: MessagesProps) => {
	const { data, loading, error, subscribeToMore } = useQuery<
		MessagesData,
		MessagesVariables
	>(MessageOperations.Query.messages, {
		variables: { conversationId },
		onError: ({ message }) => {
			toast.error(message);
		},
		// onCompleted: () => {}
	});

	const subscribeToMoreMessages = (conversationId: string) => {
		subscribeToMore({
			document: MessageOperations.Subscriptions.messageSent,
			updateQuery: (
				prev,
				{ subscriptionData }: MessageSubscriptionData
			) => {
				if (!subscriptionData) return prev;

				console.log("here is subdata", subscriptionData);

				const newMsg = subscriptionData.data.messageSent;
				return Object.assign({}, prev, {
					messages:
						newMsg.sender.id === userId
							? prev.messages
							: [newMsg, ...prev.messages],
				});
			},
			variables: {
				conversationId,
			},
		});
	};

	useEffect(() => {
		subscribeToMoreMessages(conversationId);
	}, [conversationId]);

	if (error) {
		return null;
	}
	console.log(data);

	return (
		<Flex direction="column" justify="flex-end" overflow="hidden">
			{loading && (
				<Stack spacing={4} px={4}>
					<SkeletonLoader count={4} height="60px" width="100%" />
				</Stack>
			)}
			{data?.messages && (
				<Flex
					direction="column-reverse"
					overflowY="scroll"
					height="100%"
				>
					{data.messages.map((msg) => (
						<MessageItem
							key={msg.id}
							message={msg}
							sentByMe={msg.sender.id === userId}
						/>
					))}
				</Flex>
			)}
		</Flex>
	);
};

export default Messages;
