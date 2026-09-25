import { DotsThreeVerticalIcon, XIcon } from "@phosphor-icons/react";
import {
  colorOptions,
  fillOptions,
  IconButton,
  sizeOptions,
  Tooltip,
} from "kitty";
import { create } from "zustand";
import type { singleAttachment } from "../../components/media_viewer";
import type { Message, SingleChatStore } from "./types";
import { useEffect } from "react";
import { useHeader } from "../../layout/header";

export const SelectModeHeader = () => {
  const selecteCount = useSelectModeStore((state) => state.selected.size);
  const cleanup = useSelectModeStore((state) => state.cleanup);
  const setup = useHeader((state) => state.setup);

  useEffect(() => {
    setup({
      left: (
        <Tooltip title="Cancel Selection">
          <IconButton
            onClick={cleanup}
            Icon={XIcon}
            size={sizeOptions.medium}
            fill={fillOptions.link}
            mode={colorOptions.tertiary}
          />
        </Tooltip>
      ),
      center: <span>{selecteCount} selected</span>,
      right: (
        <Tooltip title="Actions">
          <IconButton
            Icon={DotsThreeVerticalIcon}
            size={sizeOptions.medium}
            fill={fillOptions.link}
            mode={colorOptions.tertiary}
          />
        </Tooltip>
      ),
    });
  }, [selecteCount]);

  return undefined;
};

type selectModeStoreType = {
  active: boolean;
  isActive: () => boolean;
  chatStore: SingleChatStore | null;
  setup: (chatStore: SingleChatStore) => void;
  selected: Map<number, string[]>;
  toggleMessage: (message: Message) => void;
  toggleAttachment: (
    attachment: singleAttachment,
    attachmentCount: number,
  ) => void;
  cleanup: () => void;
  getSelectedMessages: () => Message[];
};

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
  toggleAttachment: (attachment, attachmentCount) => {
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
