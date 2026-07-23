import API from "./api";

/* ==========================================================
   ERROR HANDLER
========================================================== */

const handleServiceError = (error, defaultMessage) => {
  console.error(defaultMessage, error);

  throw new Error(
    error.response?.data?.message ||
      error.message ||
      defaultMessage
  );
};

/* ==========================================================
   PROPOSAL APIs
========================================================== */

/**
 * Submit a new proposal
 */
export const submitProposal = async (proposalData) => {
  try {
    if (!proposalData?.gigId) {
      throw new Error("Gig ID is required.");
    }

    if (!proposalData?.proposalDescription?.trim()) {
      throw new Error(
        "Proposal description is required."
      );
    }

    if (
      !proposalData?.bidAmount ||
      Number(proposalData.bidAmount) <= 0
    ) {
      throw new Error(
        "A valid bid amount is required."
      );
    }

    if (
      !proposalData?.estimatedCompletionTime ||
      Number(
        proposalData.estimatedCompletionTime
      ) <= 0
    ) {
      throw new Error(
        "A valid completion time is required."
      );
    }

    const { data } = await API.post(
      "/proposals",
      {
        gigId: proposalData.gigId,

        proposalDescription:
          proposalData.proposalDescription.trim(),

        bidAmount: Number(
          proposalData.bidAmount
        ),

        estimatedCompletionTime: Number(
          proposalData.estimatedCompletionTime
        ),
      }
    );

    return data;
  } catch (error) {
    handleServiceError(
      error,
      "Failed to submit proposal."
    );
  }
};

/**
 * Get proposals submitted by logged-in freelancer
 */
export const getMyProposals = async () => {
  try {
    const { data } = await API.get(
      "/proposals/my"
    );

    return data;
  } catch (error) {
    handleServiceError(
      error,
      "Failed to load your proposals."
    );
  }
};

/**
 * Get proposals received by logged-in client
 */
export const getReceivedProposals = async () => {
  try {
    const { data } = await API.get(
      "/proposals/received"
    );

    return data;
  } catch (error) {
    handleServiceError(
      error,
      "Failed to load proposal requests."
    );
  }
};

/**
 * Get proposal statistics
 */
export const getProposalStatistics = async () => {
  try {
    const { data } = await API.get(
      "/proposals/statistics"
    );

    return data;
  } catch (error) {
    handleServiceError(
      error,
      "Failed to load proposal statistics."
    );
  }
};

/**
 * Get one proposal by ID
 */
export const getProposalById = async (
  proposalId
) => {
  try {
    if (!proposalId) {
      throw new Error(
        "Proposal ID is required."
      );
    }

    const { data } = await API.get(
      `/proposals/${proposalId}`
    );

    return data;
  } catch (error) {
    handleServiceError(
      error,
      "Failed to load proposal."
    );
  }
};

/**
 * Get all proposals for one gig
 */
export const getGigProposals = async (
  gigId
) => {
  try {
    if (!gigId) {
      throw new Error(
        "Gig ID is required."
      );
    }

    const { data } = await API.get(
      `/proposals/gig/${gigId}`
    );

    return data;
  } catch (error) {
    handleServiceError(
      error,
      "Failed to load gig proposals."
    );
  }
};

/* ==========================================================
   PROPOSAL ACTIONS
========================================================== */

/**
 * Accept proposal
 */
export const acceptProposal = async (
  proposalId
) => {
  try {
    if (!proposalId) {
      throw new Error(
        "Proposal ID is required."
      );
    }

    const { data } = await API.put(
      `/proposals/${proposalId}/accept`
    );

    return data;
  } catch (error) {
    handleServiceError(
      error,
      "Failed to accept proposal."
    );
  }
};

/**
 * Reject proposal
 */
export const rejectProposal = async (
  proposalId
) => {
  try {
    if (!proposalId) {
      throw new Error(
        "Proposal ID is required."
      );
    }

    const { data } = await API.put(
      `/proposals/${proposalId}/reject`
    );

    return data;
  } catch (error) {
    handleServiceError(
      error,
      "Failed to reject proposal."
    );
  }
};

/**
 * Send counter offer
 */
export const negotiateProposal = async (
  proposalId,
  negotiationData
) => {
  try {
    if (!proposalId) {
      throw new Error(
        "Proposal ID is required."
      );
    }

    if (
      !negotiationData?.message?.trim()
    ) {
      throw new Error(
        "Negotiation message is required."
      );
    }

    if (
      !negotiationData?.offerAmount ||
      Number(
        negotiationData.offerAmount
      ) <= 0
    ) {
      throw new Error(
        "A valid offer amount is required."
      );
    }

    const { data } = await API.put(
      `/proposals/${proposalId}/negotiate`,
      {
        message:
          negotiationData.message.trim(),

        offerAmount: Number(
          negotiationData.offerAmount
        ),
      }
    );

    return data;
  } catch (error) {
    handleServiceError(
      error,
      "Failed to negotiate proposal."
    );
  }
};

/**
 * Update proposal
 */
export const updateProposal = async (
  proposalId,
  proposalData
) => {
  try {
    if (!proposalId) {
      throw new Error(
        "Proposal ID is required."
      );
    }

    const { data } = await API.put(
      `/proposals/${proposalId}`,
      proposalData
    );

    return data;
  } catch (error) {
    handleServiceError(
      error,
      "Failed to update proposal."
    );
  }
};

/**
 * Delete proposal
 */
export const deleteProposal = async (
  proposalId
) => {
  try {
    if (!proposalId) {
      throw new Error(
        "Proposal ID is required."
      );
    }

    const { data } = await API.delete(
      `/proposals/${proposalId}`
    );

    return data;
  } catch (error) {
    handleServiceError(
      error,
      "Failed to delete proposal."
    );
  }
};

/**
 * Withdraw proposal
 */
export const withdrawProposal = async (
  proposalId
) => {
  try {
    if (!proposalId) {
      throw new Error(
        "Proposal ID is required."
      );
    }

    const { data } = await API.delete(
      `/proposals/${proposalId}/withdraw`
    );

    return data;
  } catch (error) {
    handleServiceError(
      error,
      "Failed to withdraw proposal."
    );
  }
};

/**
 * Change proposal status
 */
export const changeProposalStatus = async (
  proposalId,
  status
) => {
  try {
    if (!proposalId) {
      throw new Error(
        "Proposal ID is required."
      );
    }

    if (!status) {
      throw new Error(
        "Proposal status is required."
      );
    }

    const { data } = await API.put(
      `/proposals/${proposalId}/status`,
      {
        status,
      }
    );

    return data;
  } catch (error) {
    handleServiceError(
      error,
      "Failed to change proposal status."
    );
  }
};

/* ==========================================================
   PAYMENT APIs
========================================================== */

/**
 * Create Razorpay payment order
 */
export const createPaymentOrder = async (
  proposalId
) => {
  try {
    if (!proposalId) {
      throw new Error(
        "Proposal ID is required."
      );
    }

    const { data } = await API.post(
      "/payments/create-order",
      {
        proposalId,
      }
    );

    return data;
  } catch (error) {
    handleServiceError(
      error,
      "Failed to create payment order."
    );
  }
};

/**
 * Verify Razorpay payment
 */
export const verifyPayment = async (
  paymentData
) => {
  try {
    if (
      !paymentData?.razorpay_order_id ||
      !paymentData?.razorpay_payment_id ||
      !paymentData?.razorpay_signature
    ) {
      throw new Error(
        "Incomplete payment verification data."
      );
    }

    const { data } = await API.post(
      "/payments/verify",
      paymentData
    );

    return data;
  } catch (error) {
    handleServiceError(
      error,
      "Payment verification failed."
    );
  }
};

/**
 * Release escrow payment
 */
export const releaseEscrow = async (
  paymentId
) => {
  try {
    if (!paymentId) {
      throw new Error(
        "Payment ID is required."
      );
    }

    const { data } = await API.put(
      `/payments/release/${paymentId}`
    );

    return data;
  } catch (error) {
    handleServiceError(
      error,
      "Failed to release escrow payment."
    );
  }
};

/**
 * Refund payment
 */
export const refundPayment = async (
  paymentId
) => {
  try {
    if (!paymentId) {
      throw new Error(
        "Payment ID is required."
      );
    }

    const { data } = await API.put(
      `/payments/refund/${paymentId}`
    );

    return data;
  } catch (error) {
    handleServiceError(
      error,
      "Failed to refund payment."
    );
  }
};

/**
 * Get payment details
 */
export const getPayment = async (
  paymentId
) => {
  try {
    if (!paymentId) {
      throw new Error(
        "Payment ID is required."
      );
    }

    const { data } = await API.get(
      `/payments/${paymentId}`
    );

    return data;
  } catch (error) {
    handleServiceError(
      error,
      "Failed to load payment."
    );
  }
};

/**
 * Get payment status
 */
export const getPaymentStatus = async (
  paymentId
) => {
  try {
    if (!paymentId) {
      throw new Error(
        "Payment ID is required."
      );
    }

    const { data } = await API.get(
      `/payments/status/${paymentId}`
    );

    return data;
  } catch (error) {
    handleServiceError(
      error,
      "Failed to load payment status."
    );
  }
};

/**
 * Get complete payment history
 */
export const getPaymentHistory = async () => {
  try {
    const { data } = await API.get(
      "/payments/history"
    );

    return data;
  } catch (error) {
    handleServiceError(
      error,
      "Failed to load payment history."
    );
  }
};

/**
 * Get logged-in user's payments
 */
export const getMyPayments = async () => {
  try {
    const { data } = await API.get(
      "/payments/my"
    );

    return data;
  } catch (error) {
    handleServiceError(
      error,
      "Failed to load your payments."
    );
  }
};

/**
 * Get wallet
 */
export const getWallet = async () => {
  try {
    const { data } = await API.get(
      "/payments/wallet"
    );

    return data;
  } catch (error) {
    handleServiceError(
      error,
      "Failed to load wallet."
    );
  }
};

/**
 * Get transactions
 */
export const getTransactions = async () => {
  try {
    const { data } = await API.get(
      "/payments/transactions"
    );

    return data;
  } catch (error) {
    handleServiceError(
      error,
      "Failed to load transactions."
    );
  }
};

/**
 * Request withdrawal
 */
export const requestWithdrawal = async (
  amount,
  method
) => {
  try {
    if (!amount || Number(amount) <= 0) {
      throw new Error(
        "A valid withdrawal amount is required."
      );
    }

    if (!method) {
      throw new Error(
        "Withdrawal method is required."
      );
    }

    const { data } = await API.post(
      "/payments/withdraw",
      {
        amount: Number(amount),
        method,
      }
    );

    return data;
  } catch (error) {
    handleServiceError(
      error,
      "Failed to request withdrawal."
    );
  }
};