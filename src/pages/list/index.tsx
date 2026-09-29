import {
  PencilSimpleIcon,
  UserIcon,
  UsersThreeIcon,
  XIcon,
} from "@phosphor-icons/react";
import classNames from "classnames";
import {
  AppLayer,
  colorOptions,
  fillOptions,
  IconButton,
  sizeOptions,
  Tooltip,
} from "kitty";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "wouter";
import { useHeader } from "../../layout/header";
import { HeaderSearchButton } from "../../layout/header/commons";
import { ChatDisplayName } from "../chat/chat_content";
import { useChatStore, type SingleChatStore } from "../chat/types";
import "./index.scss";
import { ListItem } from "./list-item";

export const ListPage = () => {
  const username = useChatStore((state) => state.user?.username);
  const chats = useChatStore((state) => state.chats);
  const setup = useHeader((state) => state.setup);
  useEffect(() => {
    setup({
      left: null,
      center: <span>Loged in as: {username}</span>,
      right: <HeaderSearchButton />,
    });
  }, [username]);

  return (
    <>
      <div className="chat-list">
        {Array.from(chats.values()).map((chat) => (
          <ChatListItem key={chat.getState().id} useChat={chat} />
        ))}
      </div>
      <FloatSection />
    </>
  );
};

type props = {
  useChat: SingleChatStore;
};

const ChatListItem = ({ useChat }: props) => {
  const [, setLocation] = useLocation();
  const chatId = useChat((state) => state.id);
  const chatName = ChatDisplayName({ useChat }) ?? "";
  return (
    <ListItem
      onClick={() => {
        document.startViewTransition(() => {
          setLocation(`/chat/${chatId}`);
        });
      }}
      avatar={undefined}
      title={chatName}
    />
  );
};

const FloatSection = () => {
  const [, setLocation] = useLocation();
  const [isOpen, setOpen] = useState<boolean>(false);

  return createPortal(
    <AppLayer
      blockBottomLayers={isOpen}
      closeOnEscape={isOpen}
      // preventBlock
      onClick={() => {
        setOpen(false);
      }}
      onClose={() => {
        setOpen(false);
      }}
      className={classNames("float-action-layer", isOpen && "open")}
    >
      <div className="float-actions">
        {isOpen ? (
          <>
            <Tooltip title="New Chat">
              <IconButton
                onClick={() => {
                  document.startViewTransition(() => {
                    setLocation("/contacts");
                  });
                }}
                // className="new-chat-button"
                size={sizeOptions.medium}
                Icon={UserIcon}
                fill={fillOptions.tonal}
                mode={colorOptions.tertiary}
              />
            </Tooltip>
            <Tooltip title="New Group">
              <IconButton
                onClick={() => {
                  document.startViewTransition(() => {
                    setLocation("/create-group");
                  });
                }}
                // className="new-chat-button"
                size={sizeOptions.medium}
                Icon={UsersThreeIcon}
                fill={fillOptions.tonal}
                mode={colorOptions.tertiary}
              />
            </Tooltip>
          </>
        ) : (
          <></>
        )}

        <IconButton
          onClick={(event) => {
            event.stopPropagation();
            if (isOpen) setOpen(false);
            else setOpen(true);
          }}
          // className="new-chat-button"
          size={sizeOptions.medium}
          Icon={isOpen ? XIcon : PencilSimpleIcon}
          fill={fillOptions.tonal}
          mode={colorOptions.tertiary}
        />
      </div>
    </AppLayer>,
    document.getElementById("theme-provider")!,
  );
};
