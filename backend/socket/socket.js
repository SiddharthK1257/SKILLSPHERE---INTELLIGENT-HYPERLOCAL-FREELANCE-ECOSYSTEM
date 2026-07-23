import { Server } from "socket.io";

let io = null;

/* ==========================================================
   ONLINE USERS
========================================================== */

// userId => Set(socketIds)
const onlineUsers = new Map();

/* ==========================================================
   INITIALIZE SOCKET
========================================================== */

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin:
        [
        "http://localhost:5173",
        process.env.FRONTEND_URL,
    ],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`🟢 Connected: ${socket.id}`);

    /* ======================================================
       USER JOIN
    ====================================================== */

    socket.on("join", (userId) => {
      try {
        if (!userId) return;

        userId = userId.toString();
        socket.userId = userId;

        if (!onlineUsers.has(userId)) {
          onlineUsers.set(userId, new Set());
        }

        onlineUsers.get(userId).add(socket.id);

        socket.join(userId);

        console.log(`✅ ${userId} joined`);

        io.emit("onlineUsers", [...onlineUsers.keys()]);
      } catch (err) {
        console.error(err);
      }
    });

    /* ======================================================
       JOIN CHAT
    ====================================================== */

    socket.on("joinConversation", (conversationId) => {
      if (!conversationId) return;

      socket.join(conversationId);

      console.log(
        `💬 ${socket.id} joined ${conversationId}`
      );
    });

    /* ======================================================
       LEAVE CHAT
    ====================================================== */

    socket.on("leaveConversation", (conversationId) => {
      if (!conversationId) return;

      socket.leave(conversationId);

      console.log(
        `🚪 ${socket.id} left ${conversationId}`
      );
    });

    /* ======================================================
       SEND MESSAGE
    ====================================================== */

    socket.on("sendMessage", (message) => {
      if (!message) return;

      const room =
        typeof message.conversation === "object"
          ? message.conversation._id
          : message.conversation;

      if (!room) return;

      io.to(room).emit("receiveMessage", message);
    });

    /* ======================================================
       TYPING
    ====================================================== */

    socket.on("typing", (data) => {
      const room =
        data?.conversation ||
        data?.conversationId;

      if (!room) return;

      socket.to(room).emit("typing", {
        ...data,
        conversation: room,
      });
    });

    socket.on("stopTyping", (data) => {
      const room =
        data?.conversation ||
        data?.conversationId;

      if (!room) return;

      socket.to(room).emit("stopTyping", {
        ...data,
        conversation: room,
      });
    });

    /* ======================================================
       MESSAGE DELIVERED
    ====================================================== */

    socket.on("messageDelivered", (data) => {
      const room =
        data?.conversation ||
        data?.conversationId;

      if (!room) return;

      io.to(room).emit("messageDelivered", data);
    });

    /* ======================================================
       MESSAGE SEEN
    ====================================================== */

    socket.on("messageSeen", (data) => {
      const room =
        data?.conversation ||
        data?.conversationId;

      if (!room) return;

      io.to(room).emit("messageSeen", data);
    });

    /* ======================================================
       MESSAGE EDITED
    ====================================================== */

    socket.on("messageEdited", (data) => {
      const room =
        data?.conversation ||
        data?.conversationId;

      if (!room) return;

      io.to(room).emit("messageEdited", data);
    });

    /* ======================================================
       MESSAGE DELETED
    ====================================================== */

    socket.on("messageDeleted", (data) => {
      const room =
        data?.conversation ||
        data?.conversationId;

      if (!room) return;

      io.to(room).emit("messageDeleted", data);
    });

    /* ======================================================
       NOTIFICATIONS
    ====================================================== */

    socket.on(
      "sendNotification",
      ({ userId, notification }) => {
        if (!userId) return;

        io.to(userId.toString()).emit(
          "newNotification",
          notification
        );
      }
    );

    /* ======================================================
       CHECK ONLINE
    ====================================================== */

    socket.on(
      "isUserOnline",
      (userId, callback) => {
        callback?.(
          onlineUsers.has(userId.toString())
        );
      }
    );

    /* ======================================================
       DISCONNECT
    ====================================================== */

    socket.on("disconnect", () => {
      console.log(
        `🔴 Disconnected: ${socket.id}`
      );

      if (socket.userId) {
        const sockets =
          onlineUsers.get(socket.userId);

        if (sockets) {
          sockets.delete(socket.id);

          if (sockets.size === 0) {
            onlineUsers.delete(socket.userId);
          }
        }
      }

      io.emit("onlineUsers", [...onlineUsers.keys()]);
    });
  });

  return io;
};

/* ==========================================================
   HELPERS
========================================================== */

export const getIO = () => io;

export const getOnlineUsers = () =>
  [...onlineUsers.keys()];

export const isUserOnline = (userId) =>
  onlineUsers.has(userId.toString());

export const emitToUser = (
  userId,
  event,
  payload
) => {
  if (!io || !userId) return;

  io.to(userId.toString()).emit(
    event,
    payload
  );
};

export const emitToConversation = (
  conversationId,
  event,
  payload
) => {
  if (!io || !conversationId) return;

  io.to(conversationId).emit(
    event,
    payload
  );
};