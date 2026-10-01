import { create } from "zustand";
import type { ChatStore } from "../../../chat/single/type";
import type { mediaStoreType, singleAttachment } from "./type";

export const useMediaStore = create<mediaStoreType>((set, get) => ({
  useChat: undefined,
  setChat: (chatStore) => {
    const updateStore = () => {
      set((prev) => {
        const list = getAttachmentList(chatStore);
        const currentIndex = prev.activeItem
          ? list.findIndex(
              (att) =>
                att.message_id === prev.activeItem?.message_id &&
                att.id === prev.activeItem?.id,
            )
          : -1;
        return {
          useChat: chatStore,
          list,
          currentIndex,
          activeItem: currentIndex === -1 ? null : prev.activeItem,
        };
      });
    };
    chatStore.subscribe((chat, prev) => {
      if (chat.messages === prev.messages) return;
      updateStore();
    });
    updateStore();
  },
  list: [],
  activeItem: null,
  getAttachmentMessage: (attachment: singleAttachment) => {
    const messages = get().useChat?.getState().messages;
    return messages?.find((message) => message.id === attachment.message_id);
  },
  open: (attachment) => {
    set((prev) => {
      const currentIndex = prev.list.findIndex(
        (att) =>
          att.message_id === attachment.message_id && att.id === attachment.id,
      );

      return {
        currentIndex,
        activeItem: currentIndex !== -1 ? prev.list.at(currentIndex) : null,
      };
    });
  },
  close: () => {
    set({
      currentIndex: -1,
      activeItem: null,
    });
  },
  currentIndex: -1,
}));

const getAttachmentList = (chatStore: ChatStore) => {
  const mediaMessages =
    chatStore
      .getState()
      .messages?.filter(
        (message) =>
          message.attachment &&
          message.attachment.some((att) => att.type === "image"),
      ) ?? [];
  return mediaMessages
    .map((message) =>
      message
        .attachment!.filter((att) => att.type === "image")
        .map((att) => ({ ...att, message_id: message.id })),
    )
    .filter((att) => att !== undefined)
    .flat();
};
