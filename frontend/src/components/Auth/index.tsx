import {
	ICreateUsernameData,
	ICreateUsernameVariables,
} from "../../util/types";
import { useMutation } from "@apollo/client";
import { Button, Center, Image, Input, Stack, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import UserOperations from "../../graphql/operations/user";
import { toast } from "react-hot-toast";

interface IAuthProps {
	session: Session | null;
	reloadSession: () => void;
}

const Auth = ({ session, reloadSession }: IAuthProps) => {
	const [username, setUsername] = useState("");

	const [createUsername, { loading, error }] = useMutation<
		ICreateUsernameData,
		ICreateUsernameVariables
	>(UserOperations.Mutations.createUsername);

	const onSubmit = async () => {
		if (!username) return;
		try {
			const { data } = await createUsername({
				variables: {
					username,
				},
			});

			if (!data?.createUsername) {
				throw new Error();
			}

			if (data.createUsername.error) {
				const { error } = data.createUsername;
				throw new Error(error);
			}

			toast.success("Username successfully created!");

			// Reload session to obtain new username
			reloadSession();
		} catch (error: any) {
			toast.error(error?.message);
			console.log("onsubmit error", error);
		}
	};

	return (
		<Center height="100vh">
			<Stack alignItems="center" spacing={8}>
				{session ? (
					<>
						<Text fontSize="3xl">Create a Username</Text>
						<Input
							placeholder="Enter a username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
						<Button
							width="100%"
							onClick={onSubmit}
							isLoading={loading}
						>
							Save
						</Button>
					</>
				) : (
					<>
						<Text fontSize="3xl">MessengerQL</Text>
						<Button
							leftIcon={
								<Image
									height="20px"
									src="/images/googlelogo.png"
								/>
							}
							onClick={() => signIn("google")}
						>
							Continue with Google
						</Button>
					</>
				)}
			</Stack>
		</Center>
	);
};

export default Auth;
