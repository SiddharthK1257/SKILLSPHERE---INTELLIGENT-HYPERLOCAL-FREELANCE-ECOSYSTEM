import mongoose from "mongoose";

/* ==========================================================
   NEGOTIATION SCHEMA
========================================================== */

const negotiationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Negotiation sender is required"],
    },

    message: {
      type: String,
      required: [true, "Negotiation message is required"],
      trim: true,
      minlength: [1, "Negotiation message cannot be empty"],
      maxlength: [
        2000,
        "Negotiation message cannot exceed 2000 characters",
      ],
    },

    offerAmount: {
      type: Number,
      required: [true, "Offer amount is required"],
      min: [1, "Offer amount must be greater than 0"],
    },

    status: {
      type: String,
      enum: {
        values: ["pending", "accepted", "rejected"],
        message: "Invalid negotiation status",
      },
      default: "pending",
    },
  },
  {
    timestamps: true,
    _id: true,
  }
);

/* ==========================================================
   PROPOSAL SCHEMA
========================================================== */

const proposalSchema = new mongoose.Schema(
  {
    /* ======================================================
       CLIENT

       The user who browses the gig and submits the proposal.
       The client pays after the freelancer accepts.
    ====================================================== */

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Client is required"],
      index: true,
    },

    /* ======================================================
       FREELANCER

       The owner of the gig.
       The freelancer accepts, rejects, or negotiates.
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
       PROPOSAL DETAILS
    ====================================================== */

    proposalDescription: {
      type: String,
      required: [true, "Proposal description is required"],
      trim: true,
      minlength: [
        10,
        "Proposal must contain at least 10 characters",
      ],
      maxlength: [
        5000,
        "Proposal cannot exceed 5000 characters",
      ],
    },

    /* Original amount proposed by the client */

    bidAmount: {
      type: Number,
      required: [true, "Bid amount is required"],
      min: [1, "Bid amount must be greater than 0"],
    },

    /* Latest negotiated amount */

    currentOfferAmount: {
      type: Number,
      required: [true, "Current offer amount is required"],
      min: [1, "Current offer amount must be greater than 0"],
    },

    estimatedCompletionTime: {
      type: Number,
      required: [
        true,
        "Estimated completion time is required",
      ],
      min: [
        1,
        "Completion time must be at least 1 day",
      ],
    },

    /* ======================================================
       PROPOSAL STATUS
    ====================================================== */

    status: {
      type: String,
      enum: {
        values: [
          "pending",
          "negotiating",
          "accepted",
          "rejected",
          "withdrawn",
          "hired",
          "completed",
          "cancelled",
          "suspended",
        ],
        message: "Invalid proposal status",
      },
      default: "pending",
      index: true,
    },

    /* ======================================================
       PAYMENT STATUS
    ====================================================== */

    paymentStatus: {
      type: String,
      enum: {
        values: [
          "unpaid",
          "pending",
          "paid",
          "released",
          "refunded",
          "failed",
        ],
        message: "Invalid payment status",
      },
      default: "unpaid",
      index: true,
    },

    /* ======================================================
       PAYMENT DETAILS
    ====================================================== */

    paymentOrderId: {
      type: String,
      trim: true,
      default: null,
    },

    paymentId: {
      type: String,
      trim: true,
      default: null,
    },

    paymentAmount: {
      type: Number,
      min: 0,
      default: 0,
    },

    paymentCurrency: {
      type: String,
      uppercase: true,
      trim: true,
      default: "INR",
    },

    /* ======================================================
       NEGOTIATION HISTORY
    ====================================================== */

    negotiations: {
      type: [negotiationSchema],
      default: [],
    },

    /* ======================================================
       ADMIN
    ====================================================== */

    featured: {
      type: Boolean,
      default: false,
    },

    suspended: {
      type: Boolean,
      default: false,
    },

    suspensionReason: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    suspendedAt: {
      type: Date,
      default: null,
    },

    adminNotes: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: "",
    },

    reports: {
      type: Number,
      min: 0,
      default: 0,
    },

    reportReason: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    /* ======================================================
       IMPORTANT DATES
    ====================================================== */

    acceptedAt: {
      type: Date,
      default: null,
    },

    rejectedAt: {
      type: Date,
      default: null,
    },

    withdrawnAt: {
      type: Date,
      default: null,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    hiredAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    releasedAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    /* ======================================================
       REASONS
    ====================================================== */

    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    withdrawalReason: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    cancellationReason: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    /* ======================================================
       SOFT DELETE
    ====================================================== */

    deletedAt: {
      type: Date,
      default: null,
      index: true,
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

proposalSchema.virtual("isPending").get(function () {
  return this.status === "pending";
});

proposalSchema.virtual("isNegotiating").get(function () {
  return this.status === "negotiating";
});

proposalSchema.virtual("isAccepted").get(function () {
  return this.status === "accepted";
});

proposalSchema.virtual("isRejected").get(function () {
  return this.status === "rejected";
});

proposalSchema.virtual("isWithdrawn").get(function () {
  return this.status === "withdrawn";
});

proposalSchema.virtual("isHired").get(function () {
  return this.status === "hired";
});

proposalSchema.virtual("isCompleted").get(function () {
  return this.status === "completed";
});

proposalSchema.virtual("isCancelled").get(function () {
  return this.status === "cancelled";
});

proposalSchema.virtual("isSuspended").get(function () {
  return this.status === "suspended";
});

proposalSchema.virtual("isPaid").get(function () {
  return this.paymentStatus === "paid";
});

proposalSchema.virtual("canNegotiate").get(function () {
  return [
    "pending",
    "negotiating",
  ].includes(this.status);
});

proposalSchema.virtual("canAccept").get(function () {
  return [
    "pending",
    "negotiating",
  ].includes(this.status);
});

proposalSchema.virtual("canPay").get(function () {
  return (
    this.status === "accepted" &&
    this.paymentStatus === "unpaid"
  );
});

proposalSchema.virtual("canComplete").get(function () {
  return this.status === "hired";
});

/* ==========================================================
   INSTANCE METHODS
========================================================== */

/* ==========================================================
   ACCEPT PROPOSAL

   FREELANCER

   pending
   negotiating
        ↓
   accepted
========================================================== */

proposalSchema.methods.acceptProposal = async function () {
  if (
    !["pending", "negotiating"].includes(
      this.status
    )
  ) {
    throw new Error(
      "Only pending or negotiating proposals can be accepted."
    );
  }

  this.status = "accepted";

  this.acceptedAt = new Date();

  this.paymentStatus = "unpaid";

  return this.save();
};

/* ==========================================================
   REJECT PROPOSAL

   FREELANCER
========================================================== */

proposalSchema.methods.rejectProposal = async function (
  reason = ""
) {
  if (
    !["pending", "negotiating"].includes(
      this.status
    )
  ) {
    throw new Error(
      "This proposal cannot be rejected."
    );
  }

  this.status = "rejected";

  this.rejectionReason =
    String(reason).trim();

  this.rejectedAt = new Date();

  return this.save();
};

/* ==========================================================
   ADD NEGOTIATION
========================================================== */

proposalSchema.methods.addNegotiation = async function ({
  sender,
  message,
  offerAmount,
}) {
  if (
    !["pending", "negotiating"].includes(
      this.status
    )
  ) {
    throw new Error(
      "Negotiation is no longer available."
    );
  }

  if (!sender) {
    throw new Error(
      "Negotiation sender is required."
    );
  }

  const cleanMessage =
    String(message || "").trim();

  const amount = Number(offerAmount);

  if (!cleanMessage) {
    throw new Error(
      "Negotiation message is required."
    );
  }

  if (
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    throw new Error(
      "Valid offer amount is required."
    );
  }

  this.negotiations.push({
    sender,
    message: cleanMessage,
    offerAmount: amount,
    status: "pending",
  });

  this.currentOfferAmount = amount;

  this.status = "negotiating";

  return this.save();
};

/* ==========================================================
   MARK PAYMENT PENDING
========================================================== */

proposalSchema.methods.markPaymentPending =
  async function ({
    orderId,
    amount,
  } = {}) {
    if (this.status !== "accepted") {
      throw new Error(
        "Proposal must be accepted before payment."
      );
    }

    if (
      this.paymentStatus === "paid" ||
      this.paymentStatus === "released"
    ) {
      throw new Error(
        "Payment has already been completed."
      );
    }

    this.paymentStatus = "pending";

    if (orderId) {
      this.paymentOrderId = orderId;
    }

    if (amount !== undefined) {
      this.paymentAmount = Number(amount);
    }

    return this.save();
  };

/* ==========================================================
   MARK PAYMENT AS PAID

   ONLY AFTER PAYMENT VERIFICATION
========================================================== */

proposalSchema.methods.markAsPaid =
  async function ({
    paymentId,
    orderId,
    amount,
  } = {}) {
    if (this.status !== "accepted") {
      throw new Error(
        "Proposal must be accepted before payment."
      );
    }

    if (
      this.paymentStatus === "paid" ||
      this.paymentStatus === "released"
    ) {
      throw new Error(
        "Payment has already been completed."
      );
    }

    this.paymentStatus = "paid";

    this.paymentId =
      paymentId || this.paymentId;

    this.paymentOrderId =
      orderId || this.paymentOrderId;

    if (amount !== undefined) {
      this.paymentAmount = Number(amount);
    }

    this.paidAt = new Date();

    return this.save();
  };

/* ==========================================================
   HIRE FREELANCER

   accepted + paid
        ↓
      hired
========================================================== */

proposalSchema.methods.hireFreelancer =
  async function () {
    if (this.status !== "accepted") {
      throw new Error(
        "Only accepted proposals can become hired."
      );
    }

    if (
      this.paymentStatus !== "paid"
    ) {
      throw new Error(
        "Payment must be completed before hiring."
      );
    }

    this.status = "hired";

    this.hiredAt = new Date();

    return this.save();
  };

/* ==========================================================
   COMPLETE PROJECT

   FREELANCER
========================================================== */

proposalSchema.methods.completeProject =
  async function () {
    if (this.status !== "hired") {
      throw new Error(
        "Only hired projects can be completed."
      );
    }

    this.status = "completed";

    this.completedAt = new Date();

    return this.save();
  };

/* ==========================================================
   RELEASE PAYMENT

   CLIENT
========================================================== */

proposalSchema.methods.releasePayment =
  async function () {
    if (this.status !== "completed") {
      throw new Error(
        "Project must be completed before releasing payment."
      );
    }

    if (
      this.paymentStatus !== "paid"
    ) {
      throw new Error(
        "Payment must be paid before it can be released."
      );
    }

    this.paymentStatus = "released";

    this.releasedAt = new Date();

    return this.save();
  };

/* ==========================================================
   WITHDRAW PROPOSAL

   CLIENT
========================================================== */

proposalSchema.methods.withdrawProposal =
  async function (reason = "") {
    if (
      !["pending", "negotiating"].includes(
        this.status
      )
    ) {
      throw new Error(
        "This proposal cannot be withdrawn."
      );
    }

    this.status = "withdrawn";

    this.withdrawalReason =
      String(reason).trim();

    this.withdrawnAt = new Date();

    return this.save();
  };

/* ==========================================================
   CANCEL PROJECT
========================================================== */

proposalSchema.methods.cancelProject =
  async function (reason = "") {
    if (
      !["hired", "completed"].includes(
        this.status
      )
    ) {
      throw new Error(
        "This project cannot be cancelled."
      );
    }

    this.status = "cancelled";

    this.cancellationReason =
      String(reason).trim();

    this.cancelledAt = new Date();

    return this.save();
  };

/* ==========================================================
   SOFT DELETE
========================================================== */

proposalSchema.methods.softDelete =
  async function () {
    if (
      [
        "accepted",
        "hired",
        "completed",
      ].includes(this.status)
    ) {
      throw new Error(
        "Active or completed proposals cannot be deleted."
      );
    }

    if (
      this.paymentStatus === "paid" ||
      this.paymentStatus === "released"
    ) {
      throw new Error(
        "Paid proposals cannot be deleted."
      );
    }

    this.deletedAt = new Date();

    return this.save();
  };

/* ==========================================================
   SUSPEND PROPOSAL
========================================================== */

proposalSchema.methods.suspendProposal =
  async function (reason = "") {
    this.status = "suspended";

    this.suspended = true;

    this.suspensionReason =
      String(reason).trim();

    this.suspendedAt = new Date();

    return this.save();
  };

/* ==========================================================
   RESTORE SUSPENDED PROPOSAL
========================================================== */

proposalSchema.methods.restoreProposal =
  async function () {
    if (!this.suspended) {
      throw new Error(
        "Proposal is not suspended."
      );
    }

    this.suspended = false;

    this.status = "pending";

    this.suspensionReason = "";

    this.suspendedAt = null;

    return this.save();
  };

/* ==========================================================
   STATIC METHODS
========================================================== */

proposalSchema.statics.getPendingProposals =
  function () {
    return this.find({
      status: "pending",
      deletedAt: null,
    });
  };

proposalSchema.statics.getNegotiatingProposals =
  function () {
    return this.find({
      status: "negotiating",
      deletedAt: null,
    });
  };

proposalSchema.statics.getAcceptedProposals =
  function () {
    return this.find({
      status: "accepted",
      deletedAt: null,
    });
  };

proposalSchema.statics.getHiredProposals =
  function () {
    return this.find({
      status: "hired",
      deletedAt: null,
    });
  };

proposalSchema.statics.getCompletedProposals =
  function () {
    return this.find({
      status: "completed",
      deletedAt: null,
    });
  };

proposalSchema.statics.getFreelancerProposals =
  function (freelancerId) {
    return this.find({
      freelancer: freelancerId,
      deletedAt: null,
    });
  };

proposalSchema.statics.getClientProposals =
  function (clientId) {
    return this.find({
      client: clientId,
      deletedAt: null,
    });
  };

/* ==========================================================
   QUERY MIDDLEWARE
========================================================== */

proposalSchema.pre(/^find/, function (next) {
  if (!this.getOptions().includeDeleted) {
    this.where({
      deletedAt: null,
    });
  }

  next();
});

/* ==========================================================
   INDEXES
========================================================== */

/*
  ONE CLIENT = ONE PROPOSAL FOR ONE GIG

  Soft-deleted proposal will not block
  a new proposal.
*/

proposalSchema.index(
  {
    client: 1,
    gig: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      deletedAt: null,
    },
  }
);

proposalSchema.index({
  freelancer: 1,
  status: 1,
  createdAt: -1,
});

proposalSchema.index({
  client: 1,
  status: 1,
  createdAt: -1,
});

proposalSchema.index({
  gig: 1,
  status: 1,
  createdAt: -1,
});

proposalSchema.index({
  paymentStatus: 1,
  createdAt: -1,
});

proposalSchema.index({
  status: 1,
  createdAt: -1,
});

proposalSchema.index({
  deletedAt: 1,
});

/* ==========================================================
   MODEL
========================================================== */

const Proposal = mongoose.model(
  "Proposal",
  proposalSchema
);

export default Proposal;