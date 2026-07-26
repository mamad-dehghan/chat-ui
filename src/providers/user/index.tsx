import { useLayoutEffect, type ReactNode } from "react";
import { useLocation } from "wouter";
import { useChatStore } from "../../pages/chat/types";
import { LoginPage } from "../../pages/login";
import socket from "../../utils/socket";

export interface User {
  id: number;
  username: string;
}

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const userInformation = useChatStore((state) => state.user);
  const [location, setLocation] = useLocation();

  useLayoutEffect(() => {
    socket.on("connect_error", (err) => {
      console.error("Connection failed:", err.message);
      if (location !== "/") setLocation("/");
    });
    socket.connect();
  }, []);

  if (!userInformation) return <LoginPage />;

  return children;
};
