import { useMemo } from "react";
import {
  useLocation,
  type RouteComponentProps,
  type StringRouteParams,
} from "wouter";
import { ChatContent } from "../chat/chat_content";
import { useChatStore } from "../chat/types";
import { EmptyChat } from "./empty_chat";

type props = RouteComponentProps<StringRouteParams<"/user/:id">>;

export const UserPage = ({ params: { id } }: props) => {
  const [, setLocation] = useLocation();
  const userId = useChatStore((state) => state.user?.id);

  const getChat = useChatStore((state) => state.getChatByName);
  const chats = useChatStore((state) => state.chats);
  const chatStore = useMemo(
    () => getChat(["direct", [id, userId].sort()].join("-")),
    [chats, getChat, id],
  );

  if (!chatStore) return <EmptyChat id={+id} />;
  return <ChatContent useChat={chatStore} />;
};
