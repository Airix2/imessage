import userResolvers from "./user";
import conversationResolvers from "./conversation";
import messagesResolvers from "./messages";
import merge from "lodash.merge";

const resolvers = merge(
	{},
	userResolvers,
	conversationResolvers,
	messagesResolvers
);

export default resolvers;
