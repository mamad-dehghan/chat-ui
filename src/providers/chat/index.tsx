import { createContext, useEffect, useState, type ReactNode } from "react";
import type { Chat } from "../../pages/chat/types";
import socket from "../../utils/socket";

type ChatCT = {
  chats: Map<Chat["id"], Chat>;
  getChatById: (id: number) => Chat | undefined;
  getChatByDetails: (chat_name: string) => Chat | undefined;
};

export const ChatContext = createContext<ChatCT>({
  getChatById: () => undefined,
  getChatByDetails: () => undefined,
  chats: new Map(),
});

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chats, setChats] = useState<Map<Chat["id"], Chat>>(new Map());

  useEffect(() => {
    socket.on("receive_chat", (chats: Chat[]) => {
      // console.log("chats", chats);
      setChats(new Map(chats.map((c) => [c.id, c])));
    });
    socket.on("join_room", (chat: Chat) => {
      setChats((pre) => {
        if (pre.has(chat.id)) return pre;
        pre.set(chat.id, chat);
        return new Map(pre.entries());
      });
    });
  }, []);
  // console.log(chats);
  return (
    <ChatContext
      value={{
        chats,
        getChatById: (id: number) => chats.get(id),
        getChatByDetails: (chat_name: string) => {
          for (let chat of chats.values()) {
            if (chat.name === chat_name) return chat;
          }
          return undefined;
        },
      }}
    >
      {children}
    </ChatContext>
  );
};
