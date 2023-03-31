import { MessagesData, MessagesVariables } from "@/src/util/types";
import { useQuery } from "@apollo/client";
import { Flex, Stack } from "@chakra-ui/react";
import MessageOperations from "../../../../graphql/operations/message";
import React from "react";
import { toast } from "react-hot-toast";
import SkeletonLoader from "@/src/components/common/SkeletonLoader";

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

	if (error) {
		return null;
	}

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
						// <MessageItem />
						<div key={msg.id}>{msg.body}</div>
					))}
				</Flex>
			)}
		</Flex>
	);
};

export default Messages;
