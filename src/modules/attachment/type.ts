import type { Referrence } from "../message/single/type";

export interface directMessageAttachment {
  type: "image" | "video" | "gif" | "file";
  name: string;
  file: File;
}
export interface referrenceMessageAttachment {
  type: "image" | "video" | "gif" | "file";
  id: number;
  access: Referrence;
}
export type messageAttachment =
  directMessageAttachment | referrenceMessageAttachment;
