import { useMemo } from "react";
import "./single.scss";
import { TickBadge } from "../../../pages/group/check_tick";
import { SERVER_HOST } from "../../../utils/socket";
import { useSelectModeStore } from "../../chat/select/state";
import { useMediaStore } from "./fullscreen/state";

type props = {
  attachment: {
    id: string;
    name: string;
    details: {
      width: number;
      height: number;
    };
    type: string;
  };
  chat_id: number;
  message_id: number;
  attachment_count: number;
};

export const ImageAttachmentViewer = ({
  attachment,
  chat_id,
  message_id,
  attachment_count,
}: props) => {
  const openMediaViewer = useMediaStore((state) => state.open);
  const isSelectModeActive = useSelectModeStore((state) => state.active);
  const toggleAttachment = useSelectModeStore(
    (state) => state.toggleAttachment,
  );
  const selectedDetails = useSelectModeStore((state) => state.selected).get(
    message_id,
  );
  const isSelected = selectedDetails
    ? attachment_count > 1 && selectedDetails.some((id) => id === attachment.id)
    : false;

  const url = useMemo(
    () =>
      `${SERVER_HOST}/attachment?${new URLSearchParams({
        id: attachment.id,
        message_id: message_id.toString(),
        chat_id: chat_id.toString(),
      }).toString()}`,
    [],
  );

  return (
    <TickBadge
      show={isSelected}
      style={{
        margin: "0.7rem",
        border: "2px solid hsl(var(--surface-variant))",
      }}
    >
      <div
        className="image-attchment-viewer--wrapper"
        style={{
          minWidth: 0,
          minHeight: 0,
        }}
        onClick={(event) => {
          event.stopPropagation();
          if (isSelectModeActive)
            toggleAttachment({ ...attachment, message_id });
          else openMediaViewer({ ...attachment, message_id, type: "image" });
        }}
        onContextMenu={(event) => {
          event.stopPropagation();
          event.preventDefault();
          toggleAttachment({ ...attachment, message_id });
        }}
      >
        <img
          src={url}
          data-selected={isSelected}
          style={{
            aspectRatio: attachment.details.width / attachment.details.height,
          }}
        />
      </div>
    </TickBadge>
  );
};
