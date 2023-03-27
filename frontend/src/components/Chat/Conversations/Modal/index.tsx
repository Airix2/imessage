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
import { useLazyQuery } from "@apollo/client";
import { SearchUsersData, SearchUsersInput } from "@/src/util/types";
import UserSearchList from "./UserSearchList";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const ConversationModal = ({ isOpen, onClose }: ModalProps) => {
	const [username, setUsername] = useState("");
	const [searchUsers, { loading, error, data }] = useLazyQuery<
		SearchUsersData,
		SearchUsersInput
	>(UserOperations.Queries.searchUsers);

	const onSearch = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("here");
		searchUsers({ variables: { username } });
		console.log("over here");
	};

	useEffect(() => {
		console.log("data", data);
	}, [data]);

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
						<UserSearchList users={data.searchUsers} />
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default ConversationModal;
