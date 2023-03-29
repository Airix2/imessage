import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { useEffect } from "react";
import ConversationList from "./ConversationList";
import ConversationOperations from "../../../graphql/operations/conversation";
import { useQuery } from "@apollo/client";
import { ConversationsData } from "@/src/util/types";
import { ConversationPopulated } from "@/../backend/src/util/types";

interface ConversationsWrapperProps {
	session: Session;
}

const ConversationsWrapper = ({ session }: ConversationsWrapperProps) => {
	const {
		data: conversationsData,
		error: conversationsError,
		loading: conversationsLoading,
		subscribeToMore,
	} = useQuery<ConversationsData>(ConversationOperations.Query.conversations);

	const subscribeToNewConversations = () => {
		subscribeToMore({
			document: ConversationOperations.Subscriptions.conversationCreated,
			variables: {},
			updateQuery: (
				prev,
				{
					subscriptionData,
				}: {
					subscriptionData: {
						data: { conversationCreated: ConversationPopulated };
					};
				}
			) => {
				if (!subscriptionData.data) return prev;
				console.log("sub data", subscriptionData);

				const newConversation =
					subscriptionData.data.conversationCreated;

				return Object.assign({}, prev, {
					conversations: [newConversation, ...prev.conversations],
				});
			},
		});
	};

	// Execute subscription on mount
	useEffect(() => {
		subscribeToNewConversations();
	}, []);

	useEffect(() => {
		console.log("convodata", conversationsData);
	}, [conversationsData]);

	return (
		<Box
			width={{ base: "100%", md: "400px" }}
			border="1px solid yellow"
			bg="whiteAlpha.50"
			py={6}
			px={3}
		>
			{/* Skeleton Loader */}
			<ConversationList
				conversations={conversationsData?.conversations || []}
				session={session}
			/>
		</Box>
	);
};

export default ConversationsWrapper;
