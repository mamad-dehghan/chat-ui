import { CaretLeftIcon, UserPlusIcon } from "@phosphor-icons/react";
import { useLocation } from "wouter";
import { Header } from "../../components/header";
import { useFetch } from "../../hooks/useFetch";
import { IconButton, Tooltip } from "@kitty/components";
import { colorOptions, fillOptions, sizeOptions } from "@kitty/providers";
import { ListItem } from "../list/list-item";
import { getContacts } from "./api";
import "./index.scss";

export const ContactsPage = () => {
  const [, setLocation] = useLocation();
  const contacts = useFetch(getContacts);

  console.log("contacts", contacts);
  return (
    <div className="contacts-page">
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
        <span></span>
        <Tooltip title="Add Contact">
          <IconButton
            // onClick={() => {
            //   setLocation("/contacts");
            // }}
            // className="new-chat-button"
            Icon={UserPlusIcon}
            size={sizeOptions.medium}
            fill={fillOptions.link}
            mode={colorOptions.tertiary}
          />
        </Tooltip>
      </Header>
      {contacts === undefined ? (
        <div>loading ... </div>
      ) : (
        <div className="contacts-list">
          {contacts.map((user) => (
            <ListItem
              key={user.username}
              avatar={undefined}
              title={user.username}
              onClick={() => {
                document.startViewTransition(() => {
                  setLocation(`/user/${user.id}`);
                });
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
