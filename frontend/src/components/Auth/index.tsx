import { Button, Center, Image, Stack, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import React from "react";

interface IAuthProps {
	session: Session | null;
	reloadSession: () => void;
}

const Auth = ({ session, reloadSession }: IAuthProps) => {
	return (
		<Center height="100vh">
			<Stack alignItems="center" spacing={8}>
				{session ? (
					<Text>Create a Username</Text>
					<Input placeholder="Enter a username" />
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
