import { CaretLeftIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { colorOptions, fillOptions, IconButton, sizeOptions, Tooltip } from "kitty";
import { useLayoutEffect } from "react";
import { useLocation } from "wouter";
import { Header } from "../../components/header";
import { ChatInput } from "./chat_input";
import { ChatViewer } from "./chat_viewer";
import { ChatStore } from "./types";

type props = {
  useChat: ChatStore;
};

export const ChatContent = ({ useChat }: props) => {
  const [, setLocation] = useLocation();
  const loadMessages = useChat((state) => state.loadMessages);
  const sendMessage = useChat((state) => state.sendMessage);
  const displayName = useChat((state) => state.displayName ?? state.name);

  useLayoutEffect(() => {
    loadMessages();
  }, []);

  return (
    <>
      <Header>
        <Tooltip title="Back">
          <IconButton
            onClick={() => {
              document.startViewTransition(() => {
                setLocation("/");
              });
            }}
            // className="new-chat-button"
            Icon={CaretLeftIcon}
            size={sizeOptions.medium}
            fill={fillOptions.link}
            mode={colorOptions.tertiary}
          />
        </Tooltip>
        <span>{displayName}</span>
        <Tooltip title="Search">
          <IconButton
            // onClick={() => {
            //   document.startViewTransition(() => {
            //     setLocation("/");
            //   })
            // }}
            // className="new-chat-button"
            Icon={MagnifyingGlassIcon}
            size={sizeOptions.medium}
            fill={fillOptions.link}
            mode={colorOptions.tertiary}
          />
        </Tooltip>
      </Header>
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
