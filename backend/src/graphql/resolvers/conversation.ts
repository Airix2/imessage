import { ApolloError } from "apollo-server-core";
import { ConversationPopulated, GraphQLContext } from "../../util/types";
import { Prisma } from "@prisma/client";

const resolvers = {
	Query: {
		conversations: async (
			_: any,
			__: any,
			context: GraphQLContext
		): Promise<ConversationPopulated[]> => {
			const { session, prisma } = context;

			if (!session?.user) {
				throw new ApolloError("Not Authorized");
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
				throw new ApolloError(error?.message);
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
			const { session, prisma } = context;

			if (!session?.user) {
				throw new ApolloError("Not Authorized");
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
				return {
					conversationId: conversation.id,
				};
			} catch (error: any) {
				console.log("conversation error", error);
				throw new ApolloError("Error creating conversation");
			}
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
