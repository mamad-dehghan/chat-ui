import { useHistoryLock } from "kitty";
import { useEffect, useLayoutEffect } from "react";
import { useMediaStore } from "../../attachment/image/fullscreen/state";
import { FullscreenMediaViewer } from "../../attachment/image/fullscreen/view";
import { useSelectModeStore } from "../../chat/select/state";
import type { ChatStore } from "../../chat/single/type";
import { MessageViewer } from "../single";
import "./index.scss";

type props = {
  useChat: ChatStore;
};

const LIST_CLASSNAME = "chat-list";

export const MessageList = ({ useChat }: props) => {
  const isLoading = useChat((state) => state.messages === undefined);
  const messages = useChat((state) => state.messages);

  useEffect(() => {
    if (isLoading) return;
    const el = document.getElementsByClassName(LIST_CLASSNAME).item(0)
      ?.lastChild?.lastChild as HTMLElement;
    if (el) {
      el.scrollIntoView();
    }
  }, [isLoading]);

  const cleanupSelectMode = useSelectModeStore((state) => state.cleanup);
  const isSelectModeActive = useSelectModeStore((state) => state.active);
  useHistoryLock(cleanupSelectMode, isSelectModeActive);

  useLayoutEffect(() => {
    useMediaStore.getState().setChat(useChat);
    return () => {
      cleanupSelectMode();
    };
  }, []);

  return (
    <div className={LIST_CLASSNAME} style={{}}>
      <div className="message-list--inner" style={{}}>
        {messages ? (
          messages.map((message) => (
            <MessageViewer key={message.id} message={message} />
          ))
        ) : (
          <span>Loading messages</span>
        )}
        <FullscreenMediaViewer />
      </div>
    </div>
  );
};
