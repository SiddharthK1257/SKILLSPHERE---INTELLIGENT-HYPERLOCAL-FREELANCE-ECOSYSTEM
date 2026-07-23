import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/* ==========================================================
   WITHDRAWAL SCHEMA
========================================================== */

const withdrawalSchema = new mongoose.Schema(
  {
    /* ======================================================
       AMOUNT
    ====================================================== */

    amount: {
      type: Number,
      required: [true, "Withdrawal amount is required"],
      min: [1, "Amount must be greater than zero"],
    },

    currency: {
      type: String,
      enum: ["INR"],
      default: "INR",
      uppercase: true,
    },

    /* ======================================================
       WITHDRAWAL METHOD
    ====================================================== */

    method: {
      type: String,
      enum: ["bank", "upi", "paypal"],
      required: [true, "Withdrawal method is required"],
      lowercase: true,
      trim: true,
    },

    /* ======================================================
       BANK DETAILS

       These are saved as a snapshot of the details used
       when the withdrawal was created.
    ====================================================== */

    accountName: {
      type: String,
      trim: true,
      default: "",
      maxlength: 100,
    },

    accountNumber: {
      type: String,
      trim: true,
      default: "",
      maxlength: 30,
    },

    ifscCode: {
      type: String,
      trim: true,
      uppercase: true,
      default: "",
      maxlength: 20,
    },

    /* ======================================================
       UPI
    ====================================================== */

    upiId: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
      maxlength: 100,
    },

    /* ======================================================
       PAYPAL
    ====================================================== */

    paypalEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
      maxlength: 254,
    },

    /* ======================================================
       PROCESSING INFORMATION
    ====================================================== */

    referenceId: {
      type: String,
      trim: true,
      default: null,
      index: true,
    },

    gatewayTransactionId: {
      type: String,
      trim: true,
      default: null,
      index: true,
    },

    /* ======================================================
       STATUS
    ====================================================== */

    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "completed",
        "rejected",
        "cancelled",
      ],
      default: "pending",
      lowercase: true,
      trim: true,
      index: true,
    },

    /* ======================================================
       REJECTION
    ====================================================== */

    rejectionReason: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
    },

    /* ======================================================
       NOTES
    ====================================================== */

    notes: {
      type: String,
      trim: true,
      default: "",
      maxlength: 2000,
    },

    /* ======================================================
       DATES
    ====================================================== */

    requestedAt: {
      type: Date,
      default: Date.now,
    },

    processedAt: {
      type: Date,
      default: null,
    },
  },
  {
    _id: true,
    timestamps: true,
  }
);

/* ==========================================================
   WALLET SCHEMA
========================================================== */

const walletSchema = new mongoose.Schema(
  {
    /* ======================================================
       OWNER
    ====================================================== */

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Wallet user is required"],
      unique: true,
      index: true,
    },

    /* ======================================================
       BALANCES

       availableBalance:
       Money the freelancer can withdraw.

       pendingBalance:
       Freelancer earnings waiting for escrow release.

       escrowBalance:
       Optional reporting value for money currently held
       in escrow.

       IMPORTANT:
       In your current Payment Controller, freelancer
       earnings are added to pendingBalance.

       Therefore, totalBalance is calculated as:

       availableBalance + pendingBalance

       escrowBalance should not be counted again.
    ====================================================== */

    availableBalance: {
      type: Number,
      default: 0,
      min: [0, "Available balance cannot be negative"],
    },

    pendingBalance: {
      type: Number,
      default: 0,
      min: [0, "Pending balance cannot be negative"],
    },

    escrowBalance: {
      type: Number,
      default: 0,
      min: [0, "Escrow balance cannot be negative"],
    },

    totalBalance: {
      type: Number,
      default: 0,
      min: [0, "Total balance cannot be negative"],
    },

    /* ======================================================
       EARNINGS STATISTICS
    ====================================================== */

    totalEarnings: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalWithdrawn: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalDeposits: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalRefunds: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalTransactions: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalEscrowReceived: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalReleased: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* ======================================================
       DATES
    ====================================================== */

    lastTransactionAt: {
      type: Date,
      default: null,
    },

    lastWithdrawalAt: {
      type: Date,
      default: null,
    },

    /* ======================================================
       WITHDRAWALS
    ====================================================== */

    withdrawals: {
      type: [withdrawalSchema],
      default: [],
    },

    /* ======================================================
       BANK DETAILS
    ====================================================== */

    bankDetails: {
      accountHolderName: {
        type: String,
        trim: true,
        default: "",
        maxlength: 100,
      },

      bankName: {
        type: String,
        trim: true,
        default: "",
        maxlength: 100,
      },

      accountNumber: {
        type: String,
        trim: true,
        default: "",
        maxlength: 30,
      },

      ifscCode: {
        type: String,
        trim: true,
        uppercase: true,
        default: "",
        maxlength: 20,
      },

      branch: {
        type: String,
        trim: true,
        default: "",
        maxlength: 100,
      },

      verified: {
        type: Boolean,
        default: false,
      },
    },

    /* ======================================================
       UPI DETAILS
    ====================================================== */

    upi: {
      upiId: {
        type: String,
        trim: true,
        lowercase: true,
        default: "",
        maxlength: 100,
      },

      verified: {
        type: Boolean,
        default: false,
      },
    },

    /* ======================================================
       ACCOUNT STATUS
    ====================================================== */

    status: {
      type: String,
      enum: ["active", "suspended", "blocked"],
      default: "active",
      lowercase: true,
      index: true,
    },

    isFrozen: {
      type: Boolean,
      default: false,
      index: true,
    },

    freezeReason: {
      type: String,
      trim: true,
      default: "",
      maxlength: 500,
    },

    /* ======================================================
       SECURITY
    ====================================================== */

    pinEnabled: {
      type: Boolean,
      default: false,
    },

    walletPin: {
      type: String,
      select: false,
    },

    /* ======================================================
       NOTES
    ====================================================== */

    notes: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
    },
  },
  {
    timestamps: true,

    toJSON: {
      virtuals: true,

      transform(doc, ret) {
        delete ret.__v;
        delete ret.walletPin;

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

walletSchema.virtual("canWithdraw").get(function () {
  return (
    this.availableBalance > 0 &&
    !this.isFrozen &&
    this.status === "active"
  );
});

/*
  Do NOT add escrowBalance again here if it represents
  the same funds as pendingBalance.
*/

walletSchema.virtual("totalAssets").get(function () {
  return (
    this.availableBalance +
    this.pendingBalance
  );
});

walletSchema.virtual("hasPendingWithdrawals").get(
  function () {
    return this.withdrawals.some((withdrawal) =>
      ["pending", "processing"].includes(
        withdrawal.status
      )
    );
  }
);

walletSchema.virtual("pendingWithdrawals").get(
  function () {
    return this.withdrawals.filter((withdrawal) =>
      ["pending", "processing"].includes(
        withdrawal.status
      )
    );
  }
);

walletSchema.virtual("completedWithdrawals").get(
  function () {
    return this.withdrawals.filter(
      (withdrawal) =>
        withdrawal.status === "completed"
    );
  }
);

/* ==========================================================
   PRE VALIDATE
========================================================== */

walletSchema.pre("validate", function (next) {
  const wallet = this;

  /* --------------------------------------------------------
     KEEP BALANCES NON-NEGATIVE
  -------------------------------------------------------- */

  wallet.availableBalance = Math.max(
    0,
    Number(wallet.availableBalance) || 0
  );

  wallet.pendingBalance = Math.max(
    0,
    Number(wallet.pendingBalance) || 0
  );

  wallet.escrowBalance = Math.max(
    0,
    Number(wallet.escrowBalance) || 0
  );

  /* --------------------------------------------------------
     TOTAL BALANCE

     pendingBalance already represents funds that are
     not yet available.

     Do not double-count escrowBalance.
  -------------------------------------------------------- */

  wallet.totalBalance =
    wallet.availableBalance +
    wallet.pendingBalance;

  next();
});

/* ==========================================================
   WALLET PIN HASHING
========================================================== */

walletSchema.pre("save", async function (next) {
  if (
    !this.isModified("walletPin") ||
    !this.walletPin
  ) {
    return next();
  }

  const salt = await bcrypt.genSalt(12);

  this.walletPin = await bcrypt.hash(
    this.walletPin,
    salt
  );

  next();
});

/* ==========================================================
   INSTANCE METHODS
========================================================== */

/* ----------------------------------------------------------
   COMPARE WALLET PIN
---------------------------------------------------------- */

walletSchema.methods.compareWalletPin =
  async function (pin) {
    if (!this.walletPin) {
      return false;
    }

    return await bcrypt.compare(
      pin,
      this.walletPin
    );
  };

/* ----------------------------------------------------------
   DEPOSIT
---------------------------------------------------------- */

walletSchema.methods.deposit =
  async function (amount) {
    const value = Number(amount);

    if (!Number.isFinite(value) || value <= 0) {
      throw new Error(
        "Deposit amount must be greater than zero."
      );
    }

    this.availableBalance += value;

    this.totalDeposits += value;

    this.totalTransactions += 1;

    this.lastTransactionAt = new Date();

    return await this.save();
  };

/* ----------------------------------------------------------
   HOLD FUNDS IN ESCROW
---------------------------------------------------------- */

walletSchema.methods.holdFunds =
  async function (amount) {
    const value = Number(amount);

    if (!Number.isFinite(value) || value <= 0) {
      throw new Error(
        "Escrow amount must be greater than zero."
      );
    }

    /*
      Your current payment flow uses pendingBalance
      as the freelancer's escrow-held amount.
    */

    this.pendingBalance += value;

    this.totalEscrowReceived += value;

    this.totalTransactions += 1;

    this.lastTransactionAt = new Date();

    return await this.save();
  };

/* ----------------------------------------------------------
   RELEASE ESCROW FUNDS
---------------------------------------------------------- */

walletSchema.methods.releaseFunds =
  async function (amount) {
    const value = Number(amount);

    if (!Number.isFinite(value) || value <= 0) {
      throw new Error(
        "Release amount must be greater than zero."
      );
    }

    if (this.pendingBalance < value) {
      throw new Error(
        "Insufficient pending balance."
      );
    }

    this.pendingBalance -= value;

    this.availableBalance += value;

    this.totalReleased += value;

    this.totalEarnings += value;

    this.totalTransactions += 1;

    this.lastTransactionAt = new Date();

    return await this.save();
  };

/* ----------------------------------------------------------
   REFUND ESCROW FUNDS
---------------------------------------------------------- */

walletSchema.methods.refundFunds =
  async function (amount) {
    const value = Number(amount);

    if (!Number.isFinite(value) || value <= 0) {
      throw new Error(
        "Refund amount must be greater than zero."
      );
    }

    if (this.pendingBalance < value) {
      throw new Error(
        "Insufficient pending balance."
      );
    }

    this.pendingBalance -= value;

    this.totalRefunds += value;

    this.totalTransactions += 1;

    this.lastTransactionAt = new Date();

    return await this.save();
  };

/* ----------------------------------------------------------
   WITHDRAW MONEY
---------------------------------------------------------- */

walletSchema.methods.withdraw =
  async function (amount) {
    const value = Number(amount);

    if (!Number.isFinite(value) || value <= 0) {
      throw new Error(
        "Withdrawal amount must be greater than zero."
      );
    }

    if (this.isFrozen) {
      throw new Error(
        "Wallet is currently frozen."
      );
    }

    if (this.status !== "active") {
      throw new Error(
        "Wallet is not active."
      );
    }

    if (this.availableBalance < value) {
      throw new Error(
        "Insufficient available balance."
      );
    }

    this.availableBalance -= value;

    this.totalWithdrawn += value;

    this.totalTransactions += 1;

    this.lastWithdrawalAt = new Date();

    this.lastTransactionAt = new Date();

    return await this.save();
  };

/* ----------------------------------------------------------
   FREEZE WALLET
---------------------------------------------------------- */

walletSchema.methods.freezeWallet =
  async function (reason = "") {
    this.isFrozen = true;

    this.status = "blocked";

    this.freezeReason = reason.trim();

    return await this.save();
  };

/* ----------------------------------------------------------
   UNFREEZE WALLET
---------------------------------------------------------- */

walletSchema.methods.unfreezeWallet =
  async function () {
    this.isFrozen = false;

    this.status = "active";

    this.freezeReason = "";

    return await this.save();
  };

/* ----------------------------------------------------------
   ADD WITHDRAWAL REQUEST
---------------------------------------------------------- */

walletSchema.methods.addWithdrawal =
  async function (withdrawalData) {
    if (this.isFrozen) {
      throw new Error(
        "Frozen wallets cannot request withdrawals."
      );
    }

    if (this.status !== "active") {
      throw new Error(
        "Wallet is not active."
      );
    }

    if (
      !withdrawalData ||
      !withdrawalData.amount
    ) {
      throw new Error(
        "Withdrawal amount is required."
      );
    }

    const amount = Number(
      withdrawalData.amount
    );

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      throw new Error(
        "Invalid withdrawal amount."
      );
    }

    if (this.availableBalance < amount) {
      throw new Error(
        "Insufficient available balance."
      );
    }

    /*
      Reserve the money immediately.

      This prevents the same money from being withdrawn
      twice while the request is pending.
    */

    this.availableBalance -= amount;

    this.totalWithdrawn += amount;

    this.totalTransactions += 1;

    this.lastWithdrawalAt = new Date();

    this.lastTransactionAt = new Date();

    this.withdrawals.push({
      ...withdrawalData,
      amount,
      status: "pending",
      requestedAt: new Date(),
    });

    return await this.save();
  };

/* ==========================================================
   PROCESS WITHDRAWAL
========================================================== */

walletSchema.methods.processWithdrawal =
  async function (
    withdrawalId,
    status,
    referenceId = "",
    notes = "",
    rejectionReason = ""
  ) {
    const withdrawal =
      this.withdrawals.id(withdrawalId);

    if (!withdrawal) {
      throw new Error(
        "Withdrawal request not found."
      );
    }

    const allowedStatuses = [
      "pending",
      "processing",
      "completed",
      "rejected",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      throw new Error(
        "Invalid withdrawal status."
      );
    }

    /* ------------------------------------------------------
       PREVENT DUPLICATE PROCESSING
    ------------------------------------------------------ */

    if (
      ["completed", "rejected", "cancelled"].includes(
        withdrawal.status
      )
    ) {
      throw new Error(
        "This withdrawal has already been finalized."
      );
    }

    /* ------------------------------------------------------
       REJECT / CANCEL

       Money was already reserved when withdrawal was
       created, so return it to available balance.
    ------------------------------------------------------ */

    if (
      ["rejected", "cancelled"].includes(status)
    ) {
      this.availableBalance += withdrawal.amount;

      this.totalWithdrawn = Math.max(
        0,
        this.totalWithdrawn -
          withdrawal.amount
      );

      if (status === "rejected") {
        withdrawal.rejectionReason =
          rejectionReason.trim();
      }
    }

    withdrawal.status = status;

    withdrawal.referenceId =
      referenceId || withdrawal.referenceId;

    withdrawal.notes =
      notes || withdrawal.notes;

    if (
      ["processing", "completed", "rejected", "cancelled"].includes(
        status
      )
    ) {
      withdrawal.processedAt = new Date();
    }

    this.lastTransactionAt = new Date();

    return await this.save();
  };

/* ==========================================================
   STATIC METHODS
========================================================== */

/* ----------------------------------------------------------
   FIND WALLET BY USER
---------------------------------------------------------- */

walletSchema.statics.findByUser =
  function (userId) {
    return this.findOne({
      user: userId,
    });
  };

/* ----------------------------------------------------------
   GET RICHEST USERS
---------------------------------------------------------- */

walletSchema.statics.getRichestUsers =
  function (limit = 10) {
    const safeLimit = Math.min(
      Math.max(Number(limit) || 10, 1),
      100
    );

    return this.find({
      status: "active",
    })
      .sort({
        totalEarnings: -1,
      })
      .limit(safeLimit);
  };

/* ----------------------------------------------------------
   GET FROZEN WALLETS
---------------------------------------------------------- */

walletSchema.statics.getFrozenWallets =
  function () {
    return this.find({
      isFrozen: true,
    }).sort({
      updatedAt: -1,
    });
  };

/* ----------------------------------------------------------
   GET ACTIVE WALLETS
---------------------------------------------------------- */

walletSchema.statics.getActiveWallets =
  function () {
    return this.find({
      status: "active",
      isFrozen: false,
    });
  };

/* ----------------------------------------------------------
   GET WALLETS WITH PENDING WITHDRAWALS
---------------------------------------------------------- */

walletSchema.statics.getWalletsWithPendingWithdrawals =
  function () {
    return this.find({
      "withdrawals.status": {
        $in: ["pending", "processing"],
      },
    });
  };

/* ==========================================================
   INDEXES
========================================================== */

walletSchema.index({
  user: 1,
});

walletSchema.index({
  status: 1,
  isFrozen: 1,
});

walletSchema.index({
  availableBalance: -1,
});

walletSchema.index({
  totalEarnings: -1,
});

walletSchema.index({
  createdAt: -1,
});

walletSchema.index({
  lastTransactionAt: -1,
});

walletSchema.index({
  lastWithdrawalAt: -1,
});

walletSchema.index({
  "withdrawals.status": 1,
});

/* ==========================================================
   MODEL
========================================================== */

const Wallet = mongoose.model(
  "Wallet",
  walletSchema
);

export default Wallet;