import { CaretLeftIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Header } from "../../components/header";
import { IconButton, Tooltip } from "../../lib/kitty/components";
import {
  colorOptions,
  fillOptions,
  sizeOptions,
} from "../../lib/kitty/providers/theme/types";
import { userContext } from "../../providers/user";
import socket from "../../utils/socket";
import { getChatMessages } from "./api";
import { ChatInput } from "./chat_input";
import { ChatViewer } from "./chat_viewer";
import { Chat, Message } from "./types";

type props = {
  chat: Chat;
};

export const ChatContent = ({ chat }: props) => {
  const [, setLocation] = useLocation();
  const { userInformation } = useContext(userContext);
  const [messages, setMessages] = useState<Map<number, Message>>(new Map());
  // console.log(chat);
  useEffect(() => {
    getChatMessages({ id: chat.id })
      .then((ms) => setMessages(new Map(ms.map((m) => [m.id, m]))))
      .catch((e) => {
        console.error(e.message);
      });
    socket.on("new_message", (message: Message) => {
      if (message.chat_id === chat.id) {
        setMessages((pre) => {
          pre.delete(Infinity);
          pre.set(message.id, message);
          return new Map(pre.entries());
        });
      }
    });
    socket.on("send_message_successful", (message: Message) => {
      if (
        message.chat_id === chat.id &&
        message.user_id === userInformation.id
      ) {
        setMessages((pre) => {
          pre.delete(Infinity);
          pre.set(message.id, message);
          return new Map(pre.entries());
        });
      }
    });
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
        <span>{chat.displayName}</span>
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
        {/*<p>{chat?.name} :</p>*/}
        <ChatViewer messages={Array.from(messages.values())} />

        <ChatInput
          onSend={(messaageContent) => {
            socket.emit("send_message", {
              id: chat?.id,
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
    </>
  );
};
