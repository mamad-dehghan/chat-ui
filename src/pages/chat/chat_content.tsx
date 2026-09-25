import { useEffect, useLayoutEffect } from "react";
import { useHeader } from "../../layout/header";
import {
  HeaderBackButton,
  HeaderSearchButton,
} from "../../layout/header/commons";
import { ChatInput } from "./chat_input";
import { SelectModeHeader, useSelectModeStore } from "./chat_selector";
import { ChatViewer } from "./chat_viewer";
import { type ChatStore } from "./types";

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
  const displayName = useChat((state) => state.displayName ?? state.name);

  const setup = useHeader((state) => state.setup);

  useEffect(() => {
    setup({
      left: <HeaderBackButton />,
      center: <span>{displayName}</span>,
      right: <HeaderSearchButton />,
    });
  }, []);

  return undefined;
};
