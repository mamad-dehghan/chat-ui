import { useContext, useMemo } from "react";
import type { RouteComponentProps, StringRouteParams } from "wouter";
import { ChatContext } from "../../providers/chat";
import { ChatContent } from "./chat_content";

type props = RouteComponentProps<StringRouteParams<"/chat/:id">>;

export const ChatPage = ({ params: { id } }: props) => {
  // const { userInformation } = useContext(userContext);
  const { getChatById } = useContext(ChatContext);
  const chat = useMemo(() => getChatById(+id), [getChatById]);
  // const [messages, setMessages] = useState<Map<number, Message>>(new Map());

  if (!chat) return <div>Not Found</div>;

  return <ChatContent chat={chat} />;

  // useEffect(() => {
  //   getChatMessages({ id: +id })
  //     .then((ms) => setMessages(new Map(ms.map((m) => [m.id, m]))))
  //     .catch((e) => {
  //       console.error(e.message);
  //     });
  //   socket.on("new_message", (message: Message) => {
  //     if (message.chat_id === chat?.id) {
  //       setMessages((pre) => {
  //         pre.delete(Infinity);
  //         pre.set(message.id, message);
  //         return new Map(pre.entries());
  //       });
  //     }
  //   });
  //   socket.on("send_message_successful", (message: Message) => {
  //     if (
  //       message.chat_id === chat?.id &&
  //       message.user_id === userInformation.id
  //     ) {
  //       setMessages((pre) => {
  //         pre.delete(Infinity);
  //         pre.set(message.id, message);
  //         return new Map(pre.entries());
  //       });
  //     }
  //   });
  // }, [chat?.id]);

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
  //     {/*<p>{chat?.name} :</p>*/}
  //     <ChatViewer messages={Array.from(messages.values())} />

  //     <ChatInput
  //       onSend={(messaageContent) => {
  //         socket.emit("send_message", {
  //           id: chat?.id,
  //           content: messaageContent,
  //         });
  //         setMessages((pre) => {
  //           pre.set(Infinity, {
  //             id: Infinity,
  //             user_id: userInformation.id,
  //             chat_id: Infinity,
  //             message: messaageContent,
  //             created_at: new Date().toJSON(),
  //           });
  //           return new Map(pre.entries());
  //         });
  //       }}
  //     />
  //   </section>
  // );
};
