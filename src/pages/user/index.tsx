import { useMemo } from "react";
import { type RouteComponentProps, type StringRouteParams } from "wouter";
import { EmptyChat } from "./empty_chat";
import { useChatStore } from "../../modules/chat/list/state";
import { ChatViewer } from "../../modules/chat/list/view";

type props = RouteComponentProps<StringRouteParams<"/user/:id">>;

export const UserPage = ({ params: { id } }: props) => {
  const userId = useChatStore((state) => state.user?.id);

  const getChat = useChatStore((state) => state.getChatByName);
  const chats = useChatStore((state) => state.chats);
  const chatStore = useMemo(
    () => getChat(["direct", [id, userId].sort()].join("-")),
    [chats, getChat, id],
  );

  if (!chatStore) return <EmptyChat id={+id} />;
  return <ChatViewer useChat={chatStore} />;
};
