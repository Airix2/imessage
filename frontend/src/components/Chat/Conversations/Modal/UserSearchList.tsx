import { SearchedUser } from "@/src/util/types";
import { Avatar, Flex, Stack, Text } from "@chakra-ui/react";
import React from "react";

interface UserSearchListProps {
	users: Array<SearchedUser>;
}

const UserSearchList = ({ users }: UserSearchListProps) => {
	return (
		<>
			{users.length === 0 ? (
				<Flex mt={6} justify="center">
					<Text>No users found</Text>
				</Flex>
			) : (
				<Stack mt={6}>
					{users.map((user) => (
						<Stack
							direction="row"
							key={user.id}
							align="center"
							spacing={4}
							py={2}
							px={4}
							borderRadius={4}
							_hover={{
								bg: "whiteAlpha.200",
							}}
						>
							<Avatar src="" />
							<Text color="whiteAlpha.700">{user.username}</Text>
						</Stack>
					))}
				</Stack>
			)}
		</>
	);
};

export default UserSearchList;
