import { ParticipantPopulated } from "../../../backend/src/util/types";

export const formatUsernames = (
	participants: Array<ParticipantPopulated>,
	myUserId: string
): string => {
	// it does a comma separated list, and filters yourself out
	const usernames = participants
		.filter((participant) => participant.user.id != myUserId)
		.map((participant) => participant.user.username);

	return usernames.join(", ");
};
