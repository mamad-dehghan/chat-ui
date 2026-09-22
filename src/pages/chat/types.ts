import { create, type StoreApi, type UseBoundStore } from "zustand";
import { type User } from "../../providers/user";
import socket from "../../utils/socket";
import { getChatMessages } from "./api";

export interface Chat {
  id: number;
  name: string;
  displayName: string;
  type: string;
  created_at: string;
}
export interface Referrence {
  chat_id: number;
  message_id: number;
}
export interface directMessageAttachment {
  type: "image" | "video" | "gif" | "file";
  name: string;
  file: File;
}
export interface referrenceMessageAttachment {
  type: "image" | "video" | "gif" | "file";
  id: number;
  access: Referrence;
}
export type messageAttachment =
  directMessageAttachment | referrenceMessageAttachment;
export interface Message {
  id: number;
  chat_id: number;
  user_id: number;
  caption: string;
  created_at: string;
  attachment:
    | {
        id: string;
        name: string;
        type: string;
        details: any;
      }[]
    | null;
  referrer: Referrence | null;
  replay_to: number | null;
  is_edited: boolean;
  seen: boolean;
}
export interface DraftMessage extends Omit<
  Message,
  | "id"
  | "chat_id"
  | "user_id"
  | "created_at"
  | "attachment"
  | "is_edited"
  | "seen"
> {
  attachment: messageAttachment[] | null;
}

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
    user: undefined,
    chats: [],
  });
});
socket.onAny(console.log);

export type SingleChatStore = UseBoundStore<StoreApi<single>>;
export type EmptyDirectChatStore = UseBoundStore<StoreApi<emptyDirectChat>>;
export type ChatStore = UseBoundStore<StoreApi<emptyDirectChat | single>>;

type Tot = {
  user?: User;
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
  user: undefined,
  initialize: (user) => {
    set({
      user,
      chats: [],
    });
  },
  chats: new Array(),
  draftChats: new Array(),
  setup: (incomeChats: Chat[]) =>
    set(({ user }) => ({
      chats: incomeChats.map((chat) => createSingleChatStore(chat, user!)),
    })),
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
        const newChat = createSingleChatStore(incomeChat, get().user!);
        newChat.setState({
          messages: existChat.getState().messages,
        });
        return set({
          draftChats: chats,
          chats: get().chats.concat(newChat),
        });
      }
    }
    set(({ user }) => ({
      chats: get().chats.concat(createSingleChatStore(incomeChat, user!)),
    }));
  },
  getChatById: (id: number) => {
    return get().chats.find((item) => item.getState().id === id);
  },
  getChatByName: (name: string) => {
    return get().chats.find((item) => item.getState().name === name);
  },
  addEmptyDirectChat: (userId: number) => {
    const newDraftChat = createEmptyChatStore(userId);
    set(({ draftChats, user }) => ({
      draftChats: draftChats.concat(newDraftChat),
    }));
    return newDraftChat;
  },
}));

type single = {
  messages: Message[] | undefined;
  // pendingMessages: Message[];
  loadMessages: () => Promise<void>;
  sendMessage: (draft: DraftMessage) => Promise<void>;
} & Chat;

export function createSingleChatStore(chat: Chat, userInformation: User) {
  const sc = create<single>((set, get) => ({
    ...chat,
    messages: undefined,
    // pendingMessages: [],
    async loadMessages() {
      console.log("load full");
      const messages = await getChatMessages({ id: get().id });
      set({ messages });
    },
    async sendMessage(draft: DraftMessage) {
      // const tempMessage: Omit<Message, "attachment">  = {
      //   id: Math.random(),
      //   user_id: userInformation.id,
      //   chat_id: get().id,
      //   created_at: new Date().toISOString(),
      //   is_edited: false,
      //   seen: false,
      //   ...draft,
      // };

      // set((state) => ({
      //   pendingMessages: state.pendingMessages.concat([tempMessage]),
      // }));

      try {
        const actualMessage: Message = await socket.emitWithAck(
          "send_message",
          {
            id: get().id,
            ...draft,
          },
        );

        set((state) => ({
          // pendingMessages: state.pendingMessages.filter(
          //   (item) => item.id !== tempMessage.id,
          // ),
          messages: (state.messages ?? []).concat([actualMessage]),
        }));
      } catch (error) {
        console.log(
          "Fail to send message: ",
          draft.caption || "empty caption message",
          error,
        );
        // set((state) => ({
        //   pendingMessages: state.pendingMessages.filter(
        //     (item) => item.id !== tempMessage.id,
        //   ),
        // }));
      }
    },
  }));
  socket.on("new_message", (message: Message) => {
    if (message.chat_id === sc.getState().id) {
      sc.setState((state) => ({
        messages: (state.messages ?? []).concat([message]),
      }));
    }
  });
  return sc;
}

type emptyDirectChat = {
  name: string;
  displayName: string;
  targetUserId: number;
  messages: Message[] | undefined;
  // pendingMessages: Message[];
  loadMessages: () => void;
  sendMessage: (draft: DraftMessage) => Promise<void>;
};

export function createEmptyChatStore(targetUserId: number) {
  const sc = create<emptyDirectChat>((set, get) => ({
    name: "not found",
    displayName: "not found",
    targetUserId,
    messages: [],
    pendingMessages: [],
    loadMessages() {
      console.log("load empty");
    },
    async sendMessage(draft: DraftMessage) {
      try {
        const actualMessage: Message = await socket.emitWithAck(
          "send_message",
          {
            room: `direct:${get().targetUserId}`,
            ...draft,
          },
        );

        set((state) => ({
          messages: (state.messages ?? []).concat([actualMessage]),
        }));
        console.log("recive", actualMessage);
      } catch (error) {
        console.log(
          "Fail to send message: ",
          draft.caption || "empty caption message",
          error,
        );
      }
    },
  }));
  return sc;
}
