import { MessageViewer } from "./message_viewer";
import type { Message } from "./types";

type props = {
  messages: Message[];
};

export const ChatViewer = ({ messages }: props) => {
  return (
    <div
      className="chat-viewer"
      style={{
        minHeight: "70vh",
        overflow: "hidden",
        // gridArea: "chat-content",
        // display: "grid",
        // gridTemplateColumns: "1fr",
      }}
    >
      {messages.map((message) => (
        <MessageViewer key={message.id} message={message} />
      ))}
    </div>
  );
};
