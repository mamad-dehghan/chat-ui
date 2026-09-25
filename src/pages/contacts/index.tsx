import { UserPlusIcon } from "@phosphor-icons/react";
import {
  colorOptions,
  fillOptions,
  IconButton,
  sizeOptions,
  Tooltip,
} from "kitty";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { useFetch } from "../../hooks/useFetch";
import { useHeader } from "../../layout/header";
import { HeaderBackButton } from "../../layout/header/commons";
import { ListItem } from "../list/list-item";
import { getContacts } from "./api";
import "./index.scss";

export const ContactsPage = () => {
  const [, setLocation] = useLocation();
  const contacts = useFetch(getContacts);
  const setup = useHeader((state) => state.setup);

  useEffect(() => {
    setup({
      left: <HeaderBackButton />,
      center: null,
      right: (
        <Tooltip title="Add Contact">
          <IconButton
            Icon={UserPlusIcon}
            size={sizeOptions.medium}
            fill={fillOptions.link}
            mode={colorOptions.tertiary}
          />
        </Tooltip>
      ),
    });
  }, []);

  return (
    <>
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
    </>
  );
};
