import type { DraftMessage, Message } from "../../message/single/type";

export type emptyDirectChat = {
  name: string;
  type: "direct";
  targetUserId: number;
  messages: Message[] | undefined;
  // pendingMessages: Message[];
  loadMessages: () => void;
  sendMessage: (draft: DraftMessage) => Promise<void>;
};
