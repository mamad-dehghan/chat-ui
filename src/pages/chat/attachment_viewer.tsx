import { Message } from "./types";

type bulkProps = {
  attachment:
    | {
        id: string;
        name: string;
        type: string;
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

  return attachment.map((at, index) =>
    at.type === "image" ? (
      <ImageAttachmentViewer
        key={[at.id, index].join()}
        attachment={at}
        chat_id={chat_id}
        message_id={message_id}
      />
    ) : undefined,
  );
};

type props = {
  attachment: {
    id: string;
    name: string;
    // type: "image";
  };
  chat_id: number;
  message_id: number;
};

const ImageAttachmentViewer = ({ attachment, chat_id, message_id }: props) => {
  return (
    <div>
      <img
        src={`${window.origin}:3000/attachment?${new URLSearchParams({
          id: attachment.id,
          message_id: message_id.toString(),
          chat_id: chat_id.toString(),
        }).toString()}`}
        // width="90%"
        style={{
          maxHeight: "50vh",
          width: "90%",
          objectFit: "cover",
        }}
      />
    </div>
  );
};
