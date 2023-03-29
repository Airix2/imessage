import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { useEffect } from "react";
import ConversationList from "./ConversationList";
import ConversationOperations from "../../../graphql/operations/conversation";
import { useQuery } from "@apollo/client";
import { ConversationsData } from "@/src/util/types";
import { ConversationPopulated } from "@/../backend/src/util/types";
import { useRouter } from "next/router";

interface ConversationsWrapperProps {
	session: Session;
}

const ConversationsWrapper = ({ session }: ConversationsWrapperProps) => {
	const router = useRouter();
	const conversationId = router?.query?.conversationId;
	const {
		data: conversationsData,
		error: conversationsError,
		loading: conversationsLoading,
		subscribeToMore,
	} = useQuery<ConversationsData>(ConversationOperations.Query.conversations);

	const onViewConversation = async (conversationId: string) => {
		// Push new convId to router query
		router.push({ query: { conversationId } });
		// Mark conversation as read
	};

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
			display={{ base: conversationId ? "none" : "flex", md: "flex" }}
			width={{ base: "100%", md: "400px" }}
			bg="whiteAlpha.50"
			py={6}
			px={3}
		>
			{/* Skeleton Loader */}
			<ConversationList
				conversations={conversationsData?.conversations || []}
				session={session}
				onViewConversation={onViewConversation}
			/>
		</Box>
	);
};

export default ConversationsWrapper;
