import mongoose from "mongoose";

/* ==========================================================
   TRANSACTION SCHEMA

   Financial ledger for:
   - Client payments
   - Escrow deposits
   - Freelancer earnings
   - Releases
   - Withdrawals
   - Refunds
   - Platform fees

   IMPORTANT:
   All enum values use lowercase consistently.
========================================================== */

const transactionSchema = new mongoose.Schema(
  {
    /* ======================================================
       USER

       The user whose account/wallet this transaction belongs to.
    ====================================================== */

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Transaction user is required"],
      index: true,
    },

    /* ======================================================
       RELATED DOCUMENTS
    ====================================================== */

    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
      index: true,
    },

    escrow: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Escrow",
      default: null,
      index: true,
    },

    proposal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proposal",
      default: null,
      index: true,
    },

    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      default: null,
      index: true,
    },

    /* ======================================================
       TRANSACTION TYPE
    ====================================================== */

    type: {
      type: String,
      enum: [
        "payment",
        "escrow",
        "deposit",
        "release",
        "withdrawal",
        "refund",
        "fee",
      ],
      required: [true, "Transaction type is required"],
      lowercase: true,
      trim: true,
      index: true,
    },

    /* ======================================================
       AMOUNT

       Always store positive amounts.

       Direction is determined by transaction type:
       - Credit: deposit, release, refund
       - Debit: payment, escrow, withdrawal, fee
    ====================================================== */

    amount: {
      type: Number,
      required: [true, "Transaction amount is required"],
      min: [0, "Transaction amount cannot be negative"],
    },

    currency: {
      type: String,
      enum: ["INR", "USD"],
      default: "INR",
      uppercase: true,
      trim: true,
    },

    /* ======================================================
       BALANCE SNAPSHOT

       Balance before and after this transaction.

       Example:

       Previous balance: ₹5,000
       Transaction:      ₹2,000
       Current balance:  ₹7,000
    ====================================================== */

    previousBalance: {
      type: Number,
      default: 0,
      min: [0, "Previous balance cannot be negative"],
    },

    currentBalance: {
      type: Number,
      default: 0,
      min: [0, "Current balance cannot be negative"],
    },

    /* ======================================================
       TRANSACTION STATUS
    ====================================================== */

    status: {
      type: String,
      enum: [
        "pending",
        "completed",
        "failed",
        "cancelled",
      ],
      default: "pending",
      lowercase: true,
      trim: true,
      index: true,
    },

    /* ======================================================
       PAYMENT GATEWAY
    ====================================================== */

    gateway: {
      type: String,
      enum: [
        "razorpay",
        "wallet",
        "bank",
        "upi",
        "paypal",
        "system",
      ],
      default: "system",
      lowercase: true,
      trim: true,
    },

    /* ======================================================
       EXTERNAL TRANSACTION ID

       Examples:
       - Razorpay payment ID
       - Bank transaction ID
       - Withdrawal reference ID
    ====================================================== */

    gatewayTransactionId: {
      type: String,
      trim: true,
      default: null,
      index: true,
    },

    /* ======================================================
       TRANSACTION TITLE
    ====================================================== */

    title: {
      type: String,
      required: [true, "Transaction title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },

    /* ======================================================
       DESCRIPTION
    ====================================================== */

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [
        1000,
        "Description cannot exceed 1000 characters",
      ],
    },

    /* ======================================================
       IDEMPOTENCY / REFERENCE ID

       Must be unique when provided.

       Examples:
       payment_<paymentId>_client_escrow
       payment_<paymentId>_freelancer_deposit
       escrow_<escrowId>_release
       withdrawal_<withdrawalId>
    ====================================================== */

    referenceId: {
      type: String,
      trim: true,
      default: null,
      index: true,
    },

    /* ======================================================
       PROCESSING DATE
    ====================================================== */

    processedAt: {
      type: Date,
      default: null,
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

/* ----------------------------------------------------------
   STATUS
---------------------------------------------------------- */

transactionSchema.virtual("isCompleted").get(function () {
  return this.status === "completed";
});

transactionSchema.virtual("isPending").get(function () {
  return this.status === "pending";
});

transactionSchema.virtual("isFailed").get(function () {
  return this.status === "failed";
});

transactionSchema.virtual("isCancelled").get(function () {
  return this.status === "cancelled";
});

/* ----------------------------------------------------------
   TRANSACTION DIRECTION
---------------------------------------------------------- */

transactionSchema.virtual("isCredit").get(function () {
  return [
    "deposit",
    "release",
    "refund",
  ].includes(this.type);
});

transactionSchema.virtual("isDebit").get(function () {
  return [
    "payment",
    "escrow",
    "withdrawal",
    "fee",
  ].includes(this.type);
});

/* ==========================================================
   INSTANCE METHODS
========================================================== */

/* ----------------------------------------------------------
   MARK COMPLETED
---------------------------------------------------------- */

transactionSchema.methods.markCompleted =
  async function () {
    if (this.status === "completed") {
      return this;
    }

    if (
      ["failed", "cancelled"].includes(this.status)
    ) {
      throw new Error(
        "Failed or cancelled transactions cannot be completed."
      );
    }

    this.status = "completed";
    this.processedAt = new Date();

    return await this.save();
  };

/* ----------------------------------------------------------
   MARK FAILED
---------------------------------------------------------- */

transactionSchema.methods.markFailed =
  async function () {
    if (this.status === "completed") {
      throw new Error(
        "Completed transactions cannot be marked as failed."
      );
    }

    if (this.status === "failed") {
      return this;
    }

    this.status = "failed";
    this.processedAt = new Date();

    return await this.save();
  };

/* ----------------------------------------------------------
   MARK CANCELLED
---------------------------------------------------------- */

transactionSchema.methods.markCancelled =
  async function () {
    if (this.status === "completed") {
      throw new Error(
        "Completed transactions cannot be cancelled."
      );
    }

    if (this.status === "cancelled") {
      return this;
    }

    this.status = "cancelled";
    this.processedAt = new Date();

    return await this.save();
  };

/* ==========================================================
   STATIC METHODS
========================================================== */

/* ----------------------------------------------------------
   GET USER TRANSACTIONS
---------------------------------------------------------- */

transactionSchema.statics.getUserTransactions =
  function (userId) {
    return this.find({
      user: userId,
    }).sort({
      createdAt: -1,
    });
  };

/* ----------------------------------------------------------
   GET COMPLETED TRANSACTIONS
---------------------------------------------------------- */

transactionSchema.statics.getCompletedTransactions =
  function () {
    return this.find({
      status: "completed",
    }).sort({
      createdAt: -1,
    });
  };

/* ----------------------------------------------------------
   GET PENDING TRANSACTIONS
---------------------------------------------------------- */

transactionSchema.statics.getPendingTransactions =
  function () {
    return this.find({
      status: "pending",
    }).sort({
      createdAt: -1,
    });
  };

/* ----------------------------------------------------------
   GET TRANSACTIONS BY PAYMENT
---------------------------------------------------------- */

transactionSchema.statics.getPaymentTransactions =
  function (paymentId) {
    return this.find({
      payment: paymentId,
    }).sort({
      createdAt: -1,
    });
  };

/* ----------------------------------------------------------
   GET TRANSACTIONS BY ESCROW
---------------------------------------------------------- */

transactionSchema.statics.getEscrowTransactions =
  function (escrowId) {
    return this.find({
      escrow: escrowId,
    }).sort({
      createdAt: -1,
    });
  };

/* ----------------------------------------------------------
   GET TRANSACTIONS BY PROPOSAL
---------------------------------------------------------- */

transactionSchema.statics.getProposalTransactions =
  function (proposalId) {
    return this.find({
      proposal: proposalId,
    }).sort({
      createdAt: -1,
    });
  };

/* ----------------------------------------------------------
   GET TRANSACTIONS BY TYPE
---------------------------------------------------------- */

transactionSchema.statics.getTransactionsByType =
  function (type) {
    return this.find({
      type,
    }).sort({
      createdAt: -1,
    });
  };

/* ----------------------------------------------------------
   GET TRANSACTIONS BY REFERENCE ID
---------------------------------------------------------- */

transactionSchema.statics.findByReferenceId =
  function (referenceId) {
    return this.findOne({
      referenceId,
    });
  };

/* ==========================================================
   INDEXES
========================================================== */

/* ----------------------------------------------------------
   USER TRANSACTION HISTORY
---------------------------------------------------------- */

transactionSchema.index({
  user: 1,
  createdAt: -1,
});

/* ----------------------------------------------------------
   TYPE + STATUS FILTERING
---------------------------------------------------------- */

transactionSchema.index({
  type: 1,
  status: 1,
});

/* ----------------------------------------------------------
   PAYMENT HISTORY
---------------------------------------------------------- */

transactionSchema.index({
  payment: 1,
  createdAt: -1,
});

/* ----------------------------------------------------------
   ESCROW HISTORY
---------------------------------------------------------- */

transactionSchema.index({
  escrow: 1,
  createdAt: -1,
});

/* ----------------------------------------------------------
   PROPOSAL HISTORY
---------------------------------------------------------- */

transactionSchema.index({
  proposal: 1,
  createdAt: -1,
});

/* ----------------------------------------------------------
   GATEWAY TRANSACTION LOOKUP
---------------------------------------------------------- */

transactionSchema.index({
  gatewayTransactionId: 1,
});

/* ----------------------------------------------------------
   PREVENT DUPLICATE REFERENCES
---------------------------------------------------------- */

transactionSchema.index(
  {
    referenceId: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      referenceId: {
        $type: "string",
      },
    },
  }
);

/* ==========================================================
   MODEL
========================================================== */

const Transaction = mongoose.model(
  "Transaction",
  transactionSchema
);

export default Transaction;