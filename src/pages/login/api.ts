import socket from "../../utils/socket";

export interface LoginUser {
  username: string;
  password: string;
}

export const handleLogin = async (user: LoginUser) => {
  await fetch("http://localhost:3000/login", {
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
  await fetch("http://localhost:3000/signin", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(user),
    headers: {
      "Content-type": "application/json",
    },
  });

  socket.connect();
};
