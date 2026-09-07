import {
  ListIcon,
  MagnifyingGlassIcon,
  PencilSimpleIcon,
  UserIcon,
  UsersThreeIcon,
  XIcon,
} from "@phosphor-icons/react";
import classNames from "classnames";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "wouter";
import { Header } from "../../components/header";
import { IconButton, Tooltip } from "kitty";
import { AppLayer } from "kitty";
import { colorOptions, fillOptions, sizeOptions } from "kitty";
import { useChatStore } from "../chat/types";
import "./index.scss";
import { ListItem } from "./list-item";

export const ListPage = () => {
  const username = useChatStore((state) => state.user?.username);
  const chats = useChatStore((state) => state.chats);
  const [, setLocation] = useLocation();

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
          <span>Loged in as: {username}</span>
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
              key={chat.getState().id}
              onClick={() => {
                document.startViewTransition(() => {
                  setLocation(`/chat/${chat.getState().id}`);
                });
              }}
              avatar={undefined}
              title={chat.getState().displayName ?? chat.getState().name}
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
