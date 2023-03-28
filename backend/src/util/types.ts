import { Prisma, PrismaClient } from "@prisma/client";
import { ISODateString } from "next-auth";
import {
	conversationPopulated,
	participantPopulated,
} from "../graphql/resolvers/conversation";

export interface GraphQLContext {
	session: Session | null;
	prisma: PrismaClient;
	// pubsub
}
export interface Session {
	user?: User;
	expires: ISODateString;
}
export interface User {
	id: string;
	username: string;
	image: string;
	email: string;
	emailVerified: boolean;
	name: string;
}

// Users
export interface CreateUsernameResponse {
	success?: boolean;
	error?: string;
}

// Conversations
export type ConversationPopulated = Prisma.ConversationGetPayload<{
	include: typeof conversationPopulated;
}>;

export type ParticipantPopulated = Prisma.ConversationParticipantGetPayload<{
	include: typeof participantPopulated;
}>;