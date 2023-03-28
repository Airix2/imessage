import { Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React from "react";

interface FeedWrapperProps {
	session: Session;
}

const FeedWrapper = ({ session }: FeedWrapperProps) => {
	const router = useRouter();
	const { conversationId } = router.query;

	return (
		<Flex
			display={{ base: conversationId ? "flex" : "none", md: "flex" }}
			width="100%"
			direction="column"
		>
			{conversationId ? <Flex> has one</Flex> : <div>none selected</div>}
		</Flex>
	);
};

export default FeedWrapper;
