import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import {
  FaCheckCircle,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaFlag,
  FaReply,
  FaThumbsUp,
} from "react-icons/fa";

import RatingStars from "./RatingStars";
import HelpfulButton from "./HelpfulButton";
import ReportModal from "./ReportModal";
import ReviewReplies from "./ReviewReplies";

import { deleteReview } from "../../services/reviewService";

/* ==========================================================
   HELPERS
========================================================== */

const getUserId = (user) => {
  if (!user) return null;

  if (typeof user === "string") {
    return user;
  }

  return user._id || user.id || null;
};

const getReviewClientId = (review) => {
  if (!review?.client) return null;

  if (typeof review.client === "string") {
    return review.client;
  }

  return review.client._id || review.client.id || null;
};

const formatDate = (date) => {
  if (!date) return "Unknown date";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown date";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getRating = (value) => {
  const rating = Number(value);

  if (Number.isNaN(rating)) return 0;

  return Math.min(5, Math.max(0, rating));
};

/* ==========================================================
   COMPONENT
========================================================== */

const ReviewCard = ({
  review,
  currentUser = null,
  showActions = true,
  onDeleted,
  onEdit,
  onReported,
  onHelpful,
}) => {
  const [deleteLoading, setDeleteLoading] =
    useState(false);

  const [showReport, setShowReport] =
    useState(false);

  /* ========================================================
     SAFETY
  ======================================================== */

  if (!review) {
    return null;
  }

  /* ========================================================
     DATA
  ======================================================== */

  const client =
    typeof review.client === "object"
      ? review.client
      : null;

  const clientId =
    getReviewClientId(review);

  const currentUserId =
    getUserId(currentUser);

  const canManage =
    Boolean(
      currentUserId &&
      clientId &&
      currentUserId === clientId
    );

  const repliesCount =
    review.replyCount ??
    review.replies?.length ??
    0;

  const helpfulCount =
    review.helpfulCount ??
    review.helpfulVotes?.length ??
    0;

  const isVerified =
    review.verified === true ||
    review.isVerified === true;

  const displayName =
    client?.name ||
    review.clientName ||
    "Anonymous Client";

  const profileImage =
    client?.profileImage ||
    client?.avatar ||
    review.client?.profilePicture ||
    "/default-avatar.png";

  /* ========================================================
     RATINGS
  ======================================================== */

  const ratings = useMemo(
    () => [
      {
        label: "Communication",
        value: review.communication,
      },
      {
        label: "Quality of Work",
        value: review.quality,
      },
      {
        label: "Delivery",
        value: review.delivery,
      },
      {
        label: "Professionalism",
        value: review.professionalism,
      },
      {
        label: "Value for Money",
        value: review.valueForMoney,
      },
    ],
    [review]
  );

  /* ========================================================
     DELETE REVIEW
  ======================================================== */

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeleteLoading(true);

      await deleteReview(review._id);

      if (onDeleted) {
        onDeleted(review._id);
      }
    } catch (error) {
      console.error(
        "Delete review error:",
        error
      );

      window.alert(
        error?.message ||
          "Unable to delete review."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  /* ========================================================
     REPORT SUCCESS
  ======================================================== */

  const handleReported = () => {
    setShowReport(false);

    if (onReported) {
      onReported(review._id);
    }
  };

  /* ========================================================
     RENDER
  ======================================================== */

  return (
    <>
      <motion.article
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        whileHover={{
          y: -3,
        }}
        transition={{
          duration: 0.3,
        }}
        className="
          overflow-hidden
          rounded-3xl
          border
          border-gray-200
          bg-white
          shadow-lg
          transition-shadow
          hover:shadow-2xl
        "
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <div
          className="
            flex
            flex-col
            gap-5
            border-b
            border-gray-100
            bg-gradient-to-r
            from-slate-50
            to-blue-50
            p-6
            sm:flex-row
            sm:items-start
            sm:justify-between
          "
        >
          {/* CLIENT */}

          <div className="flex items-start gap-4">
            <img
              src={profileImage}
              alt={`${displayName} profile`}
              className="
                h-16
                w-16
                rounded-full
                border-4
                border-white
                object-cover
                shadow-md
              "
              onError={(event) => {
                event.currentTarget.src =
                  "/default-avatar.png";
              }}
            />

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  className="
                    text-xl
                    font-bold
                    text-gray-800
                  "
                >
                  {displayName}
                </h3>

                {isVerified && (
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1
                      rounded-full
                      bg-blue-100
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      text-blue-700
                    "
                  >
                    <FaCheckCircle />
                    Verified
                  </span>
                )}
              </div>

              {/* OVERALL RATING */}

              <div className="mt-2">
                <RatingStars
                  rating={getRating(
                    review.overallRating
                  )}
                  size={20}
                  showValue
                />
              </div>

              {/* DATE */}

              <div
                className="
                  mt-2
                  flex
                  items-center
                  gap-2
                  text-sm
                  text-gray-500
                "
              >
                <FaCalendarAlt />

                <span>
                  {formatDate(
                    review.createdAt
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* OWNER ACTIONS */}

          {showActions && canManage && (
            <div className="flex gap-2">
              {onEdit && (
                <button
                  type="button"
                  onClick={() =>
                    onEdit(review)
                  }
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-blue-200
                    bg-white
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-blue-600
                    transition
                    hover:bg-blue-50
                  "
                >
                  <FaEdit />
                  Edit
                </button>
              )}

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteLoading}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-red-200
                  bg-white
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-red-600
                  transition
                  hover:bg-red-50
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <FaTrash />

                {deleteLoading
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          )}
        </div>

        {/* ==================================================
            CONTENT
        ================================================== */}

        <div className="p-6">
          {/* TITLE */}

          {review.title && (
            <h2
              className="
                text-2xl
                font-bold
                text-gray-800
              "
            >
              {review.title}
            </h2>
          )}

          {/* COMMENT */}

          <p
            className="
              mt-4
              whitespace-pre-wrap
              leading-8
              text-gray-600
            "
          >
            {review.comment}
          </p>

          {/* =================================================
              RECOMMENDATION BADGES
          ================================================= */}

          <div
            className="
              mt-6
              flex
              flex-wrap
              gap-3
            "
          >
            <span
              className={`
                inline-flex
                items-center
                gap-2
                rounded-full
                px-4
                py-2
                text-sm
                font-semibold
                ${
                  review.recommendFreelancer
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }
              `}
            >
              {review.recommendFreelancer
                ? "✓ Recommended"
                : "✕ Not Recommended"}
            </span>

            <span
              className={`
                inline-flex
                items-center
                gap-2
                rounded-full
                px-4
                py-2
                text-sm
                font-semibold
                ${
                  review.wouldHireAgain
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }
              `}
            >
              {review.wouldHireAgain
                ? "↻ Would Hire Again"
                : "Would Not Hire Again"}
            </span>
          </div>

          {/* =================================================
              RATING BREAKDOWN
          ================================================= */}

          <div className="mt-8">
            <h3
              className="
                mb-4
                text-lg
                font-bold
                text-gray-800
              "
            >
              Rating Breakdown
            </h3>

            <div
              className="
                grid
                gap-4
                sm:grid-cols-2
                lg:grid-cols-3
              "
            >
              {ratings.map((item) => (
                <div
                  key={item.label}
                  className="
                    rounded-2xl
                    border
                    border-gray-200
                    bg-gray-50
                    p-4
                  "
                >
                  <p
                    className="
                      mb-2
                      text-sm
                      font-semibold
                      text-gray-700
                    "
                  >
                    {item.label}
                  </p>

                  <RatingStars
                    rating={getRating(
                      item.value
                    )}
                    showValue
                  />
                </div>
              ))}
            </div>
          </div>

          {/* =================================================
              STATISTICS
          ================================================= */}

          <div
            className="
              mt-8
              grid
              gap-4
              sm:grid-cols-3
            "
          >
            <div
              className="
                rounded-2xl
                bg-blue-50
                p-5
                text-center
              "
            >
              <p
                className="
                  text-3xl
                  font-black
                  text-blue-600
                "
              >
                {getRating(
                  review.overallRating
                ).toFixed(1)}
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  text-gray-600
                "
              >
                Overall Rating
              </p>
            </div>

            <div
              className="
                rounded-2xl
                bg-green-50
                p-5
                text-center
              "
            >
              <p
                className="
                  text-3xl
                  font-black
                  text-green-600
                "
              >
                {helpfulCount}
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  text-gray-600
                "
              >
                Helpful Votes
              </p>
            </div>

            <div
              className="
                rounded-2xl
                bg-purple-50
                p-5
                text-center
              "
            >
              <p
                className="
                  text-3xl
                  font-black
                  text-purple-600
                "
              >
                {repliesCount}
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  text-gray-600
                "
              >
                Replies
              </p>
            </div>
          </div>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div
            className="
              mt-8
              flex
              flex-col
              gap-3
              border-t
              border-gray-200
              pt-6
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            {/* HELPFUL */}

            <div className="flex items-center gap-2">
              <FaThumbsUp
                className="
                  text-gray-400
                "
              />

              <HelpfulButton
                review={review}
                onHelpful={onHelpful}
              />
            </div>

            {/* REPORT */}

            <button
              type="button"
              onClick={() =>
                setShowReport(true)
              }
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-red-200
                px-5
                py-2.5
                font-semibold
                text-red-600
                transition
                hover:bg-red-50
              "
            >
              <FaFlag />
              Report Review
            </button>
          </div>

          {/* =================================================
              REPLIES
          ================================================= */}

          <div
            className="
              mt-8
              border-t
              border-gray-200
              pt-8
            "
          >
            <div
              className="
                mb-4
                flex
                items-center
                gap-2
                text-lg
                font-bold
                text-gray-800
              "
            >
              <FaReply />
              Replies
            </div>

            <ReviewReplies
              review={review}
            />
          </div>
        </div>
      </motion.article>

      {/* ====================================================
          REPORT MODAL
      ==================================================== */}

      <ReportModal
        show={showReport}
        reviewId={review._id}
        onClose={() =>
          setShowReport(false)
        }
        onReported={handleReported}
      />
    </>
  );
};

export default ReviewCard;