import { create } from "zustand";
import { getChatMessages } from "../../../pages/chat/api";
import socket from "../../../utils/socket";
import type { DraftMessage, Message } from "../../message/single/type";
import type { Chat } from "../list/type";
import type { DeleteAttachmentsAck, DeleteMessageAck, single } from "./type";

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
    async deleteMessage(id: number) {
      const ack: DeleteMessageAck = await socket
        .emitWithAck("delete-message", { id, chat_id: get().id })
        .catch((error) => ({ status: false, error }));
      if (!ack.status) {
        console.log("Fail to delete message: ", id, ack);
        // TODO: add toast message
        return false;
      }
      set((state) => ({
        messages: state.messages?.filter((msg) => msg.id !== id),
      }));
      return true;
    },
    async deleteAttachments(
      message_id: number,
      attachment_ids: (string | number)[],
    ) {
      const ack: DeleteAttachmentsAck = await socket.emitWithAck(
        "delete-attachments",
        { chat_id: get().id, message_id, attachment_ids },
      );
      if (!ack.status) {
        console.log("Fail to delete attachments: ", message_id, ack);
        // TODO: add toast message
        return false;
      }
      set((state) => ({
        messages: state.messages?.map((msg) =>
          msg.id === message_id ? ack.message : msg,
        ),
      }));
      return true;
    },
  }));
  socket.on("new_message", (message: Message) => {
    if (message.chat_id === sc.getState().id) {
      sc.setState((state) => ({
        messages: (state.messages ?? []).concat([message]),
      }));
    }
  });

  socket.on("delete_message", (message: Pick<Message, "chat_id" | "id">) => {
    if (message.chat_id === sc.getState().id) {
      sc.setState((state) => ({
        messages: state.messages?.filter((msg) => msg.id !== message.id),
      }));
    }
  });

  socket.on("update_message", (updatedMessage: Message) => {
    if (updatedMessage.chat_id === sc.getState().id) {
      sc.setState((state) => ({
        messages: state.messages?.map((msg) =>
          msg.id === updatedMessage.id ? updatedMessage : msg,
        ),
      }));
    }
  });

  return sc;
}
