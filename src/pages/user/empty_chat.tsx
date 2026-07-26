import { useState } from "react";
import socket from "../../utils/socket";
import { ChatInput } from "../chat/chat_input";
import { ChatViewer } from "../chat/chat_viewer";
import { useChatStore, type Message } from "../chat/types";

type props = {
  room: string;
};

export const EmptyChat = ({ room }: props) => {
  const userId = useChatStore((state) => state.user?.id);
  const [messages, setMessages] = useState<Map<number, Message>>(new Map());

  return (
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
      <ChatViewer messages={Array.from(messages.values())} />

      <ChatInput
        onSend={(messaageContent) => {
          console.log("send in empty");
          socket.emit("send_message", {
            room: room,
            content: messaageContent,
          });
          setMessages((pre) => {
            pre.set(Infinity, {
              id: Infinity,
              user_id: userId!,
              chat_id: Infinity,
              message: messaageContent,
              created_at: new Date().toJSON(),
            });
            return new Map(pre.entries());
          });
        }}
      />
    </section>
  );
};
