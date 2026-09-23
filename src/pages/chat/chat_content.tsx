import { CaretLeftIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import {
  colorOptions,
  fillOptions,
  IconButton,
  sizeOptions,
  Tooltip,
} from "kitty";
import { useLayoutEffect } from "react";
import { useLocation } from "wouter";
import { Header } from "../../components/header";
import { ChatInput } from "./chat_input";
import { ChatViewer } from "./chat_viewer";
import { type ChatStore } from "./types";
import { SelectModeHeader, useSelectModeStore } from "./chat_selector";

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
  const [, setLocation] = useLocation();
  const displayName = useChat((state) => state.displayName ?? state.name);

  return (
    <Header>
      <Tooltip title="Back">
        <IconButton
          onClick={() => {
            document.startViewTransition(() => {
              setLocation("/");
            });
          }}
          Icon={CaretLeftIcon}
          size={sizeOptions.medium}
          fill={fillOptions.link}
          mode={colorOptions.tertiary}
        />
      </Tooltip>
      <span>{displayName}</span>
      <Tooltip title="Search">
        <IconButton
          Icon={MagnifyingGlassIcon}
          size={sizeOptions.medium}
          fill={fillOptions.link}
          mode={colorOptions.tertiary}
        />
      </Tooltip>
    </Header>
  );
};
