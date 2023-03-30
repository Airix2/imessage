import { GraphQLError } from "graphql";
import {
	GraphQLContext,
	MessagePopulated,
	MessageSentSubscriptionPayload,
	SendMessageArgs,
} from "../../util/types";
import { Prisma } from "@prisma/client";
import { withFilter } from "graphql-subscriptions";
import { userIsConversationParticipant } from "../../util/functions";
import { conversationPopulated } from "./conversation";

const resolvers = {
	Query: {
		messages: async (
			_: any,
			args: { conversationId: string },
			context: GraphQLContext
		): Promise<MessagePopulated[]> => {
			const { prisma, session } = context;
			const { conversationId } = args;

			if (!session?.user) {
				throw new GraphQLError("Not Authorized");
			}

			const { id: userId } = session.user;
			// verify that the conversation exists & user is participant
			const conversation = await prisma.conversation.findUnique({
				where: {
					id: conversationId,
				},
				include: conversationPopulated,
			});

			if (!conversation) {
				throw new GraphQLError("Conversation Not Found");
			}
			const allowedToView = userIsConversationParticipant(
				conversation.participants || [],
				userId
			);

			if (!allowedToView) {
				throw new GraphQLError("Not Authorized");
			}

			try {
				const messages = await prisma.message.findMany({
					where: {
						conversationId: conversationId,
					},
					include: messagePopulated,
					orderBy: {
						createdAt: "desc",
					},
				});
				return messages;
			} catch (error) {
				console.log("message error", error);
				throw new GraphQLError("Couldn't create message");
			}
		},
	},
	Mutation: {
		sendMessage: async (
			_: any,
			args: SendMessageArgs,
			context: GraphQLContext
		): Promise<boolean> => {
			const { session, prisma, pubsub } = context;
			const { id: messageId, senderId, conversationId, body } = args;

			if (!session?.user) {
				throw new GraphQLError("Not authorized");
			}

			const { id: userId } = session.user;

			if (userId !== senderId) {
				throw new GraphQLError("Not authorized");
			}

			try {
				const newMessage = await prisma.message.create({
					data: {
						id: messageId,
						senderId,
						conversationId,
						body,
					},
					include: messagePopulated,
				});

				// update conversation entity
				const conversation = await prisma.conversation.update({
					where: {
						id: conversationId,
					},
					data: {
						latestMessageId: newMessage.id,
						participants: {
							update: {
								where: {
									id: senderId,
								},
								data: {
									hasSeenLatestMessage: true,
								},
							},
							updateMany: {
								where: {
									NOT: {
										userId: senderId,
									},
								},
								data: {
									hasSeenLatestMessage: false,
								},
							},
						},
					},
				});
				pubsub.publish("MESSAGE_SENT", {
					messageSent: newMessage,
				});
				// pubsub.publish("CONVERSATION_UPDATED", {
				// 	conversationUpdated: {
				// 		conversation: conversation,
				// 	},
				// });
			} catch (error) {
				console.log("send msg error", error);
				throw new GraphQLError("Error sending message");
			}

			return true;
		},
	},
	Subscription: {
		messageSent: {
			subscribe: withFilter(
				(_: any, __: any, context: GraphQLContext) => {
					const { pubsub } = context;

					return pubsub.asyncIterator(["MESSAGE_SENT"]);
				},
				(
					payload: MessageSentSubscriptionPayload,
					args: { conversationId: string },
					context: GraphQLContext
				) => {
					return (
						payload.messageSent.conversationId ===
						args.conversationId
					);
				}
			),
		},
	},
};

export const messagePopulated = Prisma.validator<Prisma.MessageInclude>()({
	sender: {
		select: {
			id: true,
			username: true,
		},
	},
});

export default resolvers;
