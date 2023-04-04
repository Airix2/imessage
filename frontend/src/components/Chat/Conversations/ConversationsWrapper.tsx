import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { useEffect } from "react";
import ConversationList from "./ConversationList";
import ConversationOperations from "../../../graphql/operations/conversation";
import { gql, useMutation, useQuery } from "@apollo/client";
import { ConversationsData } from "@/src/util/types";
import {
	ConversationPopulated,
	ParticipantPopulated,
} from "@/../backend/src/util/types";
import { useRouter } from "next/router";
import SkeletonLoader from "../../common/SkeletonLoader";

interface ConversationsWrapperProps {
	session: Session;
}

const ConversationsWrapper = ({ session }: ConversationsWrapperProps) => {
	const router = useRouter();
	const conversationId = router?.query?.conversationId;
	const { id: userId } = session.user;
	const {
		data: conversationsData,
		error: conversationsError,
		loading: conversationsLoading,
		subscribeToMore,
	} = useQuery<ConversationsData>(ConversationOperations.Query.conversations);

	const [markConversationAsRead] = useMutation<
		{ markConversationAsRead: true },
		{ conversationId: string; userId: string }
	>(ConversationOperations.Mutations.markConversationAsRead);

	const onViewConversation = async (
		conversationId: string,
		hasSeenLatestMessage: boolean
	) => {
		router.push({ query: { conversationId } });
		// so it doesnt mark it as read again
		if (hasSeenLatestMessage) return;
		try {
			await markConversationAsRead({
				variables: {
					conversationId,
					userId,
				},
				optimisticResponse: {
					markConversationAsRead: true,
				},
				update: (cache) => {
					// get conversation participants from cache
					const participantsFragment = cache.readFragment<{
						participants: Array<ParticipantPopulated>;
					}>({
						id: `Conversation:${conversationId}`,
						fragment: gql`
							fragment Participant on Conversation {
								participants {
									user {
										id
										username
									}
									hasSeenLatestMessage
								}
							}
						`,
					});
					if (!participantsFragment) return;
					const participants = [...participantsFragment.participants];
					const userParticipantIndex = participants.findIndex(
						(p) => p.userId === userId
					);

					if (userParticipantIndex === -1) return;
					const userParticipant = participants[userParticipantIndex];
					participants[userParticipantIndex] = {
						...userParticipant,
						hasSeenLatestMessage: true,
					};

					cache.writeFragment({
						id: `Conversation:${conversationId}`,
						fragment: gql`
							fragment UpdatedParticipant on Conversation {
								participants
							}
						`,
						data: {
							participants: participants,
						},
					});
				},
			});
		} catch (error) {
			console.log("onviewconversation error", error);
		}
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

	return (
		<Box
			display={{ base: conversationId ? "none" : "flex", md: "flex" }}
			width={{ base: "100%", md: "400px" }}
			bg="whiteAlpha.50"
			flexDirection="column"
			gap={4}
			py={6}
			px={3}
		>
			{conversationsLoading ? (
				<SkeletonLoader count={4} width="100%" height="90px" />
			) : (
				<ConversationList
					conversations={conversationsData?.conversations || []}
					session={session}
					onViewConversation={onViewConversation}
				/>
			)}
		</Box>
	);
};

export default ConversationsWrapper;
