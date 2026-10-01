import type { StoreApi, UseBoundStore } from "zustand";
import type { DraftMessage, Message } from "../../message/single/type";
import type { emptyDirectChat } from "../empty/type";
import type { Chat } from "../list/type";

export type SingleChatStore = UseBoundStore<StoreApi<single>>;
export type EmptyDirectChatStore = UseBoundStore<StoreApi<emptyDirectChat>>;
export type ChatStore = UseBoundStore<StoreApi<emptyDirectChat | single>>;

export type single = {
  messages: Message[] | undefined;
  // pendingMessages: Message[];
  loadMessages: () => Promise<void>;
  sendMessage: (draft: DraftMessage) => Promise<void>;
} & Chat;
