import type { ChatStore } from "../../../chat/single/type";
import type { Message } from "../../../message/single/type";

export type singleAttachment = NonNullable<Message["attachment"]>[number] & {
  message_id: number;
};

export type mediaStoreType = {
  useChat?: ChatStore;
  setChat: (chat: ChatStore) => void;

  activeItem: singleAttachment | null;
  list: singleAttachment[];
  getAttachmentMessage: (attachment: singleAttachment) => Message | undefined;
  currentIndex: number;
  open: (attachment: singleAttachment) => void;
  close: () => void;
};
