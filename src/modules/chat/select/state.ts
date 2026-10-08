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
    chatStore.subscribe((state, prevState) => {
      if (state.messages == prevState.messages) return;

      let shouldUpdate = false;
      const newSelecteMap = new Map(get().selected);
      for (const [id, selectedMessage] of newSelecteMap.entries()) {
        const findMessage = state.messages?.find(
          (message) => message.id === id,
        );
        if (!findMessage) {
          shouldUpdate = true;
          newSelecteMap.delete(id);
          continue;
        }
        const newAttachments = selectedMessage.filter((smID) =>
          findMessage?.attachment?.some((at) => at.id === smID),
        );
        console.log({ findMessage, newAttachments, selectedMessage, id });
        if (newAttachments.length === selectedMessage.length) continue;
        shouldUpdate = true;
        if (newAttachments.length === 0 && findMessage.attachment?.length)
          newSelecteMap.delete(id);
        else newSelecteMap.set(id, newAttachments);
        // if (newAttachments.length !== 0) newSelecteMap.set(id, newAttachments);
        // if (newAttachments.length === 0 && findMessage.attachment === null)
        // if (newAttachments.length === (findMessage.attachment?.length ?? 0))
        // shouldUpdate = true;
        // newSelecteMap.set(id, newAttachments);
      }
      console.log("new:", newSelecteMap);
      if (shouldUpdate) {
        set({
          selected: newSelecteMap,
          active: newSelecteMap.size > 0,
        });
      }
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
  unselectAll: () => {
    set({
      active: false,
      selected: new Map(),
    });
  },
  getSelectedMessages: () => {
    const chatStore = get().chatStore;
    if (!chatStore) {
      console.error("Chat not selected");
      return { full: [], partial: [] };
    }
    const chatMessages = chatStore.getState().messages;
    if (!chatMessages) {
      console.error("Message not fetched");
      return { full: [], partial: [] };
    }
    const fullySelectedMessages: Message[] = [];
    const partiallySelectedMessages: Message[] = [];

    for (const [id, attachments] of get().selected) {
      const targetMessage = chatMessages.find((m) => m.id === id);
      if (!targetMessage) continue;
      if (
        !targetMessage.attachment?.length ||
        attachments.length === targetMessage.attachment.length
      ) {
        fullySelectedMessages.push(targetMessage);
        continue;
      }
      partiallySelectedMessages.push({
        ...targetMessage,
        attachment: targetMessage.attachment.filter((at) =>
          attachments.includes(at.id),
        ),
      });
    }

    return { full: fullySelectedMessages, partial: partiallySelectedMessages };
  },
}));
