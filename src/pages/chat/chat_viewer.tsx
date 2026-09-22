import { useEffect, useLayoutEffect } from "react";
import { MediaViewer, useMediaStore1 } from "../../components/media_viewer";
import { MessageViewer } from "./message_viewer";
import { type ChatStore } from "./types";

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

  useLayoutEffect(() => {
    useMediaStore1.getState().setChat(useChat);
  }, []);

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
          overflowAnchor: "auto",
        }}
      >
        {messages ? (
          messages.map((message) => (
            <MessageViewer key={message.id} message={message} />
          ))
        ) : (
          <span>Loading messages</span>
        )}
        <MediaViewer />
      </div>
    </div>
  );
};
