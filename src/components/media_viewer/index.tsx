import { AppLayer } from "kitty";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useParams } from "wouter";
import { create } from "zustand";
import { ChatStore, Message } from "../../pages/chat/types";
import { SERVER_HOST } from "../../utils/socket";
import "./index.scss";

const getImageUrl =
  (attachment_id: string, message_id: number, chat_id: string) =>
    `${SERVER_HOST}/attachment?${new URLSearchParams({
      id: attachment_id,
      message_id: message_id.toString(),
      chat_id: chat_id,
    }).toString()}`

export const MediaViewer = () => {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null)
  const list = useMediaStore1(state => state.list);
  const activeItem = useMediaStore1(state => state.activeItem);
  const currentIndex = useMediaStore1(state => state.currentIndex);
  const close = useMediaStore1(state => state.close);
  const getAttachmentMessage = useMediaStore1(state => state.getAttachmentMessage);
  const params = useParams()

  const [isCaptionVisible, setCaptionVisibility] = useState(true)

  useEffect(() => {
    if (currentIndex !== -1) {
      ref.current?.children.item(currentIndex)?.scrollIntoView()
    }
  }, [currentIndex])

  if (activeItem === null || currentIndex === -1) return undefined

  return createPortal(
    <AppLayer
      blockBottomLayers
      closeOnEscape
      onClick={close}
      onClose={close}
      className="media-viewer-layer"
    >
      <div className="media-viewer">
        <div className="media-viewer--wrapper" ref={ref}>
          {
            list.map(item =>
              <div className="attachment-wrapper" key={[item.id, item.message_id].join()}>
                <img
                  onClick={event => {
                    setCaptionVisibility(pre => !pre)
                    event.stopPropagation()
                  }}
                  src={getImageUrl(item.id, item.message_id, params.id!)}
                  style={{
                    // aspectRatio: item.details.width / item.details.height,
                    display: "block",
                    width: "100%",
                    // height: "100%",
                    objectFit: "contain",
                    userSelect: "none",
                    margin: "auto"
                  }}
                />
                {isCaptionVisible ?
                  <div className="attachment-caption"
                    onClick={event => event.stopPropagation()}
                    dir="auto"
                  >{getAttachmentMessage(item)?.caption}
                  </div>
                  : <></>
                }
              </div>
            )
          }
        </div>
      </div>
    </AppLayer>,
    document.getElementById("theme-provider")!,
    id,
  )
}

type singleAttachment = NonNullable<Message["attachment"]>[number] & { message_id: number };

type mediaStoreType1 = {
  useChat?: ChatStore,
  setChat: (chat: ChatStore) => void;

  activeItem: singleAttachment | null;
  list: singleAttachment[];
  getAttachmentMessage: (attachment: singleAttachment) => Message | undefined;
  currentIndex: number;
  open: (attachment: singleAttachment) => void;
  close: () => void;
}

const getAttachmentList = (chatStore: ChatStore) => {
  const mediaMessages =
    chatStore.getState().messages
      ?.filter(message => message.attachment && message.attachment.some(att => att.type === "image"))
    ?? [];
  return mediaMessages
    .map(message =>
      message.attachment!.filter(att => att.type === "image")
        .map(att => ({ ...att, message_id: message.id }))
    )
    .filter(att => att !== undefined)
    .flat()
};

export const useMediaStore1 = create<mediaStoreType1>((set, get) => ({
  useChat: undefined,
  setChat: (chatStore) => {
    const updateStore = () => {
      set((prev) => {
        const list = getAttachmentList(chatStore);
        const currentIndex = prev.activeItem ?
          list.findIndex(att =>
            att.message_id === prev.activeItem?.message_id &&
            att.id === prev.activeItem?.id
          )
          : -1
        return {
          useChat: chatStore,
          list,
          currentIndex,
          activeItem: currentIndex === -1 ? null : prev.activeItem,
        }
      })
    }
    chatStore.subscribe((chat, prev) => {
      if (chat.messages === prev.messages) return;
      updateStore()
    })
    updateStore()
  },
  list: [],
  activeItem: null,
  getAttachmentMessage: (attachment: singleAttachment) => {
    const messages = get().useChat?.getState().messages;
    return messages?.find(message => message.id === attachment.message_id)
  },
  open: (attachment) => {
    set((prev) => {
      const currentIndex = prev.list.findIndex(att => att.message_id === attachment.message_id && att.id === attachment.id)

      return ({
        currentIndex,
        activeItem: currentIndex !== -1 ? prev.list.at(currentIndex) : null,
      })
    })
  },
  close: () => {
    set({
      currentIndex: -1,
      activeItem: null
    })
  },
  currentIndex: -1
}))
