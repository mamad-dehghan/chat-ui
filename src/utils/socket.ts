import { io, Socket } from "socket.io-client";

// export const SERVER_HOST = "/api";
const server_url = new URL(window.origin);
server_url.port = "3000";

// export const SERVER_HOST = "http://localhost:3000";
export const SERVER_HOST = server_url.toString().replace(/\/$/, "");

const socket: Socket = io(SERVER_HOST, {
  withCredentials: true,
  autoConnect: false,
});

export default socket;
