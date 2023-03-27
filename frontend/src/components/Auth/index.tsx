import { Button, Center, Image, Input, Stack, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import React, { useState } from "react";

interface IAuthProps {
	session: Session | null;
	reloadSession: () => void;
}

const Auth = ({ session, reloadSession }: IAuthProps) => {
	const [username, setUsername] = useState("");

	const onSubmit = async () => {
		try {
			// create mutation to send username to graphql
		} catch (error) {
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
						<Button width="100%" onClick={onSubmit}>
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
