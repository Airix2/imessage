import { gql } from "@apollo/client";
import { MessageFields } from "./message";

const ConversationFields = `
	id
	participants {
		user {
			id
			username
		}
		hasSeenLatestMessage
	}
	latestMessage {
		${MessageFields}
	}
	updatedAt
`;

export default {
	Query: {
		conversations: gql`
			query Conversations {
				conversations {
					${ConversationFields}
				}
			}
		`,
	},
	Mutations: {
		createConversation: gql`
			mutation CreateConversation($participantIds: [String]!) {
				createConversation(participantIds: $participantIds) {
					conversationId
				}
			}
		`,
		markConversationAsRead: gql`
			mutation MarkConversationAsRead(
				$conversationId: String!
				$userId: String!
			) {
				markConversationAsRead(
					conversationId: $conversationId
					userId: $userId
				)
			}
		`,
	},
	Subscriptions: {
		conversationCreated: gql`
			subscription ConversationCreated {
				conversationCreated {
					${ConversationFields}
				}
			}
		`,
	},
};
