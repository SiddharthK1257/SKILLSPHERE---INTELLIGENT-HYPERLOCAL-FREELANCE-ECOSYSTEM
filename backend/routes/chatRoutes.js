import express from "express";

import {
  createConversation,
  getConversations,
  sendMessage,
  getMessages,
 markAsSeen,
  editMessage,
  deleteMessage,
  startTyping,
  stopTyping,
  getOnlineUsers,
} from "../controllers/chatController.js";

import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* ==========================================================
   AUTHENTICATION
========================================================== */

router.use(protect);

/* ==========================================================
   CONVERSATIONS
========================================================== */

// Create Conversation
router.post(
  "/conversation",
  createConversation
);

// Get My Conversations
router.get(
  "/conversations",
  getConversations
);

/* ==========================================================
   MESSAGES
========================================================== */

// Send Message
// Supports text + attachments
router.post(
  "/message",
  upload.array("attachment", 10),
  sendMessage
);

// Get Conversation Messages
router.get(
  "/messages/:conversationId",
  getMessages
);

/* ==========================================================
   MESSAGE ACTIONS
========================================================== */

// Mark as Seen
router.put(
  "/message/:id/seen",
  markAsSeen
);

// Edit Message
router.put(
  "/message/:id",
  editMessage
);

// Delete Message
router.delete(
  "/message/:id",
  deleteMessage
);

/* ==========================================================
   TYPING
========================================================== */

router.post(
  "/typing/start",
  startTyping
);

router.post(
  "/typing/stop",
  stopTyping
);

/* ==========================================================
   ONLINE USERS
========================================================== */

router.get(
  "/online-users",
  getOnlineUsers
);

/* ==========================================================
   EXPORT
========================================================== */

export default router;