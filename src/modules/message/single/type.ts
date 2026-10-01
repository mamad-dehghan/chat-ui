import type { messageAttachment } from "../../attachment/type";

export interface Referrence {
  chat_id: number;
  message_id: number;
}

export interface Message {
  id: number;
  chat_id: number;
  user_id: number;
  caption: string;
  created_at: string;
  attachment:
    | {
        id: string;
        name: string;
        type: string;
        details: any;
      }[]
    | null;
  referrer: Referrence | null;
  replay_to: number | null;
  is_edited: boolean;
  seen: boolean;
}
export interface DraftMessage extends Omit<
  Message,
  | "id"
  | "chat_id"
  | "user_id"
  | "created_at"
  | "attachment"
  | "is_edited"
  | "seen"
> {
  attachment: messageAttachment[] | null;
}
