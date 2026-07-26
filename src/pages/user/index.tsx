import { CaretLeftIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useMemo } from "react";
import {
  useLocation,
  type RouteComponentProps,
  type StringRouteParams,
} from "wouter";
import { Header } from "../../components/header";
import { IconButton, Tooltip } from "../../lib/kitty/components";
import {
  colorOptions,
  fillOptions,
  sizeOptions,
} from "../../lib/kitty/providers/theme/types";
import { ChatContent } from "../chat/chat_content";
import { useChatStore } from "../chat/types";
import { EmptyChat } from "./empty_chat";

type props = RouteComponentProps<StringRouteParams<"/user/:id">>;

export const UserPage = ({ params: { id } }: props) => {
  const [, setLocation] = useLocation();
  const userId = useChatStore((state) => state.user?.id);

  const getChat = useChatStore((state) => state.getChatByName);
  const chatStore = useMemo(
    () => getChat(["direct", [id, userId].sort()].join("-")),
    [getChat, id],
  );

  if (!chatStore)
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
  return <ChatContent useChat={chatStore} />;
};
