import API from "./api";

/* ==========================================================
   CREATE PAYMENT ORDER
========================================================== */

export const createOrder = async (proposalId) => {
  const { data } = await API.post("/payments/create-order", {
    proposalId,
  });

  return data;
};

/* ==========================================================
   VERIFY PAYMENT
========================================================== */

export const verifyPayment = async (paymentData) => {
  const { data } = await API.post(
    "/payments/verify",
    paymentData
  );

  return data;
};

/* ==========================================================
   PAYMENT HISTORY
========================================================== */

export const getPaymentHistory = async () => {
  const { data } = await API.get(
    "/payments/history"
  );

  return data;
};

/* ==========================================================
   MY PAYMENTS
========================================================== */

export const getMyPayments = async () => {
  const { data } = await API.get(
    "/payments/my"
  );

  return data;
};

/* ==========================================================
   SINGLE PAYMENT
========================================================== */

export const getPayment = async (paymentId) => {
  const { data } = await API.get(
    `/payments/${paymentId}`
  );

  return data;
};

/* ==========================================================
   PAYMENT STATUS
========================================================== */

export const getPaymentStatus = async (paymentId) => {
  const { data } = await API.get(
    `/payments/status/${paymentId}`
  );

  return data;
};

/* ==========================================================
   RELEASE ESCROW
========================================================== */

export const releaseEscrow = async (paymentId) => {
  const { data } = await API.put(
    `/payments/release/${paymentId}`
  );

  return data;
};

/* ==========================================================
   REFUND PAYMENT
========================================================== */

export const refundPayment = async (paymentId) => {
  const { data } = await API.put(
    `/payments/refund/${paymentId}`
  );

  return data;
};

/* ==========================================================
   GET SINGLE ESCROW
========================================================== */

export const getEscrow = async (escrowId) => {
  const { data } = await API.get(
    `/payments/escrow/${escrowId}`
  );

  return data;
};

/* ==========================================================
   GET ALL ESCROWS
========================================================== */

export const getEscrows = async () => {
  const { data } = await API.get(
    "/payments/escrow/all"
  );

  return data;
};

/* ==========================================================
   WALLET
========================================================== */

export const getWallet = async () => {
  const { data } = await API.get(
    "/payments/wallet"
  );

  return data;
};

/* ==========================================================
   WALLET TRANSACTIONS
========================================================== */

export const getTransactions = async () => {
  const { data } = await API.get(
    "/payments/wallet/transactions"
  );

  return data;
};

/* ==========================================================
   WITHDRAW MONEY
========================================================== */

export const withdrawMoney = async (
  amount,
  method = "Bank"
) => {
  const { data } = await API.post(
    "/payments/wallet/withdraw",
    {
      amount,
      method,
    }
  );

  return data;
};

/* ==========================================================
   ADMIN - ALL PAYMENTS
========================================================== */

export const getAllPayments = async () => {
  const { data } = await API.get(
    "/payments/admin/all"
  );

  return data;
};