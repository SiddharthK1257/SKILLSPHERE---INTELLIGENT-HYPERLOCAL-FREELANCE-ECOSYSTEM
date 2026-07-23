import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaThumbsUp,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";

import { markHelpful } from "../../services/reviewService";

/* =========================================================
   HELPFUL BUTTON
========================================================= */

const HelpfulButton = ({
  review,
  onHelpfulChange,
  size = "md",
}) => {
  /* =======================================================
     SAFE INITIAL COUNT
  ======================================================= */

  const initialCount = Math.max(
    0,
    Number(review?.helpfulCount) || 0
  );

  /* =======================================================
     STATES
  ======================================================= */

  const [count, setCount] =
    useState(initialCount);

  const [clicked, setClicked] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =======================================================
     SYNC WHEN REVIEW CHANGES
  ======================================================= */

  useEffect(() => {
    setCount(
      Math.max(
        0,
        Number(review?.helpfulCount) || 0
      )
    );

    setClicked(false);
    setError("");
  }, [
    review?._id,
    review?.helpfulCount,
  ]);

  /* =======================================================
     HANDLE HELPFUL
  ======================================================= */

  const handleHelpful = async () => {
    if (
      loading ||
      clicked ||
      !review?._id
    ) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response =
        await markHelpful(review._id);

      /*
        Supports responses like:

        {
          success: true,
          helpfulCount: 10
        }

        or:

        {
          success: true,
          review: {
            helpfulCount: 10
          }
        }
      */

      if (
        response?.success === false
      ) {
        throw new Error(
          response.message ||
            "Unable to mark review as helpful."
        );
      }

      const updatedCount =
        response?.helpfulCount ??
        response?.review?.helpfulCount ??
        count + 1;

      setCount(
        Math.max(
          0,
          Number(updatedCount)
        )
      );

      setClicked(true);

      if (onHelpfulChange) {
        onHelpfulChange({
          reviewId: review._id,
          helpfulCount: Number(
            updatedCount
          ),
        });
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to mark review as helpful.";

      setError(message);

      /*
        Automatically hide error after a short delay.
      */

      setTimeout(() => {
        setError("");
      }, 4000);
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     BUTTON SIZE
  ======================================================= */

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2",
    lg: "px-5 py-3 text-lg",
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="relative inline-flex flex-col items-start gap-2">
      {/* ===================================================
          BUTTON
      =================================================== */}

      <motion.button
        type="button"
        onClick={handleHelpful}
        disabled={
          loading ||
          clicked ||
          !review?._id
        }
        whileHover={
          !loading && !clicked
            ? {
                scale: 1.03,
              }
            : undefined
        }
        whileTap={
          !loading && !clicked
            ? {
                scale: 0.96,
              }
            : undefined
        }
        aria-label={
          clicked
            ? "You marked this review as helpful"
            : "Mark this review as helpful"
        }
        aria-pressed={clicked}
        className={`
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          font-semibold
          transition-all
          duration-200
          focus:outline-none
          focus:ring-4
          focus:ring-green-100
          disabled:cursor-not-allowed
          disabled:opacity-80

          ${sizeClasses[size] || sizeClasses.md}

          ${
            clicked
              ? `
                border-green-600
                bg-green-600
                text-white
                shadow-lg
              `
              : `
                border-green-600
                bg-white
                text-green-600
                hover:bg-green-50
                hover:shadow-md
              `
          }
        `}
      >
        {/* LOADING */}

        {loading ? (
          <>
            <FaSpinner
              className="animate-spin"
            />

            <span>
              Updating...
            </span>
          </>
        ) : clicked ? (
          <>
            <FaCheckCircle />

            <span>
              Marked Helpful
            </span>

            <span
              className="
                rounded-full
                bg-white/20
                px-2
                py-0.5
                text-sm
              "
            >
              {count}
            </span>
          </>
        ) : (
          <>
            <FaThumbsUp />

            <span>
              Helpful
            </span>

            <span
              className="
                rounded-full
                bg-green-100
                px-2
                py-0.5
                text-sm
              "
            >
              {count}
            </span>
          </>
        )}
      </motion.button>

      {/* ===================================================
          ERROR MESSAGE
      =================================================== */}

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{
              opacity: 0,
              y: -5,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -5,
            }}
            className="
              absolute
              left-0
              top-full
              z-10
              mt-2
              w-max
              max-w-xs
              rounded-lg
              bg-red-50
              px-3
              py-2
              text-xs
              font-medium
              text-red-600
              shadow-md
            "
            role="alert"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HelpfulButton;