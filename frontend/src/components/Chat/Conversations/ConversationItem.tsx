import { ConversationPopulated } from "@/../backend/src/util/types";
import {
	Avatar,
	Box,
	Flex,
	Menu,
	MenuItem,
	MenuList,
	Stack,
	Text,
} from "@chakra-ui/react";
import { AiOutlineEdit } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";
import { GoPrimitiveDot } from "react-icons/go";
import enUs from "date-fns/locale/en-US";
import { formatRelative } from "date-fns";
import React, { useState } from "react";
import { formatUsernames } from "@/src/util/functions";

const formatRelativeLocale = {
	lastWeek: "eeee",
	yesterday: "'Yesterday",
	today: "p",
	other: "MM/dd/yy",
};

interface ConversationItemProp {
	conversation: ConversationPopulated;
	onClick: () => void;
	isSelected: boolean;
	userId: string;
	onDeleteConversation: (conversationId: string) => void;
	hasSeenLatestMessage: boolean;
}

const ConversationItem = ({
	conversation,
	onClick,
	isSelected,
	userId,
	onDeleteConversation,
	hasSeenLatestMessage,
}: ConversationItemProp) => {
	const [menuOpen, setMenuOpen] = useState(false);

	const handleClick = (event: React.MouseEvent) => {
		if (event.type === "click") {
			onClick();
		} else if (event.type === "contextmenu") {
			event.preventDefault();
			setMenuOpen(true);
		}
	};
	return (
		<Stack
			direction="row"
			align="center"
			justify="space-between"
			p={4}
			cursor="pointer"
			borderRadius={4}
			bg={isSelected ? "whiteAlpha.200" : "none"}
			_hover={{ bg: "whiteAlpha.200" }}
			onClick={handleClick}
			onContextMenu={handleClick}
			position="relative"
		>
			<Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
				<MenuList bg="#2d2d2d">
					<MenuItem
						icon={<AiOutlineEdit fontSize={20} />}
						onClick={(event) => {
							event.stopPropagation();
							//   onEditConversation();
						}}
						bg="#2d2d2d"
						_hover={{ bg: "whiteAlpha.300" }}
					>
						Edit
					</MenuItem>
					<MenuItem
						icon={<MdDeleteOutline fontSize={20} />}
						onClick={(event) => {
							event.stopPropagation();
							onDeleteConversation(conversation.id);
						}}
						bg="#2d2d2d"
						_hover={{ bg: "whiteAlpha.300" }}
					>
						Delete
					</MenuItem>
					{/* {conversation.participants.length > 2 ? (
            <MenuItem
              icon={<BiLogOut fontSize={20} />}
              onClick={(event) => {
                event.stopPropagation();
                // onLeaveConversation(conversation);
              }}
            >
              Leave
            </MenuItem>
          ) : (
            <MenuItem
              icon={<MdDeleteOutline fontSize={20} />}
              onClick={(event) => {
                event.stopPropagation();
                // onDeleteConversation(conversation.id);
              }}
            >
              Delete
            </MenuItem>
          )} */}
				</MenuList>
			</Menu>
			<Flex position="absolute" left="-6px">
				{hasSeenLatestMessage === false && (
					<GoPrimitiveDot fontSize={18} color="#6B46C1" />
				)}
			</Flex>
			<Avatar />
			<Flex justify="space-between" width="80%" height="100%">
				<Flex direction="column" width="70%" height="100%">
					<Text
						fontWeight={600}
						whiteSpace="nowrap"
						overflow="hidden"
						textOverflow="ellipsis"
					>
						{formatUsernames(conversation.participants, userId)}
					</Text>
					{conversation.latestMessage && (
						<Box width="140%" maxWidth="360px">
							<Text
								color="whiteAlpha.700"
								whiteSpace="nowrap"
								overflow="hidden"
								textOverflow="ellipsis"
							>
								{conversation.latestMessage.body}
							</Text>
						</Box>
					)}
				</Flex>
				<Text
					color="whiteAlpha.700"
					textAlign="right"
					position="absolute"
					right={4}
				>
					{formatRelative(
						new Date(conversation.updatedAt),
						new Date(),
						{
							locale: {
								...enUs,
								formatRelative: (token) =>
									formatRelativeLocale[
										token as keyof typeof formatRelativeLocale
									],
							},
						}
					)}
				</Text>
			</Flex>
		</Stack>
	);
};
export default ConversationItem;
