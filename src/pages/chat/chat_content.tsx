import { use, useEffect, useLayoutEffect } from "react";
import { useHeader } from "../../layout/header";
import {
  HeaderBackButton,
  HeaderSearchButton,
} from "../../layout/header/commons";
import { ChatInput } from "./chat_input";
import { SelectModeHeader, useSelectModeStore } from "./chat_selector";
import { ChatViewer } from "./chat_viewer";
import { useChatStore, type ChatStore } from "./types";
import { useUsersState } from "../../modules/users/state";
import { useFetch } from "../../hooks/useFetch";
import type { User } from "../../providers/user";

type props = {
  useChat: ChatStore;
};

export const ChatContent = ({ useChat }: props) => {
  const loadMessages = useChat((state) => state.loadMessages);
  const sendMessage = useChat((state) => state.sendMessage);

  useLayoutEffect(() => {
    loadMessages();
  }, []);

  const isSelectModeActive = useSelectModeStore((state) => state.active);

  return (
    <>
      {isSelectModeActive ? (
        <SelectModeHeader />
      ) : (
        <UnselectHeader useChat={useChat} />
      )}
      <section
        style={{
          // width: "100%",
          // height: "stretch",
          width: "stretch",
          flexGrow: 1,
          // overflowX: "hidden",
          // minHeight: "100vh",
          // height: "100vh",
          overflow: "hidden",
          display: "grid",
          gridTemplateAreas: "'chat-content' 'chat-input'",
          gridTemplateColumns: "1fr",
          gridTemplateRows: "1fr auto",
          // alignItems: "stretch",
          // position: "relative",
        }}
      >
        <ChatViewer useChat={useChat} />

        <ChatInput
          onSend={({ attachment, caption, replay_to }) => {
            sendMessage({
              caption,
              attachment,
              replay_to,
              referrer: null,
            });
          }}
        />
      </section>
    </>
  );
};

const UnselectHeader = ({ useChat }: props) => {
  const setup = useHeader((state) => state.setup);
  const chatName = useChat((state) => state.name);
  const chatType = useChat((state) => state.type);

  useEffect(() => {
    setup({
      left: <HeaderBackButton />,
      center:
        chatType !== "direct" ? (
          <span>{chatName}</span>
        ) : (
          <span>
            <ChatDisplayName useChat={useChat} />
          </span>
        ),
      right: <HeaderSearchButton />,
    });
  }, [chatType, chatName]);

  return undefined;
};

export const ChatDisplayName = ({ useChat }: props): string | undefined => {
  const currentUserId = useChatStore((state) => state.user?.id)!;
  const chatName = useChat((state) => state.name);
  const targetUserId = chatName
    .slice("direct-".length, chatName.length)
    .split(",")
    .map((id) => parseInt(id))
    .filter((id) => id !== currentUserId)[0]!;
  const getUserById = useUsersState((state) => state.getUserById);

  const username = useFetch(() => getUserById(targetUserId));

  return username?.username;
};
