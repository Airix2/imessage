import {
	ConversationPopulated,
	ParticipantPopulated,
} from "../../../backend/src/util/types";
export interface ICreateUsernameData {
	createUsername: {
		success: boolean;
		error: string;
	};
}
export interface ICreateUsernameVariables {
	username: string;
}

export interface SearchUsersData {
	searchUsers: Array<SearchedUser>;
}
export interface SearchUsersInput {
	username: string;
}
export interface SearchedUser {
	id: string;
	username: string;
}

// Conversations
export interface Conversations {}
export interface ConversationsData {
	conversations: ConversationPopulated[];
}
export interface CreateConversationData {
	createConversation: {
		conversationId: string;
	};
}
export interface CreateConversationInput {
	participantIds: String[];
}
