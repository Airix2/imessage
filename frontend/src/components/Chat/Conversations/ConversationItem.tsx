import { ConversationPopulated } from "@/../backend/src/util/types";
import { Stack, Text } from "@chakra-ui/react";
import React from "react";

interface ConversationItemProp {
	conversation: ConversationPopulated;
}

const ConversationItem = ({ conversation }: ConversationItemProp) => {
	return (
		<Stack p={4} _hover={{ bg: "whiteAlpha.200" }} borderRadius={4}>
			<Text>{conversation.id}</Text>
		</Stack>
	);
};

export default ConversationItem;
