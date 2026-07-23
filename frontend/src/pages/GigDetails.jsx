import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

import {
  FaArrowLeft,
  FaArrowRight,
  FaBriefcase,
  FaCheckCircle,
  FaClock,
  FaEnvelope,
  FaFire,
  FaHeart,
  FaMapMarkerAlt,
  FaRegHeart,
  FaShieldAlt,
  FaStar,
  FaUsers,
  FaBolt,
  FaCrown,
  FaQuestionCircle,
  FaClipboardCheck,
  FaPaperPlane,
  FaTimes,
} from "react-icons/fa";

import Navbar from "../components/Navbar";
import ReviewSection from "../components/reviews/ReviewSection";
import API from "../services/api";

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600";

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=Freelancer&background=2563eb&color=fff&size=200";

const GigDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [startingChat, setStartingChat] = useState(false);
  const [liked, setLiked] = useState(false);

  const [showProposalModal, setShowProposalModal] =
    useState(false);

  const [submittingProposal, setSubmittingProposal] =
    useState(false);

  const [currentUser, setCurrentUser] = useState(null);

  const [proposalData, setProposalData] = useState({
    proposalDescription: "",
    bidAmount: "",
    estimatedCompletionTime: "",
  });

  // =====================================================
  // LOAD CURRENT USER
  // =====================================================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("User parsing error:", error);
      }
    }
  }, []);

  // =====================================================
  // FETCH GIG
  // =====================================================

  useEffect(() => {
    if (!id) {
      setError("Invalid gig ID.");
      setLoading(false);
      return;
    }

    fetchGig();
  }, [id]);

  const fetchGig = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await API.get(`/gigs/${id}`);

      const gigData =
        data?.gig ||
        data?.data ||
        data;

      if (!gigData) {
        throw new Error("Gig not found.");
      }

      setGig(gigData);

      // Set default values for proposal
      setProposalData({
        proposalDescription: "",
        bidAmount:
          gigData.basicPackage?.price ||
          gigData.price ||
          gigData.startingPrice ||
          "",
        estimatedCompletionTime:
          gigData.basicPackage?.deliveryTime ||
          gigData.deliveryTime ||
          gigData.estimatedDuration ||
          "",
      });
    } catch (err) {
      console.error("Fetch Gig Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load gig."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // NORMALIZED DATA
  // =====================================================

  const freelancer = useMemo(() => {
    if (!gig) return {};

    return (
      gig.freelancer ||
      gig.freelancerSnapshot ||
      {}
    );
  }, [gig]);

  const freelancerId = useMemo(() => {
    if (!gig) return null;

    if (
      gig.freelancer &&
      typeof gig.freelancer === "object"
    ) {
      return (
        gig.freelancer._id ||
        gig.freelancer.id ||
        null
      );
    }

    if (typeof gig.freelancer === "string") {
      return gig.freelancer;
    }

    if (gig.freelancerSnapshot?._id) {
      return gig.freelancerSnapshot._id;
    }

    return null;
  }, [gig]);

  const price =
    gig?.basicPackage?.price ??
    gig?.price ??
    gig?.startingPrice ??
    0;

  const deliveryTime =
    gig?.basicPackage?.deliveryTime ??
    gig?.deliveryTime ??
    gig?.estimatedDuration ??
    0;

  const rating = Number(gig?.rating || 0);

  const reviewCount = Array.isArray(gig?.reviews)
    ? gig.reviews.length
    : gig?.reviewCount ||
      gig?.totalReviews ||
      0;

  const orders =
    gig?.completedOrders ??
    gig?.orders ??
    0;

  const image =
    gig?.coverImage ||
    gig?.image ||
    DEFAULT_COVER;

  const avatar =
    freelancer?.profileImage ||
    freelancer?.avatar ||
    freelancer?.photo ||
    DEFAULT_AVATAR;

  const freelancerName =
    freelancer?.name ||
    "Professional Freelancer";

  const location =
    freelancer?.location ||
    freelancer?.country ||
    gig?.location ||
    "Remote";

  const skills =
    gig?.tags?.length
      ? gig.tags
      : gig?.skills?.length
      ? gig.skills
      : [];

  const faqs = Array.isArray(gig?.faqs)
    ? gig.faqs
    : [];

  const requirements = Array.isArray(
    gig?.requirements
  )
    ? gig.requirements
    : [];

  // =====================================================
  // CHECK USER LOGIN
  // =====================================================

  const requireLogin = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error(
        "Please login to submit a proposal."
      );

      navigate("/login");
      return false;
    }

    return true;
  };

  // =====================================================
  // SUBMIT PROPOSAL BUTTON
  // =====================================================

  const handleOpenProposal = () => {
    if (!requireLogin()) return;

    // Prevent freelancer from applying to own gig
    if (
      currentUser?._id &&
      freelancerId &&
      currentUser._id === freelancerId
    ) {
      toast.error(
        "You cannot submit a proposal to your own gig."
      );

      return;
    }

    setShowProposalModal(true);
  };

  // =====================================================
  // HANDLE PROPOSAL INPUT
  // =====================================================

  const handleProposalChange = (event) => {
    const { name, value } = event.target;

    setProposalData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // SUBMIT PROPOSAL
  // =====================================================

  const handleSubmitProposal = async (event) => {
    event.preventDefault();

    const {
      proposalDescription,
      bidAmount,
      estimatedCompletionTime,
    } = proposalData;

    if (
      !proposalDescription.trim() ||
      !bidAmount ||
      !estimatedCompletionTime
    ) {
      toast.error(
        "Please complete all proposal fields."
      );

      return;
    }

    if (Number(bidAmount) <= 0) {
      toast.error(
        "Bid amount must be greater than 0."
      );

      return;
    }

    if (
      Number(estimatedCompletionTime) <= 0
    ) {
      toast.error(
        "Delivery time must be greater than 0."
      );

      return;
    }

    try {
      setSubmittingProposal(true);

      const { data } = await API.post(
        "/proposals",
        {
          gigId: gig._id,

          proposalDescription:
            proposalDescription.trim(),

          bidAmount: Number(bidAmount),

          estimatedCompletionTime: Number(
            estimatedCompletionTime
          ),
        }
      );

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "Failed to submit proposal."
        );
      }

      toast.success(
        data.message ||
          "Proposal submitted successfully!"
      );

      setShowProposalModal(false);

      navigate("/my-proposals");
    } catch (error) {
      console.error(
        "Submit Proposal Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to submit proposal."
      );
    } finally {
      setSubmittingProposal(false);
    }
  };

  // =====================================================
  // CONTACT FREELANCER
  // =====================================================

  const contactFreelancer = async () => {
    if (!requireLogin()) return;

    if (!freelancerId) {
      toast.error(
        "Freelancer information is not available."
      );

      return;
    }

    try {
      setStartingChat(true);

      const { data } = await API.post(
        "/chat/conversation",
        {
          receiverId: freelancerId,
          gigId: gig._id,
        }
      );

      if (!data?.conversation) {
        throw new Error(
          "Conversation could not be created."
        );
      }

      navigate("/chat", {
        state: {
          conversation: data.conversation,
        },
      });
    } catch (err) {
      console.error(
        "Start Chat Error:",
        err
      );

      toast.error(
        err.response?.data?.message ||
          "Unable to start chat."
      );
    } finally {
      setStartingChat(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen bg-slate-50 px-6 py-10">
          <div className="mx-auto max-w-7xl animate-pulse">

            <div className="h-[420px] rounded-3xl bg-slate-200" />

            <div className="mt-8 grid gap-8 lg:grid-cols-3">

              <div className="space-y-6 lg:col-span-2">

                <div className="h-12 rounded-xl bg-slate-200" />

                <div className="h-40 rounded-3xl bg-slate-200" />

                <div className="h-64 rounded-3xl bg-slate-200" />

              </div>

              <div className="h-96 rounded-3xl bg-slate-200" />

            </div>

          </div>
        </div>
      </>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !gig) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">

          <div className="w-full max-w-lg rounded-3xl border border-red-100 bg-white p-10 text-center shadow-xl">

            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-3xl text-red-600">
              !
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Unable to Load Gig
            </h1>

            <p className="mt-3 text-slate-500">
              {error || "Gig not found."}
            </p>

            <button
              onClick={() =>
                navigate("/browse-gigs")
              }
              className="mt-7 rounded-2xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
            >
              Browse Gigs
            </button>

          </div>

        </div>
      </>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">

        {/* HERO */}

        <section className="relative">

          <div className="h-[360px] w-full overflow-hidden md:h-[480px]">

            <img
              src={image}
              alt={gig.title || "Gig cover"}
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.src =
                  DEFAULT_COVER;
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          </div>

          <div className="absolute left-0 right-0 top-0">

            <div className="mx-auto max-w-7xl px-6 py-8">

              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-3 rounded-2xl bg-black/40 px-5 py-3 font-semibold text-white backdrop-blur-md transition hover:bg-black/60"
              >
                <FaArrowLeft />
                Back
              </button>

            </div>

          </div>

          <div className="absolute bottom-0 left-0 right-0">

            <div className="mx-auto max-w-7xl px-6 pb-10">

              <div className="flex flex-wrap items-center gap-3">

                {gig.category && (
                  <span className="rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white">
                    {gig.category}
                  </span>
                )}

                {gig.featured && (
                  <span className="flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-2 text-sm font-bold text-black">
                    <FaCrown />
                    Featured
                  </span>
                )}

                {gig.trending && (
                  <span className="flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-bold text-white">
                    <FaFire />
                    Trending
                  </span>
                )}

              </div>

              <h1 className="mt-5 max-w-5xl text-3xl font-black leading-tight text-white md:text-5xl">
                {gig.title}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-6 text-sm text-white/90">

                <span className="flex items-center gap-2">
                  <FaStar className="text-yellow-400" />

                  <strong>
                    {rating.toFixed(1)}
                  </strong>

                  ({reviewCount} reviews)
                </span>

                <span className="flex items-center gap-2">
                  <FaBriefcase />
                  {orders} completed orders
                </span>

                <span className="flex items-center gap-2">
                  <FaMapMarkerAlt />
                  {location}
                </span>

              </div>

            </div>

          </div>

        </section>

        {/* CONTENT */}

        <section className="mx-auto max-w-7xl px-6 py-10">

          <div className="grid gap-8 lg:grid-cols-3">

            {/* LEFT */}

            <div className="space-y-8 lg:col-span-2">

              {/* DESCRIPTION */}

              <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">

                <div className="mb-6 flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-xl text-blue-600">
                    <FaBriefcase />
                  </div>

                  <h2 className="text-2xl font-black text-slate-900">
                    About This Gig
                  </h2>

                </div>

                <p className="whitespace-pre-line text-lg leading-8 text-slate-600">
                  {gig.description ||
                    gig.shortDescription ||
                    "No description available."}
                </p>

              </section>

              {/* SKILLS */}

              {skills.length > 0 && (
                <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">

                  <h2 className="mb-6 text-2xl font-black text-slate-900">
                    Skills & Technologies
                  </h2>

                  <div className="flex flex-wrap gap-3">

                    {skills.map(
                      (skill, index) => (
                        <span
                          key={`${skill}-${index}`}
                          className="rounded-full bg-blue-50 px-5 py-3 font-semibold text-blue-700"
                        >
                          {skill}
                        </span>
                      )
                    )}

                  </div>

                </section>
              )}

              {/* REQUIREMENTS */}

              {requirements.length > 0 && (
                <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">

                  <div className="mb-6 flex items-center gap-3">

                    <FaClipboardCheck className="text-2xl text-blue-600" />

                    <h2 className="text-2xl font-black text-slate-900">
                      Requirements
                    </h2>

                  </div>

                  <div className="space-y-4">

                    {requirements.map(
                      (requirement, index) => (

                        <div
                          key={index}
                          className="flex gap-3 rounded-2xl bg-slate-50 p-4"
                        >

                          <FaCheckCircle className="mt-1 shrink-0 text-green-500" />

                          <span className="text-slate-700">
                            {typeof requirement ===
                            "string"
                              ? requirement
                              : requirement.question ||
                                requirement.title ||
                                "Requirement"}
                          </span>

                        </div>

                      )
                    )}

                  </div>

                </section>
              )}

              {/* FAQ */}

              {faqs.length > 0 && (
                <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">

                  <div className="mb-6 flex items-center gap-3">

                    <FaQuestionCircle className="text-2xl text-blue-600" />

                    <h2 className="text-2xl font-black text-slate-900">
                      Frequently Asked Questions
                    </h2>

                  </div>

                  <div className="space-y-5">

                    {faqs.map(
                      (faq, index) => (

                        <details
                          key={index}
                          className="group rounded-2xl border border-slate-200 p-5"
                        >

                          <summary className="cursor-pointer list-none font-bold text-slate-900">
                            {faq.question ||
                              faq.title ||
                              "Frequently Asked Question"}
                          </summary>

                          <p className="mt-4 leading-7 text-slate-600">
                            {faq.answer ||
                              faq.description ||
                              "No answer available."}
                          </p>

                        </details>

                      )
                    )}

                  </div>

                </section>
              )}

              {/* =====================================================
    REVIEWS & RATINGS
===================================================== */}

<ReviewSection gigId={gig._id} />

            </div>

            {/* RIGHT SIDEBAR */}

            <aside className="space-y-6">

              {/* PRICE CARD */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="sticky top-24 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
              >

                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white">

                  <p className="text-sm font-semibold text-blue-100">
                    Starting From
                  </p>

                  <h2 className="mt-2 text-5xl font-black">
                    ₹{price}
                  </h2>

                </div>

                <div className="space-y-5 p-6">

                  <div className="flex items-center justify-between border-b pb-5">

                    <span className="flex items-center gap-3 text-slate-600">
                      <FaClock className="text-blue-600" />
                      Delivery
                    </span>

                    <strong>
                      {deliveryTime} Days
                    </strong>

                  </div>

                  <div className="flex items-center justify-between border-b pb-5">

                    <span className="flex items-center gap-3 text-slate-600">
                      <FaStar className="text-yellow-500" />
                      Rating
                    </span>

                    <strong>
                      {rating.toFixed(1)}
                    </strong>

                  </div>

                  <div className="flex items-center justify-between">

                    <span className="flex items-center gap-3 text-slate-600">
                      <FaUsers className="text-blue-600" />
                      Orders
                    </span>

                    <strong>
                      {orders}
                    </strong>

                  </div>

                  {/* SUBMIT PROPOSAL */}

                  <button
                    onClick={handleOpenProposal}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 py-4 font-bold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
                  >
                    <FaPaperPlane />

                    Submit Proposal

                    <FaArrowRight />
                  </button>

                  {/* CONTACT */}

                  <button
                    onClick={contactFreelancer}
                    disabled={
                      startingChat ||
                      !freelancerId
                    }
                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-4 font-bold text-white shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    <FaEnvelope />

                    {startingChat
                      ? "Opening Chat..."
                      : "Contact Freelancer"}

                  </button>

                  {/* SAVE */}

                  <button
                    onClick={() =>
                      setLiked(!liked)
                    }
                    className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 py-4 font-bold text-slate-700 transition hover:bg-red-50"
                  >

                    {liked ? (
                      <>
                        <FaHeart className="text-red-500" />
                        Saved
                      </>
                    ) : (
                      <>
                        <FaRegHeart />
                        Save Gig
                      </>
                    )}

                  </button>

                </div>

              </motion.div>

              {/* FREELANCER */}

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">

                <h2 className="mb-5 text-xl font-black">
                  About the Freelancer
                </h2>

                <div className="flex items-center gap-4">

                  <img
                    src={avatar}
                    alt={freelancerName}
                    className="h-16 w-16 rounded-full border-2 border-blue-500 object-cover"
                  />

                  <div>

                    <h3 className="font-bold">
                      {freelancerName}
                    </h3>

                    <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                      <FaMapMarkerAlt className="text-blue-600" />
                      {location}
                    </p>

                  </div>

                </div>

                {freelancer?.verified && (
                  <div className="mt-5 flex items-center gap-2 rounded-xl bg-green-50 p-3 text-sm font-semibold text-green-700">
                    <FaCheckCircle />
                    Verified Freelancer
                  </div>
                )}

              </section>

              {/* TRUST */}

              <section className="rounded-3xl border border-green-100 bg-green-50 p-6">

                <div className="flex items-start gap-4">

                  <FaShieldAlt className="mt-1 text-2xl text-green-600" />

                  <div>

                    <h3 className="font-bold text-green-900">
                      Secure Marketplace
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-green-800">
                      Your payment is protected through secure payment processing and marketplace protection.
                    </p>

                  </div>

                </div>

              </section>

            </aside>

          </div>

        </section>

      </main>

      {/* =====================================================
          SUBMIT PROPOSAL MODAL
      ===================================================== */}

      {showProposalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b p-6">

              <div>

                <h2 className="text-2xl font-black text-slate-900">
                  Submit Your Proposal
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Send your best offer for this project.
                </p>

              </div>

              <button
                onClick={() =>
                  setShowProposalModal(false)
                }
                className="rounded-full p-3 text-slate-500 transition hover:bg-slate-100 hover:text-red-500"
              >
                <FaTimes />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmitProposal}
              className="space-y-6 p-6"
            >

              {/* PROJECT */}

              <div className="rounded-2xl bg-blue-50 p-5">

                <p className="text-sm text-blue-600">
                  Applying for
                </p>

                <h3 className="mt-1 font-bold text-blue-900">
                  {gig.title}
                </h3>

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="mb-2 block font-bold text-slate-700">
                  Proposal Description
                </label>

                <textarea
                  name="proposalDescription"
                  rows={7}
                  value={
                    proposalData.proposalDescription
                  }
                  onChange={handleProposalChange}
                  placeholder="Explain your experience, approach, and why you are the right freelancer for this project..."
                  className="w-full resize-none rounded-2xl border border-slate-300 p-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />

                <p className="mt-2 text-right text-xs text-slate-500">
                  {
                    proposalData
                      .proposalDescription
                      .length
                  }{" "}
                  characters
                </p>

              </div>

              {/* BID + DELIVERY */}

              <div className="grid gap-5 md:grid-cols-2">

                <div>

                  <label className="mb-2 block font-bold text-slate-700">
                    Your Bid Amount (₹)
                  </label>

                  <input
                    type="number"
                    name="bidAmount"
                    min="1"
                    value={
                      proposalData.bidAmount
                    }
                    onChange={handleProposalChange}
                    placeholder={`Example: ${price}`}
                    className="w-full rounded-2xl border border-slate-300 p-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    Client's starting budget: ₹{price}
                  </p>

                </div>

                <div>

                  <label className="mb-2 block font-bold text-slate-700">
                    Delivery Time (Days)
                  </label>

                  <input
                    type="number"
                    name="estimatedCompletionTime"
                    min="1"
                    value={
                      proposalData.estimatedCompletionTime
                    }
                    onChange={handleProposalChange}
                    placeholder={`Example: ${deliveryTime}`}
                    className="w-full rounded-2xl border border-slate-300 p-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    Gig's estimated delivery:{" "}
                    {deliveryTime} days
                  </p>

                </div>

              </div>

              {/* TIPS */}

              <div className="rounded-2xl bg-yellow-50 p-5">

                <h3 className="font-bold text-yellow-800">
                  Proposal Tips
                </h3>

                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-yellow-900">

                  <li>
                    Explain your relevant experience.
                  </li>

                  <li>
                    Mention how you will approach the project.
                  </li>

                  <li>
                    Provide a realistic delivery time.
                  </li>

                  <li>
                    Keep your proposal professional.
                  </li>

                </ul>

              </div>

              {/* BUTTONS */}

              <div className="flex gap-4">

                <button
                  type="button"
                  onClick={() =>
                    setShowProposalModal(false)
                  }
                  className="flex-1 rounded-2xl border border-slate-300 py-4 font-bold text-slate-700 transition hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submittingProposal}
                  className="flex flex-1 items-center justify-center gap-3 rounded-2xl bg-blue-600 py-4 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  <FaPaperPlane />

                  {submittingProposal
                    ? "Submitting..."
                    : "Submit Proposal"}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </>
  );
};

export default GigDetails;