import mongoose from "mongoose";

/* ==========================================================
   REPORT SCHEMA
========================================================== */

const reportSchema = new mongoose.Schema(
  {
    /* ======================================================
       REPORTER
    ====================================================== */

    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* ======================================================
       REPORTED USER
    ====================================================== */

    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* ======================================================
       OPTIONAL REFERENCES
    ====================================================== */

    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      default: null,
    },

    proposal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proposal",
      default: null,
    },

    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },

    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      default: null,
    },

    /* ======================================================
       REPORT DETAILS
    ====================================================== */

    reason: {
      type: String,
      required: true,
      enum: [
        "Spam",
        "Fake Gig",
        "Fake Review",
        "Scam",
        "Fraud",
        "Harassment",
        "Copyright",
        "Abusive Language",
        "Inappropriate Content",
        "Other",
      ],
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000,
    },

    evidence: [
      {
        type: String,
      },
    ],

    /* ======================================================
       STATUS
    ====================================================== */

    status: {
      type: String,
      enum: [
        "Pending",
        "Under Review",
        "Resolved",
        "Rejected",
      ],
      default: "Pending",
      index: true,
    },

    /* ======================================================
       ADMIN ACTION
    ====================================================== */

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    adminNote: {
      type: String,
      default: "",
      maxlength: 1000,
      trim: true,
    },

    actionTaken: {
      type: String,
      default: "",
      trim: true,
      maxlength: 200,
    },

    /* ======================================================
       PRIORITY
    ====================================================== */

    priority: {
      type: String,
      enum: [
        "Low",
        "Medium",
        "High",
        "Critical",
      ],
      default: "Medium",
    },

    /* ======================================================
       FLAGS
    ====================================================== */

    resolved: {
      type: Boolean,
      default: false,
    },

    rejected: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/* ==========================================================
   INDEXES
========================================================== */

reportSchema.index({
  reporter: 1,
});

reportSchema.index({
  reportedUser: 1,
});

reportSchema.index({
  status: 1,
});

reportSchema.index({
  priority: 1,
});

reportSchema.index({
  createdAt: -1,
});

reportSchema.index({
  reason: 1,
});

/* ==========================================================
   VIRTUAL
========================================================== */

reportSchema.virtual("isPending").get(function () {
  return this.status === "Pending";
});

reportSchema.virtual("isResolved").get(function () {
  return this.status === "Resolved";
});

/* ==========================================================
   JSON
========================================================== */

reportSchema.set("toJSON", {
  virtuals: true,
});

reportSchema.set("toObject", {
  virtuals: true,
});

/* ==========================================================
   EXPORT
========================================================== */

const Report = mongoose.model(
  "Report",
  reportSchema
);

export default Report;