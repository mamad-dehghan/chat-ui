import { type ReactNode, useLayoutEffect } from "react";
import { useLocation } from "wouter";
import { LoginPage } from "../../pages/login";
import socket from "../../utils/socket";
import { useChatStore } from "../chat/list/state";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const userInformation = useChatStore((state) => state.user);
  const [_, setLocation] = useLocation();

  useLayoutEffect(() => {
    socket.on("connect_error", (err) => {
      console.error("Connection failed:", err.message);
      setLocation("/");
    });
    socket.connect();
  }, []);

  if (!userInformation) return <LoginPage />;

  return children;
};
