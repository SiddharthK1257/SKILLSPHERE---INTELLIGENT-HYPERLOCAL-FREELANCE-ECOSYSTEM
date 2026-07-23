import mongoose from "mongoose";

/* ==========================================================
   ESCROW SCHEMA
========================================================== */

const escrowSchema = new mongoose.Schema(
  {
    /* ======================================================
       REFERENCES
    ====================================================== */

    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: [true, "Payment reference is required"],
      unique: true,
      index: true,
    },

    proposal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proposal",
      required: [true, "Proposal reference is required"],
      index: true,
    },

    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: [true, "Gig reference is required"],
      index: true,
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Client is required"],
      index: true,
    },

    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Freelancer is required"],
      index: true,
    },

    /* ======================================================
       FINANCIAL DETAILS
    ====================================================== */

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    platformFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    freelancerAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    releasedAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    remainingAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    refundedAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      trim: true,
    },

    /* ======================================================
       STATUS
    ====================================================== */

    status: {
      type: String,
      enum: [
        "holding",
        "partially_released",
        "released",
        "refunded",
        "disputed",
        "cancelled",
      ],
      default: "holding",
      index: true,
    },

    autoRelease: {
      type: Boolean,
      default: true,
    },

    /* ======================================================
       RELEASE DETAILS
    ====================================================== */

    released: {
      type: Boolean,
      default: false,
    },

    releasedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    releasedAt: {
      type: Date,
      default: null,
    },

    autoReleaseDate: {
      type: Date,
      default: null,
    },

    /* ======================================================
       REFUND DETAILS
    ====================================================== */

    refunded: {
      type: Boolean,
      default: false,
    },

    refundedAt: {
      type: Date,
      default: null,
    },

    refundReason: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    /* ======================================================
       DISPUTE DETAILS
    ====================================================== */

    disputeRaised: {
      type: Boolean,
      default: false,
    },

    disputeReason: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    disputedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    disputedAt: {
      type: Date,
      default: null,
    },

    disputeResolved: {
      type: Boolean,
      default: false,
    },

    disputeResolvedAt: {
      type: Date,
      default: null,
    },

    /* ======================================================
       ADMIN
    ====================================================== */

    suspended: {
      type: Boolean,
      default: false,
    },

    suspendedReason: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: "",
    },

    adminNotes: {
      type: String,
      trim: true,
      maxlength: 3000,
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

escrowSchema.virtual("isHolding").get(function () {
  return this.status === "holding";
});

escrowSchema.virtual("isReleased").get(function () {
  return this.status === "released";
});

escrowSchema.virtual("isPartiallyReleased").get(function () {
  return this.status === "partially_released";
});

escrowSchema.virtual("isRefunded").get(function () {
  return this.status === "refunded";
});

escrowSchema.virtual("isDisputed").get(function () {
  return this.status === "disputed";
});

escrowSchema.virtual("isCancelled").get(function () {
  return this.status === "cancelled";
});

escrowSchema.virtual("canRelease").get(function () {
  return (
    !this.suspended &&
    !this.disputeRaised &&
    (
      this.status === "holding" ||
      this.status === "partially_released"
    )
  );
});

escrowSchema.virtual("releasePercentage").get(function () {
  if (this.freelancerAmount <= 0) return 0;

  return Number(
    (
      (this.releasedAmount /
        this.freelancerAmount) *
      100
    ).toFixed(2)
  );
});

escrowSchema.virtual("platformRevenue").get(function () {
  return this.platformFee;
});

escrowSchema.virtual("completed").get(function () {
  return (
    this.status === "released" ||
    this.status === "refunded"
  );
});
/* ==========================================================
   VIRTUALS
========================================================== */

escrowSchema.virtual("isHolding").get(function () {
  return this.status === "holding";
});

escrowSchema.virtual("isReleased").get(function () {
  return this.status === "released";
});

escrowSchema.virtual("isPartiallyReleased").get(function () {
  return this.status === "partially_released";
});

escrowSchema.virtual("isRefunded").get(function () {
  return this.status === "refunded";
});

escrowSchema.virtual("isDisputed").get(function () {
  return this.status === "disputed";
});

escrowSchema.virtual("isCancelled").get(function () {
  return this.status === "cancelled";
});

escrowSchema.virtual("canRelease").get(function () {
  return (
    !this.suspended &&
    !this.disputeRaised &&
    ["holding", "partially_released"].includes(this.status)
  );
});

escrowSchema.virtual("releasePercentage").get(function () {
  if (!this.freelancerAmount) return 0;

  return Number(
    (
      (this.releasedAmount / this.freelancerAmount) *
      100
    ).toFixed(2)
  );
});

/* ==========================================================
   PRE SAVE MIDDLEWARE
========================================================== */

escrowSchema.pre("save", function (next) {
  this.remainingAmount = Math.max(
    0,
    this.freelancerAmount - this.releasedAmount
  );

  if (this.remainingAmount === 0 && this.releasedAmount > 0) {
    this.status = "released";
    this.released = true;
  }

  next();
});

/* ==========================================================
   INSTANCE METHODS
========================================================== */

/* ----------------------------------------------------------
   RELEASE COMPLETE ESCROW
---------------------------------------------------------- */

escrowSchema.methods.releaseFunds = async function (
  releasedBy
) {
  if (!this.canRelease) {
    throw new Error("Escrow cannot be released.");
  }

  this.releasedAmount = this.freelancerAmount;

  this.remainingAmount = 0;

  this.status = "released";

  this.released = true;

  this.releasedBy = releasedBy;

  this.releasedAt = new Date();

  return await this.save();
};

/* ----------------------------------------------------------
   PARTIAL RELEASE
---------------------------------------------------------- */

escrowSchema.methods.partialRelease =
  async function (amount, releasedBy) {
    amount = Number(amount);

    if (amount <= 0) {
      throw new Error("Invalid amount.");
    }

    if (!this.canRelease) {
      throw new Error("Escrow cannot be released.");
    }

    if (amount > this.remainingAmount) {
      throw new Error(
        "Release amount exceeds remaining balance."
      );
    }

    this.releasedAmount += amount;

    this.remainingAmount -= amount;

    this.releasedBy = releasedBy;

    this.releasedAt = new Date();

    if (this.remainingAmount === 0) {
      this.status = "released";
      this.released = true;
    } else {
      this.status = "partially_released";
    }

    return await this.save();
  };

/* ----------------------------------------------------------
   REFUND ESCROW
---------------------------------------------------------- */

escrowSchema.methods.refundFunds =
  async function (reason = "") {
    if (this.released) {
      throw new Error(
        "Released escrow cannot be refunded."
      );
    }

    this.status = "refunded";

    this.refunded = true;

    this.refundedAmount = this.totalAmount;

    this.remainingAmount = 0;

    this.refundedAt = new Date();

    this.refundReason = reason.trim();

    return await this.save();
  };

/* ----------------------------------------------------------
   RAISE DISPUTE
---------------------------------------------------------- */

escrowSchema.methods.raiseDispute =
  async function (userId, reason) {
    if (this.disputeRaised) {
      throw new Error(
        "Dispute has already been raised."
      );
    }

    this.status = "disputed";

    this.disputeRaised = true;

    this.disputedBy = userId;

    this.disputeReason = reason.trim();

    this.disputedAt = new Date();

    return await this.save();
  };

/* ----------------------------------------------------------
   RESOLVE DISPUTE
---------------------------------------------------------- */

escrowSchema.methods.resolveDispute =
  async function () {
    if (!this.disputeRaised) {
      throw new Error("No dispute exists.");
    }

    this.disputeRaised = false;

    this.disputeResolved = true;

    this.disputeResolvedAt = new Date();

    this.disputedBy = null;

    this.disputeReason = "";

    if (this.remainingAmount === 0) {
      this.status = "released";
    } else if (this.releasedAmount > 0) {
      this.status = "partially_released";
    } else {
      this.status = "holding";
    }

    return await this.save();
  };

/* ----------------------------------------------------------
   CANCEL ESCROW
---------------------------------------------------------- */

escrowSchema.methods.cancelEscrow =
  async function () {
    if (this.released) {
      throw new Error(
        "Released escrow cannot be cancelled."
      );
    }

    this.status = "cancelled";

    return await this.save();
  };

/* ----------------------------------------------------------
   SUSPEND ESCROW
---------------------------------------------------------- */

escrowSchema.methods.suspendEscrow =
  async function (reason = "") {
    this.suspended = true;

    this.suspendedReason = reason.trim();

    return await this.save();
  };

/* ----------------------------------------------------------
   UNSUSPEND ESCROW
---------------------------------------------------------- */

escrowSchema.methods.unsuspendEscrow =
  async function () {
    this.suspended = false;

    this.suspendedReason = "";

    return await this.save();
  };

/* ----------------------------------------------------------
   SUMMARY
---------------------------------------------------------- */

escrowSchema.methods.getSummary = function () {
  return {
    id: this._id,

    status: this.status,

    totalAmount: this.totalAmount,

    freelancerAmount: this.freelancerAmount,

    releasedAmount: this.releasedAmount,

    remainingAmount: this.remainingAmount,

    platformFee: this.platformFee,

    released: this.released,

    refunded: this.refunded,

    disputeRaised: this.disputeRaised,

    autoReleaseDate: this.autoReleaseDate,
  };
};
/* ==========================================================
   STATIC METHODS
========================================================== */

/*
  Find escrow by payment
*/
escrowSchema.statics.findByPayment = function (paymentId) {
  return this.findOne({ payment: paymentId });
};

/*
  Find escrow by proposal
*/
escrowSchema.statics.findByProposal = function (proposalId) {
  return this.findOne({ proposal: proposalId });
};

/*
  Find escrow by gig
*/
escrowSchema.statics.findByGig = function (gigId) {
  return this.find({ gig: gigId });
};

/*
  Find client escrows
*/
escrowSchema.statics.findByClient = function (clientId) {
  return this.find({
    client: clientId,
    deletedAt: null,
  }).sort({
    createdAt: -1,
  });
};

/*
  Find freelancer escrows
*/
escrowSchema.statics.findByFreelancer = function (
  freelancerId
) {
  return this.find({
    freelancer: freelancerId,
    deletedAt: null,
  }).sort({
    createdAt: -1,
  });
};

/*
  Holding escrows
*/
escrowSchema.statics.getHoldingEscrows = function () {
  return this.find({
    status: "holding",
    deletedAt: null,
  });
};

/*
  Released escrows
*/
escrowSchema.statics.getReleasedEscrows = function () {
  return this.find({
    status: "released",
    deletedAt: null,
  });
};

/*
  Partially Released
*/
escrowSchema.statics.getPartiallyReleasedEscrows =
  function () {
    return this.find({
      status: "partially_released",
      deletedAt: null,
    });
  };

/*
  Refunded
*/
escrowSchema.statics.getRefundedEscrows = function () {
  return this.find({
    status: "refunded",
    deletedAt: null,
  });
};

/*
  Disputed
*/
escrowSchema.statics.getDisputedEscrows = function () {
  return this.find({
    status: "disputed",
    deletedAt: null,
  });
};

/*
  Cancelled
*/
escrowSchema.statics.getCancelledEscrows = function () {
  return this.find({
    status: "cancelled",
    deletedAt: null,
  });
};

/*
  Auto Release Queue
*/
escrowSchema.statics.getAutoReleaseQueue =
  function () {
    return this.find({
      autoRelease: true,
      status: {
        $in: [
          "holding",
          "partially_released",
        ],
      },
      autoReleaseDate: {
        $lte: new Date(),
      },
      deletedAt: null,
    });
  };

/*
  Search
*/
escrowSchema.statics.search = function ({
  status,
  client,
  freelancer,
  gig,
  payment,
} = {}) {
  const query = {
    deletedAt: null,
  };

  if (status)
    query.status = status;

  if (client)
    query.client = client;

  if (freelancer)
    query.freelancer = freelancer;

  if (gig)
    query.gig = gig;

  if (payment)
    query.payment = payment;

  return this.find(query);
};

/* ==========================================================
   DASHBOARD STATISTICS
========================================================== */

escrowSchema.statics.getDashboardStats =
  async function () {
    const [
      total,
      holding,
      partial,
      released,
      refunded,
      disputed,
      cancelled,
    ] = await Promise.all([
      this.countDocuments({
        deletedAt: null,
      }),

      this.countDocuments({
        status: "holding",
        deletedAt: null,
      }),

      this.countDocuments({
        status:
          "partially_released",
        deletedAt: null,
      }),

      this.countDocuments({
        status: "released",
        deletedAt: null,
      }),

      this.countDocuments({
        status: "refunded",
        deletedAt: null,
      }),

      this.countDocuments({
        status: "disputed",
        deletedAt: null,
      }),

      this.countDocuments({
        status: "cancelled",
        deletedAt: null,
      }),
    ]);

    const financial =
      await this.aggregate([
        {
          $match: {
            deletedAt: null,
          },
        },
        {
          $group: {
            _id: null,

            totalAmount: {
              $sum: "$totalAmount",
            },

            releasedAmount: {
              $sum:
                "$releasedAmount",
            },

            remainingAmount: {
              $sum:
                "$remainingAmount",
            },

            freelancerAmount: {
              $sum:
                "$freelancerAmount",
            },

            refundedAmount: {
              $sum:
                "$refundedAmount",
            },

            platformFee: {
              $sum:
                "$platformFee",
            },
          },
        },
      ]);

    return {
      total,
      holding,
      partiallyReleased:
        partial,
      released,
      refunded,
      disputed,
      cancelled,

      financials:
        financial[0] || {
          totalAmount: 0,
          releasedAmount: 0,
          remainingAmount: 0,
          freelancerAmount: 0,
          refundedAmount: 0,
          platformFee: 0,
        },
    };
  };

/* ==========================================================
   MONTHLY REPORT
========================================================== */

escrowSchema.statics.getMonthlyReport =
  function (year) {
    return this.aggregate([
      {
        $match: {
          deletedAt: null,

          createdAt: {
            $gte: new Date(
              year,
              0,
              1
            ),

            $lte: new Date(
              year,
              11,
              31,
              23,
              59,
              59
            ),
          },
        },
      },

      {
        $group: {
          _id: {
            month: {
              $month:
                "$createdAt",
            },
          },

          totalEscrows: {
            $sum: 1,
          },

          totalAmount: {
            $sum:
              "$totalAmount",
          },

          releasedAmount: {
            $sum:
              "$releasedAmount",
          },

          refundedAmount: {
            $sum:
              "$refundedAmount",
          },
        },
      },

      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);
  };

/* ==========================================================
   QUERY MIDDLEWARE
========================================================== */

escrowSchema.pre(/^find/, function (next) {
  this.where({
    deletedAt: null,
  });

  this.populate(
    "client",
    "name username avatar profilePicture"
  );

  this.populate(
    "freelancer",
    "name username avatar profilePicture"
  );

  this.populate(
    "gig",
    "title price category"
  );

  this.populate(
    "proposal",
    "bidAmount status"
  );

  this.populate(
    "payment",
    "amount paymentMethod status"
  );

  next();
});

/* ==========================================================
   INDEXES
========================================================== */

escrowSchema.index({
  payment: 1,
});

escrowSchema.index({
  proposal: 1,
});

escrowSchema.index({
  gig: 1,
});

escrowSchema.index({
  client: 1,
});

escrowSchema.index({
  freelancer: 1,
});

escrowSchema.index({
  status: 1,
});

escrowSchema.index({
  autoReleaseDate: 1,
});

escrowSchema.index({
  releasedAt: -1,
});

escrowSchema.index({
  refundedAt: -1,
});

escrowSchema.index({
  disputedAt: -1,
});

escrowSchema.index({
  createdAt: -1,
});

escrowSchema.index({
  deletedAt: 1,
});
/* ==========================================================
   HELPER METHODS
========================================================== */

/*
  Soft Delete Escrow
*/
escrowSchema.methods.softDelete =
  async function () {
    this.deletedAt = new Date();

    return await this.save();
  };

/*
  Restore Soft Deleted Escrow
*/
escrowSchema.methods.restore =
  async function () {
    this.deletedAt = null;

    return await this.save();
  };

/*
  Mark Auto Release Date
*/
escrowSchema.methods.setAutoReleaseDate =
  async function (days = 7) {
    const date = new Date();

    date.setDate(date.getDate() + days);

    this.autoReleaseDate = date;

    return await this.save();
  };

/*
  Disable Auto Release
*/
escrowSchema.methods.disableAutoRelease =
  async function () {
    this.autoRelease = false;

    this.autoReleaseDate = null;

    return await this.save();
  };

/*
  Enable Auto Release
*/
escrowSchema.methods.enableAutoRelease =
  async function (days = 7) {
    this.autoRelease = true;

    const date = new Date();

    date.setDate(date.getDate() + days);

    this.autoReleaseDate = date;

    return await this.save();
  };

/*
  Check if escrow is eligible for release
*/
escrowSchema.methods.canBeReleased =
  function () {
    return (
      !this.disputeRaised &&
      !this.suspended &&
      !this.deletedAt &&
      (
        this.status === "holding" ||
        this.status ===
          "partially_released"
      )
    );
  };

/*
  Check if escrow can be refunded
*/
escrowSchema.methods.canBeRefunded =
  function () {
    return (
      !this.deletedAt &&
      this.status !== "released" &&
      this.status !== "cancelled" &&
      this.status !== "refunded"
    );
  };

/*
  Serialize Summary
*/
escrowSchema.methods.toSummary =
  function () {
    return {
      id: this._id,

      payment: this.payment,

      proposal: this.proposal,

      gig: this.gig,

      client: this.client,

      freelancer: this.freelancer,

      status: this.status,

      totalAmount: this.totalAmount,

      freelancerAmount:
        this.freelancerAmount,

      platformFee:
        this.platformFee,

      releasedAmount:
        this.releasedAmount,

      remainingAmount:
        this.remainingAmount,

      refundedAmount:
        this.refundedAmount,

      released: this.released,

      refunded: this.refunded,

      disputeRaised:
        this.disputeRaised,

      suspended:
        this.suspended,

      autoRelease:
        this.autoRelease,

      autoReleaseDate:
        this.autoReleaseDate,

      releasedAt:
        this.releasedAt,

      refundedAt:
        this.refundedAt,

      createdAt:
        this.createdAt,
    };
  };

/* ==========================================================
   PRE SAVE MIDDLEWARE
========================================================== */

escrowSchema.pre("save", function (next) {
  /*
    Prevent negative values
  */

  this.totalAmount = Math.max(
    0,
    this.totalAmount
  );

  this.platformFee = Math.max(
    0,
    this.platformFee
  );

  this.freelancerAmount = Math.max(
    0,
    this.freelancerAmount
  );

  this.releasedAmount = Math.max(
    0,
    this.releasedAmount
  );

  this.remainingAmount = Math.max(
    0,
    this.remainingAmount
  );

  this.refundedAmount = Math.max(
    0,
    this.refundedAmount
  );

  /*
    Keep released flag synced
  */

  this.released =
    this.status === "released";

  /*
    Keep refunded flag synced
  */

  this.refunded =
    this.status === "refunded";

  /*
    Ensure remaining amount
  */

  if (
    this.releasedAmount >
    this.freelancerAmount
  ) {
    this.releasedAmount =
      this.freelancerAmount;
  }

  this.remainingAmount =
    this.freelancerAmount -
    this.releasedAmount;

  next();
});

/* ==========================================================
   MODEL
========================================================== */

const Escrow = mongoose.model(
  "Escrow",
  escrowSchema
);

export default Escrow;