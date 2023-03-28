import React, { useEffect, useState } from "react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	Button,
	Stack,
	Input,
} from "@chakra-ui/react";
import UserOperations from "../../../../graphql/operations/user";
import ConversationOperations from "../../../../graphql/operations/conversation";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
	CreateConversationData,
	CreateConversationInput,
	SearchedUser,
	SearchUsersData,
	SearchUsersInput,
} from "@/src/util/types";
import UserSearchList from "./UserSearchList";
import Participants from "./Participants";
import { toast } from "react-hot-toast";
import { Session } from "next-auth";
import { useRouter } from "next/router";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	session: Session;
}

const ConversationModal = ({ isOpen, onClose, session }: ModalProps) => {
	const router = useRouter();

	const [username, setUsername] = useState("");
	const [participants, setParticipants] = useState<SearchedUser[]>([]);

	const [searchUsers, { loading, error, data }] = useLazyQuery<
		SearchUsersData,
		SearchUsersInput
	>(UserOperations.Queries.searchUsers);
	const [createConversation, { loading: createConversationLoading }] =
		useMutation<CreateConversationData, CreateConversationInput>(
			ConversationOperations.Mutations.createConversation
		);

	const onSearch = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("here");
		searchUsers({ variables: { username } });
		console.log("over here");
	};

	const addParticipant = (user: SearchedUser) => {
		setParticipants((prev) => [...prev, user]);
		setUsername("");
	};
	const removeParticipant = (userId: string) => {
		setParticipants((prev) => prev.filter((p) => p.id !== userId));
	};
	const onCreateConversation = async () => {
		const participantIds = [
			...participants.map((p) => p.id),
			session.user.id,
		];
		try {
			const { data } = await createConversation({
				variables: {
					participantIds,
				},
			});
			if (!data?.createConversation) {
				throw new Error("Failed to create conversation");
			}

			const {
				createConversation: { conversationId },
			} = data;

			router.push({
				query: {
					conversationId,
				},
			});
			// Clearing modal/state
			setParticipants([]);
			setUsername("");
			onClose();
		} catch (error: any) {
			console.log("onCreateConversation error", error);
			toast.error(error?.message);
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />

			<ModalContent bg="#2d2d2d" pb={4}>
				<ModalHeader>Create a Conversation</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<form onSubmit={onSearch}>
						<Stack spacing={4}>
							<Input
								placeholder="Enter a username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
							<Button
								type="submit"
								isLoading={loading}
								isDisabled={!username}
							>
								Search
							</Button>
						</Stack>
					</form>
					{data?.searchUsers && (
						<UserSearchList
							users={data.searchUsers}
							addParticipant={addParticipant}
						/>
					)}
					{participants.length > 0 && (
						<>
							<Participants
								participants={participants}
								removeParticipant={removeParticipant}
							/>
							<Button
								bg="brand.100"
								width="100%"
								mt={6}
								_hover={{ bg: "brand.100" }}
								onClick={onCreateConversation}
								isLoading={createConversationLoading}
							>
								Create Conversation
							</Button>
						</>
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default ConversationModal;
