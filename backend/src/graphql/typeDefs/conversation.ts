import gql from "graphql-tag";

const typeDefs = gql`
	scalar Date
	type Query {
		conversations: [Conversation]
	}
	type Mutation {
		createConversation(participantIds: [String]): CreateConversationResponse
	}

	type CreateConversationResponse {
		conversationId: String
	}
	type Conversation {
		id: String
		latestMessage: Message
		participants: [Participant]
		createdAt: Date
		updatedAt: Date
	}
	type Participant {
		id: String
		user: User
		hasSeenLatestMessage: Boolean
	}

	type Subscription {
		conversationCreated: Conversation
	}
`;

export default typeDefs;
