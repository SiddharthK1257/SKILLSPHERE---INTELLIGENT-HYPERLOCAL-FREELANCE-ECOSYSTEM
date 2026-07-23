import Razorpay from "razorpay";

/* ==========================================================
   ENVIRONMENT VALIDATION
========================================================== */

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

if (!razorpayKeyId) {
  throw new Error(
    "RAZORPAY_KEY_ID is missing from environment variables."
  );
}

if (!razorpayKeySecret) {
  throw new Error(
    "RAZORPAY_KEY_SECRET is missing from environment variables."
  );
}

/* ==========================================================
   RAZORPAY INSTANCE
========================================================== */

const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});

/* ==========================================================
   CREATE ORDER
========================================================== */

export const createRazorpayOrder = async ({
  amount,
  currency = "INR",
  receipt,
  notes = {},
}) => {
  if (!amount || Number(amount) <= 0) {
    throw new Error(
      "Payment amount must be greater than 0."
    );
  }

  if (!receipt) {
    throw new Error(
      "Payment receipt is required."
    );
  }

  const order = await razorpay.orders.create({
    amount: Math.round(Number(amount) * 100),
    currency,
    receipt,
    notes,
  });

  return order;
};

/* ==========================================================
   FETCH ORDER
========================================================== */

export const fetchRazorpayOrder = async (
  orderId
) => {
  if (!orderId) {
    throw new Error(
      "Razorpay order ID is required."
    );
  }

  return await razorpay.orders.fetch(orderId);
};

/* ==========================================================
   FETCH PAYMENT
========================================================== */

export const fetchRazorpayPayment = async (
  paymentId
) => {
  if (!paymentId) {
    throw new Error(
      "Razorpay payment ID is required."
    );
  }

  return await razorpay.payments.fetch(
    paymentId
  );
};

/* ==========================================================
   CAPTURE PAYMENT
========================================================== */

export const captureRazorpayPayment = async (
  paymentId,
  amount,
  currency = "INR"
) => {
  if (!paymentId) {
    throw new Error(
      "Razorpay payment ID is required."
    );
  }

  if (!amount || Number(amount) <= 0) {
    throw new Error(
      "Payment amount must be greater than 0."
    );
  }

  return await razorpay.payments.capture(
    paymentId,
    Math.round(Number(amount) * 100),
    currency
  );
};

/* ==========================================================
   REFUND PAYMENT
========================================================== */

export const refundRazorpayPayment = async (
  paymentId,
  amount = null,
  notes = {}
) => {
  if (!paymentId) {
    throw new Error(
      "Razorpay payment ID is required."
    );
  }

  const refundData = {
    notes,
  };

  if (amount !== null && Number(amount) > 0) {
    refundData.amount = Math.round(
      Number(amount) * 100
    );
  }

  return await razorpay.payments.refund(
    paymentId,
    refundData
  );
};

/* ==========================================================
   EXPORT DEFAULT INSTANCE
========================================================== */

export default razorpay;