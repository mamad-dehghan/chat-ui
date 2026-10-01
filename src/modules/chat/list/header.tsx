import { useEffect } from "react";
import { useHeader } from "../../../layout/header";
import {
  HeaderBackButton,
  HeaderSearchButton,
} from "../../../layout/header/commons";
import { ChatDisplayName } from "./displayName";
import type { ChatStore } from "../single/type";

type props = {
  useChat: ChatStore;
};

export const UnselectHeader = ({ useChat }: props) => {
  const setup = useHeader((state) => state.setup);
  const chatName = useChat((state) => state.name);
  const chatType = useChat((state) => state.type);

  useEffect(() => {
    setup({
      left: <HeaderBackButton />,
      center:
        chatType !== "direct" ? (
          <span>{chatName}</span>
        ) : (
          <span>
            <ChatDisplayName useChat={useChat} />
          </span>
        ),
      right: <HeaderSearchButton />,
    });
  }, [chatType, chatName]);

  return undefined;
};
