import type { singleAttachment } from "../../attachment/image/fullscreen/type";
import type { Message } from "../../message/single/type";
import type { ChatStore } from "../single/type";

export type selectModeStoreType = {
  active: boolean;
  isActive: () => boolean;
  chatStore: ChatStore | null;
  setup: (chatStore: ChatStore) => void;
  selected: Map<number, string[]>;
  toggleMessage: (message: Message) => void;
  toggleAttachment: (attachment: singleAttachment) => void;
  cleanup: () => void;
  unselectAll: () => void;
  getSelectedMessages: () => {
    full: Message[];
    partial: Message[];
  };
};
