import { useEffect } from "react";
import { MessageViewer } from "./message_viewer";
import { ChatStore, EmptyDirectChatStore, type SingleChatStore } from "./types";
import { StoreApi, UseBoundStore } from "zustand";

type props = {
  useChat: ChatStore;
};

export const ChatViewer = ({ useChat }: props) => {
  const isLoading = useChat((state) => state.messages === undefined);
  const messages = useChat((state) => state.messages);

  useEffect(() => {
    if (isLoading) return;
    const el = document.getElementsByClassName("chat-viewer").item(0)?.lastChild
      ?.lastChild as HTMLElement;
    if (el) {
      el.scrollIntoView();
    }
  }, [isLoading]);

  return (
    <div
      className="chat-viewer"
      style={{
        overflowX: "hidden",
        overflowY: "scroll",
        width: "stretch",
        alignSelf: "stretch",
        gridArea: "chat-content",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: "flex-end",
        }}
      >
        {messages ? (
          messages.map((message) => (
            <MessageViewer key={message.id} message={message} />
          ))
        ) : (
          <span>Loading messages</span>
        )}
      </div>
    </div>
  );
};
