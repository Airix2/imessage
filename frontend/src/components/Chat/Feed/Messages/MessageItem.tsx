import { MessagePopulated } from "@/../backend/src/util/types";
import { Avatar, Box, Flex, Stack, Text } from "@chakra-ui/react";
import { formatRelative } from "date-fns";
import enUS from "date-fns/locale/en-US";
import React from "react";

const formatRelativeLocale = {
	lastWeek: "eeee",
	yesterday: "'Yesterday",
	today: "p",
	other: "MM/dd/yy",
};

interface MessageItemProps {
	message: MessagePopulated;
	sentByMe: boolean;
}

const MessageItem = ({ message, sentByMe }: MessageItemProps) => {
	console.log("msg", message);
	return (
		<Stack
			direction="row"
			p={4}
			spacing={4}
			_hover={{ bg: "whiteAlpha.200" }}
			wordBreak="break-word"
		>
			{!sentByMe && (
				<Flex>
					<Avatar size="sm" />
				</Flex>
			)}
			<Stack spacing={1} width="100%">
				<Stack
					direction="row"
					align="center"
					justify={sentByMe ? "flex-end" : "flex-start"}
				>
					{!sentByMe && (
						<Text fontWeight={500} textAlign="left">
							{message.sender.username}
						</Text>
					)}
					<Text fontSize={14} color="whiteAlpha.700">
						{formatRelative(
							new Date(message.createdAt),
							new Date(),
							{
								locale: {
									...enUS,
									formatRelative: (token) =>
										formatRelativeLocale[
											token as keyof typeof formatRelativeLocale
										],
								},
							}
						)}
					</Text>
				</Stack>
				<Flex justify={sentByMe ? "flex-end" : "flex-start"}>
					<Box
						bg={sentByMe ? "brand.100" : "whiteAlpha.300"}
						p={2}
						borderRadius={12}
						maxWidth="70%"
					>
						<Text>{message.body}</Text>
					</Box>
				</Flex>
			</Stack>
		</Stack>
	);
};

export default MessageItem;
