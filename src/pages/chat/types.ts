import { create, StoreApi, UseBoundStore } from "zustand";
import { User } from "../../providers/user";
import socket from "../../utils/socket";
import { getChatMessages } from "./api";

export interface Chat {
  id: number;
  name: string;
  displayName: string;
  type: string;
  created_at: string;
}
export interface Message {
  id: number;
  chat_id: number;
  user_id: number;
  message: string;
  created_at: string;
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

type Tot = {
  user?: User;
  initialize: (user: User) => void;

  chats: Array<SingleChatStore>;
  setup: (incomeChats: Chat[]) => void;
  join: (incomeChat: Chat) => void;
  getChatById: (id: number) => SingleChatStore | undefined;
  getChatByName: (name: string) => SingleChatStore | undefined;
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
  setup: (incomeChats: Chat[]) =>
    set(({ user }) => ({
      chats: incomeChats.map((chat) => createSingleChatStore(chat, user!)),
    })),
  join: (incomeChat: Chat) => {
    const exist = get().chats.some((ch) => ch.getState().id === incomeChat.id);
    if (exist) return;
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
}));

type single = {
  messages: Message[] | undefined;
  pendingMessages: Message[];
  loadMessages: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
} & Chat;

function createSingleChatStore(chat: Chat, userInformation: User) {
  const sc = create<single>((set, get) => ({
    ...chat,
    messages: undefined,
    pendingMessages: [],
    async loadMessages() {
      const messages = await getChatMessages({ id: get().id });
      set({ messages });
    },
    async sendMessage(content: string) {
      const tempMessage: Message = {
        id: Math.random(),
        user_id: userInformation.id,
        chat_id: get().id,
        message: content,
        created_at: new Date().toISOString(),
      };

      set((state) => ({
        pendingMessages: state.pendingMessages.concat([tempMessage]),
      }));

      try {
        const actualMessage: Message = await socket.emitWithAck(
          "send_message",
          {
            id: get().id,
            content: content,
          },
        );

        set((state) => ({
          pendingMessages: state.pendingMessages.filter(
            (item) => item.id !== tempMessage.id,
          ),
          messages: (state.messages ?? []).concat([actualMessage]),
        }));
      } catch (error) {
        console.log(
          "Fail to send message: ",
          tempMessage.message,
          error.message,
        );
        set((state) => ({
          pendingMessages: state.pendingMessages.filter(
            (item) => item.id !== tempMessage.id,
          ),
        }));
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
