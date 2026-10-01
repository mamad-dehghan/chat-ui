import { UserPlusIcon } from "@phosphor-icons/react";
import {
  colorOptions,
  fillOptions,
  IconButton,
  LoadingIndicator,
  sizeOptions,
  Tooltip,
} from "kitty";
import { Suspense, use, useEffect } from "react";
import { useLocation } from "wouter";
import { useHeader } from "../../layout/header";
import { HeaderBackButton } from "../../layout/header/commons";
import { ListItem } from "../list/list-item";
import "./index.scss";
import { useUsersState } from "../../modules/users/state";
import { PageLoading } from "../../components/page_loading";
import type { User } from "../../modules/users/type";

export const ContactsPage = () => {
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

  const contactsPromise = useUsersState((state) => state.getContacts)();

  return (
    <>
      <Suspense fallback={<PageLoading />}>
        <Contacts contactsPromise={contactsPromise} />
      </Suspense>
    </>
  );
};

type contactsViewerProps = { contactsPromise: Promise<User[]> };

const Contacts = ({ contactsPromise }: contactsViewerProps) => {
  const [, setLocation] = useLocation();
  const contacts = use(contactsPromise);

  return (
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
  );
};
