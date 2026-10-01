import type { RouteComponentProps, StringRouteParams } from "wouter";
import { ChatViewer } from "./view";
import { useChatStore } from "./state";

type props = RouteComponentProps<StringRouteParams<"/chat/:id">>;

export const ChatPage = ({ params: { id } }: props) => {
  const chat = useChatStore((state) => state.getChatById)(+id);
  if (!chat) return <div>Not Found</div>;

  return <ChatViewer useChat={chat} />;
};
