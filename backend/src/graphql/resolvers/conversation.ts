import { GraphQLError } from "graphql";
import { ConversationPopulated, GraphQLContext } from "../../util/types";
import { Prisma } from "@prisma/client";
import { withFilter } from "graphql-subscriptions";

const resolvers = {
	Query: {
		conversations: async (
			_: any,
			__: any,
			context: GraphQLContext
		): Promise<ConversationPopulated[]> => {
			const { session, prisma } = context;

			if (!session?.user) {
				throw new GraphQLError("Not Authorized");
			}

			const {
				user: { id: userId },
			} = session;

			try {
				// Find all conv that user is a part of
				const conversations = await prisma.conversation.findMany({
					/*
					This is the correct query, but apparently prisma 
					has it bugged and it aint working */
					where: {
						participants: {
							some: {
								userId: {
									equals: userId,
								},
							},
						},
					},
					include: conversationPopulated,
				});

				// if the above query doesn't work, remove the where and then we filter them
				// return conversations.filter(
				// 	(conversation) =>
				// 		!!conversation.participants.find(
				// 			(p) => p.userId === userId
				// 		)
				// );

				return conversations;
			} catch (error: any) {
				console.log(error);
				throw new GraphQLError(error?.message);
			}
		},
	},
	Mutation: {
		createConversation: async (
			_: any,
			args: { participantIds: string[] },
			context: GraphQLContext
		): Promise<{ conversationId: string }> => {
			const { participantIds } = args;
			const { session, prisma, pubsub } = context;

			if (!session?.user) {
				throw new GraphQLError("Not Authorized");
			}

			const {
				user: { id: userId },
			} = session;

			try {
				const conversation = await prisma.conversation.create({
					data: {
						participants: {
							createMany: {
								data: participantIds.map((id) => ({
									userId: id,
									hasSeenLatestMessage: id === userId,
								})),
							},
						},
					},
					include: conversationPopulated,
				});

				// conversation emit
				pubsub.publish("CONVERSATION_CREATED", {
					conversationCreated: conversation,
				});

				return {
					conversationId: conversation.id,
				};
			} catch (error: any) {
				console.log("conversation error", error);
				throw new GraphQLError("Error creating conversation");
			}
		},
	},
	Subscription: {
		conversationCreated: {
			// subscribe: (_: any, __: any, context: GraphQLContext) => {
			// 	const { pubsub } = context;
			// 	return pubsub.asyncIterator(["CONVERSATION_CREATED"]);
			// },
			subscribe: withFilter(
				(_: any, __: any, context: GraphQLContext) => {
					const { pubsub } = context;
					return pubsub.asyncIterator(["CONVERSATION_CREATED"]);
				},
				(
					payload: ConversationCreatedSubscriptionPayload,
					_: any,
					context: GraphQLContext
				) => {
					const { session } = context;
					const { conversationCreated } = payload;

					const { participants } = conversationCreated;
					const userIsParticipant = !!participants.find(
						(p) => p.userId === session?.user?.id
					);
					return userIsParticipant;
				}
			),
		},
	},
};

export const participantPopulated =
	Prisma.validator<Prisma.ConversationParticipantInclude>()({
		user: {
			select: {
				id: true,
				username: true,
			},
		},
	});

export const conversationPopulated =
	Prisma.validator<Prisma.ConversationInclude>()({
		participants: {
			include: participantPopulated,
		},
		latestMessage: {
			include: {
				sender: {
					select: {
						id: true,
						username: true,
					},
				},
			},
		},
	});

export default resolvers;
