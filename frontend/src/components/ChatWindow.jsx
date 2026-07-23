import { useEffect, useRef, useState } from "react";
import {
  MessageCircle,
  UserCircle,
  Circle,
} from "lucide-react";

import { getMessages } from "../api/chatApi";
import useSocket from "../hooks/useSocket";

import Loader from "./Loader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

const ChatWindow = ({ conversation }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  const { socket } = useSocket(currentUser?._id);

  /* ======================================
      LOAD MESSAGES
  ====================================== */

  useEffect(() => {
    if (!conversation?._id) {
      setMessages([]);
      return;
    }

    loadMessages();
  }, [conversation]);

  const loadMessages = async () => {
    try {
      setLoading(true);

      const response = await getMessages(
        conversation._id
      );

      setMessages(response?.messages || []);
    } catch (error) {
      console.error(error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  /* ======================================
      SOCKET RECEIVE
  ====================================== */

  useEffect(() => {
    if (!socket) return;

    const receiveMessage = (message) => {
      if (
        message?.conversation === conversation?._id ||
        message?.conversation?._id === conversation?._id
      ) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("receiveMessage", receiveMessage);

    return () => {
      socket.off("receiveMessage", receiveMessage);
    };
  }, [socket, conversation]);

  /* ======================================
      AUTO SCROLL
  ====================================== */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  /* ======================================
      AFTER SEND
  ====================================== */

  const handleMessageSent = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  /* ======================================
      EMPTY STATE
  ====================================== */

  if (!conversation) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-gray-50">

        <MessageCircle
          size={80}
          className="text-blue-500 mb-5"
        />

        <h2 className="text-2xl font-bold text-gray-700">
          Welcome to SkillSphere Chat
        </h2>

        <p className="mt-3 text-gray-500">
          Select a conversation to start chatting.
        </p>

      </div>
    );
  }

  /* ======================================
      LOADING
  ====================================== */

  if (loading) {
    return (
      <Loader
        fullScreen={false}
        text="Loading Messages..."
      />
    );
  }

  const receiver =
    conversation?.members?.find(
      (member) =>
        member?._id !== currentUser?._id
    );

  return (
    <div className="flex h-full flex-col bg-gray-100">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="flex items-center justify-between border-b bg-white px-6 py-4 shadow">

        <div className="flex items-center gap-4">

          {receiver?.profileImage ? (
            <img
              src={receiver.profileImage}
              alt={receiver?.name}
              className="h-12 w-12 rounded-full object-cover border"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">

              {receiver?.name ? (
                <span className="text-lg font-bold">
                  {receiver.name
                    .charAt(0)
                    .toUpperCase()}
                </span>
              ) : (
                <UserCircle size={28} />
              )}

            </div>
          )}

          <div>

            <h2 className="text-lg font-bold">
              {receiver?.name ||
                "Unknown User"}
            </h2>

            <div className="flex items-center gap-2 text-sm text-gray-500">

              <Circle
                size={10}
                fill="#22c55e"
                className="text-green-500"
              />

              Online

            </div>

          </div>

        </div>

      </div>

      {/* ======================================
          MESSAGES
      ====================================== */}

      <div className="flex-1 overflow-y-auto bg-gray-100 px-5 py-6">

        {messages.length === 0 ? (

          <div className="mt-20 flex flex-col items-center">

            <MessageCircle
              size={60}
              className="text-gray-400"
            />

            <h3 className="mt-4 text-xl font-semibold text-gray-600">
              No Messages Yet
            </h3>

            <p className="mt-2 text-gray-500">
              Start the conversation by sending
              your first message.
            </p>

          </div>

        ) : (

          messages.map((message) => (
            <MessageBubble
              key={message._id}
              message={message}
            />
          ))

        )}

        <div ref={bottomRef}></div>

      </div>

      {/* ======================================
          INPUT
      ====================================== */}

      <div className="border-t bg-white p-4">

        <MessageInput
          conversation={conversation}
          onMessageSent={handleMessageSent}
        />

      </div>

    </div>
  );
};

export default ChatWindow;