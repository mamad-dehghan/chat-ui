import { CaretLeftIcon, CaretRightIcon, XIcon } from "@phosphor-icons/react";
import { Dispatch, SetStateAction, useCallback } from "react";
import { useLocation } from "wouter";
import { Header } from "../../components/header";
import { FilterChip, IconButton, Tooltip } from "kitty";
import { colorOptions, fillOptions, sizeOptions } from "kitty";
import { User } from "../../providers/user";
import { ListItem } from "../list/list-item";

type props = {
  contacts: User[] | undefined;
  selectedUsers: User[];
  setSelectedUsers: Dispatch<SetStateAction<User[]>>;
  // toggleSelect:(user: User) => () => void
  handleNext: () => void;
};
export const SelectUserSection = ({
  contacts,
  selectedUsers,
  setSelectedUsers,
  handleNext,
}: props) => {
  const [, setLocation] = useLocation();

  const toggleSelect = useCallback(
    (user: User) => () => {
      setSelectedUsers((pre) =>
        pre.some((u) => u.id === user.id)
          ? [...pre.filter((u) => u.id !== user.id)]
          : [user].concat(pre),
      );
    },
    [],
  );

  return (
    <div className="select-user-group-page">
      <Header>
        <Tooltip title="Back">
          <IconButton
            onClick={() => {
              document.startViewTransition(() => {
                setLocation("/");
              });
            }}
            Icon={CaretLeftIcon}
            size={sizeOptions.medium}
            fill={fillOptions.link}
            mode={colorOptions.tertiary}
          />
        </Tooltip>
        <span
          style={{
            display: "flex",
            flexFlow: "row wrap",
            maxHeight: "4rem",
            gap: "6px",
            padding: "6px",
          }}
        >
          {selectedUsers.map((user) => (
            <FilterChip
              key={user.id}
              enable
              fill={fillOptions.outline}
              Icon={XIcon}
              onClick={toggleSelect(user)}
            >
              {user.username}
            </FilterChip>
          ))}
        </span>
        <Tooltip title="Next">
          <IconButton
            onClick={() => {
              document.startViewTransition(() => {
                handleNext();
              });
            }}
            Icon={CaretRightIcon}
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
              onClick={toggleSelect(user)}
              selected={selectedUsers.some((u) => u.id === user.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
