import express from "express";

import {
  createOrder,
  verifyPayment,
  releaseEscrow,
  refundPayment,
  getWallet,
  getTransactions,
  requestWithdrawal,
  getPayment,
  getPaymentHistory,
  getPaymentStatus,
  getMyPayments,
  getAllPayments,
  getEscrow,
  getEscrows,
} from "../controllers/paymentController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* ==========================================================
   AUTHENTICATION
   Every payment route requires login
========================================================== */

router.use(protect);

/* ==========================================================
   RAZORPAY PAYMENT ROUTES
========================================================== */

/**
 * CREATE RAZORPAY ORDER
 *
 * Only CLIENT can create a payment order.
 *
 * Flow:
 *
 * Client
 *   ↓
 * createOrder()
 *   ↓
 * Razorpay Order
 */
router.post(
  "/create-order",
  authorize("client"),
  createOrder
);

/**
 * VERIFY RAZORPAY PAYMENT
 *
 * Only CLIENT can verify their payment.
 *
 * Razorpay:
 *
 * payment_id
 * order_id
 * signature
 */
router.post(
  "/verify",
  authorize("client", "freelancer", "admin"),
  verifyPayment
);

/* ==========================================================
   WALLET ROUTES
========================================================== */

router.get(
  "/wallet",
  authorize("client", "freelancer", "admin"),
  getWallet
);

/**
 * GET FREELANCER TRANSACTIONS
 */
router.get(
  "/wallet/transactions",
  authorize("freelancer"),
  getTransactions
);

/**
 * REQUEST WITHDRAWAL
 *
 * Only freelancer can withdraw earned funds.
 */
router.post(
  "/wallet/withdraw",
  authorize("freelancer"),
  requestWithdrawal
);

/* ==========================================================
   ESCROW ROUTES
========================================================== */

/**
 * GET ALL ESCROWS
 *
 * Client:
 *   Can see their escrows
 *
 * Freelancer:
 *   Can see escrows related to them
 *
 * Admin:
 *   Can see all escrows
 */
router.get(
  "/escrow/all",
  authorize(
    "client",
    "freelancer",
    "admin"
  ),
  getEscrows
);

/**
 * GET SINGLE ESCROW
 */
router.get(
  "/escrow/:id",
  authorize(
    "client",
    "freelancer",
    "admin"
  ),
  getEscrow
);

/**
 * RELEASE ESCROW
 *
 * Client:
 *   Can release their own payment.
 *
 * Admin:
 *   Can release any payment.
 */
router.put(
  "/release/:paymentId",
  authorize(
    "client",
    "admin"
  ),
  releaseEscrow
);

/**
 * REFUND PAYMENT
 *
 * Client:
 *   Can refund/request refund according
 *   to controller ownership rules.
 *
 * Admin:
 *   Can refund any payment.
 */
router.put(
  "/refund/:paymentId",
  authorize(
    "client",
    "admin"
  ),
  refundPayment
);

/* ==========================================================
   PAYMENT HISTORY ROUTES
========================================================== */

/**
 * PAYMENT HISTORY
 */
router.get(
  "/history",
  authorize(
    "client",
    "freelancer",
    "admin"
  ),
  getPaymentHistory
);

/**
 * CURRENT USER PAYMENTS
 */
router.get(
  "/my",
  authorize(
    "client",
    "freelancer",
    "admin"
  ),
  getMyPayments
);

/**
 * PAYMENT STATUS
 */
router.get(
  "/status/:id",
  authorize(
    "client",
    "freelancer",
    "admin"
  ),
  getPaymentStatus
);

/* ==========================================================
   ADMIN ROUTES
========================================================== */

/**
 * ADMIN GET ALL PAYMENTS
 */
router.get(
  "/admin/all",
  authorize("admin"),
  getAllPayments
);

/* ==========================================================
   SINGLE PAYMENT
========================================================== */

/**
 * GET SINGLE PAYMENT
 *
 * IMPORTANT:
 *
 * Keep this route at the bottom.
 *
 * Otherwise:
 *
 * /wallet
 * /history
 * /my
 * /status
 *
 * could accidentally be treated as:
 *
 * /:id
 */
router.get(
  "/:id",
  authorize(
    "client",
    "freelancer",
    "admin"
  ),
  getPayment
);

/* ==========================================================
   EXPORT
========================================================== */

export default router;