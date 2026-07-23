import mongoose from "mongoose";

/* ==========================================================
   CONVERSATION SCHEMA
========================================================== */

const conversationSchema = new mongoose.Schema(
  {
    /* ======================================================
       PARTICIPANTS
    ====================================================== */

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    /* ======================================================
       RELATED GIG
    ====================================================== */

    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      default: null,
    },

    /* ======================================================
       RELATED PROPOSAL
    ====================================================== */

    proposal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proposal",
      default: null,
    },

    /* ======================================================
       LAST MESSAGE
    ====================================================== */

    lastMessage: {
      type: String,
      default: "",
      trim: true,
    },

    lastMessageSender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    lastMessageTime: {
      type: Date,
      default: Date.now,
    },

    /* ======================================================
       LAST MESSAGE TYPE
    ====================================================== */

    lastMessageType: {
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

    /* ======================================================
       UNREAD COUNTS
    ====================================================== */

    unreadCounts: {
      type: Map,
      of: Number,
      default: {},
    },

    /* ======================================================
       CHAT STATUS
    ====================================================== */

    isActive: {
      type: Boolean,
      default: true,
    },

    isArchived: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    /* ======================================================
       BLOCK CHAT
    ====================================================== */

    blockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    /* ======================================================
       ADMIN CHAT
    ====================================================== */

    isAdminConversation: {
      type: Boolean,
      default: false,
    },

    /* ======================================================
       PIN CHAT
    ====================================================== */

    pinnedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    /* ======================================================
       MUTE CHAT
    ====================================================== */

    mutedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    /* ======================================================
       CHAT THEME
    ====================================================== */

    theme: {
      type: String,
      default: "default",
    },
  },
  {
    timestamps: true,
  }
);

/* ==========================================================
   INDEXES
========================================================== */

conversationSchema.index({
  participants: 1,
});

conversationSchema.index({
  participants: 1,
  updatedAt: -1,
});

conversationSchema.index({
  lastMessageTime: -1,
});

conversationSchema.index({
  proposal: 1,
});

conversationSchema.index({
  gig: 1,
});

conversationSchema.index({
  isArchived: 1,
});

conversationSchema.index({
  isDeleted: 1,
});

conversationSchema.index({
  blockedBy: 1,
});

/* ==========================================================
   VIRTUALS
========================================================== */

conversationSchema.virtual("participantCount").get(function () {
  return this.participants.length;
});

/* ==========================================================
   EXPORT
========================================================== */

const Conversation = mongoose.model(
  "Conversation",
  conversationSchema
);

export default Conversation;