import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  FaArrowLeft,
  FaBriefcase,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaComments,
  FaExclamationTriangle,
  FaFileAlt,
  FaMoneyBillWave,
  FaPaperPlane,
  FaTimes,
  FaTimesCircle,
  FaUser,
} from "react-icons/fa";

import Navbar from "../components/Navbar";

import {
  getProposalById,
  acceptProposal,
  rejectProposal,
  negotiateProposal,
} from "../services/proposalService";

/* =========================================================
   STATUS CONFIG
========================================================= */

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: FaClock,
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },

  negotiating: {
    label: "Negotiating",
    icon: FaComments,
    className: "border-yellow-200 bg-yellow-50 text-yellow-700",
  },

  accepted: {
    label: "Accepted",
    icon: FaCheckCircle,
    className: "border-green-200 bg-green-50 text-green-700",
  },

  rejected: {
    label: "Rejected",
    icon: FaTimesCircle,
    className: "border-red-200 bg-red-50 text-red-700",
  },

  withdrawn: {
    label: "Withdrawn",
    icon: FaTimesCircle,
    className: "border-gray-200 bg-gray-50 text-gray-700",
  },

  hired: {
    label: "Hired",
    icon: FaCheckCircle,
    className: "border-indigo-200 bg-indigo-50 text-indigo-700",
  },

  completed: {
    label: "Completed",
    icon: FaCheckCircle,
    className: "border-purple-200 bg-purple-50 text-purple-700",
  },

  cancelled: {
    label: "Cancelled",
    icon: FaTimesCircle,
    className: "border-orange-200 bg-orange-50 text-orange-700",
  },

  suspended: {
    label: "Suspended",
    icon: FaExclamationTriangle,
    className: "border-red-300 bg-red-100 text-red-800",
  },
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const ProposalDetails = () => {
  const { id } = useParams();

  /* =======================================================
     STATE
  ======================================================= */

  const [proposal, setProposal] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");

  const [showNegotiationModal, setShowNegotiationModal] =
    useState(false);

  const [negotiationForm, setNegotiationForm] = useState({
    message: "",
    offerAmount: "",
  });

  /* =======================================================
     CURRENT USER
  ======================================================= */

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  }, []);

  const currentUserId = String(
    currentUser?._id || currentUser?.id || ""
  );

  const clientId = String(
    proposal?.client?._id || proposal?.client || ""
  );

  const freelancerId = String(
    proposal?.freelancer?._id ||
      proposal?.freelancer ||
      ""
  );

  const isClient = currentUserId === clientId;

  const isFreelancer =
    currentUserId === freelancerId;

  /* =======================================================
     FETCH PROPOSAL
  ======================================================= */

  const fetchProposal = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError("");

      const data = await getProposalById(id);

      if (data?.success && data?.proposal) {
        setProposal(data.proposal);
      } else {
        setProposal(null);
        setError(
          data?.message || "Proposal not found."
        );
      }
    } catch (error) {
      console.error(
        "Fetch proposal error:",
        error
      );

      setProposal(null);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load proposal."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProposal();
  }, [fetchProposal]);

  /* =======================================================
     NORMALIZED STATUS
  ======================================================= */

  const statusKey =
    proposal?.status?.toLowerCase() || "pending";

  const currentStatus =
    STATUS_CONFIG[statusKey] || {
      label: proposal?.status || "Unknown",
      icon: FaFileAlt,
      className:
        "border-gray-200 bg-gray-50 text-gray-700",
    };

  const StatusIcon = currentStatus.icon;

  /* =======================================================
     PAYMENT STATES
  ======================================================= */

  const paymentStatus =
    proposal?.paymentStatus?.toLowerCase();

  const isPaid =
    paymentStatus === "paid" ||
    paymentStatus === "released";

  const canPay =
    isClient &&
    statusKey === "accepted" &&
    paymentStatus === "unpaid";

  /* =======================================================
     PROPOSAL ACTION STATES
  ======================================================= */

  const canManageProposal =
    isClient &&
    ["pending", "negotiating"].includes(
      statusKey
    );

  const canNegotiate =
    isClient &&
    ["pending", "negotiating"].includes(
      statusKey
    );

  /* =======================================================
     ACCEPT
  ======================================================= */

  const handleAccept = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to accept this proposal?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      const data = await acceptProposal(id);

      toast.success(
        data?.message ||
          "Proposal accepted successfully."
      );

      await fetchProposal();
    } catch (error) {
      console.error(
        "Accept proposal error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to accept proposal."
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* =======================================================
     REJECT
  ======================================================= */

  const handleReject = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this proposal?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      const data = await rejectProposal(id);

      toast.success(
        data?.message ||
          "Proposal rejected successfully."
      );

      await fetchProposal();
    } catch (error) {
      console.error(
        "Reject proposal error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to reject proposal."
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* =======================================================
     NEGOTIATION INPUT
  ======================================================= */

  const handleNegotiationChange = (event) => {
    const { name, value } = event.target;

    setNegotiationForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =======================================================
     NEGOTIATE
  ======================================================= */

  const handleNegotiate = async (event) => {
    event.preventDefault();

    const message =
      negotiationForm.message.trim();

    const offerAmount = Number(
      negotiationForm.offerAmount
    );

    if (!message) {
      toast.error(
        "Please enter a negotiation message."
      );
      return;
    }

    if (
      !Number.isFinite(offerAmount) ||
      offerAmount <= 0
    ) {
      toast.error(
        "Please enter a valid offer amount."
      );
      return;
    }

    try {
      setActionLoading(true);

      const data = await negotiateProposal(id, {
        message,
        offerAmount,
      });

      toast.success(
        data?.message ||
          "Negotiation offer sent successfully."
      );

      setNegotiationForm({
        message: "",
        offerAmount: "",
      });

      setShowNegotiationModal(false);

      await fetchProposal();
    } catch (error) {
      console.error(
        "Negotiation error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to negotiate."
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <>
        <Navbar />
        <LoadingState />
      </>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error || !proposal) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-6 py-12">
          <div className="w-full max-w-xl rounded-3xl border border-red-200 bg-white p-10 text-center shadow-xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-3xl text-red-600">
              <FaExclamationTriangle />
            </div>

            <h1 className="mt-6 text-3xl font-black text-slate-900">
              Proposal Not Found
            </h1>

            <p className="mt-3 text-slate-500">
              {error ||
                "This proposal does not exist or has been removed."}
            </p>

            <Link
              to="/dashboard"
              className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
            >
              <FaArrowLeft />
              Back to Dashboard
            </Link>
          </div>
        </main>
      </>
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600">
          <div className="w-full px-6 py-14 lg:px-12">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <Link
                  to="/dashboard"
                  className="mb-6 inline-flex items-center gap-2 font-semibold text-blue-100 transition hover:text-white"
                >
                  <FaArrowLeft />
                  Back to Dashboard
                </Link>

                <p className="mb-3 font-semibold uppercase tracking-[0.25em] text-blue-200">
                  Proposal Workspace
                </p>

                <h1 className="text-4xl font-black text-white md:text-5xl">
                  Proposal Details
                </h1>

                <p className="mt-4 max-w-3xl text-lg leading-8 text-blue-100">
                  Review proposal information,
                  payment status, and negotiation
                  history.
                </p>
              </div>

              <div
                className={`flex items-center gap-3 self-start rounded-full border px-6 py-3 font-bold lg:self-center ${currentStatus.className}`}
              >
                <StatusIcon />
                {currentStatus.label}
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="w-full px-6 py-10 lg:px-12">

          {/* =================================================
              INFORMATION CARDS
          ================================================= */}

          <div className="grid gap-6 xl:grid-cols-3">

            {/* GIG */}

            <InfoCard
              icon={<FaBriefcase />}
              title="Gig Information"
              iconClass="bg-blue-100 text-blue-600"
            >
              <InfoRow
                label="Title"
                value={
                  proposal.gig?.title ||
                  "Unavailable"
                }
              />

              <InfoRow
                label="Category"
                value={
                  proposal.gig?.category ||
                  "Not specified"
                }
              />

              <InfoRow
                label="Budget"
                value={`₹${formatCurrency(
                  proposal.gig?.price ||
                    proposal.currentOfferAmount
                )}`}
              />
            </InfoCard>

            {/* FREELANCER */}

            <InfoCard
              icon={<FaUser />}
              title="Freelancer"
              iconClass="bg-purple-100 text-purple-600"
            >
              <InfoRow
                label="Name"
                value={
                  proposal.freelancer?.name ||
                  "Unknown Freelancer"
                }
              />

              <InfoRow
                label="Email"
                value={
                  proposal.freelancer?.email ||
                  "Email unavailable"
                }
              />

              <InfoRow
                label="Role"
                value="Freelancer"
              />
            </InfoCard>

            {/* PAYMENT */}

            <InfoCard
              icon={<FaMoneyBillWave />}
              title="Payment Information"
              iconClass="bg-green-100 text-green-600"
            >
              <InfoRow
                label="Payment Status"
                value={
                  proposal.paymentStatus ||
                  "unpaid"
                }
                valueClass={
                  isPaid
                    ? "text-green-600"
                    : "text-yellow-600"
                }
              />

              <InfoRow
                label="Original Bid"
                value={`₹${formatCurrency(
                  proposal.bidAmount
                )}`}
              />

              <InfoRow
                label="Current Offer"
                value={`₹${formatCurrency(
                  proposal.currentOfferAmount
                )}`}
              />

              <InfoRow
                label="Currency"
                value={
                  proposal.paymentCurrency ||
                  "INR"
                }
              />
            </InfoCard>
          </div>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">

            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-xl text-blue-600">
                <FaFileAlt />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Proposal Description
                </h2>

                <p className="text-sm text-slate-500">
                  Freelancer's project proposal
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-6">
              <p className="whitespace-pre-line leading-8 text-slate-700">
                {proposal.proposalDescription ||
                  "No proposal description provided."}
              </p>
            </div>
          </div>

          {/* =================================================
              SUMMARY
          ================================================= */}

          <div className="mt-8 grid gap-6 md:grid-cols-3">

            <SummaryCard
              icon={<FaMoneyBillWave />}
              label="Original Bid"
              value={`₹${formatCurrency(
                proposal.bidAmount
              )}`}
              className="border-blue-200 bg-blue-50 text-blue-700"
            />

            <SummaryCard
              icon={<FaMoneyBillWave />}
              label="Current Offer"
              value={`₹${formatCurrency(
                proposal.currentOfferAmount
              )}`}
              className="border-yellow-200 bg-yellow-50 text-yellow-700"
            />

            <SummaryCard
              icon={<FaCalendarAlt />}
              label="Delivery Time"
              value={`${proposal.estimatedCompletionTime || 0} Days`}
              className="border-green-200 bg-green-50 text-green-700"
            />
          </div>

          {/* =================================================
              CLIENT ACTIONS
          ================================================= */}

          {canManageProposal && (
            <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">

              <h2 className="mb-6 text-2xl font-black text-slate-900">
                Proposal Actions
              </h2>

              <div className="flex flex-wrap gap-4">

                <button
                  onClick={handleAccept}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-3 rounded-2xl bg-green-600 px-7 py-3 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FaCheckCircle />

                  {actionLoading
                    ? "Processing..."
                    : "Accept Proposal"}
                </button>

                <button
                  onClick={handleReject}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-3 rounded-2xl bg-red-600 px-7 py-3 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FaTimesCircle />
                  Reject Proposal
                </button>

                {canNegotiate && (
                  <button
                    onClick={() =>
                      setShowNegotiationModal(true)
                    }
                    disabled={actionLoading}
                    className="inline-flex items-center gap-3 rounded-2xl bg-yellow-500 px-7 py-3 font-bold text-white transition hover:bg-yellow-600 disabled:opacity-60"
                  >
                    <FaComments />
                    Negotiate
                  </button>
                )}
              </div>
            </div>
          )}

          {/* =================================================
              PAYMENT
          ================================================= */}

          {canPay && (
            <div className="mt-10 rounded-3xl border border-blue-200 bg-blue-50 p-6 lg:p-8">

              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Complete Payment
                  </h2>

                  <p className="mt-2 text-slate-600">
                    Your proposal has been accepted.
                    Complete the payment to hire the
                    freelancer.
                  </p>
                </div>

                <Link
                  to={`/checkout/${proposal._id}`}
                  className="inline-flex items-center justify-center gap-3 rounded-2xl bg-blue-600 px-8 py-4 font-bold text-white transition hover:bg-blue-700"
                >
                  <FaMoneyBillWave />
                  Pay with Razorpay
                </Link>
              </div>
            </div>
          )}

          {/* =================================================
              PAYMENT COMPLETED
          ================================================= */}

          {isPaid && (
            <div className="mt-10 rounded-3xl border border-green-200 bg-green-50 p-6 lg:p-8">

              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">
                  <FaCheckCircle />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-green-800">
                    Payment Completed
                  </h2>

                  <p className="mt-1 text-green-700">
                    Payment has been successfully
                    recorded for this proposal.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* =================================================
              NEGOTIATION HISTORY
          ================================================= */}

          <NegotiationHistory
            negotiations={proposal.negotiations}
          />

        </section>
      </main>

      {/* =====================================================
          NEGOTIATION MODAL
      ===================================================== */}

      {showNegotiationModal && (
        <NegotiationModal
          form={negotiationForm}
          loading={actionLoading}
          onChange={handleNegotiationChange}
          onSubmit={handleNegotiate}
          onClose={() =>
            setShowNegotiationModal(false)
          }
        />
      )}
    </>
  );
};

/* =========================================================
   INFO CARD
========================================================= */

const InfoCard = ({
  icon,
  title,
  iconClass,
  children,
}) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${iconClass}`}
        >
          {icon}
        </div>

        <h2 className="text-xl font-black text-slate-900">
          {title}
        </h2>
      </div>

      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

/* =========================================================
   INFO ROW
========================================================= */

const InfoRow = ({
  label,
  value,
  valueClass = "text-slate-900",
}) => {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">

      <span className="text-sm font-semibold text-slate-500">
        {label}
      </span>

      <span
        className={`font-bold sm:max-w-[65%] sm:text-right ${valueClass}`}
      >
        {value}
      </span>
    </div>
  );
};

/* =========================================================
   SUMMARY CARD
========================================================= */

const SummaryCard = ({
  icon,
  label,
  value,
  className,
}) => {
  return (
    <div
      className={`rounded-3xl border p-7 ${className}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">
          {icon}
        </span>

        <span className="font-bold">
          {label}
        </span>
      </div>

      <p className="mt-4 text-4xl font-black">
        {value}
      </p>
    </div>
  );
};

/* =========================================================
   NEGOTIATION HISTORY
========================================================= */

const NegotiationHistory = ({
  negotiations = [],
}) => {
  return (
    <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">

      <div className="mb-8 flex items-center gap-3">

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100 text-xl text-yellow-600">
          <FaComments />
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Negotiation History
          </h2>

          <p className="text-sm text-slate-500">
            Review previous offers and messages.
          </p>
        </div>
      </div>

      {!negotiations ||
      negotiations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">

          <FaComments className="mx-auto text-4xl text-slate-300" />

          <p className="mt-4 font-semibold text-slate-500">
            No negotiation history available.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {negotiations.map(
            (item, index) => (
              <div
                key={
                  item._id ||
                  `${item.createdAt}-${index}`
                }
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
              >

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <FaMoneyBillWave />
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-900">
                        Offer ₹
                        {formatCurrency(
                          item.offerAmount
                        )}
                      </h3>

                      <p className="text-sm capitalize text-slate-500">
                        {item.status || "pending"}
                      </p>
                    </div>
                  </div>

                  <span className="text-sm text-slate-500">
                    {item.createdAt
                      ? new Date(
                          item.createdAt
                        ).toLocaleString()
                      : "Date unavailable"}
                  </span>
                </div>

                <p className="mt-5 whitespace-pre-line leading-7 text-slate-700">
                  {item.message ||
                    "No message provided."}
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

/* =========================================================
   NEGOTIATION MODAL
========================================================= */

const NegotiationModal = ({
  form,
  loading,
  onChange,
  onSubmit,
  onClose,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-5 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl md:p-8"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        <div className="mb-6 flex items-center justify-between">

          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Make a Counter Offer
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Send your message and proposed amount.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-red-100 hover:text-red-600"
          >
            <FaTimes />
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-5"
        >

          <div>
            <label className="mb-2 block font-semibold text-slate-700">
              Counter Offer Amount
            </label>

            <div className="relative">

              <FaMoneyBillWave className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="number"
                name="offerAmount"
                min="1"
                step="0.01"
                placeholder="Enter amount"
                value={form.offerAmount}
                onChange={onChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-semibold text-slate-700">
              Message
            </label>

            <textarea
              name="message"
              rows="6"
              maxLength="2000"
              placeholder="Write your negotiation message..."
              value={form.message}
              onChange={onChange}
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              required
            />

            <p className="mt-1 text-right text-xs text-slate-400">
              {form.message.length}/2000
            </p>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl bg-slate-100 px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaPaperPlane />

              {loading
                ? "Sending..."
                : "Send Counter Offer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================================================
   LOADING
========================================================= */

const LoadingState = () => {
  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50">
      <div className="text-center">

        <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

        <p className="mt-5 text-lg font-semibold text-slate-600">
          Loading Proposal...
        </p>
      </div>
    </main>
  );
};

/* =========================================================
   FORMAT CURRENCY
========================================================= */

const formatCurrency = (amount) => {
  const number = Number(amount);

  if (!Number.isFinite(number)) {
    return "0";
  }

  return number.toLocaleString("en-IN");
};

export default ProposalDetails;