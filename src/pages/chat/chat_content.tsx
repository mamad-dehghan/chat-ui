import { CaretLeftIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { Header } from "../../components/header";
import { IconButton, Tooltip } from "../../lib/kitty/components";
import {
  colorOptions,
  fillOptions,
  sizeOptions,
} from "../../lib/kitty/providers/theme/types";
import { ChatInput } from "./chat_input";
import { ChatViewer } from "./chat_viewer";
import { SingleChatStore } from "./types";

type props = {
  useChat: SingleChatStore;
};

export const ChatContent = ({ useChat }: props) => {
  const [, setLocation] = useLocation();
  const loadMessages = useChat((state) => state.loadMessages);
  const sendMessage = useChat((state) => state.sendMessage);
  const messages = useChat((state) => state.messages);
  const displayName = useChat((state) => state.displayName);

  useEffect(() => {
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
          width: "100%",
          // minHeight: "100vh",
          // height: "100vh",
          // overflow: "hidden",
          // display: "grid",
          // gridTemplateAreas: "chat-content / chat-input",
          // gridTemplateColumns: "1fr",
          // gridTemplateRows: "1fr auto",
          position: "relative",
        }}
      >
        <ChatViewer messages={messages} />

        <ChatInput
          onSend={(messaageContent) => {
            sendMessage(messaageContent);
          }}
        />
      </section>
    </>
  );
};
