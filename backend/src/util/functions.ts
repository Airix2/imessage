import { ParticipantPopulated } from "./types";

export const userIsConversationParticipant = (
	participants: ParticipantPopulated[],
	userId: string
): boolean => {
	return !!participants.find((participant) => participant.userId === userId);
};
