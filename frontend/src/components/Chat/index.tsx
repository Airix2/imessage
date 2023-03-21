import { Button } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import React from "react";

const Chat = () => {
	return (
		<div>
			Chat
			<Button onClick={() => signOut()}>Logout</Button>
		</div>
	);
};

export default Chat;
