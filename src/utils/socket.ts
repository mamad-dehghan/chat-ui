import { io, Socket } from "socket.io-client";

// export const SERVER_HOST = "/api";
export const SERVER_HOST = "http://localhost:3000";

const socket: Socket = io(SERVER_HOST, {
  withCredentials: true,
  autoConnect: false,
});

export default socket;
