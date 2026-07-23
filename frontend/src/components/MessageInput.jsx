import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Smile,
  Paperclip,
  Loader2,
  X,
  File,
  Image,
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";

import { sendMessage } from "../api/chatApi";
import useSocket from "../hooks/useSocket";

const MAX_LENGTH = 500;

const MessageInput = ({
  conversation,
  onMessageSent,
}) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeout = useRef(null);

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  const { socket } = useSocket(currentUser?._id);

  /* ==========================================
      AUTO RESIZE TEXTAREA
  ========================================== */

  useEffect(() => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height =
      `${textareaRef.current.scrollHeight}px`;
  }, [text]);

  /* ==========================================
      FIND RECEIVER
  ========================================== */

  const getReceiver = () => {
    const users =
      conversation?.participants ||
      conversation?.members ||
      [];

    return users.find((user) => {
      const id =
        typeof user === "object"
          ? user?._id?.toString()
          : user?.toString();

      return id !== currentUser?._id?.toString();
    });
  };
    /* ==========================================
      TEXT CHANGE + TYPING
  ========================================== */

  const handleChange = (e) => {
    const value = e.target.value;

    if (value.length > MAX_LENGTH) return;

    setText(value);

    if (!socket || !conversation?._id) return;

    socket.emit("typing", {
      conversation: conversation._id,
      userId: currentUser?._id,
    });

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      socket.emit("stopTyping", {
        conversation: conversation._id,
        userId: currentUser?._id,
      });
    }, 1000);
  };

  /* ==========================================
      EMOJI
  ========================================== */

  const onEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
    setShowEmoji(false);
  };

  /* ==========================================
      FILE
  ========================================== */

  const chooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* ==========================================
      SEND MESSAGE
  ========================================== */

  const handleSend = async () => {
    if (!conversation?._id) return;

    const messageText = text.trim();

    if (!messageText && !selectedFile) return;

    try {
      setLoading(true);

      const receiver = getReceiver();

      if (!receiver) {
        console.error("Receiver not found");
        return;
      }

      const receiverId =
        typeof receiver === "object"
          ? receiver._id
          : receiver;

      const formData = new FormData();

      formData.append(
        "conversationId",
        conversation._id
      );

      formData.append(
        "receiverId",
        receiverId
      );

      formData.append(
        "text",
        messageText
      );

      if (selectedFile) {
        formData.append(
          "attachment",
          selectedFile
        );
      }
            const response = await sendMessage(formData);

      const newMessage =
        response?.message ||
        response?.data?.message;

      if (!newMessage) {
        console.error("Message was not returned.");
        return;
      }

      // Update chat immediately
      onMessageSent?.(newMessage);

      // Stop typing
      socket?.emit("stopTyping", {
        conversation: conversation._id,
        userId: currentUser?._id,
      });

      // Reset input
      setText("");
      setSelectedFile(null);
      setShowEmoji(false);

      if (textareaRef.current) {
        textareaRef.current.style.height = "52px";
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error(
        "Send Message Error:",
        error?.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================
      ENTER TO SEND
  ========================================== */

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="border-t border-gray-200 bg-white p-4"
    >
      {/* Emoji Picker */}

      <AnimatePresence>
        {showEmoji && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
            }}
            className="absolute bottom-24 left-5 z-50"
          >
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              width={320}
              height={380}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* File Preview */}

      {selectedFile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 flex items-center justify-between rounded-xl border bg-gray-50 p-3"
        >
          <div className="flex items-center gap-3">
            {selectedFile.type.startsWith("image") ? (
              <Image
                size={22}
                className="text-blue-600"
              />
            ) : (
              <File
                size={22}
                className="text-blue-600"
              />
            )}

            <div>
              <p className="font-medium">
                {selectedFile.name}
              </p>

              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024).toFixed(1)}
                KB
              </p>
            </div>
          </div>

          <button
            onClick={removeFile}
            className="rounded-full p-2 hover:bg-red-100"
          >
            <X
              size={18}
              className="text-red-500"
            />
          </button>
        </motion.div>
      )}
            {/* Input Box */}

      <div
        className="
          flex
          items-end
          gap-3
          rounded-3xl
          border
          border-gray-200
          bg-white
          p-3
          shadow-md
          transition
          focus-within:border-blue-500
        "
      >
        {/* Emoji Button */}

        <motion.button
          type="button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowEmoji((prev) => !prev)}
          className="rounded-xl p-3 text-gray-500 hover:bg-yellow-100"
        >
          <Smile size={22} />
        </motion.button>

        {/* Attachment Button */}

        <motion.button
          type="button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={chooseFile}
          className="rounded-xl p-3 text-gray-500 hover:bg-blue-100"
        >
          <Paperclip size={22} />
        </motion.button>

        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={handleFile}
        />

        {/* Text Area */}

        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="
            min-h-[52px]
            max-h-40
            flex-1
            resize-none
            bg-transparent
            px-2
            py-3
            text-[15px]
            leading-6
            text-gray-700
            placeholder:text-gray-400
            outline-none
          "
        />

        {/* Send Button */}

        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={
            loading ||
            (!text.trim() && !selectedFile)
          }
          onClick={handleSend}
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-gradient-to-r
            from-blue-600
            to-cyan-500
            text-white
            shadow-lg
            transition
            hover:shadow-xl
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {loading ? (
            <Loader2
              size={22}
              className="animate-spin"
            />
          ) : (
            <Send size={22} />
          )}
        </motion.button>
      </div>

      {/* Footer */}

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          Press <b>Enter</b> to send •{" "}
          <b>Shift + Enter</b> for a new line
        </span>

        <span
          className={`text-xs ${
            text.length >= MAX_LENGTH
              ? "text-red-500"
              : "text-gray-400"
          }`}
        >
          {text.length}/{MAX_LENGTH}
        </span>
      </div>
    </motion.div>
  );
};

export default MessageInput;