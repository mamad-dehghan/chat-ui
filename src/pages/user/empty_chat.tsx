import { useMemo } from "react";
import { useChatStore } from "../../modules/chat/list/state";
import { ChatViewer } from "../../modules/chat/list/view";

type props = {
  id: number;
};

export const EmptyChat = ({ id }: props) => {
  const getDraftChat = useChatStore((state) => state.addEmptyDirectChat);

  const useChat = useMemo(() => getDraftChat(+id), [getDraftChat, id]);
  // const sendMessage = useChat((state) => state.sendMessage);

  return <ChatViewer useChat={useChat} />;
  // return (
  //   <section
  //     style={{
  //       width: "100%",
  //       // minHeight: "100vh",
  //       // height: "100vh",
  //       // overflow: "hidden",
  //       // display: "grid",
  //       // gridTemplateAreas: "chat-content / chat-input",
  //       // gridTemplateColumns: "1fr",
  //       // gridTemplateRows: "1fr auto",
  //       position: "relative",
  //     }}
  //   >
  //     <ChatViewer useChat={useChat} />

  //     <ChatInput
  //       onSend={({ attachment, caption, replay_to }) => {
  //         sendMessage({
  //           caption,
  //           attachment,
  //           replay_to,
  //           referrer: null,
  //         });
  //       }}
  //     />
  //   </section>
  // );
};
