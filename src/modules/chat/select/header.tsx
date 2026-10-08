import { TrashIcon, XIcon } from "@phosphor-icons/react";
import {
  colorOptions,
  fillOptions,
  IconButton,
  sizeOptions,
  Tooltip,
} from "kitty";
import { useEffect } from "react";
import { useHeader } from "../../../layout/header";
import { useSelectModeStore } from "./state";

export const SelectModeHeader = () => {
  const selecteCount = useSelectModeStore((state) => state.selected.size);
  const unselectAll = useSelectModeStore((state) => state.unselectAll);
  const setup = useHeader((state) => state.setup);

  useEffect(() => {
    setup({
      left: (
        <Tooltip title="Cancel Selection">
          <IconButton
            onClick={unselectAll}
            Icon={XIcon}
            size={sizeOptions.medium}
            fill={fillOptions.link}
            mode={colorOptions.tertiary}
          />
        </Tooltip>
      ),
      center: <span>{selecteCount} selected</span>,
      right: <DeleteSelectedButton />,
    });
  }, [selecteCount]);

  return undefined;
};

const DeleteSelectedButton = () => {
  return (
    <Tooltip title="Delete">
      <IconButton
        onClick={handleDelete}
        Icon={TrashIcon}
        size={sizeOptions.medium}
        fill={fillOptions.link}
        mode={colorOptions.tertiary}
      />
    </Tooltip>
  );
};

const handleDelete = async () => {
  const store = useSelectModeStore.getState();
  const chatStore = store.chatStore;
  if (!chatStore) {
    console.error("Chat not selected");
    return;
  }
  const state = chatStore.getState();
  // Empty/draft chats have no deletable server messages.
  if (!("deleteMessage" in state) || !("deleteAttachments" in state)) return;

  const { full, partial } = store.getSelectedMessages();

  for (const message of full) {
    await state.deleteMessage(message.id);
  }

  for (const message of partial) {
    await state.deleteAttachments(
      message.id,
      message.attachment?.map((at) => at.id) ?? [],
    );
  }
};
