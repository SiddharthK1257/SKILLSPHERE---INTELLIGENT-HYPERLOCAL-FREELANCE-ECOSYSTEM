import mongoose from "mongoose";
import crypto from "crypto";
import Razorpay from "razorpay";

import Payment from "../models/Payment.js";
import Proposal from "../models/Proposal.js";
import Escrow from "../models/Escrow.js";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";

/* ==========================================================
   RAZORPAY CONFIGURATION
========================================================== */

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ==========================================================
   PLATFORM SETTINGS
========================================================== */

const PLATFORM_FEE_PERCENT = 10;
const AUTO_RELEASE_DAYS = 7;

/* ==========================================================
   HELPER FUNCTIONS
========================================================== */

const calculatePlatformFee = (amount) =>
  Number(((amount * PLATFORM_FEE_PERCENT) / 100).toFixed(2));

const calculateFreelancerAmount = (amount) =>
  Number((amount - calculatePlatformFee(amount)).toFixed(2));

const generateReceipt = () =>
  `SS_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;

/* ==========================================================
   CREATE PAYMENT ORDER
========================================================== */

export const createOrder = async (req, res) => {
  try {
    const { proposalId } = req.body;

    /* ==========================================
       VALIDATION
    ========================================== */

    if (!proposalId) {
      return res.status(400).json({
        success: false,
        message: "Proposal ID is required.",
      });
    }

    /* ==========================================
       FETCH PROPOSAL
    ========================================== */

    const proposal = await Proposal.findById(proposalId)
      .populate("client", "name email")
      .populate("freelancer", "name email")
      .populate("gig", "title");

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found.",
      });
    }

    /* ==========================================
       AUTHORIZATION
    ========================================== */

    console.log("Logged in user:", req.user);
console.log("Proposal client:", proposal.client);
console.log("req.user._id:", req.user._id.toString());
console.log("proposal.client._id:", proposal.client._id.toString());

    if (
      proposal.client._id.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Only the client can make payment.",
      });
    }

    /* ==========================================
       PROPOSAL STATUS CHECK
    ========================================== */

    if (proposal.status !== "accepted") {
      return res.status(400).json({
        success: false,
        message:
          "Only accepted proposals can be paid.",
      });
    }

    /* ==========================================
       CHECK EXISTING PAYMENT
    ========================================== */

    const existingPayment = await Payment.findOne({
      proposal: proposal._id,
      paymentStatus: {
        $in: [
          "pending",
          "escrow",
          "completed",
        ],
      },
    });

    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message:
          "Payment already exists for this proposal.",
      });
    }

    /* ==========================================
       CALCULATE PAYMENT
    ========================================== */

    const amount = proposal.bidAmount;

    const platformFee =
      calculatePlatformFee(amount);

    const freelancerAmount =
      calculateFreelancerAmount(amount);

    /* ==========================================
       CREATE RAZORPAY ORDER
    ========================================== */

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: generateReceipt(),
      payment_capture: 1,
    });

    /* ==========================================
       SAVE PAYMENT
    ========================================== */

    const payment = await Payment.create({
      client: proposal.client._id,
      freelancer: proposal.freelancer._id,
      proposal: proposal._id,
      gig: proposal.gig._id,

      amount,
      currency: "INR",

      paymentMethod: "razorpay",

      paymentStatus: "pending",

      razorpayOrderId: order.id,

      platformFee,

      freelancerAmount,
    });

    /* ==========================================
       RESPONSE
    ========================================== */

    return res.status(201).json({
      success: true,
      message: "Payment order created successfully.",

      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },

      payment,
    });

  } catch (error) {

    console.error("CREATE ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create payment order.",
      error: error.message,
    });

  }
};
/* ==========================================================
   VERIFY PAYMENT
========================================================== */

export const verifyPayment = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    /* ==========================================
       VALIDATION
    ========================================== */

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      throw new Error("Invalid payment details.");
    }

    /* ==========================================
       VERIFY SIGNATURE
    ========================================== */

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw new Error("Invalid Razorpay signature.");
    }

    /* ==========================================
       FIND PAYMENT
    ========================================== */

    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
    }).session(session);

    if (!payment) {
      throw new Error("Payment not found.");
    }

    if (payment.paymentStatus !== "pending") {
      throw new Error("Payment already verified.");
    }

    /* ==========================================
       UPDATE PAYMENT
    ========================================== */

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;

    payment.paymentStatus = "escrow";
    payment.paidAt = new Date();

    await payment.save({ session });

    /* ==========================================
       CREATE ESCROW
    ========================================== */

    const escrow = await Escrow.create(
      [
        {
          payment: payment._id,

          proposal: payment.proposal,

          gig: payment.gig,

          client: payment.client,

          freelancer: payment.freelancer,

          totalAmount: payment.amount,

          platformFee: payment.platformFee,

          freelancerAmount:
            payment.freelancerAmount,

          releasedAmount: 0,

          remainingAmount:
            payment.freelancerAmount,

          status: "holding",

          autoRelease: true,

          autoReleaseDate: new Date(
            Date.now() +
              AUTO_RELEASE_DAYS *
                24 *
                60 *
                60 *
                1000
          ),
        },
      ],
      { session }
    );

    /* ==========================================
       FREELANCER WALLET
    ========================================== */

    let wallet = await Wallet.findOne({
      user: payment.freelancer,
    }).session(session);

    if (!wallet) {
      const wallets = await Wallet.create(
        [
          {
            user: payment.freelancer,
          },
        ],
        { session }
      );

      wallet = wallets[0];
    }

    wallet.pendingBalance +=
      payment.freelancerAmount;

    wallet.totalTransactions += 1;

    await wallet.save({ session });

    /* ==========================================
       CLIENT TRANSACTION
    ========================================== */

    await Transaction.create(
      [
        {
          user: payment.client,

          payment: payment._id,

          escrow: escrow[0]._id,

          proposal: payment.proposal,

          gig: payment.gig,

          type: "escrow",

          amount: payment.amount,

          status: "completed",

          gateway: "razorpay",

          gatewayTransactionId:
            razorpay_payment_id,

          title: "Escrow Deposit",

          description:
            "Client deposited payment into escrow.",

          processedAt: new Date(),
        },
      ],
      { session }
    );

    /* ==========================================
       FREELANCER TRANSACTION
    ========================================== */

    await Transaction.create(
      [
        {
          user: payment.freelancer,

          payment: payment._id,

          escrow: escrow[0]._id,

          proposal: payment.proposal,

          gig: payment.gig,

          type: "deposit",

          amount:
            payment.freelancerAmount,

          status: "pending",

          gateway: "wallet",

          title: "Escrow Credit",

          description:
            "Funds are securely held in escrow.",

          processedAt: new Date(),
        },
      ],
      { session }
    );

    /* ==========================================
       UPDATE PROPOSAL
    ========================================== */

    await Proposal.findByIdAndUpdate(
      payment.proposal,
      {
        paymentStatus: "paid",
      },
      { session }
    );

    /* ==========================================
       COMMIT
    ========================================== */

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message:
        "Payment verified successfully.",

      payment,

      escrow: escrow[0],
    });

  } catch (error) {

    await session.abortTransaction();

    console.error(
      "VERIFY PAYMENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  } finally {

    session.endSession();

  }
};
/* ==========================================================
   RELEASE ESCROW
========================================================== */

export const releaseEscrow = async (req, res) => {
  const session = await mongoose.startSession();

  try {

    session.startTransaction();

    const { paymentId } = req.params;

    /* ==========================================
       FIND PAYMENT
    ========================================== */

    const payment = await Payment.findById(paymentId)
      .session(session);

    if (!payment) {
      throw new Error("Payment not found.");
    }

    if (payment.paymentStatus !== "escrow") {
      throw new Error(
        "Payment is not currently in escrow."
      );
    }

    /* ==========================================
       FIND ESCROW
    ========================================== */

    const escrow = await Escrow.findOne({
      payment: payment._id,
    }).session(session);

    if (!escrow) {
      throw new Error("Escrow not found.");
    }

    if (escrow.status !== "holding") {
      throw new Error(
        "Escrow has already been released."
      );
    }

    /* ==========================================
       GET WALLET
    ========================================== */

    let wallet = await Wallet.findOne({
      user: payment.freelancer,
    }).session(session);

    if (!wallet) {
      const wallets = await Wallet.create(
        [
          {
            user: payment.freelancer,
          },
        ],
        { session }
      );

      wallet = wallets[0];
    }

    const previousBalance =
      wallet.availableBalance;

    /* ==========================================
       UPDATE WALLET
    ========================================== */

    wallet.pendingBalance = Math.max(
      wallet.pendingBalance -
        escrow.freelancerAmount,
      0
    );

    wallet.availableBalance +=
      escrow.freelancerAmount;

    wallet.totalEarnings +=
      escrow.freelancerAmount;

    wallet.totalTransactions += 1;

    await wallet.save({ session });

    /* ==========================================
       UPDATE ESCROW
    ========================================== */

    escrow.status = "released";

    escrow.releasedAmount =
      escrow.freelancerAmount;

    escrow.remainingAmount = 0;

    escrow.releasedAt = new Date();

    escrow.releasedBy = req.user._id;

    await escrow.save({ session });

    /* ==========================================
       UPDATE PAYMENT
    ========================================== */

    payment.paymentStatus = "completed";

    payment.completedAt = new Date();

    await payment.save({ session });

    /* ==========================================
       FREELANCER TRANSACTION
    ========================================== */

    await Transaction.create(
      [
        {
          user: payment.freelancer,

          payment: payment._id,

          escrow: escrow._id,

          proposal: payment.proposal,

          gig: payment.gig,

          type: "release",

          amount:
            escrow.freelancerAmount,

          status: "completed",

          gateway: "wallet",

          title: "Escrow Released",

          description:
            "Escrow funds released to freelancer.",

          previousBalance,

          currentBalance:
            wallet.availableBalance,

          processedAt: new Date(),
        },
      ],
      { session }
    );

    /* ==========================================
       UPDATE PROPOSAL
    ========================================== */

    await Proposal.findByIdAndUpdate(
      payment.proposal,
      {
        paymentStatus: "completed",
      },
      { session }
    );

    /* ==========================================
       COMMIT TRANSACTION
    ========================================== */

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message:
        "Escrow released successfully.",

      wallet,

      escrow,

      payment,
    });

  } catch (error) {

    await session.abortTransaction();

    console.error(
      "RELEASE ESCROW ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  } finally {

    session.endSession();

  }
};
/* ==========================================================
   REFUND PAYMENT
========================================================== */

export const refundPayment = async (req, res) => {
  const session = await mongoose.startSession();

  try {

    session.startTransaction();

    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId)
      .session(session);

    if (!payment) {
      throw new Error("Payment not found.");
    }

    if (payment.paymentStatus === "refunded") {
      throw new Error("Payment already refunded.");
    }

    /* ==========================================
       FIND ESCROW
    ========================================== */

    const escrow = await Escrow.findOne({
      payment: payment._id,
    }).session(session);

    /* ==========================================
       UPDATE WALLET
    ========================================== */

    const wallet = await Wallet.findOne({
      user: payment.freelancer,
    }).session(session);

    if (wallet && escrow) {

      wallet.pendingBalance = Math.max(
        wallet.pendingBalance -
          escrow.freelancerAmount,
        0
      );

      await wallet.save({ session });

    }

    /* ==========================================
       UPDATE ESCROW
    ========================================== */

    if (escrow) {

      escrow.status = "refunded";

      escrow.refunded = true;

      escrow.refundedAmount =
        escrow.totalAmount;

      escrow.refundedAt = new Date();

      await escrow.save({ session });

    }

    /* ==========================================
       UPDATE PAYMENT
    ========================================== */

    payment.paymentStatus = "refunded";

    payment.refundedAt = new Date();

    await payment.save({ session });

    /* ==========================================
       CLIENT TRANSACTION
    ========================================== */

    await Transaction.create(
      [
        {
          user: payment.client,

          payment: payment._id,

          escrow: escrow?._id,

          proposal: payment.proposal,

          gig: payment.gig,

          type: "refund",

          amount: payment.amount,

          status: "completed",

          gateway: "razorpay",

          title: "Refund",

          description:
            "Payment refunded successfully.",

          processedAt: new Date(),
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message:
        "Payment refunded successfully.",
    });

  } catch (error) {

    await session.abortTransaction();

    console.error(
      "REFUND PAYMENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  } finally {

    session.endSession();

  }
};

/* ==========================================================
   GET WALLET
========================================================== */

export const getWallet = async (req, res) => {

  try {

    let wallet = await Wallet.findOne({
      user: req.user._id,
    });

    if (!wallet) {

      wallet = await Wallet.create({
        user: req.user._id,
      });

    }

    return res.status(200).json({
      success: true,
      wallet,
    });

  } catch (error) {

    console.error(
      "GET WALLET ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

/* ==========================================================
   REQUEST WITHDRAWAL
========================================================== */

export const requestWithdrawal = async (
  req,
  res
) => {

  try {

    const {
      amount,
      method = "Bank",
    } = req.body;

    if (!amount || amount <= 0) {

      return res.status(400).json({
        success: false,
        message:
          "Invalid withdrawal amount.",
      });

    }

    const wallet = await Wallet.findOne({
      user: req.user._id,
    });

    if (!wallet) {

      return res.status(404).json({
        success: false,
        message: "Wallet not found.",
      });

    }

    if (
      wallet.availableBalance < amount
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Insufficient balance.",
      });

    }

    const previousBalance =
      wallet.availableBalance;

    wallet.availableBalance -= amount;

    wallet.totalWithdrawn += amount;

    wallet.totalTransactions += 1;

    wallet.withdrawals.push({
      amount,
      method,
      status: "pending",
      requestedAt: new Date(),
    });

    await wallet.save();

    await Transaction.create({

      user: req.user._id,

      type: "withdrawal",

      amount,

      status: "pending",

      gateway: "wallet",

      title: "Withdrawal Request",

      description:
        "Withdrawal request submitted.",

      previousBalance,

      currentBalance:
        wallet.availableBalance,

      processedAt: new Date(),

    });

    return res.status(200).json({

      success: true,

      message:
        "Withdrawal request submitted successfully.",

      wallet,

    });

  } catch (error) {

    console.error(
      "WITHDRAWAL ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};
/* ==========================================================
   GET SINGLE PAYMENT
========================================================== */

export const getPayment = async (req, res) => {
  try {

    const payment = await Payment.findById(req.params.id)
      .populate("client", "name email profileImage")
      .populate("freelancer", "name email profileImage")
      .populate("gig", "title category")
      .populate("proposal");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    return res.status(200).json({
      success: true,
      payment,
    });

  } catch (error) {

    console.error("GET PAYMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/* ==========================================================
   PAYMENT HISTORY
========================================================== */

export const getPaymentHistory = async (req, res) => {
  try {

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const filter = {
      $or: [
        { client: req.user._id },
        { freelancer: req.user._id },
      ],
    };

    const total = await Payment.countDocuments(filter);

    const payments = await Payment.find(filter)
      .populate("client", "name")
      .populate("freelancer", "name")
      .populate("gig", "title")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({

      success: true,

      page,

      pages: Math.ceil(total / limit),

      total,

      payments,

    });

  } catch (error) {

    console.error(
      "PAYMENT HISTORY ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }
};

/* ==========================================================
   PAYMENT STATUS
========================================================== */

export const getPaymentStatus = async (req, res) => {

  try {

    const payment = await Payment.findById(
      req.params.id
    );

    if (!payment) {

      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });

    }

    return res.status(200).json({

      success: true,

      paymentStatus:
        payment.paymentStatus,

      paidAt: payment.paidAt,

      completedAt:
        payment.completedAt,

      refundedAt:
        payment.refundedAt,

    });

  } catch (error) {

    console.error(
      "PAYMENT STATUS ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

/* ==========================================================
   GET MY PAYMENTS
========================================================== */

export const getMyPayments = async (
  req,
  res
) => {

  try {

    const payments = await Payment.find({

      $or: [
        { client: req.user._id },
        { freelancer: req.user._id },
      ],

    })
      .populate(
        "client",
        "name email profileImage"
      )
      .populate(
        "freelancer",
        "name email profileImage"
      )
      .populate(
        "gig",
        "title category"
      )
      .populate("proposal")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({

      success: true,

      count: payments.length,

      payments,

    });

  } catch (error) {

    console.error(
      "MY PAYMENTS ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

/* ==========================================================
   GET ALL PAYMENTS (ADMIN)
========================================================== */

export const getAllPayments = async (
  req,
  res
) => {

  try {

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    const total =
      await Payment.countDocuments();

    const payments = await Payment.find()

      .populate("client", "name email")

      .populate(
        "freelancer",
        "name email"
      )

      .populate("gig", "title")

      .sort({
        createdAt: -1,
      })

      .skip(skip)

      .limit(limit);

    return res.status(200).json({

      success: true,

      page,

      pages:
        Math.ceil(total / limit),

      total,

      payments,

    });

  } catch (error) {

    console.error(
      "GET ALL PAYMENTS ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};
/* ==========================================================
   GET SINGLE ESCROW
========================================================== */

export const getEscrow = async (req, res) => {
  try {
    const escrow = await Escrow.findOne({
      payment: req.params.id,
    })
      .populate("payment")
      .populate("client", "name email profileImage")
      .populate("freelancer", "name email profileImage")
      .populate("gig", "title category")
      .populate("proposal");

    if (!escrow) {
      return res.status(404).json({
        success: false,
        message: "Escrow not found",
      });
    }

    res.status(200).json({
      success: true,
      escrow,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ==========================================================
   GET ALL ESCROWS
========================================================== */

export const getEscrows = async (req, res) => {
  try {

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const filter = {
      $or: [
        { client: req.user._id },
        { freelancer: req.user._id },
      ],
    };

    const total = await Escrow.countDocuments(filter);

    const escrows = await Escrow.find(filter)
      .populate("payment")
      .populate("client", "name")
      .populate("freelancer", "name")
      .populate("gig", "title")
      .populate("proposal")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({

      success: true,

      page,

      pages: Math.ceil(total / limit),

      total,

      escrows,

    });

  } catch (error) {

    console.error("GET ESCROWS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/* ==========================================================
   GET TRANSACTIONS
========================================================== */

export const getTransactions = async (req, res) => {
  try {

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    const filter = {
      user: req.user._id,
    };

    const total = await Transaction.countDocuments(filter);

    const transactions = await Transaction.find(filter)

      .populate("gig", "title")

      .populate("proposal")

      .populate("payment")

      .populate("escrow")

      .sort({
        createdAt: -1,
      })

      .skip(skip)

      .limit(limit);

    return res.status(200).json({

      success: true,

      page,

      pages: Math.ceil(total / limit),

      total,

      transactions,

    });

  } catch (error) {

    console.error(
      "GET TRANSACTIONS ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};