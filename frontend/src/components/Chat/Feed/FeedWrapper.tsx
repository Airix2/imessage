import { Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React from "react";
import MessagesHeader from "./Messages/MessagesHeader";

interface FeedWrapperProps {
	session: Session;
}

const FeedWrapper = ({ session }: FeedWrapperProps) => {
	const router = useRouter();
	const conversationId = router.query?.conversationId as string;
	const {
		user: { id: userId },
	} = session;

	return (
		<Flex
			display={{ base: conversationId ? "flex" : "none", md: "flex" }}
			width="100%"
			direction="column"
		>
			{conversationId ? (
				<Flex
					direction="column"
					justify="space-between"
					overflow="hidden"
					flexGrow={1}
				>
					<MessagesHeader
						userId={userId}
						conversationId={conversationId}
					/>
					{/* <Messages /> */}
				</Flex>
			) : (
				<div>none selected</div>
			)}
		</Flex>
	);
};

export default FeedWrapper;
