import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

import Navbar from "../components/Navbar";

import {
  FaArrowLeft,
  FaPaperPlane,
  FaMoneyBillWave,
  FaClock,
  FaLightbulb,
  FaCheckCircle,
} from "react-icons/fa";

import { submitProposal } from "../services/proposalService";

const SubmitProposal = () => {
  const navigate = useNavigate();
  const { gigId } = useParams();

  /* =====================================================
     STATE
  ===================================================== */

  const [formData, setFormData] = useState({
    proposalDescription: "",
    bidAmount: "",
    estimatedCompletionTime: "",
  });

  const [loading, setLoading] = useState(false);

  /* =====================================================
     HANDLE INPUT
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =====================================================
     FORM VALIDATION
  ===================================================== */

  const validateForm = () => {
    const description =
      formData.proposalDescription.trim();

    const bidAmount = Number(formData.bidAmount);

    const deliveryTime = Number(
      formData.estimatedCompletionTime
    );

    if (!description) {
      toast.error(
        "Please write a proposal description."
      );

      return false;
    }

    if (description.length < 50) {
      toast.error(
        "Proposal must contain at least 50 characters."
      );

      return false;
    }

    if (!bidAmount || bidAmount <= 0) {
      toast.error(
        "Please enter a valid bid amount."
      );

      return false;
    }

    if (!deliveryTime || deliveryTime <= 0) {
      toast.error(
        "Please enter a valid delivery time."
      );

      return false;
    }

    return true;
  };

  /* =====================================================
     SUBMIT PROPOSAL
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      await submitProposal({
        gigId,

        proposalDescription:
          formData.proposalDescription.trim(),

        bidAmount: Number(formData.bidAmount),

        estimatedCompletionTime: Number(
          formData.estimatedCompletionTime
        ),
      });

      toast.success(
        "Proposal submitted successfully!"
      );

      setTimeout(() => {
        navigate("/my-proposals");
      }, 800);
    } catch (error) {
      console.error(
        "Submit proposal error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to submit proposal."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600">

          <div className="w-full px-6 py-14 lg:px-12 xl:px-20">

            <motion.div
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
              }}
            >

              <Link
                to="/browse-gigs"
                className="mb-6 inline-flex items-center gap-2 font-semibold text-blue-100 transition hover:text-white"
              >
                <FaArrowLeft />
                Back to Browse Gigs
              </Link>

              <p className="mb-3 font-semibold uppercase tracking-widest text-blue-200">
                Freelancer Workspace
              </p>

              <h1 className="text-4xl font-black text-white md:text-5xl">
                Submit Your Proposal
              </h1>

              <p className="mt-4 max-w-3xl text-lg leading-8 text-blue-100">
                Showcase your experience, explain your approach,
                and submit a competitive offer for this project.
              </p>

            </motion.div>

          </div>

        </section>

        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="w-full px-6 py-10 lg:px-12 xl:px-20">

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">

            {/* =================================================
                FORM
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.1,
              }}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10"
            >

              <div className="mb-8">

                <h2 className="text-2xl font-black text-slate-900">
                  Create Your Proposal
                </h2>

                <p className="mt-2 text-slate-500">
                  Provide clear and professional information
                  to improve your chances of getting selected.
                </p>

              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-7"
              >

                {/* =================================================
                    DESCRIPTION
                ================================================= */}

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label
                      htmlFor="proposalDescription"
                      className="font-bold text-slate-800"
                    >
                      Proposal Description
                    </label>

                    <span className="text-sm text-slate-400">
                      {
                        formData.proposalDescription.length
                      }{" "}
                      characters
                    </span>

                  </div>

                  <textarea
                    id="proposalDescription"
                    name="proposalDescription"
                    rows={10}
                    value={
                      formData.proposalDescription
                    }
                    onChange={handleChange}
                    placeholder="Explain why you are the right freelancer for this project..."
                    maxLength={3000}
                    required
                    className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-5 leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />

                  <p className="mt-2 text-sm text-slate-500">
                    Minimum 50 characters recommended for a
                    strong proposal.
                  </p>

                </div>

                {/* =================================================
                    BID + DELIVERY
                ================================================= */}

                <div className="grid gap-6 md:grid-cols-2">

                  {/* BID */}

                  <div>

                    <label
                      htmlFor="bidAmount"
                      className="mb-2 flex items-center gap-2 font-bold text-slate-800"
                    >
                      <FaMoneyBillWave className="text-green-600" />

                      Bid Amount
                    </label>

                    <div className="relative">

                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">
                        ₹
                      </span>

                      <input
                        id="bidAmount"
                        type="number"
                        name="bidAmount"
                        min="1"
                        step="1"
                        value={formData.bidAmount}
                        onChange={handleChange}
                        placeholder="5000"
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      />

                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      Enter your total project price.
                    </p>

                  </div>

                  {/* DELIVERY */}

                  <div>

                    <label
                      htmlFor="estimatedCompletionTime"
                      className="mb-2 flex items-center gap-2 font-bold text-slate-800"
                    >
                      <FaClock className="text-purple-600" />

                      Delivery Time
                    </label>

                    <div className="relative">

                      <input
                        id="estimatedCompletionTime"
                        type="number"
                        name="estimatedCompletionTime"
                        min="1"
                        step="1"
                        value={
                          formData.estimatedCompletionTime
                        }
                        onChange={handleChange}
                        placeholder="7"
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-4 pr-20 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      />

                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-semibold text-slate-500">
                        Days
                      </span>

                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      Give a realistic completion timeline.
                    </p>

                  </div>

                </div>

                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div className="flex flex-col gap-4 border-t border-slate-100 pt-7 sm:flex-row">

                  <Link
                    to="/browse-gigs"
                    className="flex flex-1 items-center justify-center rounded-2xl border border-slate-300 px-6 py-4 font-bold text-slate-700 transition hover:bg-slate-100"
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex flex-1 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-4 font-bold text-white shadow-lg transition hover:shadow-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    {loading ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />

                        Submitting...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />

                        Submit Proposal
                      </>
                    )}

                  </button>

                </div>

              </form>

            </motion.div>

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <motion.aside
              initial={{
                opacity: 0,
                x: 25,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.2,
              }}
              className="space-y-6"
            >

              {/* TIPS */}

              <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">

                <div className="mb-5 flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-xl text-white">
                    <FaLightbulb />
                  </div>

                  <h2 className="text-xl font-black text-blue-900">
                    Proposal Tips
                  </h2>

                </div>

                <div className="space-y-4">

                  <Tip text="Introduce yourself professionally." />

                  <Tip text="Explain your relevant experience." />

                  <Tip text="Mention similar projects you have completed." />

                  <Tip text="Provide a realistic delivery timeline." />

                  <Tip text="Keep your bid competitive and reasonable." />

                </div>

              </div>

              {/* CHECKLIST */}

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                <h2 className="mb-5 text-xl font-black text-slate-900">
                  Before You Submit
                </h2>

                <div className="space-y-4">

                  <ChecklistItem text="Your proposal is clear and professional" />

                  <ChecklistItem text="Your bid amount is realistic" />

                  <ChecklistItem text="Your delivery time is achievable" />

                  <ChecklistItem text="You have explained your experience" />

                </div>

              </div>

            </motion.aside>

          </div>

        </section>

      </main>
    </>
  );
};

/* =========================================================
   TIP COMPONENT
========================================================= */

const Tip = ({ text }) => {
  return (
    <div className="flex items-start gap-3">

      <FaCheckCircle className="mt-1 shrink-0 text-blue-600" />

      <p className="text-sm leading-6 text-blue-900">
        {text}
      </p>

    </div>
  );
};

/* =========================================================
   CHECKLIST COMPONENT
========================================================= */

const ChecklistItem = ({ text }) => {
  return (
    <div className="flex items-start gap-3">

      <FaCheckCircle className="mt-1 shrink-0 text-green-600" />

      <p className="text-sm leading-6 text-slate-600">
        {text}
      </p>

    </div>
  );
};

export default SubmitProposal;