import type { Chat } from "../../modules/chat/list/type";
import type { Message } from "../../modules/message/single/type";
import { SERVER_HOST } from "../../utils/socket";

export const getChatMessages = async (
  chat: Pick<Chat, "id">,
): Promise<Message[]> => {
  return fetch(`${SERVER_HOST}/chat/messages/${chat.id}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
    credentials: "include",
  }).then((res) => res.json());
};
