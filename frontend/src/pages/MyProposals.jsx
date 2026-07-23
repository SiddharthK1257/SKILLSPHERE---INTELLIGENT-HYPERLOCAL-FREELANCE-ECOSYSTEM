import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaSyncAlt,
  FaBriefcase,
  FaUser,
  FaMoneyBillWave,
  FaClock,
  FaArrowRight,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaComments,
  FaFileAlt,
} from "react-icons/fa";

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
  "completed",
];

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: FaHourglassHalf,
    className:
      "bg-blue-50 text-blue-700 border-blue-200",
  },

  accepted: {
    label: "Accepted",
    icon: FaCheckCircle,
    className:
      "bg-green-50 text-green-700 border-green-200",
  },

  rejected: {
    label: "Rejected",
    icon: FaTimesCircle,
    className:
      "bg-red-50 text-red-700 border-red-200",
  },

  negotiating: {
    label: "Negotiating",
    icon: FaComments,
    className:
      "bg-yellow-50 text-yellow-700 border-yellow-200",
  },

  completed: {
    label: "Completed",
    icon: FaCheckCircle,
    className:
      "bg-purple-50 text-purple-700 border-purple-200",
  },

  default: {
    label: "Unknown",
    icon: FaFileAlt,
    className:
      "bg-gray-50 text-gray-700 border-gray-200",
  },
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const MyProposals = () => {
  const [proposals, setProposals] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  /* =======================================================
     LOAD PROPOSALS
  ======================================================= */

  const loadProposals = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const { data } = await API.get("/proposals/my");

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
        console.error("Load proposals error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load proposals."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    loadProposals();
  }, [loadProposals]);

  /* =======================================================
     FILTER PROPOSALS
  ======================================================= */

  const filteredProposals = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return proposals.filter((proposal) => {
      const gigTitle =
        proposal?.gig?.title?.toLowerCase() || "";

      const clientName =
        proposal?.client?.name?.toLowerCase() || "";

      const description =
        proposal?.proposalDescription?.toLowerCase() ||
        "";

      const matchesSearch =
        !keyword ||
        gigTitle.includes(keyword) ||
        clientName.includes(keyword) ||
        description.includes(keyword);

      const matchesStatus =
        statusFilter === "all" ||
        proposal?.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [proposals, search, statusFilter]);

  /* =======================================================
     STATISTICS
  ======================================================= */

  const statistics = useMemo(() => {
    return {
      total: proposals.length,

      pending: proposals.filter(
        (item) => item.status === "pending"
      ).length,

      accepted: proposals.filter(
        (item) => item.status === "accepted"
      ).length,

      negotiating: proposals.filter(
        (item) => item.status === "negotiating"
      ).length,
    };
  }, [proposals]);

  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (loading) {
    return (
      <>
        <Navbar />
        <ProposalSkeleton />
      </>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600">

          <div className="mx-auto w-full px-6 py-16">

            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
              }}
            >

              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

                <div>

                  <p className="mb-3 font-semibold uppercase tracking-widest text-blue-200">
                    Freelancer Workspace
                  </p>

                  <h1 className="text-4xl font-black text-white md:text-5xl">
                    My Proposals
                  </h1>

                  <p className="mt-4 max-w-2xl text-blue-100">
                    Track your submitted proposals, monitor
                    client responses, and manage your active
                    opportunities.
                  </p>

                </div>

                <button
                  onClick={() =>
                    loadProposals(true)
                  }
                  disabled={refreshing}
                  className="flex items-center justify-center gap-3 rounded-2xl bg-white px-6 py-3 font-bold text-blue-700 shadow-xl transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
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

            </motion.div>

          </div>

        </section>

        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="w-full px-6 py-10">

          {/* =================================================
              STATISTICS
          ================================================= */}

          <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

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
              icon={<FaComments />}
              label="Negotiating"
              value={statistics.negotiating}
              iconClass="bg-purple-100 text-purple-600"
            />

          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="mb-8 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">

              <p className="font-semibold">
                {error}
              </p>

              <button
                onClick={() => loadProposals()}
                className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
              >
                Try Again
              </button>

            </div>
          )}

          {/* =================================================
              FILTERS
          ================================================= */}

          <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex flex-col gap-4 md:flex-row">

              {/* Search */}

              <div className="relative flex-1">

                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  placeholder="Search by gig, client, or proposal..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />

              </div>

              {/* Status */}

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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

            <div className="mt-4 flex items-center justify-between text-sm text-slate-500">

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

              {(search || statusFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                  }}
                  className="font-semibold text-blue-600 hover:text-blue-700"
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
                search || statusFilter !== "all"
              }
            />
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">

              {filteredProposals.map(
                (proposal, index) => (
                  <ProposalCard
                    key={proposal._id}
                    proposal={proposal}
                    index={index}
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
}) => {
  const status =
    STATUS_CONFIG[proposal?.status] ||
    STATUS_CONFIG.default;

  const StatusIcon = status.icon;

  const gigTitle =
    proposal?.gig?.title ||
    "Deleted Gig";

  const clientName =
    proposal?.client?.name ||
    "Unknown Client";

  const clientEmail =
    proposal?.client?.email ||
    "Email unavailable";

  const description =
    proposal?.proposalDescription ||
    "No proposal description provided.";

  const bidAmount =
    proposal?.bidAmount || 0;

  const deliveryTime =
    proposal?.estimatedCompletionTime || 0;

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
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-xl"
    >

      {/* Card Header */}

      <div className="border-b border-slate-100 p-6">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

          <div className="flex min-w-0 gap-4">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-xl text-blue-600">
              <FaBriefcase />
            </div>

            <div className="min-w-0">

              <h2 className="line-clamp-2 text-xl font-bold text-slate-900">
                {gigTitle}
              </h2>

              <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">

                <FaUser className="text-blue-500" />

                <span>
                  {clientName}
                </span>

              </div>

              <p className="mt-1 truncate text-sm text-slate-400">
                {clientEmail}
              </p>

            </div>

          </div>

          {/* Status */}

          <div
            className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ${status.className}`}
          >
            <StatusIcon />
            {status.label}
          </div>

        </div>

      </div>

      {/* Card Body */}

      <div className="p-6">

        <div className="rounded-2xl bg-slate-50 p-5">

          <p className="line-clamp-4 whitespace-pre-line leading-7 text-slate-600">
            {description}
          </p>

        </div>

        {/* Stats */}

        <div className="mt-6 grid grid-cols-2 gap-4">

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">

            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-600">
              <FaMoneyBillWave />
              Bid Amount
            </div>

            <p className="text-2xl font-black text-slate-900">
              ₹{Number(bidAmount).toLocaleString(
                "en-IN"
              )}
            </p>

          </div>

          <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4">

            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-purple-600">
              <FaClock />
              Delivery
            </div>

            <p className="text-2xl font-black text-slate-900">
              {deliveryTime}{" "}
              <span className="text-sm font-semibold text-slate-500">
                Days
              </span>
            </p>

          </div>

        </div>

        {/* Payment Status */}

        {proposal.status === "accepted" && (
          <PaymentStatus
            paymentStatus={
              proposal.paymentStatus
            }
          />
        )}

      </div>

      {/* Footer */}

      <div className="border-t border-slate-100 bg-slate-50 p-6">

        <Link
          to={`/proposal/${proposal._id}`}
          className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-4 font-bold text-white shadow-lg transition hover:shadow-blue-200"
        >
          View Proposal Details

          <FaArrowRight className="transition-transform group-hover:translate-x-2" />
        </Link>

      </div>

    </motion.article>
  );
};

/* =========================================================
   PAYMENT STATUS
========================================================= */

const PaymentStatus = ({
  paymentStatus,
}) => {
  const isPaid =
    String(paymentStatus).toLowerCase() ===
    "paid";

  return (
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
            ? "The client has completed payment for this proposal."
            : "Waiting for the client to complete the payment."}
        </p>

      </div>

    </div>
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
      className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
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
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">

      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-3xl text-blue-600">
        <FaFileAlt />
      </div>

      <h2 className="mt-6 text-2xl font-bold text-slate-900">
        {hasFilters
          ? "No matching proposals"
          : "No proposals yet"}
      </h2>

      <p className="mx-auto mt-3 max-w-md text-slate-500">
        {hasFilters
          ? "Try changing your search or filter to find more proposals."
          : "Start applying to gigs and your submitted proposals will appear here."}
      </p>

      {!hasFilters && (
        <Link
          to="/browse-gigs"
          className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
        >
          Browse Gigs
          <FaArrowRight />
        </Link>
      )}

    </div>
  );
};

/* =========================================================
   LOADING SKELETON
========================================================= */

const ProposalSkeleton = () => {
  return (
    <main className="min-h-screen bg-slate-50">

      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600">

        <div className="w-full px-6 py-16">

          <div className="h-12 w-80 animate-pulse rounded-xl bg-white/20" />

          <div className="mt-5 h-5 max-w-xl animate-pulse rounded bg-white/20" />

        </div>

      </div>

      <section className="w-full px-6 py-10">

        <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {Array.from({
            length: 4,
          }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-3xl bg-white"
            />
          ))}

        </div>

        <div className="mb-8 h-24 animate-pulse rounded-3xl bg-white" />

        <div className="grid gap-6 lg:grid-cols-2">

          {Array.from({
            length: 4,
          }).map((_, index) => (
            <div
              key={index}
              className="h-96 animate-pulse rounded-3xl bg-white"
            />
          ))}

        </div>

      </section>

    </main>
  );
};

/* =========================================================
   HELPERS
========================================================= */

const formatStatus = (status) => {
  return status
    .charAt(0)
    .toUpperCase() + status.slice(1);
};

export default MyProposals;