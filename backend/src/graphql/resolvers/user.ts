import { ApolloError } from "apollo-server-core";
import { CreateUsernameResponse, GraphQLContext } from "../../util/types";
import { User } from "@prisma/client";

const resolvers = {
	Query: {
		searchUsers: async (
			_: any,
			args: { username: string },
			context: GraphQLContext
		): Promise<Array<User>> => {
			const { username: searchedUsername } = args;
			const { session, prisma } = context;

			if (!session?.user) {
				throw new ApolloError("Not authorized");
			}
			const ownUsername = session?.user?.username;

			try {
				const users = await prisma.user.findMany({
					where: {
						username: {
							contains: searchedUsername,
							not: ownUsername,
							mode: "insensitive",
						},
					},
				});

				return users;
			} catch (error: any) {
				console.log("searchUser error", error);
				throw new ApolloError(error?.message);
			}
		},
	},
	Mutation: {
		createUsername: async (
			_: any,
			args: { username: string },
			context: GraphQLContext
		): Promise<CreateUsernameResponse> => {
			const { username } = args;
			const { session, prisma } = context;

			if (!session?.user) {
				return {
					error: "Not authorized",
				};
			}

			const { id: userId } = session.user;
			try {
				// check if username is taken
				const existingUser = await prisma.user.findUnique({
					where: {
						username: username,
					},
				});
				if (existingUser) {
					return {
						error: "Username already taken. Try another",
					};
				}
				await prisma.user.update({
					where: {
						id: userId,
					},
					data: {
						username,
					},
				});

				return {
					success: true,
				};
			} catch (error: any) {
				console.log("createusername error", error);
				return {
					error: error?.message,
					success: false,
				};
			}
		},
	},
	// Subscription: {},
};

export default resolvers;
