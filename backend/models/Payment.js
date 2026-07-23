import mongoose from "mongoose";

/* ==========================================================
   PAYMENT SCHEMA
========================================================== */

const paymentSchema = new mongoose.Schema(
  {
    /* ======================================================
       CLIENT

       User who submitted the proposal and pays.
    ====================================================== */

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Client is required"],
      index: true,
    },

    /* ======================================================
       FREELANCER

       Owner of the gig and receiver of the money.
    ====================================================== */

    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Freelancer is required"],
      index: true,
    },

    /* ======================================================
       GIG
    ====================================================== */

    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: [true, "Gig is required"],
      index: true,
    },

    /* ======================================================
       PROPOSAL

       One proposal can have only one payment record.
    ====================================================== */

    proposal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proposal",
      required: [true, "Proposal is required"],
      unique: true,
      index: true,
    },

    /* ======================================================
       PAYMENT AMOUNT

       Store amount in INR as rupees.

       Example:

       ₹15,000

       amount = 15000

       Razorpay receives:

       1500000 paise
    ====================================================== */

    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
      min: [1, "Payment amount must be greater than 0"],
    },

    currency: {
      type: String,
      enum: ["INR"],
      default: "INR",
      uppercase: true,
    },

    /* ======================================================
       PAYMENT METHOD
    ====================================================== */

    paymentMethod: {
      type: String,
      enum: [
        "razorpay",
        "stripe",
        "wallet",
        "cash",
      ],
      default: "razorpay",
      lowercase: true,
    },

    /* ======================================================
       PAYMENT STATUS

       pending
       ↓
       escrow
       ↓
       completed

       Alternative:

       pending → failed
       escrow → refunded
    ====================================================== */

    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "escrow",
        "completed",
        "refunded",
        "failed",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },

    /* ======================================================
       PLATFORM FEE
    ====================================================== */

    platformFee: {
      type: Number,
      default: 0,
      min: [0, "Platform fee cannot be negative"],
    },

    /* ======================================================
       FREELANCER EARNINGS
    ====================================================== */

    freelancerAmount: {
      type: Number,
      default: 0,
      min: [
        0,
        "Freelancer amount cannot be negative",
      ],
    },

    /* ======================================================
       RAZORPAY DETAILS
    ====================================================== */

    razorpayOrderId: {
      type: String,
      trim: true,
      default: null,
      index: true,
    },

    razorpayPaymentId: {
      type: String,
      trim: true,
      default: null,
      index: true,
    },

    razorpaySignature: {
      type: String,
      trim: true,
      default: null,
    },

    /* ======================================================
       RECEIPT
    ====================================================== */

    receipt: {
      type: String,
      trim: true,
      default: null,
    },

    /* ======================================================
       PAYMENT DATES
    ====================================================== */

    paidAt: {
      type: Date,
      default: null,
    },

    escrowAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    refundedAt: {
      type: Date,
      default: null,
    },

    failedAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    /* ======================================================
       REFUND INFORMATION
    ====================================================== */

    refundAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    refundReason: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
    },

    /* ======================================================
       ADMIN INFORMATION
    ====================================================== */

    adminNotes: {
      type: String,
      trim: true,
      default: "",
      maxlength: 3000,
    },
  },
  {
    timestamps: true,

    toJSON: {
      virtuals: true,

      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },

    toObject: {
      virtuals: true,
    },
  }
);

/* ==========================================================
   VIRTUALS
========================================================== */

paymentSchema.virtual("isPending").get(function () {
  return this.paymentStatus === "pending";
});

paymentSchema.virtual("isInEscrow").get(function () {
  return this.paymentStatus === "escrow";
});

paymentSchema.virtual("isCompleted").get(function () {
  return this.paymentStatus === "completed";
});

paymentSchema.virtual("isRefunded").get(function () {
  return this.paymentStatus === "refunded";
});

paymentSchema.virtual("isFailed").get(function () {
  return this.paymentStatus === "failed";
});

paymentSchema.virtual("isCancelled").get(function () {
  return this.paymentStatus === "cancelled";
});

paymentSchema.virtual("canRelease").get(function () {
  return this.paymentStatus === "escrow";
});

paymentSchema.virtual("canRefund").get(function () {
  return ["pending", "escrow"].includes(
    this.paymentStatus
  );
});

/* ==========================================================
   INSTANCE METHODS
========================================================== */

/* ----------------------------------------------------------
   MARK PAYMENT AS PAID AND MOVE TO ESCROW

   pending → escrow
---------------------------------------------------------- */

paymentSchema.methods.markAsEscrow = async function ({
  razorpayPaymentId,
  razorpaySignature,
} = {}) {
  if (this.paymentStatus !== "pending") {
    throw new Error(
      "Only pending payments can be moved to escrow."
    );
  }

  if (!razorpayPaymentId) {
    throw new Error(
      "Razorpay payment ID is required."
    );
  }

  this.razorpayPaymentId =
    razorpayPaymentId;

  this.razorpaySignature =
    razorpaySignature || null;

  this.paymentStatus = "escrow";

  this.paidAt = new Date();

  this.escrowAt = new Date();

  return await this.save();
};

/* ----------------------------------------------------------
   RELEASE PAYMENT

   escrow → completed
---------------------------------------------------------- */

paymentSchema.methods.releasePayment =
  async function () {
    if (this.paymentStatus !== "escrow") {
      throw new Error(
        "Only escrow payments can be released."
      );
    }

    this.paymentStatus = "completed";

    this.completedAt = new Date();

    return await this.save();
  };

/* ----------------------------------------------------------
   REFUND PAYMENT

   pending/escrow → refunded
---------------------------------------------------------- */

paymentSchema.methods.refundPayment =
  async function ({
    amount = null,
    reason = "",
  } = {}) {
    if (
      !["pending", "escrow"].includes(
        this.paymentStatus
      )
    ) {
      throw new Error(
        "This payment cannot be refunded."
      );
    }

    const refundAmount =
      amount === null
        ? this.amount
        : Number(amount);

    if (
      !Number.isFinite(refundAmount) ||
      refundAmount <= 0 ||
      refundAmount > this.amount
    ) {
      throw new Error(
        "Invalid refund amount."
      );
    }

    this.paymentStatus = "refunded";

    this.refundAmount = refundAmount;

    this.refundReason =
      reason.trim();

    this.refundedAt = new Date();

    return await this.save();
  };

/* ----------------------------------------------------------
   MARK PAYMENT FAILED
---------------------------------------------------------- */

paymentSchema.methods.markAsFailed =
  async function (reason = "") {
    if (
      ["completed", "refunded"].includes(
        this.paymentStatus
      )
    ) {
      throw new Error(
        "This payment cannot be marked as failed."
      );
    }

    this.paymentStatus = "failed";

    this.adminNotes =
      reason.trim();

    this.failedAt = new Date();

    return await this.save();
  };

/* ----------------------------------------------------------
   CANCEL PAYMENT
---------------------------------------------------------- */

paymentSchema.methods.cancelPayment =
  async function () {
    if (
      ["completed", "refunded"].includes(
        this.paymentStatus
      )
    ) {
      throw new Error(
        "This payment cannot be cancelled."
      );
    }

    this.paymentStatus = "cancelled";

    this.cancelledAt = new Date();

    return await this.save();
  };

/* ==========================================================
   STATIC METHODS
========================================================== */

paymentSchema.statics.getClientPayments =
  function (clientId) {
    return this.find({
      client: clientId,
    }).sort({
      createdAt: -1,
    });
  };

paymentSchema.statics.getFreelancerPayments =
  function (freelancerId) {
    return this.find({
      freelancer: freelancerId,
    }).sort({
      createdAt: -1,
    });
  };

paymentSchema.statics.getEscrowPayments =
  function () {
    return this.find({
      paymentStatus: "escrow",
    }).sort({
      createdAt: -1,
    });
  };

paymentSchema.statics.getCompletedPayments =
  function () {
    return this.find({
      paymentStatus: "completed",
    }).sort({
      createdAt: -1,
    });
  };

paymentSchema.statics.getRefundedPayments =
  function () {
    return this.find({
      paymentStatus: "refunded",
    }).sort({
      createdAt: -1,
    });
};

/* ==========================================================
   INDEXES
========================================================== */

paymentSchema.index({
  client: 1,
  paymentStatus: 1,
});

paymentSchema.index({
  freelancer: 1,
  paymentStatus: 1,
});

paymentSchema.index({
  paymentStatus: 1,
  createdAt: -1,
});

paymentSchema.index({
  razorpayOrderId: 1,
});

paymentSchema.index({
  razorpayPaymentId: 1,
});

/* ==========================================================
   MODEL
========================================================== */

const Payment = mongoose.model(
  "Payment",
  paymentSchema
);

export default Payment;