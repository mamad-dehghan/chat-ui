import socket, { SERVER_HOST } from "../../utils/socket";

export interface LoginUser {
  username: string;
  password: string;
}

export const handleLogin = async (user: LoginUser) => {
  await fetch(`${SERVER_HOST}/login`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(user),
    headers: {
      "Content-type": "application/json",
    },
  });

  socket.connect();
};

export const handleSignin = async (user: LoginUser) => {
  await fetch(`${SERVER_HOST}/signin`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(user),
    headers: {
      "Content-type": "application/json",
    },
  });

  socket.connect();
};
