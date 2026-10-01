import { IconButton, Input } from "kitty";
import { colorOptions, fillOptions, sizeOptions } from "kitty";
import { ArrowUpIcon } from "@phosphor-icons/react";
import "./chat_input.scss";
import { FileButton, useInputStore } from "./file_button";
import type { DraftMessage } from "../../modules/message/single/type";

type props = {
  onSend: (
    // message: Pick<Message, "caption" | "attachment" | "replay_to">,
    message: DraftMessage,
  ) => void;
};

export const ChatInput = ({ onSend }: props) => {
  const viewer = useInputStore((state) => state.viewer);
  const fileContent = useInputStore((state) => state.content);
  const getAttachment = useInputStore((state) => state.getAsAttachment);
  const reset = useInputStore((state) => state.reset);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      }}
    >
      {viewer(fileContent)}
      <Input
        className="chat-input"
        fill={fillOptions.fill}
        mode={colorOptions.primary}
        id="chat-input"
        label=""
        onKeyDown={(e) => {
          const content = e.currentTarget.value;
          const attachment = getAttachment();
          if (e.key === "Enter" && (content || attachment?.length)) {
            onSend({
              caption: content,
              attachment,
              replay_to: null,
              referrer: null,
            });
            reset();
            e.currentTarget.value = "";
          }
        }}
        iconStart={<FileButton />}
        iconEnd={
          <IconButton
            size={sizeOptions.small}
            // mode={colorOptions.secondary}
            fill={fillOptions.fill}
            Icon={ArrowUpIcon}
            enable
            onClick={() => {
              const input = document.getElementById(
                "chat-input",
              ) as HTMLInputElement | null;
              const attachment = getAttachment();
              if (input && (input.value || attachment?.length)) {
                onSend({
                  caption: input.value,
                  attachment,
                  replay_to: null,
                  referrer: null,
                });
                reset();
                input.value = "";
              }
            }}
          />
        }
      />
    </div>
  );
};
