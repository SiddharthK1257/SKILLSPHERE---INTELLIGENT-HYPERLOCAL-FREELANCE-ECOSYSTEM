import Razorpay from "razorpay";
import crypto from "crypto";

/* ==========================================================
   RAZORPAY CONFIGURATION
========================================================== */

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ==========================================================
   CREATE RAZORPAY ORDER
========================================================== */

/**
 * Amount should be provided in INR.
 *
 * Example:
 *
 * createRazorpayOrder({
 *   amount: 500,
 *   receipt: "order_123",
 *   notes: {
 *     gigId: "123",
 *     buyerId: "456",
 *   },
 * });
 */

export const createRazorpayOrder = async ({
  amount,
  currency = "INR",
  receipt,
  notes = {},
}) => {
  try {
    if (!amount || Number(amount) <= 0) {
      throw new Error("Invalid payment amount.");
    }

    const amountInPaise = Math.round(
      Number(amount) * 100
    );

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      receipt,
      notes,
    });

    return order;
  } catch (error) {
    console.error(
      "Razorpay Create Order Error:",
      error
    );

    throw new Error(
      error?.error?.description ||
        error.message ||
        "Unable to create Razorpay order."
    );
  }
};

/* ==========================================================
   VERIFY PAYMENT SIGNATURE
========================================================== */

/**
 * Verifies:
 *
 * razorpay_order_id
 * razorpay_payment_id
 * razorpay_signature
 */

export const verifyPaymentSignature = ({
  orderId,
  paymentId,
  signature,
}) => {
  try {
    if (
      !orderId ||
      !paymentId ||
      !signature
    ) {
      return false;
    }

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(
          `${orderId}|${paymentId}`
        )
        .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(generatedSignature),
      Buffer.from(signature)
    );
  } catch (error) {
    console.error(
      "Razorpay Signature Verification Error:",
      error
    );

    return false;
  }
};

/* ==========================================================
   FETCH PAYMENT DETAILS
========================================================== */

export const getPaymentDetails = async (
  paymentId
) => {
  try {
    if (!paymentId) {
      throw new Error(
        "Payment ID is required."
      );
    }

    const payment =
      await razorpay.payments.fetch(
        paymentId
      );

    return payment;
  } catch (error) {
    console.error(
      "Razorpay Fetch Payment Error:",
      error
    );

    throw new Error(
      error?.error?.description ||
        error.message ||
        "Unable to fetch payment details."
    );
  }
};

/* ==========================================================
   FETCH ORDER DETAILS
========================================================== */

export const getOrderDetails = async (
  orderId
) => {
  try {
    if (!orderId) {
      throw new Error(
        "Order ID is required."
      );
    }

    const order =
      await razorpay.orders.fetch(
        orderId
      );

    return order;
  } catch (error) {
    console.error(
      "Razorpay Fetch Order Error:",
      error
    );

    throw new Error(
      error?.error?.description ||
        error.message ||
        "Unable to fetch order details."
    );
  }
};

/* ==========================================================
   CAPTURE PAYMENT
========================================================== */

/**
 * Amount should be provided in INR.
 */

export const capturePayment = async ({
  paymentId,
  amount,
  currency = "INR",
}) => {
  try {
    if (!paymentId) {
      throw new Error(
        "Payment ID is required."
      );
    }

    if (!amount || Number(amount) <= 0) {
      throw new Error(
        "Invalid capture amount."
      );
    }

    const amountInPaise = Math.round(
      Number(amount) * 100
    );

    const payment =
      await razorpay.payments.capture(
        paymentId,
        amountInPaise,
        currency
      );

    return payment;
  } catch (error) {
    console.error(
      "Razorpay Capture Payment Error:",
      error
    );

    throw new Error(
      error?.error?.description ||
        error.message ||
        "Unable to capture payment."
    );
  }
};

/* ==========================================================
   CREATE REFUND
========================================================== */

/**
 * Amount is optional.
 *
 * If amount is not provided,
 * the entire payment will be refunded.
 */

export const createRefund = async ({
  paymentId,
  amount,
  notes = {},
}) => {
  try {
    if (!paymentId) {
      throw new Error(
        "Payment ID is required."
      );
    }

    const refundData = {
      notes,
    };

    if (
      amount !== undefined &&
      amount !== null
    ) {
      if (Number(amount) <= 0) {
        throw new Error(
          "Invalid refund amount."
        );
      }

      refundData.amount = Math.round(
        Number(amount) * 100
      );
    }

    const refund =
      await razorpay.payments.refund(
        paymentId,
        refundData
      );

    return refund;
  } catch (error) {
    console.error(
      "Razorpay Refund Error:",
      error
    );

    throw new Error(
      error?.error?.description ||
        error.message ||
        "Unable to process refund."
    );
  }
};

/* ==========================================================
   FETCH REFUND DETAILS
========================================================== */

export const getRefundDetails = async (
  refundId
) => {
  try {
    if (!refundId) {
      throw new Error(
        "Refund ID is required."
      );
    }

    const refund =
      await razorpay.refunds.fetch(
        refundId
      );

    return refund;
  } catch (error) {
    console.error(
      "Razorpay Fetch Refund Error:",
      error
    );

    throw new Error(
      error?.error?.description ||
        error.message ||
        "Unable to fetch refund details."
    );
  }
};

/* ==========================================================
   FETCH ALL PAYMENTS
========================================================== */

export const getAllPayments = async ({
  count = 10,
  skip = 0,
} = {}) => {
  try {
    const payments =
      await razorpay.payments.all({
        count,
        skip,
      });

    return payments;
  } catch (error) {
    console.error(
      "Razorpay Get All Payments Error:",
      error
    );

    throw new Error(
      error?.error?.description ||
        error.message ||
        "Unable to fetch payments."
    );
  }
};

/* ==========================================================
   FETCH ALL REFUNDS
========================================================== */

export const getAllRefunds = async ({
  count = 10,
  skip = 0,
} = {}) => {
  try {
    const refunds =
      await razorpay.refunds.all({
        count,
        skip,
      });

    return refunds;
  } catch (error) {
    console.error(
      "Razorpay Get All Refunds Error:",
      error
    );

    throw new Error(
      error?.error?.description ||
        error.message ||
        "Unable to fetch refunds."
    );
  }
};

/* ==========================================================
   VERIFY WEBHOOK SIGNATURE
========================================================== */

/**
 * IMPORTANT:
 *
 * Use the RAW request body
 * for webhook verification.
 */

export const verifyWebhookSignature = ({
  rawBody,
  signature,
}) => {
  try {
    if (
      !rawBody ||
      !signature
    ) {
      return false;
    }

    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_WEBHOOK_SECRET
        )
        .update(rawBody)
        .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    );
  } catch (error) {
    console.error(
      "Razorpay Webhook Verification Error:",
      error
    );

    return false;
  }
};

/* ==========================================================
   CONVERT INR TO PAISE
========================================================== */

export const convertToPaise = (
  amount
) => {
  return Math.round(
    Number(amount) * 100
  );
};

/* ==========================================================
   CONVERT PAISE TO INR
========================================================== */

export const convertToRupees = (
  amount
) => {
  return Number(amount) / 100;
};

/* ==========================================================
   DEFAULT EXPORT
========================================================== */

export default razorpay;