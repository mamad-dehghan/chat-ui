import type { User } from "../../providers/user";

export const getContacts = async (): Promise<User[]> => {
  return fetch(`http://localhost:3000/contacts`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
    credentials: "include",
  }).then((res) => res.json());
};
