import axios from "axios";

/* ==========================================================
   API CONFIGURATION
========================================================== */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://skillsphere-intelligent-hyperlocal-4wq2.onrender.com/api";

/* ==========================================================
   AXIOS INSTANCE
========================================================== */

const API = axios.create({
  baseURL: `${API_BASE_URL}/payments`,
  timeout: 30000,

  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/* ==========================================================
   TOKEN HELPER
========================================================== */

const getToken = () => {
  return localStorage.getItem("token");
};

/* ==========================================================
   REQUEST INTERCEPTOR
========================================================== */

API.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers = config.headers || {};

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

/* ==========================================================
   RESPONSE INTERCEPTOR
========================================================== */

API.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    const status = error.response?.status;

    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong.";

    console.error("==================================");
    console.error("PAYMENT API ERROR");
    console.error("URL:", error.config?.url);
    console.error("METHOD:", error.config?.method);
    console.error("STATUS:", status);
    console.error("MESSAGE:", message);
    console.error("==================================");

    /*
     * Do not automatically remove the token here unless
     * your entire application wants this behavior.
     *
     * A payment API 401 may happen for many reasons.
     */

    return Promise.reject(error);
  }
);

/* ==========================================================
   RESPONSE NORMALIZER
========================================================== */

const normalizeResponse = (response) => {
  return response?.data || response;
};

/* ==========================================================
   ERROR MESSAGE HELPER
========================================================== */

export const getPaymentErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Payment request failed."
  );
};

/* ==========================================================
   PAYMENT
========================================================== */

/**
 * Create Razorpay order
 *
 * POST /payments/create-order
 */
export const createOrder = async (proposalId) => {
  if (!proposalId) {
    throw new Error("Proposal ID is required.");
  }

  const response = await API.post("/create-order", {
    proposalId,
  });

  return normalizeResponse(response);
};

/**
 * Verify Razorpay payment
 *
 * POST /payments/verify
 */
export const verifyPayment = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature
  ) {
    throw new Error(
      "Incomplete Razorpay payment verification data."
    );
  }

  const response = await API.post("/verify", {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });

  return normalizeResponse(response);
};

/**
 * Get single payment
 *
 * GET /payments/:paymentId
 */
export const getPayment = async (paymentId) => {
  if (!paymentId) {
    throw new Error("Payment ID is required.");
  }

  const response = await API.get(`/${paymentId}`);

  return normalizeResponse(response);
};

/**
 * Get payment status
 *
 * GET /payments/status/:paymentId
 */
export const getPaymentStatus = async (paymentId) => {
  if (!paymentId) {
    throw new Error("Payment ID is required.");
  }

  const response = await API.get(
    `/status/${paymentId}`
  );

  return normalizeResponse(response);
};

/**
 * Get logged-in user's payments
 *
 * GET /payments/my
 */
export const getMyPayments = async () => {
  const response = await API.get("/my");

  return normalizeResponse(response);
};

/**
 * Get payment history
 *
 * GET /payments/history
 */
export const getPaymentHistory = async () => {
  const response = await API.get("/history");

  return normalizeResponse(response);
};

/* ==========================================================
   ESCROW
========================================================== */

/**
 * Get all escrow records
 *
 * GET /payments/escrow/all
 */
export const getEscrows = async () => {
  const response = await API.get("/escrow/all");

  return normalizeResponse(response);
};

/**
 * Get escrow by payment ID
 *
 * GET /payments/escrow/:paymentId
 */
export const getEscrow = async (paymentId) => {
  if (!paymentId) {
    throw new Error("Payment ID is required.");
  }

  const response = await API.get(
    `/escrow/${paymentId}`
  );

  return normalizeResponse(response);
};

/**
 * Release escrow payment
 *
 * PUT /payments/release/:paymentId
 */
export const releaseEscrow = async (paymentId) => {
  if (!paymentId) {
    throw new Error("Payment ID is required.");
  }

  const response = await API.put(
    `/release/${paymentId}`
  );

  return normalizeResponse(response);
};

/**
 * Refund payment
 *
 * PUT /payments/refund/:paymentId
 */
export const refundPayment = async (paymentId) => {
  if (!paymentId) {
    throw new Error("Payment ID is required.");
  }

  const response = await API.put(
    `/refund/${paymentId}`
  );

  return normalizeResponse(response);
};

/* ==========================================================
   WALLET
========================================================== */

/**
 * Get current user's wallet
 *
 * GET /payments/wallet
 */
export const getWallet = async () => {
  const response = await API.get("/wallet");

  return normalizeResponse(response);
};

/**
 * Get wallet transactions
 *
 * GET /payments/wallet/transactions
 */
export const getTransactions = async () => {
  const response = await API.get(
    "/wallet/transactions"
  );

  return normalizeResponse(response);
};

/**
 * Withdraw money
 *
 * POST /payments/wallet/withdraw
 */
export const withdrawMoney = async (
  amount,
  method = "Bank"
) => {
  const numericAmount = Number(amount);

  if (
    !numericAmount ||
    numericAmount <= 0
  ) {
    throw new Error(
      "Withdrawal amount must be greater than zero."
    );
  }

  const response = await API.post(
    "/wallet/withdraw",
    {
      amount: numericAmount,
      method,
    }
  );

  return normalizeResponse(response);
};

/* ==========================================================
   ADMIN PAYMENT APIs
========================================================== */

/**
 * Get all platform payments
 *
 * GET /payments/admin/all
 */
export const getAllPayments = async ({
  page = 1,
  limit = 20,
  status = "",
  search = "",
} = {}) => {
  const response = await API.get("/admin/all", {
    params: {
      page,
      limit,
      status,
      search,
    },
  });

  return normalizeResponse(response);
};

/* ==========================================================
   ADMIN PAYMENT DETAILS
========================================================== */

/**
 * Get admin payment details
 *
 * GET /payments/admin/:paymentId
 */
export const getAdminPayment = async (
  paymentId
) => {
  if (!paymentId) {
    throw new Error("Payment ID is required.");
  }

  const response = await API.get(
    `/admin/${paymentId}`
  );

  return normalizeResponse(response);
};

/**
 * Admin refund payment
 *
 * PUT /payments/admin/refund/:paymentId
 */
export const adminRefundPayment = async (
  paymentId,
  reason = ""
) => {
  if (!paymentId) {
    throw new Error("Payment ID is required.");
  }

  const response = await API.put(
    `/admin/refund/${paymentId}`,
    {
      reason,
    }
  );

  return normalizeResponse(response);
};

/* ==========================================================
   PAYMENT HEALTH CHECK
========================================================== */

/**
 * Check payment service availability
 *
 * GET /payments/health
 */
export const checkPaymentHealth = async () => {
  const response = await API.get("/health");

  return normalizeResponse(response);
};

/* ==========================================================
   DEFAULT EXPORT
========================================================== */

export default API;