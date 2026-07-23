import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});

/* ==========================================
   CONNECT
========================================== */

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

/* ==========================================
   DISCONNECT
========================================== */

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

/* ==========================================
   USER ROOM (Notifications)
========================================== */

export const joinNotificationRoom = (userId) => {
  if (!userId) return;

  connectSocket();

  socket.emit("join", userId);

  console.log("Joined Notification Room:", userId);
};

export const leaveNotificationRoom = (userId) => {
  if (!userId) return;

  socket.emit("leave", userId);
};

/* ==========================================
   CONVERSATION ROOM
========================================== */

export const joinConversation = (conversationId) => {
  if (!conversationId) return;

  socket.emit("joinConversation", conversationId);

  console.log("Joined Conversation:", conversationId);
};

export const leaveConversation = (conversationId) => {
  if (!conversationId) return;

  socket.emit("leaveConversation", conversationId);
};

/* ==========================================
   SEND CHAT MESSAGE
========================================== */

export const sendChatMessage = (message) => {
  socket.emit("sendMessage", message);
};

/* ==========================================
   RECEIVE CHAT MESSAGE
========================================== */

export const onReceiveMessage = (callback) => {
  socket.on("receiveMessage", callback);
};

export const removeReceiveMessage = () => {
  socket.off("receiveMessage");
};

/* ==========================================
   TYPING
========================================== */

export const startTyping = (data) => {
  socket.emit("typing", data);
};

export const stopTyping = (data) => {
  socket.emit("stopTyping", data);
};

export const onTyping = (callback) => {
  socket.on("typing", callback);
};

export const onStopTyping = (callback) => {
  socket.on("stopTyping", callback);
};

export const removeTypingListeners = () => {
  socket.off("typing");
  socket.off("stopTyping");
};

/* ==========================================
   NOTIFICATIONS
========================================== */

export const onNewNotification = (callback) => {
  socket.on("newNotification", callback);
};

export const removeNotificationListener = () => {
  socket.off("newNotification");
};

/* ==========================================
   ONLINE USERS
========================================== */

export const onOnlineUsers = (callback) => {
  socket.on("onlineUsers", callback);
};

export const removeOnlineUsersListener = () => {
  socket.off("onlineUsers");
};

/* ==========================================
   SOCKET EVENTS
========================================== */

socket.on("connect", () => {
  console.log("🟢 Socket Connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("🔴 Socket Disconnected:", reason);
});

socket.on("connect_error", (err) => {
  console.error("Socket Error:", err.message);
});

/* ==========================================
   EXPORT
========================================== */

export default socket;