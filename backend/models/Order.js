import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    /* ===================== USERS ===================== */

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

    /* ===================== GIG ===================== */

    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: true,
      index: true,
    },

    /* ===================== PROPOSAL ===================== */

    proposal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proposal",
      default: null,
    },

    /* ===================== ORDER DETAILS ===================== */

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      trim: true,
    },

    /* ===================== ORDER STATUS ===================== */

    status: {
      type: String,
      enum: [
        "pending",
        "active",
        "in_progress",
        "delivered",
        "revision_requested",
        "completed",
        "cancelled",
        "disputed",
      ],
      default: "pending",
      index: true,
    },

    /* ===================== PAYMENT ===================== */

    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "paid",
        "failed",
        "refunded",
        "partially_refunded",
      ],
      default: "pending",
    },

    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },

    /* ===================== DELIVERY ===================== */

    deliveryTime: {
      type: Number,
      min: 1,
      default: null,
    },

    deliveryDate: {
      type: Date,
      default: null,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    /* ===================== CANCELLATION ===================== */

    cancellationReason: {
      type: String,
      trim: true,
      default: "",
    },

    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    /* ===================== REQUIREMENTS ===================== */

    requirements: {
      type: String,
      trim: true,
      default: "",
    },

    /* ===================== DELIVERY MESSAGE ===================== */

    deliveryMessage: {
      type: String,
      trim: true,
      default: "",
    },

    deliveryFiles: [
      {
        url: {
          type: String,
          required: true,
        },

        name: {
          type: String,
          default: "",
        },

        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

/* ===================== INDEXES ===================== */

orderSchema.index({ client: 1, createdAt: -1 });
orderSchema.index({ freelancer: 1, createdAt: -1 });
orderSchema.index({ gig: 1, status: 1 });
orderSchema.index({ status: 1, createdAt: -1 });

/* ===================== MODEL ===================== */

const Order =
  mongoose.models.Order ||
  mongoose.model("Order", orderSchema);

/* ===================== DEFAULT EXPORT ===================== */

export default Order;