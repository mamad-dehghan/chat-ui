import { ArrowUpIcon } from "@phosphor-icons/react";
import { IconButton, Input } from "../../lib/kitty/components";
import {
  colorOptions,
  fillOptions,
  sizeOptions,
} from "../../lib/kitty/providers/theme/types";
import "./chat-input.scss";

type props = {
  onSend: (messageContent: string) => void;
};

export const ChatInput = ({ onSend }: props) => {
  return (
    <Input
      className="chat-input"
      fill={fillOptions.fill}
      style={
        {
          // position: "fixed",
          // left: 0,
          // bottom: 0,
          // gridArea: "chat-input",
        }
      }
      mode={colorOptions.primary}
      id="chat-input"
      label=""
      onKeyDown={(e) => {
        const content = e.currentTarget.value;
        if (e.key === "Enter" && content) {
          onSend(content);
          e.currentTarget.value = "";
        }
      }}
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
            if (input && input.value) {
              onSend(input.value);
              input.value = "";
            }
          }}
        />
      }
    />
  );
};
