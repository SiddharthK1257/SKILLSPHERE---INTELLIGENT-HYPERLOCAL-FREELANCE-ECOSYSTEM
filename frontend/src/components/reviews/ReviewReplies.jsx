import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaReply,
  FaChevronDown,
  FaChevronUp,
  FaPaperPlane,
  FaTrash,
  FaEdit,
  FaTimes,
} from "react-icons/fa";

const ReviewReplies = ({
  replies = [],
  currentUser,
  onAddReply,
  onEditReply,
  onDeleteReply,
}) => {
  /* ===========================
      STATES
  =========================== */

  const [showReplies, setShowReplies] =
    useState(false);

  const [replyText, setReplyText] =
    useState("");

  const [editingId, setEditingId] =
    useState(null);

  const [editText, setEditText] =
    useState("");

  /* ===========================
      ADD REPLY
  =========================== */

  const handleReply = () => {
    if (!replyText.trim()) return;

    if (onAddReply) {
      onAddReply(replyText);
    }

    setReplyText("");
  };

  /* ===========================
      EDIT REPLY
  =========================== */

  const startEdit = (reply) => {
    setEditingId(reply._id);

    setEditText(reply.comment);
  };

  const saveEdit = (id) => {
    if (!editText.trim()) return;

    if (onEditReply) {
      onEditReply(id, editText);
    }

    setEditingId(null);

    setEditText("");
  };

  const cancelEdit = () => {
    setEditingId(null);

    setEditText("");
  };

  return (
    <div className="mt-6">

      {/* ===========================
          HEADER
      =========================== */}

      <button
        onClick={() =>
          setShowReplies(!showReplies)
        }
        className="
          flex
          items-center
          gap-2
          text-blue-600
          font-semibold
          hover:text-blue-700
        "
      >
        <FaReply />

        {replies.length} Replies

        {showReplies ? (
          <FaChevronUp />
        ) : (
          <FaChevronDown />
        )}

      </button>

      <AnimatePresence>

        {showReplies && (

          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration: .3,
            }}
            className="mt-5"
          >
                        {/* ===========================
                ADD REPLY
            =========================== */}

            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.3,
              }}
              className="
                mb-8
                rounded-2xl
                border
                border-gray-200
                bg-gray-50
                p-5
              "
            >

              <h3
                className="
                  mb-4
                  flex
                  items-center
                  gap-2
                  text-lg
                  font-bold
                  text-gray-800
                "
              >
                <FaReply className="text-blue-600" />

                Leave a Reply

              </h3>

              <textarea
                rows={4}
                value={replyText}
                onChange={(e) =>
                  setReplyText(e.target.value)
                }
                placeholder="Write your reply..."
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-gray-300
                  bg-white
                  px-4
                  py-3
                  text-gray-700
                  outline-none
                  transition-all
                  duration-300
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-100
                "
              />

              <div
                className="
                  mt-4
                  flex
                  items-center
                  justify-between
                "
              >

                <p className="text-sm text-gray-500">
                  {replyText.length} characters
                </p>

                <motion.button
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                  onClick={handleReply}
                  disabled={!replyText.trim()}
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-gradient-to-r
                    from-blue-600
                    via-cyan-500
                    to-indigo-600
                    px-6
                    py-3
                    font-semibold
                    text-white
                    shadow-lg
                    transition-all
                    hover:shadow-xl
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  <FaPaperPlane />

                  Send Reply

                </motion.button>

              </div>

            </motion.div>

            {/* ===========================
                REPLIES LIST
            =========================== */}

            <div className="space-y-5">
                              {replies.length === 0 ? (

                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  className="
                    rounded-2xl
                    border
                    border-dashed
                    border-gray-300
                    bg-gray-50
                    py-10
                    text-center
                  "
                >

                  <FaReply
                    className="
                      mx-auto
                      mb-4
                      text-5xl
                      text-gray-300
                    "
                  />

                  <h3
                    className="
                      text-lg
                      font-semibold
                      text-gray-700
                    "
                  >
                    No Replies Yet
                  </h3>

                  <p className="mt-2 text-gray-500">
                    Be the first one to reply.
                  </p>

                </motion.div>

              ) : (

                replies.map((reply, index) => (

                  <motion.div
                    key={reply._id}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * .08,
                    }}
                    className="
                      rounded-2xl
                      border
                      border-gray-200
                      bg-white
                      p-5
                      shadow-sm
                    "
                  >

                    {/* Header */}

                    <div
                      className="
                        mb-4
                        flex
                        items-start
                        justify-between
                      "
                    >

                      <div className="flex items-center gap-4">

                        <img
                          src={
                            reply.user?.avatar ||
                            "/default-avatar.png"
                          }
                          alt="avatar"
                          className="
                            h-12
                            w-12
                            rounded-full
                            object-cover
                          "
                        />

                        <div>

                          <h4
                            className="
                              font-semibold
                              text-gray-800
                            "
                          >
                            {reply.user?.name ||
                              "User"}
                          </h4>

                          <p
                            className="
                              text-sm
                              text-gray-500
                            "
                          >
                            {new Date(
                              reply.createdAt
                            ).toLocaleString()}
                          </p>

                        </div>

                      </div>

                      {/* Actions */}

                      {currentUser &&
                        currentUser._id ===
                          reply.user?._id && (

                        <div className="flex gap-2">

                          <button
                            onClick={() =>
                              startEdit(reply)
                            }
                            className="
                              rounded-lg
                              p-2
                              text-blue-600
                              transition
                              hover:bg-blue-50
                            "
                          >
                            <FaEdit />
                          </button>

                          <button
                            onClick={() =>
                              onDeleteReply(
                                reply._id
                              )
                            }
                            className="
                              rounded-lg
                              p-2
                              text-red-500
                              transition
                              hover:bg-red-50
                            "
                          >
                            <FaTrash />
                          </button>

                        </div>

                      )}

                    </div>

                    {/* Reply Content */}

                    {editingId === reply._id ? (

                      <div className="space-y-4">

                        <textarea
                          rows={4}
                          value={editText}
                          onChange={(e) =>
                            setEditText(
                              e.target.value
                            )
                          }
                          className="
                            w-full
                            rounded-xl
                            border
                            border-gray-300
                            p-4
                            outline-none
                            transition
                            focus:border-blue-500
                            focus:ring-4
                            focus:ring-blue-100
                          "
                        />

                        <div className="flex gap-3">

                          <button
                            onClick={() =>
                              saveEdit(
                                reply._id
                              )
                            }
                            className="
                              rounded-xl
                              bg-blue-600
                              px-5
                              py-2
                              font-semibold
                              text-white
                              transition
                              hover:bg-blue-700
                            "
                          >
                            Save
                          </button>

                          <button
                            onClick={cancelEdit}
                            className="
                              rounded-xl
                              border
                              border-gray-300
                              px-5
                              py-2
                              font-semibold
                              transition
                              hover:bg-gray-100
                            "
                          >
                            Cancel
                          </button>

                        </div>

                      </div>

                    ) : (

                      <p
                        className="
                          whitespace-pre-wrap
                          leading-7
                          text-gray-700
                        "
                      >
                        {reply.comment}
                      </p>

                    )}

                  </motion.div>

                ))

              )}
                          </div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
};

export default ReviewReplies;