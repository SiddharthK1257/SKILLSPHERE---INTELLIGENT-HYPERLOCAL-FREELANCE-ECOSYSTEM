import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { motion } from "framer-motion";

import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaFlag,
  FaThumbsUp,
  FaSpinner,
} from "react-icons/fa";

import ReviewCard from "../components/reviews/ReviewCard";
import ReviewReplies from "../components/reviews/ReviewReplies";
import RatingDistribution from "../components/reviews/RatingDistribution";
import ReportModal from "../components/reviews/ReportModal";
import DeleteModal from "../components/reviews/DeleteModal";

import {
  getReviewById,
  markHelpful,
  deleteReview,
} from "../services/reviewService";

const ReviewDetails = () => {

  const navigate = useNavigate();

  const { id } = useParams();

  /* =====================================
      STATES
  ===================================== */

  const [review, setReview] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [helpfulLoading, setHelpfulLoading] =
    useState(false);

  const [showReport, setShowReport] =
    useState(false);

  const [showDelete, setShowDelete] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =====================================
      LOAD REVIEW
  ===================================== */

  useEffect(() => {

    if (id) {

      fetchReview();

    }

  }, [id]);

  const fetchReview = async () => {

    try {

      setLoading(true);

      const response =
        await getReviewById(id);

      setReview(
        response.review ||
        response
      );

    } catch (err) {

      setError(

        err?.response?.data?.message ||

        "Unable to load review."

      );

    } finally {

      setLoading(false);

    }

  };

  /* =====================================
      HELPFUL
  ===================================== */

  const handleHelpful = async () => {

    try {

      setHelpfulLoading(true);

      await markHelpful(id);

      fetchReview();

    } catch (err) {

      console.error(err);

    } finally {

      setHelpfulLoading(false);

    }

  };

  /* =====================================
      DELETE
  ===================================== */

  const handleDelete = async () => {

    try {

      await deleteReview(id);

      navigate("/reviews");

    } catch (err) {

      alert(

        err?.response?.data?.message ||

        "Unable to delete review."

      );

    }

  };

  /* =====================================
      LOADING
  ===================================== */

  if (loading) {

    return (

      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-gradient-to-br
          from-slate-50
          via-blue-50
          to-indigo-100
        "
      >

        <motion.div

          animate={{
            rotate:360,
          }}

          transition={{
            repeat:Infinity,
            duration:1,
            ease:"linear",
          }}

          className="
            flex
            h-24
            w-24
            items-center
            justify-center
            rounded-full
            border-4
            border-blue-600
            border-t-transparent
          "
        >

          <FaSpinner
            className="
              text-3xl
              text-blue-600
            "
          />

        </motion.div>

      </div>

    );

  }

  return (

    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-slate-50
        via-blue-50
        to-indigo-100
        py-10
      "
    >

      <div
        className="
          mx-auto
          max-w-7xl
          px-6
        "
      >

        {/* ==========================
            HEADER
        ========================== */}

        <motion.div

          initial={{
            opacity:0,
            y:-20,
          }}

          animate={{
            opacity:1,
            y:0,
          }}

          className="
            mb-10
            flex
            flex-col
            gap-5
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >

          <div>

            <h1
              className="
                text-5xl
                font-black
                text-slate-800
              "
            >

              Review Details

            </h1>

            <p
              className="
                mt-3
                text-lg
                text-slate-600
              "
            >

              View complete review,
              replies and ratings.

            </p>

          </div>

          <motion.button

            whileHover={{
              scale:1.05,
            }}

            whileTap={{
              scale:.95,
            }}

            onClick={() =>
              navigate(-1)
            }

            className="
              flex
              items-center
              gap-3
              rounded-2xl
              bg-white
              px-6
              py-4
              font-semibold
              shadow-lg
            "
          >

            <FaArrowLeft />

            Back

          </motion.button>

        </motion.div>
                {/* =====================================
            MAIN CONTENT
        ===================================== */}

        <div
          className="
            grid
            gap-8
            lg:grid-cols-3
          "
        >

          {/* =====================================
              LEFT CONTENT
          ===================================== */}

          <div
            className="
              space-y-8
              lg:col-span-2
            "
          >

            {/* Error */}

            {error && (

              <motion.div
                initial={{
                  opacity: 0,
                  y: -20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="
                  rounded-3xl
                  border
                  border-red-200
                  bg-red-50
                  p-6
                  text-red-600
                  shadow-lg
                "
              >

                {error}

              </motion.div>

            )}

            {/* Review Card */}

            {review && (

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
                  delay: .2,
                }}
              >

                <ReviewCard
                  review={review}
                  showActions={false}
                />

              </motion.div>

            )}

            {/* Quick Actions */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: .3,
              }}
              className="
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-8
                shadow-xl
              "
            >

              <h2
                className="
                  mb-8
                  text-2xl
                  font-bold
                  text-slate-800
                "
              >
                Review Actions
              </h2>

              <div
                className="
                  flex
                  flex-wrap
                  gap-4
                "
              >

                {/* Helpful */}

                <motion.button
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{
                    scale: .95,
                  }}
                  disabled={helpfulLoading}
                  onClick={handleHelpful}
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    bg-blue-600
                    px-6
                    py-4
                    font-semibold
                    text-white
                    shadow-lg
                  "
                >

                  <FaThumbsUp />

                  {helpfulLoading
                    ? "Updating..."
                    : "Helpful"}

                </motion.button>

                {/* Edit */}

                <motion.button
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{
                    scale: .95,
                  }}
                  onClick={() =>
                    navigate(
                      `/reviews/edit/${review?._id}`
                    )
                  }
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    bg-yellow-500
                    px-6
                    py-4
                    font-semibold
                    text-white
                    shadow-lg
                  "
                >

                  <FaEdit />

                  Edit

                </motion.button>

                {/* Report */}

                <motion.button
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{
                    scale: .95,
                  }}
                  onClick={() =>
                    setShowReport(true)
                  }
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    bg-red-500
                    px-6
                    py-4
                    font-semibold
                    text-white
                    shadow-lg
                  "
                >

                  <FaFlag />

                  Report

                </motion.button>

                {/* Delete */}

                <motion.button
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{
                    scale: .95,
                  }}
                  onClick={() =>
                    setShowDelete(true)
                  }
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    bg-slate-900
                    px-6
                    py-4
                    font-semibold
                    text-white
                    shadow-lg
                  "
                >

                  <FaTrash />

                  Delete

                </motion.button>

              </div>

            </motion.div>

            {/* Replies */}

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
                delay: .4,
              }}
              className="
                overflow-hidden
                rounded-3xl
                border
                border-slate-200
                bg-white
                shadow-xl
              "
            >

              <div
                className="
                  border-b
                  border-slate-200
                  bg-gradient-to-r
                  from-blue-600
                  to-indigo-600
                  px-8
                  py-6
                  text-white
                "
              >

                <h2
                  className="
                    text-2xl
                    font-bold
                  "
                >
                  Review Replies
                </h2>

                <p
                  className="
                    mt-2
                    text-blue-100
                  "
                >
                  Conversation between client
                  and freelancer.
                </p>

              </div>

              <div className="p-8">

                <ReviewReplies
                  reviewId={review?._id}
                />

              </div>

            </motion.div>

          </div>
                    {/* =====================================
              RIGHT SIDEBAR
          ===================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.4,
            }}
            className="space-y-8"
          >

            {/* ==========================
                REVIEWER
            ========================== */}

            <div
              className="
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-8
                shadow-xl
              "
            >

              <h2
                className="
                  mb-6
                  text-2xl
                  font-bold
                  text-slate-800
                "
              >
                Reviewer
              </h2>

              <div className="flex items-center gap-5">

                <img
                  src={
                    review?.client?.avatar ||
                    "https://ui-avatars.com/api/?name=User&background=2563eb&color=fff"
                  }
                  alt="Reviewer"
                  className="
                    h-20
                    w-20
                    rounded-full
                    object-cover
                    ring-4
                    ring-blue-100
                  "
                />

                <div>

                  <h3
                    className="
                      text-xl
                      font-bold
                      text-slate-800
                    "
                  >
                    {review?.client?.name ||
                      "Anonymous"}
                  </h3>

                  <p className="text-slate-500">
                    {review?.client?.email ||
                      "No email available"}
                  </p>

                </div>

              </div>

            </div>

            {/* ==========================
                FREELANCER
            ========================== */}

            <div
              className="
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-8
                shadow-xl
              "
            >

              <h2
                className="
                  mb-6
                  text-2xl
                  font-bold
                  text-slate-800
                "
              >
                Freelancer
              </h2>

              <div className="flex items-center gap-5">

                <img
                  src={
                    review?.freelancer?.avatar ||
                    "https://ui-avatars.com/api/?name=Freelancer&background=0f172a&color=fff"
                  }
                  alt="Freelancer"
                  className="
                    h-20
                    w-20
                    rounded-full
                    object-cover
                    ring-4
                    ring-indigo-100
                  "
                />

                <div>

                  <h3
                    className="
                      text-xl
                      font-bold
                      text-slate-800
                    "
                  >
                    {review?.freelancer?.name ||
                      "Unknown"}
                  </h3>

                  <p className="text-slate-500">
                    {review?.freelancer?.email ||
                      "No email available"}
                  </p>

                </div>

              </div>

            </div>

            {/* ==========================
                RATING BREAKDOWN
            ========================== */}

            <div
              className="
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-8
                shadow-xl
              "
            >

              <h2
                className="
                  mb-6
                  text-2xl
                  font-bold
                  text-slate-800
                "
              >
                Rating Breakdown
              </h2>

              <RatingDistribution
                review={review}
              />

            </div>

            {/* ==========================
                REVIEW STATS
            ========================== */}

            <div
              className="
                rounded-3xl
                bg-gradient-to-br
                from-indigo-600
                via-blue-600
                to-cyan-500
                p-8
                text-white
                shadow-2xl
              "
            >

              <h2
                className="
                  mb-8
                  text-2xl
                  font-bold
                "
              >
                Review Statistics
              </h2>

              <div className="space-y-5">

                <div className="flex justify-between">

                  <span>
                    Overall Rating
                  </span>

                  <strong>
                    ⭐ {review?.overallRating || 0}/5
                  </strong>

                </div>

                <div className="flex justify-between">

                  <span>
                    Helpful Votes
                  </span>

                  <strong>
                    {review?.helpfulCount || 0}
                  </strong>

                </div>

                <div className="flex justify-between">

                  <span>
                    Replies
                  </span>

                  <strong>
                    {review?.replies?.length || 0}
                  </strong>

                </div>

                <div className="flex justify-between">

                  <span>
                    Recommendation
                  </span>

                  <strong>
                    {review?.recommendFreelancer
                      ? "Yes"
                      : "No"}
                  </strong>

                </div>

                <div className="flex justify-between">

                  <span>
                    Hire Again
                  </span>

                  <strong>
                    {review?.wouldHireAgain
                      ? "Yes"
                      : "No"}
                  </strong>

                </div>

              </div>

            </div>

            {/* ==========================
                REVIEW INSIGHT
            ========================== */}

            <div
              className="
                rounded-3xl
                border
                border-blue-100
                bg-blue-50
                p-8
                shadow-lg
              "
            >

              <h2
                className="
                  mb-4
                  text-xl
                  font-bold
                  text-blue-700
                "
              >
                Review Insight
              </h2>

              <p
                className="
                  leading-8
                  text-slate-700
                "
              >
                Reviews with detailed comments,
                category ratings, and constructive
                feedback help build trust within
                the platform. They also improve
                freelancer reputation and assist
                future clients in making informed
                hiring decisions.
              </p>

            </div>

          </motion.div>

        </div>
                {/* =====================================
            MODALS
        ===================================== */}

        <ReportModal
          show={showReport}
          reviewId={review?._id}
          onClose={() => setShowReport(false)}
        />

        <DeleteModal
          show={showDelete}
          title="Delete Review"
          message="Are you sure you want to permanently delete this review? This action cannot be undone."
          loading={false}
          onClose={() => setShowDelete(false)}
          onConfirm={handleDelete}
        />

        {/* =====================================
            FOOTER CTA
        ===================================== */}

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
            delay: 0.6,
          }}
          className="mt-12"
        >

          <div
            className="
              relative
              overflow-hidden
              rounded-3xl
              bg-gradient-to-r
              from-indigo-700
              via-blue-700
              to-cyan-600
              p-10
              text-white
              shadow-2xl
            "
          >

            {/* Decorative Background */}

            <div
              className="
                absolute
                -top-20
                -right-20
                h-64
                w-64
                rounded-full
                bg-white/10
                blur-3xl
              "
            />

            <div
              className="
                absolute
                -bottom-20
                -left-20
                h-64
                w-64
                rounded-full
                bg-cyan-300/10
                blur-3xl
              "
            />

            <div className="relative z-10">

              <div
                className="
                  flex
                  flex-col
                  gap-8
                  lg:flex-row
                  lg:items-center
                  lg:justify-between
                "
              >

                <div>

                  <h2
                    className="
                      text-4xl
                      font-black
                    "
                  >
                    Help Build Trust
                  </h2>

                  <p
                    className="
                      mt-4
                      max-w-2xl
                      text-blue-100
                      leading-8
                    "
                  >
                    Honest reviews, meaningful ratings,
                    and respectful discussions help create
                    a transparent freelancing marketplace.
                    Your feedback supports both clients
                    and freelancers.
                  </p>

                </div>

                <div
                  className="
                    flex
                    flex-wrap
                    gap-4
                  "
                >

                  <motion.button
                    whileHover={{
                      scale: 1.05,
                    }}
                    whileTap={{
                      scale: 0.95,
                    }}
                    onClick={() =>
                      navigate("/reviews")
                    }
                    className="
                      rounded-2xl
                      bg-white
                      px-8
                      py-4
                      font-semibold
                      text-indigo-700
                      shadow-lg
                    "
                  >
                    All Reviews
                  </motion.button>

                  <motion.button
                    whileHover={{
                      scale: 1.05,
                    }}
                    whileTap={{
                      scale: 0.95,
                    }}
                    onClick={() =>
                      navigate("/dashboard")
                    }
                    className="
                      rounded-2xl
                      border
                      border-white/30
                      bg-white/10
                      px-8
                      py-4
                      font-semibold
                      text-white
                      backdrop-blur-lg
                    "
                  >
                    Dashboard
                  </motion.button>

                </div>

              </div>

            </div>

          </div>

        </motion.div>

      </div>

    </div>

  );

};

export default ReviewDetails;