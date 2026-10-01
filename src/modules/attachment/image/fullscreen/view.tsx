import { AppLayer } from "kitty";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useParams } from "wouter";
import { SERVER_HOST } from "../../../../utils/socket";
import { Zoomable } from "./single";
import { useMediaStore } from "./state";
import "./view.scss";

const getImageUrl = (
  attachment_id: string,
  message_id: number,
  chat_id: string,
) =>
  `${SERVER_HOST}/attachment?${new URLSearchParams({
    id: attachment_id,
    message_id: message_id.toString(),
    chat_id: chat_id,
  }).toString()}`;

export const FullscreenMediaViewer = () => {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const list = useMediaStore((state) => state.list);
  const activeItem = useMediaStore((state) => state.activeItem);
  const currentIndex = useMediaStore((state) => state.currentIndex);
  const close = useMediaStore((state) => state.close);
  const open = useMediaStore((state) => state.open);
  const getAttachmentMessage = useMediaStore(
    (state) => state.getAttachmentMessage,
  );
  const params = useParams();

  const [isCaptionVisible, setCaptionVisibility] = useState(true);

  useEffect(() => {
    if (currentIndex !== -1) {
      ref.current?.children.item(currentIndex)?.scrollIntoView();
    }
  }, [currentIndex]);

  if (activeItem === null || currentIndex === -1) return undefined;

  return createPortal(
    <AppLayer
      blockBottomLayers
      closeOnEscape
      onClick={close}
      onClose={close}
      className="fullscreen-media-viewer-layer"
    >
      <div className="fullscreen-media-viewer">
        <div
          ref={ref}
          className="fullscreen-media-viewer--wrapper"
          onScrollEnd={(event) => {
            const { target } = event;
            const activeIndex = Math.round(
              (target as HTMLDivElement).scrollLeft /
                (target as HTMLDivElement).getBoundingClientRect().width,
            );
            const active = list.at(activeIndex);
            if (active) {
              open(active);
            }
          }}
        >
          {list.map((item, index) => (
            <div
              key={[item.id, item.message_id].join()}
              className="attachment-wrapper"
            >
              {currentIndex === index ? (
                <Zoomable
                  onClick={(event) => {
                    event.stopPropagation();
                    setCaptionVisibility((pre) => !pre);
                  }}
                  src={getImageUrl(item.id, item.message_id, params.id!)}
                />
              ) : (
                <img
                  draggable={false}
                  src={getImageUrl(item.id, item.message_id, params.id!)}
                  style={{
                    aspectRatio: item.details.width / item.details.height,
                    display: "block",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    userSelect: "none",
                    margin: "auto",
                  }}
                />
              )}
            </div>
          ))}
          {isCaptionVisible ? (
            <div
              className="attachment-caption"
              onClick={(event) => event.stopPropagation()}
              dir="auto"
            >
              {getAttachmentMessage(activeItem)?.caption}
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </AppLayer>,
    document.getElementById("theme-provider")!,
    id,
  );
};
