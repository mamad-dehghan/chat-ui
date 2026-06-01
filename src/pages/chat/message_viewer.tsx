import { useContext } from "react";
import type { Message } from "./types";
import { userContext } from "../../providers/user";

type props = {
  message: Message;
};

export const MessageViewer = ({ message }: props) => {
  const { userInformation } = useContext(userContext);
  return (
    <div
      className="message-wrapper"
      style={{
        width: "cover",
        padding:
          userInformation.id === message.user_id
            ? "4px 4px 4px 2rem"
            : "4px 2rem 4px 4px",
      }}
    >
      <p
        className="message-content"
        style={{
          backgroundColor: "hsla(var(--natural-0), 0.1)",
          borderRadius: "var(--radius-extra-small)",
          padding: "2px 4px",
        }}
      >
        {message.message}
      </p>
    </div>
  );
};
