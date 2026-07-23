import { motion } from "framer-motion";
import {
  User,
  Check,
  CheckCheck,
  Image as ImageIcon,
  Video,
  Music,
  File,
  FileText,
  Download,
  Play,
} from "lucide-react";

/* ==========================================================
   HELPERS
========================================================== */

const getInitials = (name = "") => {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

const formatTime = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatFileSize = (bytes = 0) => {
  if (!bytes) return "";

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

/* ==========================================================
   FILE HELPERS
========================================================== */

const getFileUrl = (file) => {
  return (
    file?.fileUrl ||
    file?.url ||
    file?.path ||
    ""
  );
};

const getFileName = (file) => {
  return (
    file?.fileName ||
    file?.originalName ||
    file?.name ||
    "Attachment"
  );
};

const getFileType = (file) => {
  return (
    file?.fileType ||
    file?.mimeType ||
    ""
  );
};

const getFileSizeValue = (file) => {
  return (
    file?.fileSize ||
    file?.size ||
    0
  );
};

/* ==========================================================
   FILE TYPE HELPERS
========================================================== */

const isImage = (type = "", url = "") =>
  type.startsWith("image/") ||
  /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(url);

const isVideo = (type = "", url = "") =>
  type.startsWith("video/") ||
  /\.(mp4|mov|avi|webm|mkv)$/i.test(url);

const isAudio = (type = "", url = "") =>
  type.startsWith("audio/") ||
  /\.(mp3|wav|ogg|aac|m4a)$/i.test(url);

const isPdf = (type = "", url = "") =>
  type.includes("pdf") ||
  /\.pdf$/i.test(url);

/* ==========================================================
   FILE ICON
========================================================== */

const getFileIcon = (type, url) => {
  if (isImage(type, url)) {
    return (
      <ImageIcon
        size={22}
        className="text-purple-500"
      />
    );
  }

  if (isVideo(type, url)) {
    return (
      <Video
        size={22}
        className="text-blue-500"
      />
    );
  }

  if (isAudio(type, url)) {
    return (
      <Music
        size={22}
        className="text-green-500"
      />
    );
  }

  if (isPdf(type, url)) {
    return (
      <FileText
        size={22}
        className="text-red-500"
      />
    );
  }

  return (
    <File
      size={22}
      className="text-gray-500"
    />
  );
};

/* ==========================================================
   COMPONENT
========================================================== */

const MessageBubble = ({ message }) => {
  const currentUser = (() => {
    try {
      return JSON.parse(
        localStorage.getItem("user")
      );
    } catch {
      return null;
    }
  })();

  const currentUserId =
    currentUser?._id?.toString();

  /* ==========================
     SENDER
  ========================== */

  const sender =
    typeof message?.sender === "object"
      ? message.sender
      : {
          _id: message?.sender,
          name: "Unknown User",
          profileImage: "",
        };

  const senderId =
    sender?._id?.toString();

  const isOwnMessage =
    senderId === currentUserId;

  const senderName =
    sender?.name || "Unknown User";

  const initials =
    getInitials(senderName);

  const time = formatTime(
    message?.createdAt
  );

  const attachments = Array.isArray(
    message?.attachments
  )
    ? message.attachments
    : [];

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.25,
      }}
      className={`mb-5 flex ${
        isOwnMessage
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-[78%] items-end gap-3 ${
          isOwnMessage
            ? "flex-row-reverse"
            : ""
        }`}
      >
                {/* ==========================================================
            AVATAR
        ========================================================== */}

        {sender?.profileImage ? (
          <img
            src={sender.profileImage}
            alt={senderName}
            className="
              h-10
              w-10
              rounded-full
              object-cover
              shadow
              select-none
            "
          />
        ) : (
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold shadow ${
              isOwnMessage
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
          >
            {initials || <User size={18} />}
          </div>
        )}

        {/* ==========================================================
            MESSAGE BUBBLE
        ========================================================== */}

        <motion.div
          whileHover={{
            scale: 1.01,
          }}
          className={`relative overflow-hidden rounded-2xl px-5 py-4 shadow-lg ${
            isOwnMessage
              ? "rounded-br-md bg-blue-600 text-white"
              : "rounded-bl-md border border-gray-200 bg-white text-gray-900"
          }`}
        >

          {/* ==========================================================
              DELETED MESSAGE
          ========================================================== */}

          {message?.isDeleted ? (
            <p
              className={`italic ${
                isOwnMessage
                  ? "text-white/70"
                  : "text-gray-500"
              }`}
            >
              🚫 This message was deleted.
            </p>
          ) : (
            <>
              {/* ======================================================
                  TEXT MESSAGE
              ====================================================== */}

              {message?.text && (
                <p
                  className={`break-words whitespace-pre-wrap text-[15px] leading-7 ${
                    isOwnMessage
                      ? "text-white"
                      : "text-gray-800"
                  }`}
                >
                  {message.text}
                </p>
              )}

              {/* ======================================================
                  ATTACHMENTS
              ====================================================== */}

              {attachments.length > 0 && (
                <div className="mt-4 space-y-3">

                  {attachments.map((attachment, index) => {

                    const url = getFileUrl(attachment);
                    const name = getFileName(attachment);
                    const type = getFileType(attachment);
                    const size = getFileSizeValue(attachment);

                    /* ===========================
                       IMAGE
                    =========================== */

                    if (isImage(type, url)) {
                      return (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="block overflow-hidden rounded-xl"
                        >
                          <img
                            src={url}
                            alt={name}
                            className="
                              max-h-80
                              w-full
                              rounded-xl
                              border
                              object-cover
                              shadow-md
                              transition
                              duration-300
                              hover:scale-[1.02]
                            "
                          />
                        </a>
                      );
                    }

                    /* ===========================
                       VIDEO
                    =========================== */

                    if (isVideo(type, url)) {
                      return (
                        <div
                          key={index}
                          className="overflow-hidden rounded-xl"
                        >
                          <video
                            controls
                            className="
                              w-full
                              rounded-xl
                              border
                              shadow
                            "
                          >
                            <source
                              src={url}
                              type={type}
                            />
                          </video>
                        </div>
                      );
                    }

                    /* ===========================
                       AUDIO
                    =========================== */

                    if (isAudio(type, url)) {
                      return (
                        <div
                          key={index}
                          className="rounded-xl border bg-white p-3"
                        >
                          <audio
                            controls
                            className="w-full"
                          >
                            <source
                              src={url}
                              type={type}
                            />
                          </audio>
                        </div>
                      );
                    }

                    /* ===========================
                       OTHER FILES
                    =========================== */

                    return (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className={`flex items-center gap-3 rounded-xl p-3 transition ${
                          isOwnMessage
                            ? "bg-blue-500 hover:bg-blue-400"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                            isOwnMessage
                              ? "bg-blue-700"
                              : "bg-white"
                          }`}
                        >
                          {getFileIcon(type, url)}
                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="truncate text-sm font-semibold">
                            {name}
                          </p>

                          {size > 0 && (
                            <p
                              className={`text-xs ${
                                isOwnMessage
                                  ? "text-blue-100"
                                  : "text-gray-500"
                              }`}
                            >
                              {formatFileSize(size)}
                            </p>
                          )}

                        </div>

                        <Download size={20} />

                      </a>
                    );

                  })}
                </div>
              )}

              {/* ======================================================
                  EDITED LABEL
              ====================================================== */}

              {message?.isEdited && (
                <div
                  className={`mt-2 text-xs italic ${
                    isOwnMessage
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  Edited
                </div>
              )}
                          {/* ==========================================================
                REPLY PREVIEW
            ========================================================== */}

            {message?.replyTo && (
              <div
                className={`mt-4 rounded-xl border-l-4 p-3 ${
                  isOwnMessage
                    ? "border-blue-200 bg-blue-500/30"
                    : "border-blue-500 bg-gray-100"
                }`}
              >
                <p
                  className={`mb-1 text-xs font-semibold ${
                    isOwnMessage
                      ? "text-blue-100"
                      : "text-blue-600"
                  }`}
                >
                  Replying to
                </p>

                {message.replyTo.text ? (
                  <p
                    className={`line-clamp-2 text-sm ${
                      isOwnMessage
                        ? "text-white/90"
                        : "text-gray-700"
                    }`}
                  >
                    {message.replyTo.text}
                  </p>
                ) : (
                  <p
                    className={`text-sm italic ${
                      isOwnMessage
                        ? "text-white/70"
                        : "text-gray-500"
                    }`}
                  >
                    Attachment
                  </p>
                )}
              </div>
            )}

            {/* ==========================================================
                FOOTER
            ========================================================== */}

            <div
              className={`mt-4 flex items-end ${
                isOwnMessage
                  ? "justify-end"
                  : "justify-between"
              }`}
            >
              {/* Sender Name */}

              {!isOwnMessage && (
                <div className="flex flex-col">
                  <span className="truncate text-xs font-semibold text-gray-500">
                    {senderName}
                  </span>
                </div>
              )}

              {/* Time + Status */}

              <div className="flex items-center gap-2">

                <span
                  className={`text-[11px] ${
                    isOwnMessage
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {time}
                </span>

                {isOwnMessage && (
                  <>
                    {message?.status === "seen" ? (
                      <CheckCheck
                        size={15}
                        className="text-cyan-300"
                      />
                    ) : message?.status === "delivered" ? (
                      <CheckCheck
                        size={15}
                        className="text-white"
                      />
                    ) : (
                      <Check
                        size={15}
                        className="text-white"
                      />
                    )}
                  </>
                )}

              </div>
            </div>

            {/* ==========================================================
                MESSAGE TYPE LABEL (OPTIONAL)
            ========================================================== */}

            {!message?.text &&
              attachments.length > 0 && (
                <div
                  className={`mt-2 text-xs ${
                    isOwnMessage
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {attachments.length} attachment
                  {attachments.length > 1 ? "s" : ""}
                </div>
              )}
            </>
            )}

                       {/* ==========================================================
                SHINE ANIMATION
            ========================================================== */}

            {isOwnMessage && (
              <motion.div
                className="
                  pointer-events-none
                  absolute
                  inset-y-0
                  left-[-50px]
                  w-12
                  -skew-x-12
                  bg-white/20
                  blur-md
                "
                animate={{
                  x: [-120, 380],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  repeatDelay: 4,
                  ease: "linear",
                }}
              />
            )}

            {/* ==========================================================
                BUBBLE TAIL
            ========================================================== */}

            <div
              className={`absolute bottom-0 h-4 w-4 rotate-45 ${
                isOwnMessage
                  ? "right-[-6px] bg-blue-600"
                  : "left-[-6px] border-b border-l border-gray-200 bg-white"
              }`}
            />
          </motion.div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;