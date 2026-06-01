import { useContext, useState } from "react";
import { userContext } from "../../providers/user";
import socket from "../../utils/socket";
import { ChatInput } from "../chat/chat_input";
import { ChatViewer } from "../chat/chat_viewer";
import type { Message } from "../chat/types";

type props = {
  room: string;
};

export const EmptyChat = ({ room }: props) => {
  const { userInformation } = useContext(userContext);
  const [messages, setMessages] = useState<Map<number, Message>>(new Map());

  // useEffect(() => {
  // getChatMessages({ id: chat.id })
  //   .then((ms) => setMessages(new Map(ms.map((m) => [m.id, m]))))
  //   .catch((e) => {
  //     console.error(e.message);
  //   });
  // socket.on("new_message", (message: Message) => {
  //   if (message.chat_id === chat.id) {
  //     setMessages((pre) => {
  //       pre.delete(Infinity);
  //       pre.set(message.id, message);
  //       return new Map(pre.entries());
  //     });
  //   }
  // });
  // socket.on("send_message_successful", (message: Message) => {
  //   if (
  //     message.chat_id === chat.id &&
  //     message.user_id === userInformation.id
  //   ) {
  //     setMessages((pre) => {
  //       pre.delete(Infinity);
  //       pre.set(message.id, message);
  //       return new Map(pre.entries());
  //     });
  //   }
  // });
  // }, []);

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
      {/*<p>{chat?.name} :</p>*/}
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
              user_id: userInformation.id,
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
