import { create } from "zustand";
import socket from "../../../utils/socket";
import { useUsersState } from "../../users/state";
import { createEmptyChatStore } from "../empty/state";
import { createSingleChatStore } from "../single/state";
import type { EmptyDirectChatStore, SingleChatStore } from "../single/type";
import type { Chat } from "./type";
import type { User } from "../../users/type";

type Tot = {
  user: User | null;
  initialize: (user: User) => void;

  chats: Array<SingleChatStore>;
  draftChats: Array<EmptyDirectChatStore>;
  setup: (incomeChats: Chat[]) => void;
  join: (incomeChat: Chat) => void;
  getChatById: (id: number) => SingleChatStore | undefined;
  getChatByName: (name: string) => SingleChatStore | undefined;
  addEmptyDirectChat: (userId: number) => EmptyDirectChatStore;
};

export const useChatStore = create<Tot>((set, get) => ({
  user: null,
  initialize: (user) => {
    useUsersState.getState().addUser(user);
    set({
      user,
      chats: [],
    });
  },
  chats: new Array(),
  draftChats: new Array(),
  setup: (incomeChats: Chat[]) =>
    set({
      chats: incomeChats.map((chat) => createSingleChatStore(chat)),
    }),
  join: (incomeChat: Chat) => {
    const existInChats = get().chats.some(
      (ch) => ch.getState().id === incomeChat.id,
    );
    if (existInChats) return;

    if (incomeChat.type === "direct") {
      const draftChatIndex = get().draftChats.findIndex(
        (ch) =>
          incomeChat.name ===
          ["direct", [ch.getState().targetUserId, get().user!.id].sort()].join(
            "-",
          ),
      );
      if (draftChatIndex !== -1) {
        const chats = get().draftChats;
        const [existChat] = chats.splice(draftChatIndex);
        const newChat = createSingleChatStore(incomeChat);
        newChat.setState({
          messages: existChat.getState().messages,
        });
        return set({
          draftChats: chats,
          chats: get().chats.concat(newChat),
        });
      }
    }
    set({
      chats: get().chats.concat(createSingleChatStore(incomeChat)),
    });
  },
  getChatById: (id: number) => {
    return get().chats.find((item) => item.getState().id === id);
  },
  getChatByName: (name: string) => {
    return get().chats.find((item) => item.getState().name === name);
  },
  addEmptyDirectChat: (userId: number) => {
    const newDraftChat = createEmptyChatStore(userId);
    set(({ draftChats }) => ({
      draftChats: draftChats.concat(newDraftChat),
    }));
    return newDraftChat;
  },
}));

socket.on("user_info", (user) => {
  useChatStore.getState().initialize(user);
});
socket.on("receive_chat", (chats: Chat[]) => {
  useChatStore.getState().setup(chats);
});
socket.on("join_room", (chat: Chat) => {
  useChatStore.getState().join(chat);
});
socket.on("disconnect", () => {
  useChatStore.setState({
    user: null,
    chats: [],
    draftChats: [],
  });
});
socket.on("connect_error", () => {
  useChatStore.setState({
    user: null,
    chats: [],
    draftChats: [],
  });
});
socket.onAny(console.log);
