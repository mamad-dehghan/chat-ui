import { type Message } from "./types";
import "./message_viewer.scss";
import { AttachmentViewer } from "./attachment_viewer";
import { useSelectModeStore } from "./chat_selector";
import classNames from "classnames";
import { TickBadge } from "../group/check_tick";
import { useFetch } from "../../hooks/useFetch";
import { useUsersState } from "../../modules/users/state";
import { use } from "react";

type props = {
  message: Message;
};

export const MessageViewer = ({ message }: props) => {
  const isSelectModeActive = useSelectModeStore((state) => state.active);
  const toggleMessage = useSelectModeStore((state) => state.toggleMessage);
  const selectedDetails = useSelectModeStore((state) => state.selected).get(
    message.id,
  );
  const isSelected = selectedDetails
    ? selectedDetails.length === (message.attachment?.length ?? 0)
    : false;

  const getUserById = useUsersState((state) => state.getUserById);
  const senderUsername = useFetch(() => getUserById(message.user_id));

  return (
    <div
      className={classNames("message-wrapper", isSelected && "element-focused")}
      // data-selected={isSelected}
      data-user-id={message.user_id}
      onClick={() => {
        if (isSelectModeActive) toggleMessage(message);
      }}
      onContextMenu={(event) => {
        event.stopPropagation();
        event.preventDefault();
        toggleMessage(message);
      }}
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
      <TickBadge
        show={isSelected}
        style={{
          // "--color": "var(--primary)",
          right: "anchor(right)",
          top: "anchor(bottom)",
          // top: "unset",
          margin: "-8px 8px",
          border: "2px solid hsla(var(--background), 0.9)",
        }}
      >
        <div className="user-profile">
          <div>{senderUsername?.username.charAt(0)}</div>
        </div>
      </TickBadge>
      <div className="message-username">{senderUsername?.username}</div>
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
