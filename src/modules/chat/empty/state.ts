import { create } from "zustand";
import socket from "../../../utils/socket";
import type { DraftMessage, Message } from "../../message/single/type";
import type { emptyDirectChat } from "./type";

export function createEmptyChatStore(targetUserId: number) {
  const sc = create<emptyDirectChat>((set, get) => ({
    name: "not found",
    type: "direct",
    targetUserId,
    messages: [],
    pendingMessages: [],
    loadMessages() {
      console.log("load empty");
    },
    async sendMessage(draft: DraftMessage) {
      try {
        const actualMessage: Message = await socket.emitWithAck(
          "send_message",
          {
            room: `direct:${get().targetUserId}`,
            ...draft,
          },
        );

        set((state) => ({
          messages: (state.messages ?? []).concat([actualMessage]),
        }));
        console.log("recive", actualMessage);
      } catch (error) {
        console.log(
          "Fail to send message: ",
          draft.caption || "empty caption message",
          error,
        );
      }
    },
  }));
  return sc;
}
