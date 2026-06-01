import {
  ListIcon,
  MagnifyingGlassIcon,
  PencilSimpleIcon,
  UserIcon,
  UsersThreeIcon,
  XIcon,
} from "@phosphor-icons/react";
import classNames from "classnames";
import { useContext, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "wouter";
import { Header } from "../../components/header";
import { IconButton, Tooltip } from "../../lib/kitty/components";
import { AppLayer } from "../../lib/kitty/providers";
import {
  colorOptions,
  fillOptions,
  sizeOptions,
} from "../../lib/kitty/providers/theme/types";
import { ChatContext } from "../../providers/chat";
import { userContext } from "../../providers/user";
import "./index.scss";
import { ListItem } from "./list-item";

export const ListPage = () => {
  const { userInformation } = useContext(userContext);
  const { chats } = useContext(ChatContext);
  // const [chats, setChats] = useState<Chat[]>([]);
  const [, setLocation] = useLocation();

  // useEffect(() => {
  //   socket.on("receive_chat", (chats: Chat[]) => {
  //     setChats(chats);
  //     // console.log("initial chat list", chats);
  //     // setMessages((prev) => [...prev, data]);
  //   });
  //   socket.on("join_chat", (chat: Chat) => {
  //     setChats((pre) =>
  //       pre.some((c) => c.id === chat.id) ? pre : [...pre, chat],
  //     );
  //     console.log("join_chat", chat);
  //   });
  // }, []);

  return (
    <>
      <main className="list-page">
        <Header>
          <Tooltip title="Back">
            <IconButton
              // onClick={() => {
              // document.startViewTransition(() => {
              //   setLocation("/");
              // });
              // }}
              // className="new-chat-button"
              Icon={ListIcon}
              size={sizeOptions.medium}
              fill={fillOptions.link}
              mode={colorOptions.tertiary}
            />
          </Tooltip>
          <span>Loged in as: {userInformation.username}</span>
          <Tooltip title="Search">
            <IconButton
              Icon={MagnifyingGlassIcon}
              size={sizeOptions.medium}
              fill={fillOptions.link}
              mode={colorOptions.tertiary}
            />
          </Tooltip>
        </Header>
        <div className="chat-list">
          {Array.from(chats.values()).map((chat) => (
            <ListItem
              key={chat.id}
              onClick={() => {
                document.startViewTransition(() => {
                  setLocation(`/chat/${chat.id}`);
                });
              }}
              avatar={undefined}
              title={chat.displayName}
            />
          ))}
        </div>
      </main>
      <FloatSection />
    </>
  );
};

const FloatSection = () => {
  const [, setLocation] = useLocation();
  const [isOpen, setOpen] = useState<boolean>(false);

  return createPortal(
    <AppLayer
      blockBottomLayers={isOpen}
      closeOnEscape={isOpen}
      // preventBlock
      onClick={() => {
        setOpen(false);
      }}
      onClose={() => {
        setOpen(false);
      }}
      className={classNames("float-action-layer", isOpen && "open")}
    >
      <div className="float-actions">
        {isOpen ? (
          <>
            <Tooltip title="New Chat">
              <IconButton
                onClick={() => {
                  document.startViewTransition(() => {
                    setLocation("/contacts");
                  });
                }}
                // className="new-chat-button"
                size={sizeOptions.medium}
                Icon={UserIcon}
                fill={fillOptions.tonal}
                mode={colorOptions.tertiary}
              />
            </Tooltip>
            <Tooltip title="New Group">
              <IconButton
                onClick={() => {
                  document.startViewTransition(() => {
                    setLocation("/create-group");
                  });
                }}
                // className="new-chat-button"
                size={sizeOptions.medium}
                Icon={UsersThreeIcon}
                fill={fillOptions.tonal}
                mode={colorOptions.tertiary}
              />
            </Tooltip>
          </>
        ) : (
          <></>
        )}

        <IconButton
          onClick={(event) => {
            event.stopPropagation();
            if (isOpen) setOpen(false);
            else setOpen(true);
          }}
          // className="new-chat-button"
          size={sizeOptions.medium}
          Icon={isOpen ? XIcon : PencilSimpleIcon}
          fill={fillOptions.tonal}
          mode={colorOptions.tertiary}
        />
      </div>
    </AppLayer>,
    document.getElementById("theme-provider")!,
  );
};
