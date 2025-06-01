// src/socketClient.ts
import { io, Socket } from "socket.io-client";

const SOCKET_NAMESPACE = "/team-chat";

const socket: Socket = io(`${import.meta.env.VITE_API_BASE_URL}${SOCKET_NAMESPACE}`, {
  transports: ["websocket"],
  auth: {
    token: localStorage.getItem("access_token") || "",
  },
});

console.log(socket);

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Socket connect_error:", err.message);
});

export default socket;
