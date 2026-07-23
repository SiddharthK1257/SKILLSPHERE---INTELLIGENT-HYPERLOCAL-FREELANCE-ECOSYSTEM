import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  FaCheck,
  FaTimes,
  FaHandshake,
  FaSearch,
  FaUser,
  FaEnvelope,
  FaClock,
  FaMoneyBillWave,
  FaStar,
  FaCalendarAlt,
  FaTimesCircle,
  FaPaperPlane,
  FaExclamationTriangle,
  FaFileAlt,
} from "react-icons/fa";

import {
  getGigProposals,
  acceptProposal,
  rejectProposal,
  negotiateProposal,
} from "../services/proposalService";

/* ==========================================================
   CONSTANTS
========================================================== */

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  accepted: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
  negotiating: "bg-blue-100 text-blue-700 border-blue-200",
  completed: "bg-purple-100 text-purple-700 border-purple-200",
};

/* ==========================================================
   MAIN COMPONENT
========================================================== */

const GigProposals = () => {
  const { gigId } = useParams();

  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedProposal, setSelectedProposal] = useState(null);

  const [modalType, setModalType] = useState(null);

  const [message, setMessage] = useState("");
  const [offerAmount, setOfferAmount] = useState("");

  const [actionLoading, setActionLoading] = useState(false);

  /* ==========================================================
     LOAD PROPOSALS
  ========================================================== */

  const loadProposals = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const data = await getGigProposals(gigId);

        setProposals(data?.proposals || []);
      } catch (err) {
        const message =
          err?.message || "Unable to load proposals.";

        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [gigId]
  );

  useEffect(() => {
    if (gigId) {
      loadProposals();
    }
  }, [gigId, loadProposals]);

  /* ==========================================================
     FILTER PROPOSALS
  ========================================================== */

  const filteredProposals = useMemo(() => {
    return proposals.filter((proposal) => {
      const freelancerName =
        proposal.freelancer?.name || "";

      const freelancerEmail =
        proposal.freelancer?.email || "";

      const proposalText =
        proposal.proposalDescription || "";

      const searchValue = search.toLowerCase();

      const matchesSearch =
        freelancerName
          .toLowerCase()
          .includes(searchValue) ||
        freelancerEmail
          .toLowerCase()
          .includes(searchValue) ||
        proposalText
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        proposal.status?.toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [proposals, search, statusFilter]);

  /* ==========================================================
     OPEN ACTION MODAL
  ========================================================== */

  const openModal = (type, proposal) => {
    setSelectedProposal(proposal);
    setModalType(type);

    setMessage("");
    setOfferAmount("");
  };

  /* ==========================================================
     CLOSE MODAL
  ========================================================== */

  const closeModal = () => {
    if (actionLoading) return;

    setSelectedProposal(null);
    setModalType(null);
    setMessage("");
    setOfferAmount("");
  };

  /* ==========================================================
     ACCEPT PROPOSAL
  ========================================================== */

  const handleAccept = async () => {
    if (!selectedProposal) return;

    try {
      setActionLoading(true);

      await acceptProposal(selectedProposal._id);

      toast.success("Proposal accepted successfully.");

      closeModal();

      await loadProposals(true);
    } catch (err) {
      toast.error(
        err?.message || "Failed to accept proposal."
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* ==========================================================
     REJECT PROPOSAL
  ========================================================== */

  const handleReject = async () => {
    if (!selectedProposal) return;

    try {
      setActionLoading(true);

      await rejectProposal(selectedProposal._id);

      toast.success("Proposal rejected.");

      closeModal();

      await loadProposals(true);
    } catch (err) {
      toast.error(
        err?.message || "Failed to reject proposal."
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* ==========================================================
     NEGOTIATE PROPOSAL
  ========================================================== */

  const handleNegotiate = async (e) => {
    e.preventDefault();

    if (!selectedProposal) return;

    if (!message.trim()) {
      toast.error("Please enter a negotiation message.");
      return;
    }

    if (
      !offerAmount ||
      Number(offerAmount) <= 0
    ) {
      toast.error("Please enter a valid offer amount.");
      return;
    }

    try {
      setActionLoading(true);

      await negotiateProposal(
        selectedProposal._id,
        {
          message: message.trim(),
          offerAmount: Number(offerAmount),
        }
      );

      toast.success("Counter offer sent successfully.");

      closeModal();

      await loadProposals(true);
    } catch (err) {
      toast.error(
        err?.message ||
          "Failed to send counter offer."
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return <LoadingState />;
  }

  /* ==========================================================
     ERROR
  ========================================================== */

  if (error && !proposals.length) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-red-200 bg-white p-10 text-center shadow-xl">
          <FaExclamationTriangle className="mx-auto mb-5 text-5xl text-red-500" />

          <h2 className="text-2xl font-bold text-slate-900">
            Unable to Load Proposals
          </h2>

          <p className="mt-3 text-slate-500">
            {error}
          </p>

          <button
            onClick={() => loadProposals()}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* ==========================================================
     MAIN UI
  ========================================================== */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 px-4 py-8 sm:px-6 lg:px-10">

      <div className="mx-auto max-w-7xl">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-xl text-white shadow-lg">
                <FaFileAlt />
              </div>

              <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                {proposals.length}{" "}
                {proposals.length === 1
                  ? "Proposal"
                  : "Proposals"}
              </span>
            </div>

            <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">
              Gig Proposals
            </h1>

            <p className="mt-2 text-slate-600">
              Review, compare, negotiate, and select
              the best freelancer for your project.
            </p>
          </div>

          <button
            onClick={() => loadProposals(true)}
            disabled={refreshing}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {refreshing
              ? "Refreshing..."
              : "Refresh Proposals"}
          </button>
        </div>

        {/* ==================================================
            STATS
        ================================================== */}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Total Proposals"
            value={proposals.length}
            icon={<FaFileAlt />}
            color="blue"
          />

          <StatCard
            title="Pending"
            value={
              proposals.filter(
                (p) => p.status === "pending"
              ).length
            }
            icon={<FaClock />}
            color="yellow"
          />

          <StatCard
            title="Accepted"
            value={
              proposals.filter(
                (p) => p.status === "accepted"
              ).length
            }
            icon={<FaCheck />}
            color="green"
          />

          <StatCard
            title="Negotiating"
            value={
              proposals.filter(
                (p) =>
                  p.status === "negotiating"
              ).length
            }
            icon={<FaHandshake />}
            color="purple"
          />

        </div>

        {/* ==================================================
            FILTERS
        ================================================== */}

        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-lg">

          <div className="grid gap-4 md:grid-cols-2">

            <div className="relative">

              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search freelancer or proposal..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />

            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            >
              <option value="all">
                All Statuses
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="accepted">
                Accepted
              </option>

              <option value="rejected">
                Rejected
              </option>

              <option value="negotiating">
                Negotiating
              </option>
            </select>

          </div>

        </div>

        {/* ==================================================
            EMPTY STATE
        ================================================== */}

        {filteredProposals.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-xl">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-3xl text-slate-400">
              <FaFileAlt />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              No Proposals Found
            </h2>

            <p className="mt-2 text-slate-500">
              {proposals.length === 0
                ? "You have not received any proposals for this gig yet."
                : "Try changing your search or filter."}
            </p>

          </div>
        ) : (

          /* ==================================================
             PROPOSALS
          ================================================== */

          <div className="space-y-6">

            {filteredProposals.map((proposal) => (

              <ProposalCard
                key={proposal._id}
                proposal={proposal}
                onAccept={() =>
                  openModal(
                    "accept",
                    proposal
                  )
                }
                onReject={() =>
                  openModal(
                    "reject",
                    proposal
                  )
                }
                onNegotiate={() =>
                  openModal(
                    "negotiate",
                    proposal
                  )
                }
              />

            ))}

          </div>

        )}

      </div>

      {/* ==================================================
          MODAL
      ================================================== */}

      {selectedProposal && modalType && (

        <ActionModal
          type={modalType}
          proposal={selectedProposal}
          message={message}
          offerAmount={offerAmount}
          setMessage={setMessage}
          setOfferAmount={setOfferAmount}
          loading={actionLoading}
          onClose={closeModal}
          onAccept={handleAccept}
          onReject={handleReject}
          onNegotiate={handleNegotiate}
        />

      )}

    </div>
  );
};

export default GigProposals;

/* ==========================================================
   PROPOSAL CARD
========================================================== */

const ProposalCard = ({
  proposal,
  onAccept,
  onReject,
  onNegotiate,
}) => {
  const freelancer =
    proposal.freelancer || {};

  const name =
    freelancer.name ||
    "Unknown Freelancer";

  const email =
    freelancer.email ||
    "Email unavailable";

  const avatar =
    freelancer.profileImage ||
    freelancer.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=2563eb&color=fff`;

  const status =
    proposal.status?.toLowerCase() ||
    "pending";

  const statusClass =
    STATUS_STYLES[status] ||
    "bg-slate-100 text-slate-700 border-slate-200";

  const isAccepted =
    status === "accepted";

  const isRejected =
    status === "rejected";

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg transition hover:shadow-2xl">

      {/* TOP */}

      <div className="border-b border-slate-100 p-6">

        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

          <div className="flex items-center gap-4">

            <img
              src={avatar}
              alt={name}
              className="h-16 w-16 rounded-2xl object-cover shadow-md"
            />

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                {name}
              </h2>

              <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                <FaEnvelope />
                {email}
              </p>

              {freelancer.rating && (
                <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FaStar className="text-yellow-500" />
                  {Number(
                    freelancer.rating
                  ).toFixed(1)}
                </p>
              )}

            </div>

          </div>

          <span
            className={`w-fit rounded-full border px-4 py-2 text-sm font-bold capitalize ${statusClass}`}
          >
            {status}
          </span>

        </div>

      </div>

      {/* CONTENT */}

      <div className="p-6">

        <div className="rounded-2xl bg-slate-50 p-5">

          <h3 className="mb-3 font-bold text-slate-800">
            Proposal Message
          </h3>

          <p className="whitespace-pre-line leading-7 text-slate-600">
            {proposal.proposalDescription ||
              proposal.coverLetter ||
              "No proposal description provided."}
          </p>

        </div>

        {/* INFO */}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <InfoBox
            icon={<FaMoneyBillWave />}
            label="Bid Amount"
            value={`₹${proposal.bidAmount || 0}`}
            iconClass="text-blue-600"
          />

          <InfoBox
            icon={<FaClock />}
            label="Delivery Time"
            value={`${proposal.estimatedCompletionTime || 0} Days`}
            iconClass="text-green-600"
          />

          <InfoBox
            icon={<FaCalendarAlt />}
            label="Submitted"
            value={
              proposal.createdAt
                ? new Date(
                    proposal.createdAt
                  ).toLocaleDateString()
                : "Recently"
            }
            iconClass="text-purple-600"
          />

          <InfoBox
            icon={<FaUser />}
            label="Experience"
            value={
              freelancer.experience ||
              "Professional"
            }
            iconClass="text-orange-600"
          />

        </div>

        {/* ACTIONS */}

        {!isAccepted && !isRejected && (

          <div className="mt-8 flex flex-wrap gap-3">

            <button
              onClick={onAccept}
              className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              <FaCheck />
              Accept Proposal
            </button>

            <button
              onClick={onReject}
              className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
            >
              <FaTimes />
              Reject
            </button>

            <button
              onClick={onNegotiate}
              className="flex items-center gap-2 rounded-xl bg-yellow-500 px-5 py-3 font-semibold text-white transition hover:bg-yellow-600"
            >
              <FaHandshake />
              Negotiate
            </button>

          </div>

        )}

      </div>

    </div>
  );
};

/* ==========================================================
   INFO BOX
========================================================== */

const InfoBox = ({
  icon,
  label,
  value,
  iconClass,
}) => {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">

      <div className={`mb-2 text-xl ${iconClass}`}>
        {icon}
      </div>

      <p className="text-sm text-slate-500">
        {label}
      </p>

      <h4 className="mt-1 font-bold text-slate-900">
        {value}
      </h4>

    </div>
  );
};

/* ==========================================================
   STAT CARD
========================================================== */

const StatCard = ({
  title,
  value,
  icon,
  color,
}) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    yellow: "bg-yellow-50 text-yellow-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-black text-slate-900">
            {value}
          </h3>

        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl text-xl ${colors[color]}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
};

/* ==========================================================
   ACTION MODAL
========================================================== */

const ActionModal = ({
  type,
  proposal,
  message,
  offerAmount,
  setMessage,
  setOfferAmount,
  loading,
  onClose,
  onAccept,
  onReject,
  onNegotiate,
}) => {
  const freelancerName =
    proposal.freelancer?.name ||
    "this freelancer";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm"
      onClick={onClose}
    >

      <div
        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* ACCEPT */}

        {type === "accept" && (

          <>
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-2xl text-green-600">
              <FaCheck />
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              Accept Proposal?
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              Are you sure you want to accept the
              proposal from{" "}
              <strong>
                {freelancerName}
              </strong>
              ?
            </p>

            <div className="mt-6 flex justify-end gap-3">

              <button
                onClick={onClose}
                disabled={loading}
                className="rounded-xl bg-slate-100 px-5 py-3 font-semibold text-slate-700"
              >
                Cancel
              </button>

              <button
                onClick={onAccept}
                disabled={loading}
                className="rounded-xl bg-green-600 px-5 py-3 font-semibold text-white disabled:opacity-50"
              >
                {loading
                  ? "Accepting..."
                  : "Accept Proposal"}
              </button>

            </div>
          </>

        )}

        {/* REJECT */}

        {type === "reject" && (

          <>
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-2xl text-red-600">
              <FaTimesCircle />
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              Reject Proposal?
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              Are you sure you want to reject this
              proposal?
            </p>

            <div className="mt-6 flex justify-end gap-3">

              <button
                onClick={onClose}
                disabled={loading}
                className="rounded-xl bg-slate-100 px-5 py-3 font-semibold text-slate-700"
              >
                Cancel
              </button>

              <button
                onClick={onReject}
                disabled={loading}
                className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white disabled:opacity-50"
              >
                {loading
                  ? "Rejecting..."
                  : "Reject Proposal"}
              </button>

            </div>
          </>

        )}

        {/* NEGOTIATE */}

        {type === "negotiate" && (

          <form onSubmit={onNegotiate}>

            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-100 text-2xl text-yellow-600">
              <FaHandshake />
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              Send Counter Offer
            </h2>

            <p className="mt-2 text-slate-500">
              Negotiate with{" "}
              <strong>
                {freelancerName}
              </strong>
            </p>

            <label className="mt-6 block text-sm font-semibold text-slate-700">
              Counter Offer Amount
            </label>

            <div className="relative mt-2">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">
                ₹
              </span>

              <input
                type="number"
                min="1"
                value={offerAmount}
                onChange={(e) =>
                  setOfferAmount(
                    e.target.value
                  )
                }
                placeholder="Enter amount"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />

            </div>

            <label className="mt-5 block text-sm font-semibold text-slate-700">
              Message
            </label>

            <textarea
              rows={5}
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder="Write your counter offer message..."
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />

            <div className="mt-6 flex justify-end gap-3">

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="rounded-xl bg-slate-100 px-5 py-3 font-semibold text-slate-700"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FaPaperPlane />

                {loading
                  ? "Sending..."
                  : "Send Counter Offer"}
              </button>

            </div>

          </form>

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
    <div className="min-h-screen bg-slate-50 px-4 py-10">

      <div className="mx-auto max-w-7xl">

        <div className="mb-8 h-10 w-72 animate-pulse rounded-xl bg-slate-200" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {Array.from({ length: 4 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-3xl bg-slate-200"
              />
            )
          )}

        </div>

        <div className="mt-8 space-y-6">

          {Array.from({ length: 3 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded-3xl bg-slate-200"
              />
            )
          )}

        </div>

      </div>

    </div>
  );
};