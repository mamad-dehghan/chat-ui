import { createContext, useEffect, useState, type ReactNode } from "react";
import { useLocation } from "wouter";
import { LoginPage } from "../../pages/login";
import socket from "../../utils/socket";

export interface User {
  id: number;
  username: string;
}

type userCT = {
  userInformation: User;
};

export const userContext = createContext<userCT>({
  userInformation: undefined as unknown as User,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userInformation, setUserInfo] = useState<User | undefined>(undefined);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    socket.on("connect", () => {
      // setIsConnected(true);
      // console.log("Connected!");
    });

    socket.on("connect_error", (err) => {
      console.error("Connection failed:", err.message);
      if (location !== "/") setLocation("/");
    });
    socket.connect();
    socket.on("user_info", setUserInfo);
    // socket.on("receive_chat", (chats: Chat[]) => {
    // console.log(chats, "chats");
    // });
    return () => {
      // socket.off("connect");
      // socket.off("connect_error");
    };
  }, []);

  if (!userInformation) return <LoginPage />;

  return (
    <userContext.Provider value={{ userInformation }}>
      {/*Logged in as {userInformation.username}*/}
      {children}
    </userContext.Provider>
  );
};
