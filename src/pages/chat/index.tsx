import type { RouteComponentProps, StringRouteParams } from "wouter";
import { ChatContent } from "./chat_content";
import { useChatStore } from "./types";

type props = RouteComponentProps<StringRouteParams<"/chat/:id">>;

export const ChatPage = ({ params: { id } }: props) => {
  const chat = useChatStore((state) => state.getChatById)(+id);
  if (!chat) return <div>Not Found</div>;

  return <ChatContent useChat={chat} />;
};
