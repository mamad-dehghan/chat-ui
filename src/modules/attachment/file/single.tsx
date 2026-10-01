import { FileIcon } from "@phosphor-icons/react";
import { TickBadge } from "../../../pages/group/check_tick";
import { SERVER_HOST } from "../../../utils/socket";
import { useSelectModeStore } from "../../chat/select/state";

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

export const FileAttachmentViewer = ({
  attachment,
  chat_id,
  message_id,
  attachment_count,
}: props) => {
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

  return (
    <div
      className="file-content--viewer"
      onClick={(event) => {
        event.stopPropagation();
        if (isSelectModeActive) toggleAttachment({ ...attachment, message_id });
        else {
          const link = `${SERVER_HOST}/attachment?${new URLSearchParams({
            id: attachment.id,
            message_id: message_id.toString(),
            chat_id: chat_id.toString(),
          }).toString()}`;
          const a = document.createElement("a");
          a.href = link;
          a.download = attachment.name;
          document.body.append(a);
          a.click();
          document.body.removeChild(a);
        }
      }}
      onContextMenu={(event) => {
        event.stopPropagation();
        event.preventDefault();
        toggleAttachment({ ...attachment, message_id });
      }}
    >
      <TickBadge
        show={isSelected}
        style={{
          top: "anchor(bottom)",
          margin: "-8px 8px",
          border: "2px solid hsl(var(--surface-variant))",
        }}
      >
        <div className="type-icon">
          <FileIcon weight="fill" />
        </div>
      </TickBadge>
      <div className="file-name">{attachment.name}</div>
    </div>
  );
};
