import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import React from "react";
import ConversationList from "./ConversationList";

interface ConversationsWrapperProps {
	session: Session;
}

const ConversationsWrapper = ({ session }: ConversationsWrapperProps) => {
	return (
		<Box
			width={{ base: "100%", md: "400px" }}
			border="1px solid yellow"
			bg="whiteAlpha.50"
			py={6}
			px={3}
		>
			{/* Skeleton Loader */}

			<ConversationList session={session} />
		</Box>
	);
};

export default ConversationsWrapper;
