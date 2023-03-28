import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { useEffect } from "react";
import ConversationList from "./ConversationList";
import ConversationOperations from "../../../graphql/operations/conversation";
import { useQuery } from "@apollo/client";
import { ConversationsData } from "@/src/util/types";

interface ConversationsWrapperProps {
	session: Session;
}

const ConversationsWrapper = ({ session }: ConversationsWrapperProps) => {
	const {
		data: conversationsData,
		error: conversationsError,
		loading: conversationsLoading,
	} = useQuery<ConversationsData>(ConversationOperations.Query.conversations);

	return (
		<Box
			width={{ base: "100%", md: "400px" }}
			border="1px solid yellow"
			bg="whiteAlpha.50"
			py={6}
			px={3}
		>
			{/* Skeleton Loader */}
			<ConversationList
				conversations={conversationsData?.conversations || []}
				session={session}
			/>
		</Box>
	);
};

export default ConversationsWrapper;
