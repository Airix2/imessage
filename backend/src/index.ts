import { ApolloServer } from "apollo-server-express";
import {
	ApolloServerPluginDrainHttpServer,
	ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import express from "express";
import http from "http";

import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";
import * as dotenv from "dotenv";
import { makeExecutableSchema } from "@graphql-tools/schema";
import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";
import { GraphQLContext, Session, SubscriptionContext } from "./util/types";

import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

async function startApolloServer() {
	dotenv.config();
	const app = express();
	const httpServer = http.createServer(app);

	// Create our WebSocket server using the HTTP server we just set up.
	const wsServer = new WebSocketServer({
		server: httpServer,
		path: "/graphql/subscriptions",
	});

	const schema = makeExecutableSchema({
		typeDefs,
		resolvers,
	});
	const corsOptions = {
		origin: process.env.CLIENT_ORIGIN,
		credentials: true,
	};

	const prisma = new PrismaClient();
	// const pubsub

	// Save the returned server's info so we can shutdown this server later
	const serverCleanup = useServer(
		{
			schema,
			context: async (
				ctx: SubscriptionContext
			): Promise<GraphQLContext> => {
				if (ctx?.connectionParams?.session) {
					const { session } = ctx.connectionParams;
					return {
						session,
						prisma,
					};
				}
				return {
					session: null,
					prisma,
				};
			},
		},
		wsServer
	);

	const server = new ApolloServer({
		schema,
		csrfPrevention: true,
		cache: "bounded",
		context: async ({ req, res }): Promise<GraphQLContext> => {
			const session = (await getSession({ req })) as Session;
			return {
				session,
				prisma,
			};
		},
		plugins: [
			// Proper shutdown for the HTTP server.
			ApolloServerPluginDrainHttpServer({ httpServer }),
			// Proper shutdown for the WebSocket server.
			{
				async serverWillStart() {
					return {
						async drainServer() {
							await serverCleanup.dispose();
						},
					};
				},
			},
			ApolloServerPluginLandingPageLocalDefault({ embed: true }),
		],
	});
	await server.start();
	server.applyMiddleware({ app, cors: corsOptions });
	await new Promise<void>((resolve) =>
		httpServer.listen({ port: 5000 }, resolve)
	);
	console.log(
		`🚀 Server ready at http://localhost:5000${server.graphqlPath}`
	);
}

startApolloServer().catch((err) => console.log(err));
