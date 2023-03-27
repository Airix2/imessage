import { getSession, useSession } from "next-auth/react";
import { NextPageContext } from "next";
import { Box } from "@chakra-ui/react";
import Chat from "../components/Chat";
import Auth from "../components/Auth";

export async function getServerSideProps(context: NextPageContext) {
	const session = await getSession(context);

	return {
		props: {
			session,
		},
	};
}

export default function Home() {
	const { data: session } = useSession();

	const reloadSession = () => {};

	return (
		<Box>
			{session?.user?.username ? (
				<Chat />
			) : (
				<Auth session={session} reloadSession={reloadSession} />
			)}
		</Box>
	);
}
