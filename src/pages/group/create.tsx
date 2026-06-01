import { useState } from "react";
import { useLocation } from "wouter";
import { useFetch } from "../../hooks/useFetch";
import { User } from "../../providers/user";
import socket from "../../utils/socket";
import { getContacts } from "../contacts/api";
import { AskInfo } from "./ask_info";
import { SelectUserSection } from "./select_user";

export const SelectGroupUserPage = () => {
  const [, setLocation] = useLocation();
  const contacts = useFetch(getContacts);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [pageState, setPageState] = useState<string>("select");

  if (pageState === "select")
    return (
      <SelectUserSection
        contacts={contacts}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        handleNext={() => {
          setPageState("group_info");
        }}
      />
    );

  if (pageState === "group_info")
    return (
      <AskInfo
        handlePrevious={() => {
          setPageState("select");
        }}
        handleNext={async (groupName) => {
          const response = await socket.emitWithAck("create-room", {
            name: groupName,
            type: "group",
            user_ids: selectedUsers.map((user) => user.id),
          });
          // joinChat(response);
          setLocation(`/chat/${response.id}`);
        }}
      />
    );
};
