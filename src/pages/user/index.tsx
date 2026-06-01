import { useContext, useMemo } from "react";
import {
  useLocation,
  type RouteComponentProps,
  type StringRouteParams,
} from "wouter";
import { ChatContext } from "../../providers/chat";
import { ChatContent } from "../chat/chat_content";
import { userContext } from "../../providers/user";
import { EmptyChat } from "./empty_chat";
import { Header } from "../../components/header";
import { CaretLeftIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { IconButton, Tooltip } from "../../lib/kitty/components";
import {
  sizeOptions,
  fillOptions,
  colorOptions,
} from "../../lib/kitty/providers/theme/types";

type props = RouteComponentProps<StringRouteParams<"/user/:id">>;

export const UserPage = ({ params: { id } }: props) => {
  const [, setLocation] = useLocation();
  const { userInformation } = useContext(userContext);
  const { getChatByDetails } = useContext(ChatContext);
  const chat = useMemo(
    () =>
      getChatByDetails(["direct", [+id, userInformation.id].sort()].join("-")),
    [getChatByDetails, id],
  );
  // const [messages, setMessages] = useState<Map<number, Message>>(new Map());

  if (!chat)
    return (
      <>
        <Header>
          <Tooltip title="Back">
            <IconButton
              onClick={() => {
                document.startViewTransition(() => {
                  setLocation("/");
                });
              }}
              // className="new-chat-button"
              Icon={CaretLeftIcon}
              size={sizeOptions.medium}
              fill={fillOptions.link}
              mode={colorOptions.tertiary}
            />
          </Tooltip>
          <div>user id:{id}</div>
          <Tooltip title="Search">
            <IconButton
              // onClick={() => {

              //   setLocation("/");
              // }}
              // className="new-chat-button"
              Icon={MagnifyingGlassIcon}
              size={sizeOptions.medium}
              fill={fillOptions.link}
              mode={colorOptions.tertiary}
            />
          </Tooltip>
        </Header>

        <EmptyChat room={["direct", id].join(":")} />
      </>
    );
  return <ChatContent chat={chat} />;
};
