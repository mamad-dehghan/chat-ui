import { useFetch } from "../../../hooks/useFetch";
import { useUsersState } from "../../users/state";
import type { ChatStore } from "../single/type";
import { useChatStore } from "./state";

type props = {
  useChat: ChatStore;
};

export const ChatDisplayName = ({ useChat }: props): string | undefined => {
  const currentUserId = useChatStore((state) => state.user?.id)!;
  const chatName = useChat((state) => state.name);
  const targetUserId = chatName
    .slice("direct-".length, chatName.length)
    .split(",")
    .map((id) => parseInt(id))
    .filter((id) => id !== currentUserId)[0]!;
  const getUserById = useUsersState((state) => state.getUserById);

  const username = useFetch(() => getUserById(targetUserId));

  return username?.username;
};
