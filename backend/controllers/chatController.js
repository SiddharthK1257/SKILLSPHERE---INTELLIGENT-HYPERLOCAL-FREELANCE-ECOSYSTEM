import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { getIO } from "../socket/socket.js";

/* ==========================================================
   CREATE CONVERSATION
========================================================== */

export const createConversation = async (req, res) => {
  try {
    const { receiverId, proposalId, gigId } = req.body;

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: "Receiver ID is required.",
      });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: {
        $all: [req.user._id, receiverId],
      },
    })
      .populate("participants", "name email profileImage")
      .populate("proposal")
      .populate("gig");

    if (conversation) {
      return res.status(200).json({
        success: true,
        conversation,
      });
    }

    // Create new conversation
    conversation = await Conversation.create({
      participants: [req.user._id, receiverId],
      proposal: proposalId || null,
      gig: gigId || null,
      lastMessage: "",
      lastMessageSender: null,
      lastMessageTime: new Date(),
      unreadCounts: new Map(),
    });

    conversation = await Conversation.findById(conversation._id)
      .populate("participants", "name email profileImage")
      .populate("proposal")
      .populate("gig");

    return res.status(201).json({
      success: true,
      message: "Conversation created successfully.",
      conversation,
    });
  } catch (error) {
    console.error("Create Conversation Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ==========================================================
   GET MY CONVERSATIONS
========================================================== */

export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate("participants", "name email profileImage")
      .populate("proposal")
      .populate("gig")
      .sort({
        lastMessageTime: -1,
        updatedAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: conversations.length,
      conversations,
    });
  } catch (error) {
    console.error("Get Conversations Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ==========================================================
   SEND MESSAGE
========================================================== */

export const sendMessage = async (req, res) => {
  try {
    const {
      conversationId,
      receiverId,
      text,
      messageType,
      attachments,
      replyTo,
    } = req.body;

    /* ==========================================
       VALIDATION
    ========================================== */

    if (!conversationId || !receiverId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID and Receiver ID are required.",
      });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    const isParticipant = conversation.participants.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "You are not a participant of this conversation.",
      });
    }

    /* ==========================================
       FILE ATTACHMENTS
    ========================================== */

    let uploadedFiles = [];

    if (req.files && req.files.length > 0) {
      uploadedFiles = req.files.map((file) => ({
  fileName: file.originalname,

  fileUrl: `${req.protocol}://${req.get("host")}/uploads/chat/${file.filename}`,

  fileType: file.mimetype,

  fileSize: file.size,

  thumbnail: "",
}));
    }

    if (attachments && Array.isArray(attachments)) {
      uploadedFiles = [...uploadedFiles, ...attachments];
    }

    if ((!text || text.trim() === "") && uploadedFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty.",
      });
    }

    /* ==========================================
       CREATE MESSAGE
    ========================================== */

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      receiver: receiverId,
      text: text?.trim() || "",
      messageType:
        messageType ||
        (uploadedFiles.length > 0 ? "file" : "text"),
      attachments: uploadedFiles,
      replyTo: replyTo || null,
      status: "sent",
    });

    /* ==========================================
       UPDATE CONVERSATION
    ========================================== */

    conversation.lastMessage =
      text?.trim() ||
      (uploadedFiles.length > 0
        ? "📎 Attachment"
        : "");

    conversation.lastMessageSender = req.user._id;
    conversation.lastMessageTime = new Date();

    if (conversation.unreadCounts) {
      const unread =
        conversation.unreadCounts.get(receiverId.toString()) || 0;

      conversation.unreadCounts.set(
        receiverId.toString(),
        unread + 1
      );
    }

    await conversation.save();

    /* ==========================================
       POPULATE MESSAGE
    ========================================== */

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name email profileImage")
      .populate("receiver", "name email profileImage")
      .populate("replyTo");

    /* ==========================================
       SOCKET EVENTS
    ========================================== */

    const io = getIO();

    if (io) {
      io.to(conversationId).emit(
        "receiveMessage",
        populatedMessage
      );

      io.to(receiverId.toString()).emit(
        "newNotification",
        {
          type: "message",
          conversationId,
          message: populatedMessage,
        }
      );

      io.to(conversationId).emit(
        "conversationUpdated",
        conversation
      );
    }

    /* ==========================================
       RESPONSE
    ========================================== */

    return res.status(201).json({
      success: true,
      message: populatedMessage,
    });

  } catch (error) {
    console.error("Send Message Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ==========================================================
   GET ALL MESSAGES
========================================================== */

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(
      conversationId
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    // Check access
    const isParticipant = conversation.participants.some(
      (id) =>
        id.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    const messages = await Message.find({
      conversation: conversationId,
    })
      .populate(
        "sender",
        "name email profileImage"
      )
      .populate(
        "receiver",
        "name email profileImage"
      )
      .populate("replyTo")
      .sort({
        createdAt: 1,
      });

    return res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error("Get Messages Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ==========================================================
   MARK MESSAGE AS SEEN
========================================================== */

export const markAsSeen = async (req, res) => {
  try {
    const message = await Message.findById(
      req.params.id
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    // Only receiver can mark seen
    if (
      message.receiver.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized.",
      });
    }

    // Already seen
    if (message.status !== "seen") {
      message.status = "seen";
      message.seenAt = new Date();

      await message.save();
    }

    // Reset unread count
    const conversation =
      await Conversation.findById(
        message.conversation
      );

    if (
      conversation &&
      conversation.unreadCounts
    ) {
      conversation.unreadCounts.set(
        req.user._id.toString(),
        0
      );

      await conversation.save();
    }

    const populatedMessage =
      await Message.findById(message._id)
        .populate(
          "sender",
          "name email profileImage"
        )
        .populate(
          "receiver",
          "name email profileImage"
        );

    const io = getIO();

    if (io) {
      io.to(
        message.conversation.toString()
      ).emit(
        "messageSeen",
        populatedMessage
      );

      io.to(
        message.sender.toString()
      ).emit(
        "messageSeen",
        populatedMessage
      );
    }

    return res.status(200).json({
      success: true,
      message: populatedMessage,
    });
  } catch (error) {
    console.error(
      "Mark Seen Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ==========================================================
   EDIT MESSAGE
========================================================== */

export const editMessage = async (req, res) => {
  try {
    const { text } = req.body;

    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized.",
      });
    }

    message.text = text?.trim() || "";
    message.isEdited = true;
    message.editedAt = new Date();

    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name email profileImage")
      .populate("receiver", "name email profileImage")
      .populate("replyTo");

    const io = getIO();

    if (io) {
      io.to(message.conversation.toString()).emit(
        "messageEdited",
        populatedMessage
      );
    }

    return res.status(200).json({
      success: true,
      message: populatedMessage,
    });

  } catch (error) {
    console.error("Edit Message Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ==========================================================
   DELETE MESSAGE
========================================================== */

export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized.",
      });
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    message.text = "🚫 This message was deleted.";

    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name email profileImage")
      .populate("receiver", "name email profileImage");

    const io = getIO();

    if (io) {
      io.to(message.conversation.toString()).emit(
        "messageDeleted",
        populatedMessage
      );
    }

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully.",
    });

  } catch (error) {
    console.error("Delete Message Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ==========================================================
   START TYPING
========================================================== */

export const startTyping = async (req, res) => {
  try {
    const { conversationId, receiverId } = req.body;

    const io = getIO();

    if (io) {
      io.to(conversationId).emit("typing", {
        conversationId,
        senderId: req.user._id,
        receiverId,
      });
    }

    return res.status(200).json({
      success: true,
    });

  } catch (error) {
    console.error("Typing Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ==========================================================
   STOP TYPING
========================================================== */

export const stopTyping = async (req, res) => {
  try {
    const { conversationId, receiverId } = req.body;

    const io = getIO();

    if (io) {
      io.to(conversationId).emit("stopTyping", {
        conversationId,
        senderId: req.user._id,
        receiverId,
      });
    }

    return res.status(200).json({
      success: true,
    });

  } catch (error) {
    console.error("Stop Typing Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ==========================================================
   GET ONLINE USERS
========================================================== */

export const getOnlineUsers = async (req, res) => {
  try {
    const io = getIO();

    if (!io) {
      return res.status(200).json({
        success: true,
        users: [],
      });
    }

    const sockets = await io.fetchSockets();

    const users = [];

    sockets.forEach((socket) => {
      if (socket.userId) {
        users.push(socket.userId.toString());
      }
    });

    return res.status(200).json({
      success: true,
      users,
    });

  } catch (error) {
    console.error("Online Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};