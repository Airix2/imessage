import { SearchedUser } from "@/src/util/types";
import { Flex, Stack, Text } from "@chakra-ui/react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import React from "react";

interface ParticipantsProps {
	participants: SearchedUser[];
	removeParticipant: (userId: string) => void;
}

const Participants = ({
	participants,
	removeParticipant,
}: ParticipantsProps) => {
	return (
		<Flex mt={8} gap="10px" flexWrap="wrap">
			{participants.map((participant) => (
				<Stack
					key={participant.id}
					direction="row"
					align="center"
					bg="whiteAlpha.200"
					borderRadius={4}
					p={2}
				>
					<Text>{participant.username}</Text>
					{/* Icon to remove */}
					<IoIosCloseCircleOutline
						size={20}
						cursor="pointer"
						onClick={() => removeParticipant(participant.id)}
					/>
				</Stack>
			))}
		</Flex>
	);
};

export default Participants;
