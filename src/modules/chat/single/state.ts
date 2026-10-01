import { create } from "zustand";
import { getChatMessages } from "../../../pages/chat/api";
import socket from "../../../utils/socket";
import type { DraftMessage, Message } from "../../message/single/type";
import type { Chat } from "../list/type";
import type { single } from "./type";

export function createSingleChatStore(chat: Chat) {
  const sc = create<single>((set, get) => ({
    ...chat,
    messages: undefined,
    // pendingMessages: [],
    async loadMessages() {
      const messages = await getChatMessages({ id: get().id });
      set({ messages });
    },
    async sendMessage(draft: DraftMessage) {
      // const tempMessage: Omit<Message, "attachment">  = {
      //   id: Math.random(),
      //   user_id: userInformation.id,
      //   chat_id: get().id,
      //   created_at: new Date().toISOString(),
      //   is_edited: false,
      //   seen: false,
      //   ...draft,
      // };

      // set((state) => ({
      //   pendingMessages: state.pendingMessages.concat([tempMessage]),
      // }));

      try {
        const actualMessage: Message = await socket.emitWithAck(
          "send_message",
          {
            id: get().id,
            ...draft,
          },
        );

        set((state) => ({
          // pendingMessages: state.pendingMessages.filter(
          //   (item) => item.id !== tempMessage.id,
          // ),
          messages: (state.messages ?? []).concat([actualMessage]),
        }));
      } catch (error) {
        console.log(
          "Fail to send message: ",
          draft.caption || "empty caption message",
          error,
        );
        // set((state) => ({
        //   pendingMessages: state.pendingMessages.filter(
        //     (item) => item.id !== tempMessage.id,
        //   ),
        // }));
      }
    },
  }));
  socket.on("new_message", (message: Message) => {
    if (message.chat_id === sc.getState().id) {
      sc.setState((state) => ({
        messages: (state.messages ?? []).concat([message]),
      }));
    }
  });
  return sc;
}
