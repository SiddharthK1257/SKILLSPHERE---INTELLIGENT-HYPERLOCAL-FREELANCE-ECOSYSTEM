import mongoose from "mongoose";

/* ==========================================================
   ATTACHMENT SCHEMA
========================================================== */

const attachmentSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
      trim: true,
    },

    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },

    fileType: {
      type: String,
      default: "",
      trim: true,
    },

    fileSize: {
      type: Number,
      default: 0,
    },

    thumbnail: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

/* ==========================================================
   REACTION SCHEMA
========================================================== */

const reactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    emoji: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

/* ==========================================================
   MESSAGE SCHEMA
========================================================== */

const messageSchema = new mongoose.Schema(
  {
    /* Conversation */

    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    /* Sender */

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* Receiver */

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* Message Text */

    text: {
      type: String,
      trim: true,
      default: "",
      maxlength: 5000,
    },

    /* Message Type */

    messageType: {
      type: String,
      enum: [
        "text",
        "image",
        "file",
        "audio",
        "video",
      ],
      default: "text",
    },

    /* Attachments */

    attachments: {
      type: [attachmentSchema],
      default: [],
    },

    /* Reply */

    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    /* Delivery Status */

    status: {
      type: String,
      enum: [
        "sent",
        "delivered",
        "seen",
      ],
      default: "sent",
      index: true,
    },

    /* Edited */

    isEdited: {
      type: Boolean,
      default: false,
    },

    editedAt: {
      type: Date,
      default: null,
    },

    /* Deleted */

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    /* Seen */

    seenAt: {
      type: Date,
      default: null,
    },

    /* Reactions */

    reactions: {
      type: [reactionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

/* ==========================================================
   INDEXES
========================================================== */

messageSchema.index({
  conversation: 1,
  createdAt: 1,
});

messageSchema.index({
  sender: 1,
  receiver: 1,
});

messageSchema.index({
  status: 1,
});

/* ==========================================================
   EXPORT
========================================================== */

const Message = mongoose.model(
  "Message",
  messageSchema
);

export default Message;