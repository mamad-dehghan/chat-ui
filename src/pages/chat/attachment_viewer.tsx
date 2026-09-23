import { FileIcon } from "@phosphor-icons/react";
import { type ReactNode, useMemo } from "react";
import { useMediaStore1 } from "../../components/media_viewer";
import { SERVER_HOST } from "../../utils/socket";
import { TickBadge } from "../group/check_tick";
import "./attachment_viewer.scss";
import { useSelectModeStore } from "./chat_selector";
import "./file_button.scss";

type bulkProps = {
  attachment:
    | {
        id: string;
        name: string;
        type: string;
        details: any;
      }[]
    | null;
  chat_id: number;
  message_id: number;
};

export const AttachmentViewer = ({
  attachment,
  chat_id,
  message_id,
}: bulkProps) => {
  if (attachment === null) return <></>;

  const type = new Set(attachment.map((at) => at.type));

  if (type.isSubsetOf(new Set(["image", "video"])))
    return (
      <MultipleImageGrid count={attachment.length}>
        {attachment.map((at, index) => (
          <ImageAttachmentViewer
            key={[at.id, index].join()}
            attachment={at}
            chat_id={chat_id}
            message_id={message_id}
            attachment_count={attachment.length}
          />
        ))}
      </MultipleImageGrid>
    );

  if (type.isSubsetOf(new Set(["file"])))
    return (
      <MultipleFileGrid>
        {attachment.map((at, index) => (
          <FileAttachmentViewer
            key={[at.id, index].join()}
            attachment={at}
            chat_id={chat_id}
            message_id={message_id}
            attachment_count={attachment.length}
          />
        ))}
      </MultipleFileGrid>
    );

  return <div>Unsupported Attachment Type</div>;
};

const MultipleImageGrid = ({
  count,
  children,
}: {
  count: number;
  children: ReactNode;
}) => {
  return (
    <div
      className={`viewer-with-${count}-child`}
      style={{
        maxHeight: "50vh",
        borderRadius: "4px",
        overflow: "hidden",
        gap: "1px",
      }}
    >
      {children}
    </div>
  );
};

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

const ImageAttachmentViewer = ({
  attachment,
  chat_id,
  message_id,
  attachment_count,
}: props) => {
  const openMediaViewer = useMediaStore1((state) => state.open);
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
            toggleAttachment({ ...attachment, message_id }, attachment_count);
          else openMediaViewer({ ...attachment, message_id, type: "image" });
        }}
        onContextMenu={(event) => {
          event.stopPropagation();
          event.preventDefault();
          toggleAttachment({ ...attachment, message_id }, attachment_count);
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

const MultipleFileGrid = ({ children }: { children: ReactNode }) => {
  return (
    <div
      style={{
        maxHeight: "50vh",
        borderRadius: "4px",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
};

const FileAttachmentViewer = ({
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
        if (isSelectModeActive)
          toggleAttachment({ ...attachment, message_id }, attachment_count);
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
        toggleAttachment({ ...attachment, message_id }, attachment_count);
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
