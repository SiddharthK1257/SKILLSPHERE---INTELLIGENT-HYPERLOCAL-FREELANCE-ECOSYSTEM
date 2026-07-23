import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import socket from "../services/socket";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    const handleConnect = () => {
      console.log("✅ Socket Connected");

      setConnected(true);

      if (user?._id) {
        socket.emit("join", user._id);
      }
    };

    const handleDisconnect = () => {
      console.log("❌ Socket Disconnected");
      setConnected(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    if (!socket.connected) {
      socket.connect();
    } else {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error(
      "useSocket must be used inside SocketProvider"
    );
  }

  return context;
};

export default SocketContext;