import { CaretRightIcon, XIcon } from "@phosphor-icons/react";
import {
  colorOptions,
  fillOptions,
  FilterChip,
  IconButton,
  sizeOptions,
  Tooltip,
} from "kitty";
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
} from "react";
import { useHeader } from "../../layout/header";
import { HeaderBackButton } from "../../layout/header/commons";
import { ListItem } from "../list/list-item";
import type { User } from "../../modules/users/type";

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
  const setup = useHeader((state) => state.setup);

  useEffect(() => {
    setup({
      left: <HeaderBackButton />,
      center: (
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
      ),
      right: (
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
      ),
    });
  }, [selectedUsers]);

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
