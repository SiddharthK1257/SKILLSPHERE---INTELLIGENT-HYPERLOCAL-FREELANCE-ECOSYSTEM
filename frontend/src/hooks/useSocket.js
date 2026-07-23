import { useEffect, useState } from "react";
import socket, { connectSocket } from "../services/socket";

const useSocket = (userId) => {
  const [connected, setConnected] = useState(socket.connected);

  useEffect(() => {
    if (!userId) return;

    connectSocket();

    const onConnect = () => {
      setConnected(true);
      socket.emit("join", userId);
    };

    const onDisconnect = () => {
      setConnected(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    if (socket.connected) {
      socket.emit("join", userId);
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [userId]);

  return { socket, connected };
};

export default useSocket;