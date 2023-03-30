import { Prisma, PrismaClient } from "@prisma/client";
import { ISODateString } from "next-auth";
import {
	conversationPopulated,
	participantPopulated,
} from "../graphql/resolvers/conversation";
import { messagePopulated } from "../graphql/resolvers/messages";
import { Context } from "graphql-ws/lib/server";
import { PubSub } from "graphql-subscriptions";

// Server config
export interface GraphQLContext {
	session: Session | null;
	prisma: PrismaClient;
	pubsub: PubSub;
}
export interface Session {
	user?: User;
	expires: ISODateString;
}
export interface SubscriptionContext extends Context {
	connectionParams: {
		session?: Session;
	};
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
export interface ConversationCreatedSubscriptionPayload {
	conversationCreated: ConversationPopulated;
}

// Messages
export interface SendMessageArgs {
	id: string;
	conversationId: string;
	senderId: string;
	body: string;
}
export type MessagePopulated = Prisma.MessageGetPayload<{
	include: typeof messagePopulated;
}>;
export interface MessageSentSubscriptionPayload {
	messageSent: MessagePopulated;
}
