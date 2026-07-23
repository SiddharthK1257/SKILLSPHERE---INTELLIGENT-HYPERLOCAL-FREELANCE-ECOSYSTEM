import { useEffect, useState, useCallback, useMemo } from "react";
import {
  MessageCircle,
  UserCircle,
  Search,
  Circle,
  Check,
  CheckCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { getConversations } from "../api/chatApi";
import useSocket from "../hooks/useSocket";
import Loader from "./Loader";

const ChatSidebar = ({
  selectedConversation,
  setSelectedConversation,
}) => {
  /* ==========================================================
      STATES
  ========================================================== */

  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [onlineUsers, setOnlineUsers] = useState([]);

  const [typingUsers, setTypingUsers] = useState({});

  /* ==========================================================
      CURRENT USER
  ========================================================== */

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  const { socket, connected } = useSocket(
    currentUser?._id
  );

  /* ==========================================================
      LOAD CONVERSATIONS
  ========================================================== */

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getConversations();

      const list =
        response?.conversations || [];

      setConversations(list);

      if (
        !selectedConversation &&
        list.length > 0
      ) {
        setSelectedConversation(list[0]);
      }
    } catch (error) {
      console.error(
        "Conversation Error:",
        error
      );

      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, [
    selectedConversation,
    setSelectedConversation,
  ]);

  /* ==========================================================
      INITIAL LOAD
  ========================================================== */

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  /* ==========================================================
      SEARCH
  ========================================================== */

  useEffect(() => {
    if (!search.trim()) {
      setFilteredConversations(
        conversations
      );
      return;
    }

    const value = search.toLowerCase();

    const filtered =
      conversations.filter((conversation) => {
        const receiver =
          conversation.participants?.find(
            (user) =>
              user?._id !== currentUser?._id
          );

        return receiver?.name
          ?.toLowerCase()
          .includes(value);
      });

    setFilteredConversations(filtered);
  }, [
    search,
    conversations,
    currentUser,
  ]);
    /* ==========================================================
      SOCKET EVENTS
  ========================================================== */

  useEffect(() => {
    if (!socket) return;

    /* ------------------------------
       Online Users
    ------------------------------ */

    const handleOnlineUsers = (users) => {
      setOnlineUsers(users || []);
    };

    /* ------------------------------
       Conversation Updated
    ------------------------------ */

    const handleConversationUpdate = () => {
      loadConversations();
    };

    /* ------------------------------
       Receive Message
    ------------------------------ */

    const handleReceiveMessage = (message) => {
      loadConversations();

      if (!message?.conversation) return;

      setTypingUsers((prev) => ({
        ...prev,
        [message.conversation]: false,
      }));
    };

    /* ------------------------------
       Typing
    ------------------------------ */

    const handleTyping = (data) => {
      if (!data?.conversationId) return;

      setTypingUsers((prev) => ({
        ...prev,
        [data.conversationId]: true,
      }));
    };

    /* ------------------------------
       Stop Typing
    ------------------------------ */

    const handleStopTyping = (data) => {
      if (!data?.conversationId) return;

      setTypingUsers((prev) => ({
        ...prev,
        [data.conversationId]: false,
      }));
    };

    socket.on("onlineUsers", handleOnlineUsers);

    socket.on(
      "receiveMessage",
      handleReceiveMessage
    );

    socket.on(
      "conversationUpdated",
      handleConversationUpdate
    );

    socket.on(
      "messageEdited",
      handleConversationUpdate
    );

    socket.on(
      "messageDeleted",
      handleConversationUpdate
    );

    socket.on(
      "messageSeen",
      handleConversationUpdate
    );

    socket.on("typing", handleTyping);

    socket.on(
      "stopTyping",
      handleStopTyping
    );

    return () => {
      socket.off(
        "onlineUsers",
        handleOnlineUsers
      );

      socket.off(
        "receiveMessage",
        handleReceiveMessage
      );

      socket.off(
        "conversationUpdated",
        handleConversationUpdate
      );

      socket.off(
        "messageEdited",
        handleConversationUpdate
      );

      socket.off(
        "messageDeleted",
        handleConversationUpdate
      );

      socket.off(
        "messageSeen",
        handleConversationUpdate
      );

      socket.off(
        "typing",
        handleTyping
      );

      socket.off(
        "stopTyping",
        handleStopTyping
      );
    };
  }, [socket, loadConversations]);

  /* ==========================================================
      HELPERS
  ========================================================== */

  const getReceiver = useCallback(
    (conversation) => {
      return (
        conversation?.participants?.find(
          (user) =>
            user?._id?.toString() !==
            currentUser?._id?.toString()
        ) || null
      );
    },
    [currentUser]
  );

  const isUserOnline = useCallback(
    (userId) => {
      return onlineUsers.includes(
        userId?.toString()
      );
    },
    [onlineUsers]
  );

  const formatTime = (date) => {
    if (!date) return "";

    const d = new Date(date);

    const today = new Date();

    if (
      d.toDateString() === today.toDateString()
    ) {
      return d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return d.toLocaleDateString([], {
      day: "numeric",
      month: "short",
    });
  };

  const sortedConversations = useMemo(() => {
    return [...filteredConversations].sort(
      (a, b) => {
        return (
          new Date(
            b.lastMessageTime ||
              b.updatedAt
          ) -
          new Date(
            a.lastMessageTime ||
              a.updatedAt
          )
        );
      }
    );
  }, [filteredConversations]);
    /* ==========================================================
      LOADING
  ========================================================== */

  if (loading) {
    return (
      <Loader
        fullScreen={false}
        text="Loading Conversations..."
      />
    );
  }

  return (
    <div className="flex h-full flex-col bg-white">

      {/* ================= Header ================= */}

      <div className="border-b bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-5 text-white shadow-md">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <MessageCircle size={26} />

            <div>

              <h2 className="text-xl font-bold">
                Messages
              </h2>

              <p className="text-xs text-blue-100">
                {connected
                  ? "Connected"
                  : "Connecting..."}
              </p>

            </div>

          </div>

        </div>

        {/* Search */}

        <div className="relative mt-5">

          <Search
            size={18}
            className="absolute left-3 top-3 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search conversations..."
            className="
              w-full
              rounded-xl
              bg-white
              py-3
              pl-10
              pr-4
              text-sm
              text-gray-700
              outline-none
              ring-2
              ring-transparent
              transition
              focus:ring-blue-400
            "
          />

        </div>

      </div>

      {/* ================= Conversation List ================= */}

      <div className="flex-1 overflow-y-auto">

        <AnimatePresence>

          {sortedConversations.length === 0 ? (

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              className="
                flex
                h-full
                flex-col
                items-center
                justify-center
                text-gray-500
              "
            >

              <MessageCircle
                size={60}
                className="mb-4 text-gray-300"
              />

              <h3 className="text-lg font-semibold">
                No Conversations
              </h3>

              <p className="mt-2 text-center text-sm">
                Start chatting with a freelancer
                or client.
              </p>

            </motion.div>

          ) : (

            sortedConversations.map(
              (conversation) => {

                const receiver =
                  getReceiver(conversation);

                const isSelected =
                  selectedConversation?._id ===
                  conversation._id;

                const online =
                  isUserOnline(receiver?._id);

                const unread =
                  conversation?.unreadCounts?.[
                    currentUser?._id
                  ] || 0;

                const typing =
                  typingUsers[
                    conversation._id
                  ];

                return (

                  <motion.button
                    key={conversation._id}
                    layout
                    whileHover={{
                      backgroundColor:
                        "#f8fafc",
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    onClick={() =>
                      setSelectedConversation(
                        conversation
                      )
                    }
                    className={`
                      relative
                      flex
                      w-full
                      items-center
                      gap-4
                      border-b
                      px-4
                      py-4
                      transition-all
                      ${
                        isSelected
                          ? "bg-blue-50 border-l-4 border-blue-600"
                          : ""
                      }
                    `}
                  >
                                        {/* Avatar */}

                    <div className="relative shrink-0">

                      {receiver?.profileImage ? (

                        <img
                          src={receiver.profileImage}
                          alt={receiver?.name}
                          className="h-14 w-14 rounded-full object-cover"
                        />

                      ) : (

                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-lg font-bold text-white">

                          {receiver?.name ? (
                            receiver.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .substring(0, 2)
                              .toUpperCase()
                          ) : (
                            <UserCircle size={28} />
                          )}

                        </div>

                      )}

                      {/* Online Indicator */}

                      <Circle
                        size={14}
                        fill={online ? "#22c55e" : "#9ca3af"}
                        className={`absolute bottom-1 right-1 ${
                          online
                            ? "text-green-500"
                            : "text-gray-400"
                        }`}
                      />

                    </div>

                    {/* Conversation */}

                    <div className="min-w-0 flex-1">

                      <div className="flex items-center justify-between">

                        <h3 className="truncate font-semibold text-slate-800">

                          {receiver?.name || "Unknown User"}

                        </h3>

                        <span className="text-xs text-slate-400">

                          {formatTime(
                            conversation.lastMessageTime ||
                              conversation.updatedAt
                          )}

                        </span>

                      </div>

                      <div className="mt-1 flex items-center justify-between">

                        <div className="flex min-w-0 items-center gap-2">

                          {typing ? (

                            <span className="animate-pulse text-sm font-medium text-blue-600">
                              Typing...
                            </span>

                          ) : (

                            <>

                              {conversation.lastMessageSender ===
                                currentUser?._id && (
                                <>
                                  {conversation.lastMessageStatus ===
                                  "seen" ? (
                                    <CheckCheck
                                      size={16}
                                      className="text-blue-500"
                                    />
                                  ) : (
                                    <Check
                                      size={16}
                                      className="text-slate-400"
                                    />
                                  )}
                                </>
                              )}

                              <p className="truncate text-sm text-slate-500">

                                {conversation.lastMessage ||
                                  "Start chatting..."}

                              </p>

                            </>

                          )}

                        </div>

                        {/* Unread Badge */}

                        {unread > 0 && (

                          <span
                            className="
                              ml-3
                              flex
                              h-6
                              min-w-[24px]
                              items-center
                              justify-center
                              rounded-full
                              bg-blue-600
                              px-2
                              text-xs
                              font-bold
                              text-white
                            "
                          >

                            {unread > 99
                              ? "99+"
                              : unread}

                          </span>

                        )}

                      </div>

                    </div>

                  </motion.button>

                );

              }
            )

          )}

        </AnimatePresence>

      </div>

    </div>
  );
};

export default ChatSidebar;