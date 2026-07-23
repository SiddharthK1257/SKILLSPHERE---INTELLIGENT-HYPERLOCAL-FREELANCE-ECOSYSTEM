import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  FaArrowLeft,
  FaCheckCircle,
  FaClock,
  FaCreditCard,
  FaExchangeAlt,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
  FaRedo,
  FaShieldAlt,
  FaUndo,
  FaUser,
  FaWallet,
  FaExclamationTriangle,
} from "react-icons/fa";

import Navbar from "../../components/Navbar";

import {
  getPayment,
  getEscrow,
  releaseEscrow,
  refundPayment,
} from "../../api/paymentApi";

/* ==========================================================
   CONSTANTS
========================================================== */

const PAYMENT_STATUS = {
  PAID: "paid",
  ESCROW: "escrow",
  RELEASED: "released",
  REFUNDED: "refunded",
  FAILED: "failed",
  PENDING: "pending",
};

const ESCROW_STATUS = {
  HELD: "held",
  RELEASED: "released",
  REFUNDED: "refunded",
};

/* ==========================================================
   HELPERS
========================================================== */

const normalizeStatus = (status) =>
  String(status || "")
    .trim()
    .toLowerCase();

const formatCurrency = (amount, currency = "INR") => {
  const numericAmount = Number(amount || 0);

  if (Number.isNaN(numericAmount)) {
    return "₹0";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(numericAmount);
};

const formatDate = (date) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const getApiData = (response) => {
  return response?.data || response || {};
};

const getApiMessage = (error, fallback) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
};

/* ==========================================================
   STATUS BADGE
========================================================== */

const StatusBadge = ({ status }) => {
  const normalizedStatus = normalizeStatus(status);

  const statusConfig = {
    [PAYMENT_STATUS.PAID]: {
      label: "Paid",
      className: "bg-green-100 text-green-700",
      icon: <FaCheckCircle />,
    },

    [PAYMENT_STATUS.ESCROW]: {
      label: "In Escrow",
      className: "bg-blue-100 text-blue-700",
      icon: <FaShieldAlt />,
    },

    [PAYMENT_STATUS.RELEASED]: {
      label: "Released",
      className: "bg-purple-100 text-purple-700",
      icon: <FaCheckCircle />,
    },

    [PAYMENT_STATUS.REFUNDED]: {
      label: "Refunded",
      className: "bg-red-100 text-red-700",
      icon: <FaUndo />,
    },

    [PAYMENT_STATUS.FAILED]: {
      label: "Failed",
      className: "bg-red-100 text-red-700",
      icon: <FaExchangeAlt />,
    },

    [PAYMENT_STATUS.PENDING]: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-700",
      icon: <FaClock />,
    },
  };

  const config = statusConfig[normalizedStatus] || {
    label: status || "Unknown",
    className: "bg-slate-100 text-slate-700",
    icon: <FaClock />,
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${config.className}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};

/* ==========================================================
   INFO ROW
========================================================== */

const InfoRow = ({ label, value, icon }) => {
  return (
    <div className="flex flex-col gap-2 border-b border-slate-100 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3 text-slate-500">
        <span className="text-blue-600">
          {icon}
        </span>

        <span className="font-medium">
          {label}
        </span>
      </div>

      <span className="break-all font-semibold text-slate-900 sm:max-w-[65%] sm:text-right">
        {value || "N/A"}
      </span>
    </div>
  );
};

/* ==========================================================
   SECTION CARD
========================================================== */

const SectionCard = ({
  title,
  subtitle,
  icon,
  children,
  className = "",
}) => {
  return (
    <section
      className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md lg:p-7 ${className}`}
    >
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-xl text-blue-600">
          {icon}
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-900">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {children}
    </section>
  );
};

/* ==========================================================
   AMOUNT CARD
========================================================== */

const AmountCard = ({
  label,
  amount,
  className,
}) => {
  return (
    <div
      className={`rounded-2xl border p-5 ${className}`}
    >
      <p className="text-sm font-semibold text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black">
        {amount}
      </p>
    </div>
  );
};

/* ==========================================================
   TIMELINE ITEM
========================================================== */

const TimelineItem = ({
  icon,
  title,
  description,
  date,
  active = true,
}) => {
  return (
    <div className="flex gap-4">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
          active
            ? "bg-blue-100 text-blue-600"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="font-bold text-slate-900">
          {title}
        </p>

        {description && (
          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        )}

        {date && (
          <p className="mt-1 text-xs text-slate-400">
            {date}
          </p>
        )}
      </div>
    </div>
  );
};

/* ==========================================================
   LOADING STATE
========================================================== */

const LoadingState = () => {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-7xl animate-pulse">

          <div className="mb-8 h-10 w-72 rounded-xl bg-slate-200" />

          <div className="grid gap-8 lg:grid-cols-3">

            <div className="space-y-8 lg:col-span-2">
              <div className="h-96 rounded-3xl bg-slate-200" />
              <div className="h-72 rounded-3xl bg-slate-200" />
            </div>

            <div className="h-[500px] rounded-3xl bg-slate-200" />

          </div>
        </div>
      </main>
    </>
  );
};

/* ==========================================================
   ERROR STATE
========================================================== */

const ErrorState = ({
  message,
  onRetry,
  onBack,
}) => {
  return (
    <>
      <Navbar />

      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">

        <div className="w-full max-w-xl rounded-3xl border border-red-100 bg-white p-10 text-center shadow-xl">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-3xl text-red-600">
            <FaExclamationTriangle />
          </div>

          <h1 className="mt-6 text-3xl font-black text-slate-900">
            Payment Unavailable
          </h1>

          <p className="mt-3 leading-7 text-slate-500">
            {message ||
              "Unable to load payment details."}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <button
              onClick={onBack}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-200"
            >
              <FaArrowLeft />
              Go Back
            </button>

            <button
              onClick={onRetry}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
            >
              <FaRedo />
              Try Again
            </button>

          </div>

        </div>

      </main>
    </>
  );
};

/* ==========================================================
   MAIN COMPONENT
========================================================== */

const PaymentDetails = () => {
  const { paymentId } = useParams();
  const navigate = useNavigate();

  /* ========================================================
     STATE
  ======================================================== */

  const [payment, setPayment] = useState(null);
  const [escrow, setEscrow] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState("");

  const [error, setError] = useState("");

  /* ========================================================
     FETCH PAYMENT
  ======================================================== */

  const fetchPaymentDetails = useCallback(
    async ({ silent = false } = {}) => {
      if (!paymentId) {
        setError("Payment ID is missing.");
        setLoading(false);
        return;
      }

      try {
        if (silent) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const paymentResponse =
          await getPayment(paymentId);

        const paymentResult =
          getApiData(paymentResponse);

        const paymentData =
          paymentResult?.payment;

        if (!paymentData) {
          throw new Error(
            "Payment details were not found."
          );
        }

        setPayment(paymentData);

        /* ---------------------------------------------
           ESCROW
        --------------------------------------------- */

        try {
          const escrowResponse =
            await getEscrow(paymentId);

          const escrowResult =
            getApiData(escrowResponse);

          setEscrow(
            escrowResult?.escrow || null
          );
        } catch (escrowError) {
          console.warn(
            "Escrow information unavailable:",
            escrowError
          );

          setEscrow(null);
        }
      } catch (error) {
        console.error(
          "Fetch payment details error:",
          error
        );

        const message = getApiMessage(
          error,
          "Unable to load payment details."
        );

        setError(message);

        if (!silent) {
          toast.error(message);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [paymentId]
  );

  /* ========================================================
     INITIAL LOAD
  ======================================================== */

  useEffect(() => {
    fetchPaymentDetails();
  }, [fetchPaymentDetails]);

  /* ========================================================
     NORMALIZED STATUS
  ======================================================== */

  const paymentStatus = useMemo(() => {
    return normalizeStatus(
      payment?.paymentStatus
    );
  }, [payment]);

  const escrowStatus = useMemo(() => {
    return normalizeStatus(
      escrow?.status
    );
  }, [escrow]);

  /* ========================================================
     AMOUNTS
  ======================================================== */

  const amount = useMemo(() => {
    return Number(payment?.amount || 0);
  }, [payment]);

  const platformFee = useMemo(() => {
    return Number(
      payment?.platformFee || 0
    );
  }, [payment]);

  const freelancerAmount = useMemo(() => {
    if (
      payment?.freelancerAmount !==
      undefined
    ) {
      return Number(
        payment.freelancerAmount
      );
    }

    return Math.max(
      0,
      amount - platformFee
    );
  }, [
    payment,
    amount,
    platformFee,
  ]);

  const currency = payment?.currency || "INR";

  /* ========================================================
     ACTION PERMISSIONS
  ======================================================== */

  const canRelease = useMemo(() => {
    const paymentIsEscrow =
      paymentStatus ===
        PAYMENT_STATUS.ESCROW ||
      escrowStatus ===
        ESCROW_STATUS.HELD;

    const alreadyReleased =
      paymentStatus ===
        PAYMENT_STATUS.RELEASED ||
      escrowStatus ===
        ESCROW_STATUS.RELEASED ||
      escrow?.released === true;

    return (
      paymentIsEscrow &&
      !alreadyReleased
    );
  }, [
    paymentStatus,
    escrowStatus,
    escrow,
  ]);

  const canRefund = useMemo(() => {
    return (
      paymentStatus !==
        PAYMENT_STATUS.REFUNDED &&
      paymentStatus !==
        PAYMENT_STATUS.RELEASED &&
      paymentStatus !==
        PAYMENT_STATUS.FAILED
    );
  }, [paymentStatus]);

  /* ========================================================
     RELEASE ESCROW
  ======================================================== */

  const handleReleaseEscrow = async () => {
    if (!paymentId) return;

    const confirmed = window.confirm(
      "Are you sure you want to release this payment to the freelancer?"
    );

    if (!confirmed) return;

    try {
      setActionLoading("release");

      const response =
        await releaseEscrow(paymentId);

      const result =
        getApiData(response);

      toast.success(
        result?.message ||
          "Escrow released successfully."
      );

      await fetchPaymentDetails({
        silent: true,
      });
    } catch (error) {
      console.error(
        "Release escrow error:",
        error
      );

      toast.error(
        getApiMessage(
          error,
          "Failed to release escrow."
        )
      );
    } finally {
      setActionLoading("");
    }
  };

  /* ========================================================
     REFUND PAYMENT
  ======================================================== */

  const handleRefundPayment = async () => {
    if (!paymentId) return;

    const confirmed = window.confirm(
      "Are you sure you want to refund this payment? This action may not be reversible."
    );

    if (!confirmed) return;

    try {
      setActionLoading("refund");

      const response =
        await refundPayment(paymentId);

      const result =
        getApiData(response);

      toast.success(
        result?.message ||
          "Payment refunded successfully."
      );

      await fetchPaymentDetails({
        silent: true,
      });
    } catch (error) {
      console.error(
        "Refund payment error:",
        error
      );

      toast.error(
        getApiMessage(
          error,
          "Failed to refund payment."
        )
      );
    } finally {
      setActionLoading("");
    }
  };

  /* ========================================================
     LOADING
  ======================================================== */

  if (loading) {
    return <LoadingState />;
  }

  /* ========================================================
     ERROR
  ======================================================== */

  if (error || !payment) {
    return (
      <ErrorState
        message={
          error ||
          "Payment not found."
        }
        onRetry={() =>
          fetchPaymentDetails()
        }
        onBack={() =>
          navigate(-1)
        }
      />
    );
  }

  /* ========================================================
     RENDER
  ======================================================== */

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 px-5 py-8 sm:px-6 lg:px-10">

        <div className="mx-auto max-w-7xl">

          {/* =================================================
              HEADER
          ================================================= */}

          <header className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <button
                onClick={() =>
                  navigate(-1)
                }
                className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600 transition hover:text-blue-800"
              >
                <FaArrowLeft />
                Back
              </button>

              <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                Transaction Center
              </p>

              <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">
                Payment Details
              </h1>

              <p className="mt-3 max-w-2xl text-slate-500">
                View payment, project, escrow, and transaction information.
              </p>

            </div>

            <div className="flex flex-wrap items-center gap-3">

              <button
                onClick={() =>
                  fetchPaymentDetails({
                    silent: true,
                  })
                }
                disabled={
                  refreshing ||
                  actionLoading !== ""
                }
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaRedo
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />

                {refreshing
                  ? "Refreshing..."
                  : "Refresh"}
              </button>

              <StatusBadge
                status={
                  payment.paymentStatus
                }
              />

            </div>

          </header>

          {/* =================================================
              MAIN GRID
          ================================================= */}

          <div className="grid gap-8 xl:grid-cols-3">

            {/* =================================================
                LEFT CONTENT
            ================================================= */}

            <div className="space-y-8 xl:col-span-2">

              {/* PAYMENT SUMMARY */}

              <SectionCard
                title="Payment Summary"
                subtitle="Financial breakdown of this transaction"
                icon={
                  <FaFileInvoiceDollar />
                }
              >

                <div className="grid gap-4 md:grid-cols-3">

                  <AmountCard
                    label="Total Amount"
                    amount={formatCurrency(
                      amount,
                      currency
                    )}
                    className="border-blue-100 bg-blue-50 text-blue-700"
                  />

                  <AmountCard
                    label="Platform Fee"
                    amount={formatCurrency(
                      platformFee,
                      currency
                    )}
                    className="border-purple-100 bg-purple-50 text-purple-700"
                  />

                  <AmountCard
                    label="Freelancer Receives"
                    amount={formatCurrency(
                      freelancerAmount,
                      currency
                    )}
                    className="border-green-100 bg-green-50 text-green-700"
                  />

                </div>

                <div className="mt-6">

                  <InfoRow
                    label="Payment ID"
                    value={payment._id}
                    icon={<FaCreditCard />}
                  />

                  <InfoRow
                    label="Razorpay Order ID"
                    value={
                      payment.razorpayOrderId ||
                      payment.orderId
                    }
                    icon={<FaCreditCard />}
                  />

                  <InfoRow
                    label="Payment Method"
                    value={
                      payment.paymentMethod
                    }
                    icon={<FaWallet />}
                  />

                  <InfoRow
                    label="Currency"
                    value={currency}
                    icon={
                      <FaMoneyBillWave />
                    }
                  />

                  <InfoRow
                    label="Created At"
                    value={formatDate(
                      payment.createdAt
                    )}
                    icon={<FaClock />}
                  />

                  {payment.paidAt && (
                    <InfoRow
                      label="Paid At"
                      value={formatDate(
                        payment.paidAt
                      )}
                      icon={
                        <FaCheckCircle />
                      }
                    />
                  )}

                </div>

              </SectionCard>

              {/* PROJECT INFORMATION */}

              <SectionCard
                title="Project Information"
                subtitle="The project associated with this payment"
                icon={
                  <FaFileInvoiceDollar />
                }
              >

                <InfoRow
                  label="Gig Title"
                  value={
                    payment.gig?.title ||
                    "Freelance Project"
                  }
                  icon={
                    <FaFileInvoiceDollar />
                  }
                />

                <InfoRow
                  label="Client"
                  value={
                    payment.client?.name ||
                    "N/A"
                  }
                  icon={<FaUser />}
                />

                <InfoRow
                  label="Freelancer"
                  value={
                    payment.freelancer?.name ||
                    "N/A"
                  }
                  icon={<FaUser />}
                />

                {payment.proposal && (
                  <InfoRow
                    label="Proposal ID"
                    value={
                      payment.proposal._id ||
                      payment.proposal
                    }
                    icon={
                      <FaFileInvoiceDollar />
                    }
                  />
                )}

              </SectionCard>

              {/* ESCROW INFORMATION */}

              <SectionCard
                title="Escrow Information"
                subtitle="Funds protection and release status"
                icon={<FaShieldAlt />}
              >

                {!escrow ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">

                    <FaShieldAlt className="mx-auto text-4xl text-slate-300" />

                    <p className="mt-4 font-semibold text-slate-600">
                      No escrow record found.
                    </p>

                  </div>
                ) : (
                  <div>

                    <InfoRow
                      label="Escrow Status"
                      value={
                        escrow.status ||
                        "N/A"
                      }
                      icon={
                        <FaShieldAlt />
                      }
                    />

                    <InfoRow
                      label="Released"
                      value={
                        escrow.released
                          ? "Yes"
                          : "No"
                      }
                      icon={
                        <FaCheckCircle />
                      }
                    />

                    <InfoRow
                      label="Escrow Amount"
                      value={formatCurrency(
                        escrow.amount ||
                          amount,
                        currency
                      )}
                      icon={
                        <FaMoneyBillWave />
                      }
                    />

                    <InfoRow
                      label="Remaining Amount"
                      value={formatCurrency(
                        escrow.remainingAmount ||
                          0,
                        currency
                      )}
                      icon={
                        <FaMoneyBillWave />
                      }
                    />

                    <InfoRow
                      label="Auto Release"
                      value={
                        escrow.autoRelease
                          ? "Enabled"
                          : "Disabled"
                      }
                      icon={<FaClock />}
                    />

                    {escrow.releasedAt && (
                      <InfoRow
                        label="Released At"
                        value={formatDate(
                          escrow.releasedAt
                        )}
                        icon={
                          <FaCheckCircle />
                        }
                      />
                    )}

                  </div>
                )}

              </SectionCard>

            </div>

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="space-y-8">

              {/* ACTIONS */}

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="mb-6 flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-xl text-blue-600">
                    <FaExchangeAlt />
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      Payment Actions
                    </h2>

                    <p className="text-sm text-slate-500">
                      Manage this transaction
                    </p>
                  </div>

                </div>

                <div className="space-y-4">

                  {canRelease && (
                    <button
                      onClick={
                        handleReleaseEscrow
                      }
                      disabled={
                        actionLoading !== ""
                      }
                      className="flex w-full items-center justify-center gap-3 rounded-2xl bg-green-600 py-4 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FaCheckCircle />

                      {actionLoading ===
                      "release"
                        ? "Releasing..."
                        : "Release Escrow"}
                    </button>
                  )}

                  {canRefund && (
                    <button
                      onClick={
                        handleRefundPayment
                      }
                      disabled={
                        actionLoading !== ""
                      }
                      className="flex w-full items-center justify-center gap-3 rounded-2xl bg-red-600 py-4 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FaUndo />

                      {actionLoading ===
                      "refund"
                        ? "Processing Refund..."
                        : "Refund Payment"}
                    </button>
                  )}

                  {!canRelease &&
                    !canRefund && (
                      <div className="rounded-2xl bg-slate-50 p-6 text-center">

                        <FaCheckCircle className="mx-auto text-3xl text-green-500" />

                        <p className="mt-3 font-bold text-slate-700">
                          No actions available
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          This payment has already been finalized.
                        </p>

                      </div>
                    )}

                </div>

              </section>

              {/* SECURITY CARD */}

              <section className="rounded-3xl border border-green-200 bg-green-50 p-6">

                <div className="flex items-start gap-4">

                  <FaShieldAlt className="mt-1 shrink-0 text-3xl text-green-600" />

                  <div>

                    <h3 className="font-black text-green-900">
                      Secure Payment
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-green-800">
                      This transaction is protected by SkillSphere's payment and escrow system.
                    </p>

                  </div>

                </div>

              </section>

              {/* TIMELINE */}

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                <h2 className="mb-7 text-xl font-black text-slate-900">
                  Payment Timeline
                </h2>

                <div className="space-y-7">

                  <TimelineItem
                    icon={
                      <FaFileInvoiceDollar />
                    }
                    title="Payment Created"
                    description="Payment transaction was created."
                    date={formatDate(
                      payment.createdAt
                    )}
                  />

                  {payment.paidAt && (
                    <TimelineItem
                      icon={
                        <FaCheckCircle />
                      }
                      title="Payment Completed"
                      description="Payment was successfully processed."
                      date={formatDate(
                        payment.paidAt
                      )}
                    />
                  )}

                  {escrow && (
                    <TimelineItem
                      icon={
                        <FaShieldAlt />
                      }
                      title="Funds Held in Escrow"
                      description="Funds are protected until the project agreement is completed."
                      date={formatDate(
                        escrow.createdAt
                      )}
                    />
                  )}

                  {escrow?.released && (
                    <TimelineItem
                      icon={
                        <FaMoneyBillWave />
                      }
                      title="Escrow Released"
                      description="Funds were released to the freelancer."
                      date={formatDate(
                        escrow.releasedAt
                      )}
                    />
                  )}

                  {paymentStatus ===
                    PAYMENT_STATUS.REFUNDED && (
                    <TimelineItem
                      icon={<FaUndo />}
                      title="Payment Refunded"
                      description="The payment was refunded."
                      date={formatDate(
                        payment.refundedAt
                      )}
                    />
                  )}

                </div>

              </section>

            </aside>

          </div>

        </div>

      </main>
    </>
  );
};

export default PaymentDetails;