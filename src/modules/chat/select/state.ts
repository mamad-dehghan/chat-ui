import { create } from "zustand";
import type { Message } from "../../message/single/type";
import type { selectModeStoreType } from "./type";

export const useSelectModeStore = create<selectModeStoreType>((set, get) => ({
  active: false,
  isActive: () => get().selected.size > 0,
  chatStore: null,
  setup: (chatStore) => {
    set({
      active: false,
      chatStore: chatStore,
      selected: new Map(),
    });
  },
  selected: new Map(),
  toggleMessage: (message) => {
    const currentSelected = get().selected;
    const findItem = currentSelected.get(message.id);

    if (!findItem || findItem.length !== (message.attachment?.length ?? 0)) {
      currentSelected.set(
        message.id,
        message.attachment?.map((at) => at.id) ?? [],
      );
      return set({
        selected: new Map(currentSelected),
        active: true,
      });
    } else {
      currentSelected.delete(message.id);
      return set({
        selected: new Map(currentSelected),
        active: currentSelected.size > 0,
      });
    }
  },
  toggleAttachment: (attachment) => {
    const currentSelected = get().selected;
    const findItem = currentSelected.get(attachment.message_id);

    if (!findItem) {
      currentSelected.set(attachment.message_id, [attachment.id]);
      return set({
        selected: new Map(currentSelected),
        active: true,
      });
    }
    const isAttachmentSelectedBefore = findItem.some(
      (id) => id === attachment.id,
    );
    if (isAttachmentSelectedBefore) {
      if (findItem.length === 1) currentSelected.delete(attachment.message_id);
      else
        currentSelected.set(
          attachment.message_id,
          findItem.filter((id) => id !== attachment.id),
        );
      return set({
        selected: new Map(currentSelected),
        active: currentSelected.size > 0,
      });
    } else {
      currentSelected.set(attachment.message_id, [...findItem, attachment.id]);
      return set({
        selected: new Map(currentSelected),
        active: true,
      });
    }
  },
  cleanup: () => {
    set({
      active: false,
      chatStore: null,
      selected: new Map(),
    });
  },
  getSelectedMessages: () => {
    const chatStore = get().chatStore;
    if (!chatStore) {
      console.error("Chat not selected");
      return [];
    }
    const chatMessages = chatStore.getState().messages;
    if (!chatMessages) {
      console.error("Message not fetched");
      return [];
    }
    const selected: Message[] = [];
    for (const [id, attachments] of get().selected) {
      const targetMessage = chatMessages.find((m) => m.id === id);
      if (!targetMessage) continue;
      if (
        !targetMessage.attachment?.length ||
        !attachments.length ||
        attachments.length === targetMessage.attachment?.length
      ) {
        selected.push(targetMessage);
        continue;
      }
      selected.push({
        ...targetMessage,
        attachment: targetMessage.attachment.filter((at) =>
          attachments.includes(at.id),
        ),
      });
    }

    return selected;
  },
}));
