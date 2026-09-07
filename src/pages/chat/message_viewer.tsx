import { useChatStore, type Message } from "./types";
import "./message_viewer.scss";
import { AttachmentViewer } from "./attachment_viewer";

type props = {
  message: Message;
};

export const MessageViewer = ({ message }: props) => {
  const userId = useChatStore((state) => state.user?.id);
  return (
    <div
      className="message-wrapper"
      data-user-id={message.user_id}
      style={
        {
          // width: "cover",
          // marginTop: "1px",
          // backgroundColor: "hsla(var(--natural-0), 0.1)",
          // padding: "0.5rem 2rem",
          // padding:
          //   userId === message.user_id ? "4px 4px 4px 2rem" : "4px 2rem 4px 4px",
        }
      }
    >
      <div className="user-profile">
        <div>M</div>
      </div>
      <div className="message-username">Mamad</div>
      <div className="message-time">
        {new Date(message.created_at).getHours().toString().padStart(2, "0") +
          ":" +
          new Date(message.created_at).getMinutes().toString().padStart(2, "0")}
      </div>
      <div
        className="message-content"
        style={
          {
            // backgroundColor: "hsla(var(--natural-0), 0.1)",
            // borderRadius: "var(--radius-extra-small)",
            // padding: "2px 4px",
          }
        }
      >
        <AttachmentViewer
          attachment={message.attachment}
          message_id={message.id}
          chat_id={message.chat_id}
        />
        {message.caption}
      </div>
    </div>
  );
};
