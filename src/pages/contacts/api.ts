import { SERVER_HOST } from "../../utils/socket";
import type { User } from "../../providers/user";

export const getContacts = async (): Promise<User[]> => {
  return fetch(`${SERVER_HOST}/contacts`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
    credentials: "include",
  }).then((res) => res.json());
};
