import { useLayoutEffect } from "react";
import { ChatInput } from "../../../pages/chat/chat_input";
import { MessageList } from "../../message/list";
import { SelectModeHeader } from "../select/header";
import { useSelectModeStore } from "../select/state";
import type { ChatStore } from "../single/type";
import { UnselectHeader } from "./header";

type props = {
  useChat: ChatStore;
};

export const ChatViewer = ({ useChat }: props) => {
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
        <MessageList useChat={useChat} />

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
