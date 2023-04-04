import { ConversationPopulated } from "@/../backend/src/util/types";
import { Box, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ConversationItem from "./ConversationItem";
import ConversationModal from "./Modal";

interface ConversationListProps {
	session: Session;
	conversations: ConversationPopulated[];
	onViewConversation: (
		conversationId: string,
		hasSeenLatestMessage: boolean
	) => void;
}

const ConversationList = ({
	session,
	conversations,
	onViewConversation,
}: ConversationListProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();
	const {
		user: { id: userId },
	} = session;

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
			{conversations.map((conversation) => {
				const participant = conversation.participants.find(
					(p) => p.user.id === userId
				);

				if (!participant) {
					throw new Error("Participant is undefined");
				}

				return (
					<ConversationItem
						onClick={() =>
							onViewConversation(
								conversation.id,
								participant?.hasSeenLatestMessage
							)
						}
						userId={userId}
						isSelected={
							conversation.id === router?.query?.conversationId
						}
						conversation={conversation}
						key={conversation.id}
						hasSeenLatestMessage={participant?.hasSeenLatestMessage}
						onDeleteConversation={() => {}}
					/>
				);
			})}
		</Box>
	);
};

export default ConversationList;
