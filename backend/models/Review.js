import mongoose from "mongoose";
import { updateReputation } from "../utils/reputationCalculator.js";

/* ==========================================================
   REVIEW SCHEMA
========================================================== */

const reviewSchema = new mongoose.Schema(
  {
    /* ======================================================
       REFERENCES
    ====================================================== */

    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: true,
      index: true,
    },

    proposal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proposal",
      required: true,
      unique: true,
      index: true,
    },

    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
      unique: true,
      index: true,
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* ======================================================
       VERIFIED
    ====================================================== */

    verified: {
      type: Boolean,
      default: true,
    },

    /* ======================================================
       RATINGS
    ====================================================== */

    overallRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    communication: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    quality: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    delivery: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    professionalism: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    valueForMoney: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    /* ======================================================
       REVIEW
    ====================================================== */

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },

    pros: [
      {
        type: String,
        trim: true,
      },
    ],

    cons: [
      {
        type: String,
        trim: true,
      },
    ],

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    /* ======================================================
       RECOMMENDATION
    ====================================================== */

    recommendFreelancer: {
      type: Boolean,
      default: true,
    },

    wouldHireAgain: {
      type: Boolean,
      default: true,
    },

    /* ======================================================
       HELPFUL SYSTEM
    ====================================================== */

    helpfulCount: {
      type: Number,
      default: 0,
    },

    notHelpfulCount: {
      type: Number,
      default: 0,
    },

    helpfulUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    notHelpfulUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    /* ======================================================
       REPORTS
    ====================================================== */

    reported: {
      type: Boolean,
      default: false,
    },

    reportCount: {
      type: Number,
      default: 0,
    },

    reports: [
      {
        reportedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        reason: {
          type: String,
          enum: [
            "Spam",
            "Fake Review",
            "Harassment",
            "Scam",
            "Copyright",
            "Abusive Language",
            "Other",
          ],
        },

        description: String,

        createdAt: {
          type: Date,
          default: Date.now,
        },

        status: {
          type: String,
          enum: [
            "Pending",
            "Approved",
            "Rejected",
          ],
          default: "Pending",
        },

        reviewedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        reviewedAt: Date,

        adminNote: String,
      },
    ],

    /* ======================================================
       FRAUD
    ====================================================== */

    suspicious: {
      type: Boolean,
      default: false,
    },

    fraudScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    fraudReason: {
      type: String,
      default: "",
    },

    /* ======================================================
       ADMIN
    ====================================================== */

    approved: {
      type: Boolean,
      default: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    hidden: {
      type: Boolean,
      default: false,
    },

    /* ======================================================
       FREELANCER REPLY
    ====================================================== */

    reply: {
      message: {
        type: String,
        default: "",
        trim: true,
        maxlength: 1000,
      },

      repliedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      repliedAt: Date,

      edited: {
        type: Boolean,
        default: false,
      },

      editedAt: Date,
    },

    /* ======================================================
       EDIT
    ====================================================== */

    edited: {
      type: Boolean,
      default: false,
    },

    editedAt: Date,
  },
  {
    timestamps: true,
  }
);

/* ==========================================================
   INDEXES
========================================================== */

reviewSchema.index({
  freelancer: 1,
  overallRating: -1,
});

reviewSchema.index({
  createdAt: -1,
});

reviewSchema.index({
  verified: 1,
});

reviewSchema.index({
  approved: 1,
});

reviewSchema.index({
  featured: 1,
});

reviewSchema.index({
  suspicious: 1,
});

/* ==========================================================
   VIRTUAL
========================================================== */

reviewSchema.virtual("averageScore").get(function () {
  if (
    this.communication === undefined ||
    this.quality === undefined ||
    this.delivery === undefined ||
    this.professionalism === undefined ||
    this.valueForMoney === undefined
  ) {
    return "0.0";
  }
  return (
    (
      this.communication +
      this.quality +
      this.delivery +
      this.professionalism +
      this.valueForMoney
    ) / 5
  ).toFixed(1);
});

/* ==========================================================
   AUTO UPDATE REPUTATION
========================================================== */

reviewSchema.post("save", async function () {
  try {
    await updateReputation(this.freelancer);
  } catch (error) {
    console.error(error);
  }
});

reviewSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    await updateReputation(doc.freelancer);
  }
});

reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await updateReputation(doc.freelancer);
  }
});

/* ==========================================================
   JSON
========================================================== */

reviewSchema.set("toJSON", {
  virtuals: true,
});

reviewSchema.set("toObject", {
  virtuals: true,
});

/* ==========================================================
   EXPORT
========================================================== */

export default mongoose.model(
  "Review",
  reviewSchema
);