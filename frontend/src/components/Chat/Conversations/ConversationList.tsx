import { ConversationPopulated } from "@/../backend/src/util/types";
import { Box, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { useEffect, useState } from "react";
import ConversationItem from "./ConversationItem";
import ConversationModal from "./Modal";

interface ConversationListProps {
	session: Session;
	conversations: ConversationPopulated[];
}

const ConversationList = ({
	session,
	conversations,
}: ConversationListProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const onOpen = () => setIsOpen(true);
	const onClose = () => setIsOpen(false);

	return (
		<Box width="100%">
			<Box
				py={2}
				px={4}
				mb={4}
				bg="blackAlpha.300"
				borderRadius={4}
				cursor="pointer"
				onClick={onOpen}
			>
				<Text
					textAlign="center"
					color="whiteAlpha.800"
					fontWeight={500}
				>
					Find or start a conversation
				</Text>
			</Box>
			<ConversationModal
				session={session}
				isOpen={isOpen}
				onClose={onClose}
			/>
			{conversations.map((conversation) => (
				<ConversationItem
					conversation={conversation}
					key={conversation.id}
				/>
			))}
		</Box>
	);
};

export default ConversationList;
