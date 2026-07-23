import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import {
  FaChartLine,
  FaStar,
  FaThumbsUp,
  FaRedo,
  FaCommentDots,
  FaSpinner,
  FaSyncAlt,
  FaAward,
  FaExclamationTriangle,
} from "react-icons/fa";

import RatingDistribution from "./RatingDistribution";
import ReputationBadge from "./ReputationBadge";

import {
  getReviewAnalytics,
} from "../../services/reviewService";

/* ============================================================
   CONSTANTS
============================================================ */

const DEFAULT_ANALYTICS = {
  averageRating: 0,
  totalReviews: 0,
  recommendationRate: 0,
  hireAgainRate: 0,
  responseRate: 0,
  ratingDistribution: {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  },
  ratingBreakdown: {
    communicationRating: 0,
    qualityRating: 0,
    deadlineRating: 0,
    professionalismRating: 0,
    valueRating: 0,
  },
};

/* ============================================================
   HELPER FUNCTIONS
============================================================ */

const toNumber = (value, fallback = 0) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
};

const clampPercentage = (value) => {
  return Math.min(
    100,
    Math.max(0, toNumber(value))
  );
};

const formatPercentage = (value) => {
  return `${Math.round(
    clampPercentage(value)
  )}%`;
};

const getRatingPercentage = (rating) => {
  return clampPercentage(
    toNumber(rating) * 20
  );
};

/* ============================================================
   REUSABLE STAT CARD
============================================================ */

const StatCard = ({
  icon,
  label,
  value,
  description,
  gradient,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 24,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay,
        duration: 0.45,
      }}
      whileHover={{
        y: -6,
        scale: 1.02,
      }}
      className={`
        rounded-3xl
        bg-gradient-to-br
        ${gradient}
        p-6
        text-white
        shadow-xl
      `}
    >
      <div className="flex items-center justify-between">
        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-white/20
            backdrop-blur
          "
        >
          {icon}
        </div>

        <span
          className="
            rounded-full
            bg-white/20
            px-3
            py-1
            text-xs
            font-semibold
          "
        >
          {label}
        </span>
      </div>

      <h2
        className="
          mt-6
          text-4xl
          font-black
          tracking-tight
        "
      >
        {value}
      </h2>

      <p
        className="
          mt-2
          text-sm
          text-white/80
        "
      >
        {description}
      </p>
    </motion.div>
  );
};

/* ============================================================
   PROGRESS METRIC
============================================================ */

const ProgressMetric = ({
  label,
  value,
  suffix = "%",
  color = "from-blue-500 to-indigo-600",
  delay = 0,
}) => {
  const numericValue = clampPercentage(value);

  return (
    <div className="mt-7">
      <div
        className="
          mb-2
          flex
          items-center
          justify-between
          gap-4
        "
      >
        <span
          className="
            text-sm
            font-semibold
            text-slate-700
          "
        >
          {label}
        </span>

        <span
          className="
            text-sm
            font-bold
            text-slate-900
          "
        >
          {toNumber(value).toFixed(
            suffix === "/ 5" ? 1 : 0
          )}

          {suffix}
        </span>
      </div>

      <div
        className="
          h-3
          overflow-hidden
          rounded-full
          bg-slate-200
        "
      >
        <motion.div
          initial={{
            width: 0,
          }}
          animate={{
            width: `${numericValue}%`,
          }}
          transition={{
            duration: 1,
            delay,
            ease: "easeOut",
          }}
          className={`
            h-full
            rounded-full
            bg-gradient-to-r
            ${color}
          `}
        />
      </div>
    </div>
  );
};

/* ============================================================
   MAIN COMPONENT
============================================================ */

const ReviewAnalytics = ({
  freelancerId,
  refreshKey = 0,
  onAnalyticsLoaded,
}) => {
  const [analytics, setAnalytics] =
    useState(DEFAULT_ANALYTICS);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  /* ============================================================
     LOAD ANALYTICS
  ============================================================ */

  const loadAnalytics = useCallback(
    async () => {
      if (!freelancerId) {
        setAnalytics(DEFAULT_ANALYTICS);
        setLoading(false);
        return;
      }

      try {
        setError("");
        setRefreshing(true);

        const response =
          await getReviewAnalytics(
            freelancerId
          );

        const data =
          response?.analytics ||
          response?.data?.analytics ||
          response?.data ||
          response ||
          {};

        const normalizedAnalytics = {
          ...DEFAULT_ANALYTICS,
          ...data,

          averageRating: toNumber(
            data.averageRating
          ),

          totalReviews: toNumber(
            data.totalReviews
          ),

          recommendationRate:
            clampPercentage(
              data.recommendationRate
            ),

          hireAgainRate:
            clampPercentage(
              data.hireAgainRate
            ),

          responseRate:
            clampPercentage(
              data.responseRate
            ),

          ratingDistribution: {
            ...DEFAULT_ANALYTICS.ratingDistribution,
            ...(data.ratingDistribution ||
              {}),
          },

          ratingBreakdown: {
            ...DEFAULT_ANALYTICS.ratingBreakdown,
            ...(data.ratingBreakdown ||
              {}),
          },
        };

        setAnalytics(
          normalizedAnalytics
        );

        if (onAnalyticsLoaded) {
          onAnalyticsLoaded(
            normalizedAnalytics
          );
        }
      } catch (err) {
        console.error(
          "Review analytics error:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load review analytics."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [
      freelancerId,
      onAnalyticsLoaded,
    ]
  );

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics, refreshKey]);

  /* ============================================================
     DERIVED DATA
  ============================================================ */

  const {
    averageRating,
    totalReviews,
    recommendationRate,
    hireAgainRate,
    responseRate,
    ratingDistribution,
    ratingBreakdown,
  } = analytics;

  const performanceStatus = useMemo(() => {
    if (totalReviews === 0) {
      return {
        title: "No Reviews Yet",
        description:
          "Complete successful projects to start building your reputation.",
      };
    }

    if (averageRating >= 4.8) {
      return {
        title: "Outstanding Performance",
        description:
          "Your clients consistently rate your work exceptionally highly.",
      };
    }

    if (averageRating >= 4.5) {
      return {
        title: "Excellent Performance",
        description:
          "You are maintaining a very strong reputation with clients.",
      };
    }

    if (averageRating >= 4) {
      return {
        title: "Good Standing",
        description:
          "Your overall performance is positive. Continue improving your service quality.",
      };
    }

    return {
      title: "Growth Opportunity",
      description:
        "Focus on communication, quality, and delivery consistency to improve your reputation.",
    };
  }, [
    averageRating,
    totalReviews,
  ]);

  /* ============================================================
     INITIAL LOADING
  ============================================================ */

  if (loading && !analytics) {
    return (
      <div
        className="
          flex
          min-h-[400px]
          items-center
          justify-center
        "
      >
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
        >
          <FaSpinner
            className="
              text-5xl
              text-blue-600
            "
          />
        </motion.div>
      </div>
    );
  }

  /* ============================================================
     ERROR STATE
  ============================================================ */

  if (error && totalReviews === 0) {
    return (
      <div
        className="
          rounded-3xl
          border
          border-red-200
          bg-red-50
          p-10
          text-center
        "
      >
        <FaExclamationTriangle
          className="
            mx-auto
            text-4xl
            text-red-500
          "
        />

        <h3
          className="
            mt-4
            text-xl
            font-bold
            text-red-700
          "
        >
          Unable to Load Analytics
        </h3>

        <p
          className="
            mt-2
            text-red-600
          "
        >
          {error}
        </p>

        <button
          type="button"
          onClick={loadAnalytics}
          className="
            mt-6
            inline-flex
            items-center
            gap-2
            rounded-xl
            bg-red-600
            px-5
            py-3
            font-semibold
            text-white
            transition
            hover:bg-red-700
          "
        >
          <FaSyncAlt />
          Try Again
        </button>
      </div>
    );
  }

  /* ============================================================
     MAIN UI
  ============================================================ */

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      className="
        mx-auto
        max-w-7xl
        space-y-8
      "
    >
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div
        className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          <h2
            className="
              text-3xl
              font-black
              text-slate-800
            "
          >
            Review Analytics
          </h2>

          <p
            className="
              mt-2
              text-slate-500
            "
          >
            Understand your client satisfaction and professional reputation.
          </p>
        </div>

        <button
          type="button"
          onClick={loadAnalytics}
          disabled={refreshing}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-slate-200
            bg-white
            px-5
            py-3
            font-semibold
            text-slate-700
            shadow-sm
            transition
            hover:border-blue-300
            hover:text-blue-600
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
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

      {/* ======================================================
          SUMMARY CARDS
      ====================================================== */}

      <div
        className="
          grid
          gap-6
          sm:grid-cols-2
          xl:grid-cols-5
        "
      >
        <StatCard
          icon={<FaStar size={28} />}
          label="Overall"
          value={averageRating.toFixed(1)}
          description="Average Rating"
          gradient="
            from-yellow-400
            via-amber-500
            to-orange-500
          "
          delay={0.1}
        />

        <StatCard
          icon={<FaCommentDots size={28} />}
          label="Reviews"
          value={totalReviews}
          description="Total Reviews"
          gradient="
            from-blue-500
            via-indigo-600
            to-purple-700
          "
          delay={0.2}
        />

        <StatCard
          icon={<FaThumbsUp size={28} />}
          label="Recommend"
          value={formatPercentage(
            recommendationRate
          )}
          description="Recommendation Rate"
          gradient="
            from-green-500
            via-emerald-600
            to-teal-600
          "
          delay={0.3}
        />

        <StatCard
          icon={<FaRedo size={28} />}
          label="Returning"
          value={formatPercentage(
            hireAgainRate
          )}
          description="Hire Again Rate"
          gradient="
            from-pink-500
            via-rose-600
            to-red-600
          "
          delay={0.4}
        />

        <StatCard
          icon={<FaChartLine size={28} />}
          label="Response"
          value={formatPercentage(
            responseRate
          )}
          description="Response Rate"
          gradient="
            from-cyan-500
            via-sky-600
            to-blue-700
          "
          delay={0.5}
        />
      </div>

      {/* ======================================================
          EMPTY STATE
      ====================================================== */}

      {totalReviews === 0 ? (
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            rounded-3xl
            border
            border-dashed
            border-slate-300
            bg-white
            p-12
            text-center
            shadow-sm
          "
        >
          <FaAward
            className="
              mx-auto
              text-6xl
              text-slate-300
            "
          />

          <h3
            className="
              mt-5
              text-2xl
              font-bold
              text-slate-800
            "
          >
            Start Building Your Reputation
          </h3>

          <p
            className="
              mx-auto
              mt-3
              max-w-xl
              leading-7
              text-slate-500
            "
          >
            Once clients complete projects and submit reviews,
            your rating distribution and performance analytics
            will appear here.
          </p>
        </motion.div>
      ) : (
        <>
          {/* ==================================================
              MAIN GRID
          ================================================== */}

          <div
            className="
              grid
              gap-8
              xl:grid-cols-3
            "
          >
            {/* =================================================
                LEFT
            ================================================= */}

            <div
              className="
                space-y-8
                xl:col-span-2
              "
            >
              <ReputationBadge
                analytics={analytics}
              />

              <RatingDistribution
                analytics={analytics}
              />

              {/* Rating Breakdown */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="
                  rounded-3xl
                  border
                  border-slate-200
                  bg-white
                  p-8
                  shadow-lg
                "
              >
                <h2
                  className="
                    text-2xl
                    font-bold
                    text-slate-800
                  "
                >
                  Rating Breakdown
                </h2>

                <p
                  className="
                    mt-2
                    text-sm
                    text-slate-500
                  "
                >
                  Average score across different aspects of your service.
                </p>

                <div
                  className="
                    mt-6
                    grid
                    gap-5
                    md:grid-cols-2
                  "
                >
                  <RatingBreakdownItem
                    label="Communication"
                    value={
                      ratingBreakdown.communicationRating
                    }
                    icon="💬"
                  />

                  <RatingBreakdownItem
                    label="Quality of Work"
                    value={
                      ratingBreakdown.qualityRating
                    }
                    icon="⭐"
                  />

                  <RatingBreakdownItem
                    label="Deadline"
                    value={
                      ratingBreakdown.deadlineRating
                    }
                    icon="⏱️"
                  />

                  <RatingBreakdownItem
                    label="Professionalism"
                    value={
                      ratingBreakdown.professionalismRating
                    }
                    icon="🤝"
                  />

                  <RatingBreakdownItem
                    label="Value for Money"
                    value={
                      ratingBreakdown.valueRating
                    }
                    icon="💰"
                  />
                </div>
              </motion.div>
            </div>

            {/* =================================================
                RIGHT
            ================================================= */}

            <div className="space-y-8">
              {/* Performance Overview */}

              <motion.div
                initial={{
                  opacity: 0,
                  x: 30,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                className="
                  rounded-3xl
                  border
                  border-slate-200
                  bg-white
                  p-8
                  shadow-lg
                "
              >
                <h2
                  className="
                    text-2xl
                    font-bold
                    text-slate-800
                  "
                >
                  Performance Overview
                </h2>

                <p
                  className="
                    mt-2
                    text-sm
                    text-slate-500
                  "
                >
                  Your most important reputation metrics.
                </p>

                <ProgressMetric
                  label="Average Rating"
                  value={getRatingPercentage(
                    averageRating
                  )}
                  suffix="%"
                  color="
                    from-yellow-400
                    via-amber-500
                    to-orange-500
                  "
                  delay={0.2}
                />

                <ProgressMetric
                  label="Recommendation"
                  value={recommendationRate}
                  color="
                    from-green-500
                    to-emerald-600
                  "
                  delay={0.3}
                />

                <ProgressMetric
                  label="Hire Again"
                  value={hireAgainRate}
                  color="
                    from-pink-500
                    to-rose-600
                  "
                  delay={0.4}
                />

                <ProgressMetric
                  label="Response Rate"
                  value={responseRate}
                  color="
                    from-blue-500
                    to-indigo-600
                  "
                  delay={0.5}
                />
              </motion.div>

              {/* Performance Status */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="
                  rounded-3xl
                  bg-gradient-to-br
                  from-indigo-600
                  via-blue-600
                  to-cyan-600
                  p-8
                  text-white
                  shadow-xl
                "
              >
                <div className="flex items-center gap-4">
                  <div
                    className="
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-2xl
                      bg-white/20
                    "
                  >
                    <FaAward size={28} />
                  </div>

                  <div>
                    <p
                      className="
                        text-sm
                        text-blue-100
                      "
                    >
                      Current Reputation
                    </p>

                    <h3
                      className="
                        text-2xl
                        font-black
                      "
                    >
                      {performanceStatus.title}
                    </h3>
                  </div>
                </div>

                <p
                  className="
                    mt-6
                    leading-7
                    text-blue-100
                  "
                >
                  {performanceStatus.description}
                </p>

                <div
                  className="
                    mt-6
                    rounded-2xl
                    bg-white/10
                    p-5
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >
                    <span>
                      Overall Score
                    </span>

                    <strong
                      className="
                        text-2xl
                      "
                    >
                      {averageRating.toFixed(1)}
                      /5
                    </strong>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* ==================================================
              INSIGHTS
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-8
              shadow-lg
            "
          >
            <div
              className="
                flex
                flex-col
                gap-4
                md:flex-row
                md:items-center
                md:justify-between
              "
            >
              <div>
                <h2
                  className="
                    text-2xl
                    font-bold
                    text-slate-800
                  "
                >
                  Performance Insights
                </h2>

                <p
                  className="
                    mt-2
                    text-slate-500
                  "
                >
                  A quick summary of your current client feedback.
                </p>
              </div>

              <div
                className="
                  rounded-2xl
                  bg-slate-100
                  px-5
                  py-3
                  font-bold
                  text-slate-700
                "
              >
                {performanceStatus.title}
              </div>
            </div>

            <div
              className="
                mt-8
                grid
                gap-5
                md:grid-cols-4
              "
            >
              <InsightItem
                label="Client Satisfaction"
                value={`${Math.round(
                  averageRating * 20
                )}%`}
              />

              <InsightItem
                label="Recommendation"
                value={formatPercentage(
                  recommendationRate
                )}
              />

              <InsightItem
                label="Repeat Hiring"
                value={formatPercentage(
                  hireAgainRate
                )}
              />

              <InsightItem
                label="Response Rate"
                value={formatPercentage(
                  responseRate
                )}
              />
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

/* ============================================================
   RATING BREAKDOWN ITEM
============================================================ */

const RatingBreakdownItem = ({
  label,
  value,
  icon,
}) => {
  const rating = toNumber(value);

  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-slate-50
        p-5
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
        "
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">
            {icon}
          </span>

          <span
            className="
              font-semibold
              text-slate-700
            "
          >
            {label}
          </span>
        </div>

        <strong
          className="
            text-lg
            text-slate-900
          "
        >
          {rating.toFixed(1)}
        </strong>
      </div>

      <div
        className="
          mt-4
          h-2
          overflow-hidden
          rounded-full
          bg-slate-200
        "
      >
        <motion.div
          initial={{
            width: 0,
          }}
          animate={{
            width: `${getRatingPercentage(
              rating
            )}%`,
          }}
          transition={{
            duration: 0.8,
          }}
          className="
            h-full
            rounded-full
            bg-gradient-to-r
            from-blue-500
            to-indigo-600
          "
        />
      </div>
    </div>
  );
};

/* ============================================================
   INSIGHT ITEM
============================================================ */

const InsightItem = ({
  label,
  value,
}) => {
  return (
    <div
      className="
        rounded-2xl
        bg-slate-50
        p-6
        text-center
      "
    >
      <p
        className="
          text-sm
          font-medium
          text-slate-500
        "
      >
        {label}
      </p>

      <p
        className="
          mt-3
          text-3xl
          font-black
          text-slate-800
        "
      >
        {value}
      </p>
    </div>
  );
};

export default ReviewAnalytics;