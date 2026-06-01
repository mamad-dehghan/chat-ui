import type { Chat, Message } from "./types";

export const getChatMessages = async (
  chat: Pick<Chat, "id">,
): Promise<Message[]> => {
  return fetch(`http://localhost:3000/chat/messages/${chat.id}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
    credentials: "include",
  }).then((res) => res.json());
};
