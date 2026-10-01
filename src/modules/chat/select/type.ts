import type { singleAttachment } from "../../../components/media_viewer";
import type { Message } from "../../message/single/type";
import type { SingleChatStore } from "../single/type";

export type selectModeStoreType = {
  active: boolean;
  isActive: () => boolean;
  chatStore: SingleChatStore | null;
  setup: (chatStore: SingleChatStore) => void;
  selected: Map<number, string[]>;
  toggleMessage: (message: Message) => void;
  toggleAttachment: (attachment: singleAttachment) => void;
  cleanup: () => void;
  getSelectedMessages: () => Message[];
};
