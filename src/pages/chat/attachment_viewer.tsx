import { FileIcon } from "@phosphor-icons/react";
import { type ReactNode, useMemo } from "react";
import { useMediaStore1 } from "../../components/media_viewer";
import { SERVER_HOST } from "../../utils/socket";
import "./attachment_viewer.scss";
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
          />
        ))}
      </MultipleImageGrid>
    );

  if (type.isSubsetOf(new Set(["file"])))
    return (
      <MultipleFileGrid count={attachment.length}>
        {attachment.map((at, index) => (
          <FileAttachmentViewer
            key={[at.id, index].join()}
            attachment={at}
            chat_id={chat_id}
            message_id={message_id}
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
    // type: "image";
  };
  chat_id: number;
  message_id: number;
};

const ImageAttachmentViewer = ({ attachment, chat_id, message_id }: props) => {
  const openMediaViewer = useMediaStore1((state) => state.open);

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
    <div
      style={{
        minWidth: 0,
        minHeight: 0,
      }}
      onClick={() => {
        openMediaViewer({ ...attachment, message_id, type: "image" });
      }}
    >
      <img
        src={url}
        style={{
          aspectRatio: attachment.details.width / attachment.details.height,
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      1
    </div>
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

const FileAttachmentViewer = ({ attachment, chat_id, message_id }: props) => {
  return (
    <div className="file-content--viewer">
      <div className="type-icon">
        <FileIcon
          weight="fill"
          onClick={() => {
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
          }}
        />
      </div>
      <div className="file-name">{attachment.name}</div>
    </div>
  );
};
