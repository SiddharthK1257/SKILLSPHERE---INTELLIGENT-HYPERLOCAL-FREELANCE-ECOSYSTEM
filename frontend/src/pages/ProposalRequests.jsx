import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaSyncAlt,
  FaFileAlt,
  FaUser,
  FaMoneyBillWave,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaCreditCard,
  FaArrowRight,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

import Navbar from "../components/Navbar";
import API from "../services/api";

/* =========================================================
   CONSTANTS
========================================================= */

const STATUS_OPTIONS = [
  "all",
  "pending",
  "accepted",
  "rejected",
  "negotiating",
];

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: FaHourglassHalf,
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },

  accepted: {
    label: "Accepted",
    icon: FaCheckCircle,
    className: "bg-green-50 text-green-700 border-green-200",
  },

  rejected: {
    label: "Rejected",
    icon: FaTimesCircle,
    className: "bg-red-50 text-red-700 border-red-200",
  },

  negotiating: {
    label: "Negotiating",
    icon: FaHourglassHalf,
    className: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },

  default: {
    label: "Unknown",
    icon: FaFileAlt,
    className: "bg-gray-50 text-gray-700 border-gray-200",
  },
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const ProposalRequests = () => {
  const [proposals, setProposals] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [processingId, setProcessingId] = useState(null);
  const [processingPaymentId, setProcessingPaymentId] =
    useState(null);

  /* =========================================================
     LOAD RAZORPAY
  ========================================================= */

  const loadRazorpay = useCallback(() => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

      if (existingScript) {
        existingScript.onload = () => resolve(true);
        existingScript.onerror = () => resolve(false);
        return;
      }

      const script = document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.async = true;

      script.onload = () => resolve(true);

      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  }, []);

  /* =========================================================
     FETCH PROPOSALS
  ========================================================= */

  const fetchProposalRequests = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const { data } = await API.get(
          "/proposals/received"
        );

        if (data?.success) {
          setProposals(
            Array.isArray(data.proposals)
              ? data.proposals
              : []
          );
        } else {
          setProposals([]);
        }
      } catch (error) {
        console.error(
          "Fetch proposal requests error:",
          error
        );

        const message =
          error.response?.data?.message ||
          "Failed to load proposal requests.";

        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    fetchProposalRequests();
    loadRazorpay();
  }, [fetchProposalRequests, loadRazorpay]);

  /* =========================================================
     ACCEPT PROPOSAL
  ========================================================= */

  const handleAccept = async (proposalId) => {
    const confirmed = window.confirm(
      "Are you sure you want to accept this proposal?"
    );

    if (!confirmed) return;

    try {
      setProcessingId(proposalId);

      const { data } = await API.put(
        `/proposals/${proposalId}/accept`
      );

      toast.success(
        data.message ||
          "Proposal accepted successfully."
      );

      await fetchProposalRequests(true);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Unable to accept proposal."
      );
    } finally {
      setProcessingId(null);
    }
  };

  /* =========================================================
     REJECT PROPOSAL
  ========================================================= */

  const handleReject = async (proposalId) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this proposal?"
    );

    if (!confirmed) return;

    try {
      setProcessingId(proposalId);

      const { data } = await API.put(
        `/proposals/${proposalId}/reject`
      );

      toast.success(
        data.message ||
          "Proposal rejected successfully."
      );

      await fetchProposalRequests(true);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Unable to reject proposal."
      );
    } finally {
      setProcessingId(null);
    }
  };

  /* =========================================================
     PAYMENT
  ========================================================= */

  const handlePayment = async (proposal) => {
    try {
      setProcessingPaymentId(proposal._id);

      const sdkLoaded = await loadRazorpay();

      if (!sdkLoaded) {
        toast.error(
          "Unable to load Razorpay. Please try again."
        );

        return;
      }

      const { data } = await API.post(
        "/payments/create-order",
        {
          proposalId: proposal._id,
        }
      );

      if (!data?.success || !data?.order) {
        throw new Error(
          data?.message ||
            "Unable to create payment order."
        );
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: data.order.amount,

        currency:
          data.order.currency || "INR",

        order_id: data.order.id,

        name: "SkillSphere",

        description:
          proposal.gig?.title ||
          "Freelance Project",

        image: "/logo.png",

        prefill: {
          name:
            proposal.client?.name || "",

          email:
            proposal.client?.email || "",
        },

        theme: {
          color: "#2563eb",
        },

        handler: async (response) => {
          try {
            const { data: verifyData } =
              await API.post(
                "/payments/verify",
                {
                  razorpay_order_id:
                    response.razorpay_order_id,

                  razorpay_payment_id:
                    response.razorpay_payment_id,

                  razorpay_signature:
                    response.razorpay_signature,
                }
              );

            if (!verifyData?.success) {
              throw new Error(
                verifyData?.message ||
                  "Payment verification failed."
              );
            }

            toast.success(
              "Payment completed successfully!"
            );

            await fetchProposalRequests(true);
          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );

            toast.error(
              error.response?.data?.message ||
                error.message ||
                "Payment verification failed."
            );
          } finally {
            setProcessingPaymentId(null);
          }
        },

        modal: {
          ondismiss: () => {
            setProcessingPaymentId(null);
          },
        },
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        (response) => {
          console.error(
            "Payment failed:",
            response.error
          );

          toast.error(
            response.error?.description ||
              "Payment failed."
          );

          setProcessingPaymentId(null);
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(
        "Payment initiation error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to initiate payment."
      );

      setProcessingPaymentId(null);
    }
  };

  /* =========================================================
     FILTER PROPOSALS
  ========================================================= */

  const filteredProposals = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return proposals.filter((proposal) => {
      const gigTitle =
        proposal?.gig?.title?.toLowerCase() || "";

      const freelancerName =
        proposal?.freelancer?.name?.toLowerCase() ||
        "";

      const description =
        proposal?.proposalDescription?.toLowerCase() ||
        "";

      const matchesSearch =
        !keyword ||
        gigTitle.includes(keyword) ||
        freelancerName.includes(keyword) ||
        description.includes(keyword);

      const matchesStatus =
        statusFilter === "all" ||
        proposal.status === statusFilter;

      return (
        matchesSearch && matchesStatus
      );
    });
  }, [proposals, search, statusFilter]);

  /* =========================================================
     STATISTICS
  ========================================================= */

  const statistics = useMemo(() => {
    return {
      total: proposals.length,

      pending: proposals.filter(
        (item) => item.status === "pending"
      ).length,

      accepted: proposals.filter(
        (item) => item.status === "accepted"
      ).length,

      rejected: proposals.filter(
        (item) => item.status === "rejected"
      ).length,
    };
  }, [proposals]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <>
        <Navbar />
        <ProposalRequestsSkeleton />
      </>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <>
      <Navbar />

      <main className="min-h-screen w-full bg-slate-50">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="w-full bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600">

          <div className="w-full px-6 py-16 sm:px-10 lg:px-16 xl:px-24">

            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

              <div>

                <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-blue-200">
                  Client Workspace
                </p>

                <h1 className="text-4xl font-black text-white sm:text-5xl lg:text-6xl">
                  Proposal Requests
                </h1>

                <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-100">
                  Review freelancer proposals, compare
                  offers, accept the best proposal, and
                  securely complete your payment.
                </p>

              </div>

              <button
                onClick={() =>
                  fetchProposalRequests(true)
                }
                disabled={refreshing}
                className="flex items-center justify-center gap-3 rounded-2xl bg-white px-7 py-4 font-bold text-blue-700 shadow-xl transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaSyncAlt
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

            </div>

          </div>

        </section>

        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="w-full px-6 py-10 sm:px-10 lg:px-16 xl:px-24">

          {/* =================================================
              STATISTICS
          ================================================= */}

          <div className="mb-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              icon={<FaFileAlt />}
              label="Total Proposals"
              value={statistics.total}
              iconClass="bg-blue-100 text-blue-600"
            />

            <StatCard
              icon={<FaHourglassHalf />}
              label="Pending"
              value={statistics.pending}
              iconClass="bg-yellow-100 text-yellow-600"
            />

            <StatCard
              icon={<FaCheckCircle />}
              label="Accepted"
              value={statistics.accepted}
              iconClass="bg-green-100 text-green-600"
            />

            <StatCard
              icon={<FaTimesCircle />}
              label="Rejected"
              value={statistics.rejected}
              iconClass="bg-red-100 text-red-600"
            />

          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 sm:flex-row sm:items-center sm:justify-between">

              <p className="font-semibold">
                {error}
              </p>

              <button
                onClick={() =>
                  fetchProposalRequests()
                }
                className="rounded-xl bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-700"
              >
                Try Again
              </button>

            </div>
          )}

          {/* =================================================
              FILTERS
          ================================================= */}

          <div className="mb-10 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex flex-col gap-4 lg:flex-row">

              <div className="relative flex-1">

                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  placeholder="Search by gig, freelancer, or proposal..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />

              </div>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status === "all"
                      ? "All Statuses"
                      : formatStatus(status)}
                  </option>
                ))}
              </select>

            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">

              <span>
                Showing{" "}
                <strong className="text-slate-900">
                  {filteredProposals.length}
                </strong>{" "}
                of{" "}
                <strong className="text-slate-900">
                  {proposals.length}
                </strong>{" "}
                proposals
              </span>

              {(search ||
                statusFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                  }}
                  className="font-bold text-blue-600 hover:text-blue-700"
                >
                  Clear Filters
                </button>
              )}

            </div>

          </div>

          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {filteredProposals.length === 0 ? (
            <EmptyState
              hasFilters={
                search ||
                statusFilter !== "all"
              }
            />
          ) : (
            <div className="grid gap-7 xl:grid-cols-2 2xl:grid-cols-3">

              {filteredProposals.map(
                (proposal, index) => (
                  <ProposalCard
                    key={proposal._id}
                    proposal={proposal}
                    index={index}
                    processingId={processingId}
                    processingPaymentId={
                      processingPaymentId
                    }
                    onAccept={handleAccept}
                    onReject={handleReject}
                    onPayment={handlePayment}
                  />
                )
              )}

            </div>
          )}

        </section>

      </main>
    </>
  );
};

/* =========================================================
   PROPOSAL CARD
========================================================= */

const ProposalCard = ({
  proposal,
  index,
  processingId,
  processingPaymentId,
  onAccept,
  onReject,
  onPayment,
}) => {
  const status =
    STATUS_CONFIG[proposal?.status] ||
    STATUS_CONFIG.default;

  const StatusIcon = status.icon;

  const isProcessing =
    processingId === proposal._id;

  const isPaymentProcessing =
    processingPaymentId === proposal._id;

  const isPaid =
    proposal.paymentStatus === "Paid" ||
    proposal.paymentStatus === "Completed";

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 25,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
      }}
      whileHover={{
        y: -5,
      }}
      className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-xl"
    >

      {/* HEADER */}

      <div className="border-b border-slate-100 p-6">

        <div className="flex items-start justify-between gap-4">

          <div className="min-w-0">

            <h2 className="line-clamp-2 text-2xl font-black text-slate-900">
              {proposal.gig?.title ||
                "Untitled Gig"}
            </h2>

            <div className="mt-3 flex items-center gap-2 text-slate-600">

              <FaUser className="text-blue-500" />

              <span>
                {proposal.freelancer?.name ||
                  "Unknown Freelancer"}
              </span>

            </div>

          </div>

          <div
            className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold ${status.className}`}
          >
            <StatusIcon />

            {status.label}
          </div>

        </div>

      </div>

      {/* BODY */}

      <div className="flex flex-1 flex-col p-6">

        <div className="rounded-2xl bg-slate-50 p-5">

          <h3 className="mb-3 font-bold text-slate-800">
            Proposal
          </h3>

          <p className="line-clamp-5 whitespace-pre-line leading-7 text-slate-600">
            {proposal.proposalDescription ||
              "No proposal description provided."}
          </p>

        </div>

        {/* STATS */}

        <div className="mt-6 grid grid-cols-2 gap-4">

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">

            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-blue-600">
              <FaMoneyBillWave />
              Bid Amount
            </div>

            <p className="text-2xl font-black text-slate-900">
              ₹
              {Number(
                proposal.bidAmount || 0
              ).toLocaleString("en-IN")}
            </p>

          </div>

          <div className="rounded-2xl border border-green-100 bg-green-50 p-5">

            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-green-600">
              <FaClock />
              Delivery
            </div>

            <p className="text-2xl font-black text-slate-900">
              {proposal.estimatedCompletionTime ||
                0}

              <span className="ml-1 text-sm font-semibold text-slate-500">
                Days
              </span>
            </p>

          </div>

        </div>

        {/* PAYMENT STATUS */}

        {proposal.status === "accepted" && (
          <div
            className={`mt-6 flex items-center gap-3 rounded-2xl border p-4 ${
              isPaid
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-yellow-200 bg-yellow-50 text-yellow-700"
            }`}
          >

            {isPaid ? (
              <FaCheckCircle className="text-xl" />
            ) : (
              <FaHourglassHalf className="text-xl" />
            )}

            <div>

              <p className="font-bold">
                {isPaid
                  ? "Payment Completed"
                  : "Payment Pending"}
              </p>

              <p className="mt-1 text-sm opacity-80">
                {isPaid
                  ? "Payment has been completed successfully."
                  : "Complete payment to start the project."}
              </p>

            </div>

          </div>
        )}

        {/* ACTIONS */}

        <div className="mt-auto pt-8">

          <div className="grid gap-3 sm:grid-cols-2">

            <Link
              to={`/proposal/${proposal._id}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-center font-bold text-white transition hover:bg-black"
            >
              View Details
              <FaArrowRight />
            </Link>

            {proposal.status === "pending" && (
              <>
                <button
                  onClick={() =>
                    onAccept(proposal._id)
                  }
                  disabled={isProcessing}
                  className="rounded-xl bg-green-600 px-4 py-3 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isProcessing
                    ? "Processing..."
                    : "Accept"}
                </button>

                <button
                  onClick={() =>
                    onReject(proposal._id)
                  }
                  disabled={isProcessing}
                  className="rounded-xl bg-red-600 px-4 py-3 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isProcessing
                    ? "Processing..."
                    : "Reject"}
                </button>
              </>
            )}

            {proposal.status === "accepted" &&
              !isPaid && (
                <button
                  onClick={() =>
                    onPayment(proposal)
                  }
                  disabled={isPaymentProcessing}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  <FaCreditCard />

                  {isPaymentProcessing
                    ? "Processing..."
                    : "Pay with Razorpay"}
                </button>
              )}

            {proposal.status === "accepted" &&
              isPaid && (
                <button
                  disabled
                  className="rounded-xl bg-green-600 px-4 py-3 font-bold text-white"
                >
                  ✓ Payment Completed
                </button>
              )}

          </div>

        </div>

      </div>

    </motion.article>
  );
};

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({
  icon,
  label,
  value,
  iconClass,
}) => {
  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >

      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl text-xl ${iconClass}`}
      >
        {icon}
      </div>

      <div>

        <p className="text-sm font-semibold text-slate-500">
          {label}
        </p>

        <p className="mt-1 text-3xl font-black text-slate-900">
          {value}
        </p>

      </div>

    </motion.div>
  );
};

/* =========================================================
   EMPTY STATE
========================================================= */

const EmptyState = ({
  hasFilters,
}) => {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-24 text-center">

      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-4xl text-blue-600">
        <FaFileAlt />
      </div>

      <h2 className="mt-6 text-3xl font-black text-slate-900">
        {hasFilters
          ? "No matching proposals"
          : "No proposal requests yet"}
      </h2>

      <p className="mx-auto mt-4 max-w-xl text-slate-500">
        {hasFilters
          ? "Try changing your search or status filter."
          : "When freelancers submit proposals to your gigs, they will appear here."}
      </p>

    </div>
  );
};

/* =========================================================
   LOADING SKELETON
========================================================= */

const ProposalRequestsSkeleton = () => {
  return (
    <main className="min-h-screen w-full bg-slate-50">

      <section className="w-full bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600">

        <div className="px-6 py-16 sm:px-10 lg:px-16">

          <div className="h-14 w-96 animate-pulse rounded-xl bg-white/20" />

          <div className="mt-5 h-5 max-w-2xl animate-pulse rounded bg-white/20" />

        </div>

      </section>

      <section className="w-full px-6 py-10 sm:px-10 lg:px-16">

        <div className="mb-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {Array.from({
            length: 4,
          }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-3xl bg-white"
            />
          ))}

        </div>

        <div className="mb-10 h-24 animate-pulse rounded-3xl bg-white" />

        <div className="grid gap-7 xl:grid-cols-2 2xl:grid-cols-3">

          {Array.from({
            length: 6,
          }).map((_, index) => (
            <div
              key={index}
              className="h-[500px] animate-pulse rounded-3xl bg-white"
            />
          ))}

        </div>

      </section>

    </main>
  );
};

/* =========================================================
   HELPER
========================================================= */

const formatStatus = (status) => {
  return (
    status.charAt(0).toUpperCase() +
    status.slice(1)
  );
};

export default ProposalRequests;