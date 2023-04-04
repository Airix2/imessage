import userResolvers from "./user";
import conversationResolvers from "./conversation";
import messagesResolvers from "./messages";
import merge from "lodash.merge";
import scalarResolvers from "./scalars";

const resolvers = merge(
	{},
	userResolvers,
	conversationResolvers,
	messagesResolvers,
	scalarResolvers
);

export default resolvers;
