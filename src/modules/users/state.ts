import { create } from "zustand";
import type { User } from "../../providers/user";
import { getContacts } from "../../pages/contacts/api";

type usersStateType = {
  users: Map<number, User>;
  getUserById: (id: number) => Promise<User | undefined>;
  getContacts: () => Promise<User[]>;
  addUser: (user: User) => void;
};

export const useUsersState = create<usersStateType>((set, get) => ({
  users: new Map(),
  getUserById: async (id) => {
    console.log("get: " + id);
    const cachedUsers = get().users;
    const cached = cachedUsers.get(id);
    if (cached) return cached;
    const contacts = await getContacts();
    set({
      users: new Map([
        ...cachedUsers.entries(),
        ...contacts.map<[number, User]>((c) => [c.id, c]),
      ]),
    });
    return get().users.get(id);
  },
  getContacts: async () => {
    const contacts = await getContacts();
    const cachedUsers = get().users;
    set({
      users: new Map([
        ...cachedUsers.entries(),
        ...contacts.map<[number, User]>((c) => [c.id, c]),
      ]),
    });
    return Array.from(contacts);
  },
  addUser: (user) => {
    const cachedUsers = get().users;
    cachedUsers.set(user.id, user);
    set({
      users: new Map(cachedUsers),
    });
  },
}));
