import { MultipleFileGrid } from "./file/multiple";
import { FileAttachmentViewer } from "./file/single";
import { MultipleImageGrid } from "./image/multiple";
import { ImageAttachmentViewer } from "./image/single";

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
      <MultipleImageGrid>
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
