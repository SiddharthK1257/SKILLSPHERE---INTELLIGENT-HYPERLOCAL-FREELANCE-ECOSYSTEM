import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import {
  FaAward,
  FaChartLine,
  FaComments,
  FaExclamationTriangle,
  FaShieldAlt,
  FaStar,
  FaSyncAlt,
  FaThumbsUp,
} from "react-icons/fa";

import ReviewAnalytics from "./ReviewAnalytics";
import ReviewList from "./ReviewList";

import {
  getReviewAnalytics,
} from "../../services/reviewService";

/* ==========================================================
   HELPERS
========================================================== */

const toNumber = (value, fallback = 0) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
};

const formatPercentage = (value) => {
  const number = toNumber(value);

  return `${Math.round(number)}%`;
};

const formatRating = (value) => {
  return toNumber(value).toFixed(1);
};

/* ==========================================================
   STAT CARD
========================================================== */

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  className = "",
}) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -6,
      }}
      className={`
        rounded-3xl
        p-6
        text-white
        shadow-xl
        ${className}
      `}
    >
      <div className="flex items-start justify-between gap-4">

        <div>

          <p className="text-sm font-medium text-white/80">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-black">
            {value}
          </h2>

          {subtitle && (
            <p className="mt-2 text-sm text-white/75">
              {subtitle}
            </p>
          )}

        </div>

        <div
          className="
            flex
            h-14
            w-14
            shrink-0
            items-center
            justify-center
            rounded-2xl
            bg-white/20
          "
        >
          {icon}
        </div>

      </div>
    </motion.div>
  );
};

/* ==========================================================
   LOADING SKELETON
========================================================== */

const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-6">

      <div className="mx-auto max-w-7xl animate-pulse">

        <div className="h-56 rounded-3xl bg-slate-200" />

        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="
                h-40
                rounded-3xl
                bg-slate-200
              "
            />
          ))}

        </div>

        <div className="mt-8 h-96 rounded-3xl bg-slate-200" />

        <div className="mt-8 h-96 rounded-3xl bg-slate-200" />

      </div>

    </div>
  );
};

/* ==========================================================
   ERROR STATE
========================================================== */

const ErrorState = ({
  message,
  onRetry,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 p-6">

      <div
        className="
          mx-auto
          flex
          min-h-[500px]
          max-w-3xl
          flex-col
          items-center
          justify-center
          rounded-3xl
          bg-white
          p-10
          text-center
          shadow-xl
        "
      >

        <FaExclamationTriangle
          className="text-6xl text-red-500"
        />

        <h2
          className="
            mt-6
            text-2xl
            font-bold
            text-slate-800
          "
        >
          Unable to load review dashboard
        </h2>

        <p className="mt-3 text-slate-500">
          {message}
        </p>

        <button
          onClick={onRetry}
          className="
            mt-6
            flex
            items-center
            gap-2
            rounded-xl
            bg-blue-600
            px-6
            py-3
            font-semibold
            text-white
            transition
            hover:bg-blue-700
          "
        >
          <FaSyncAlt />
          Try Again
        </button>

      </div>

    </div>
  );
};

/* ==========================================================
   MAIN COMPONENT
========================================================== */

const ReviewDashboard = ({
  freelancerId,
}) => {

  /* ========================================================
     STATE
  ======================================================== */

  const [analytics, setAnalytics] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [refreshing, setRefreshing] =
    useState(false);

  const [refreshKey, setRefreshKey] =
    useState(0);

  /* ========================================================
     LOAD ANALYTICS
  ======================================================== */

  const loadDashboard = useCallback(
    async () => {

      if (!freelancerId) {
        setLoading(false);
        return;
      }

      try {

        setError("");

        setLoading(true);

        const response =
          await getReviewAnalytics(
            freelancerId
          );

        /*
         * Supports both:
         *
         * {
         *   analytics: {...}
         * }
         *
         * and:
         *
         * {...}
         */

        const analyticsData =
          response?.analytics ||
          response?.data?.analytics ||
          response?.data ||
          response;

        setAnalytics(
          analyticsData || {}
        );

      } catch (err) {

        console.error(
          "Review dashboard error:",
          err
        );

        setError(
          err?.message ||
          "Failed to load review analytics."
        );

      } finally {

        setLoading(false);

      }

    },
    [freelancerId]
  );

  /* ========================================================
     FETCH ON LOAD
  ======================================================== */

  useEffect(() => {

    loadDashboard();

  }, [
    loadDashboard,
    refreshKey,
  ]);

  /* ========================================================
     REFRESH
  ======================================================== */

  const refreshDashboard = async () => {

    try {

      setRefreshing(true);

      await loadDashboard();

      setRefreshKey((prev) => prev + 1);

    } finally {

      setRefreshing(false);

    }

  };

  /* ========================================================
     NORMALIZED ANALYTICS
  ======================================================== */

  const stats = useMemo(() => {

    const totalReviews =
      toNumber(
        analytics?.totalReviews ||
        analytics?.count ||
        analytics?.total
      );

    const averageRating =
      toNumber(
        analytics?.averageRating ||
        analytics?.avgRating
      );

    const recommendationRate =
      toNumber(
        analytics?.recommendationRate ||
        analytics?.recommendRate
      );

    const hireAgainRate =
      toNumber(
        analytics?.hireAgainRate ||
        analytics?.wouldHireAgainRate
      );

    const verifiedReviews =
      toNumber(
        analytics?.verifiedReviews
      );

    const helpfulVotes =
      toNumber(
        analytics?.helpfulVotes ||
        analytics?.helpfulCount
      );

    return {
      totalReviews,
      averageRating,
      recommendationRate,
      hireAgainRate,
      verifiedReviews,
      helpfulVotes,
    };

  }, [analytics]);

  /* ========================================================
     REPUTATION MESSAGE
  ======================================================== */

  const reputation = useMemo(() => {

    const rating =
      stats.averageRating;

    if (rating >= 4.8) {

      return {
        title: "Outstanding Reputation",
        description:
          "Your clients consistently rate your work exceptionally highly.",
        className:
          "bg-emerald-50 text-emerald-700 border-emerald-200",
      };

    }

    if (rating >= 4.5) {

      return {
        title: "Excellent Performance",
        description:
          "Your reviews show strong client satisfaction and reliability.",
        className:
          "bg-blue-50 text-blue-700 border-blue-200",
      };

    }

    if (rating >= 4) {

      return {
        title: "Good Standing",
        description:
          "Your overall performance is positively viewed by clients.",
        className:
          "bg-amber-50 text-amber-700 border-amber-200",
      };

    }

    return {
      title: "Keep Improving",
      description:
        "Use client feedback to improve your future performance.",
      className:
        "bg-orange-50 text-orange-700 border-orange-200",
    };

  }, [
    stats.averageRating,
  ]);

  /* ========================================================
     LOADING
  ======================================================== */

  if (loading) {
    return <DashboardSkeleton />;
  }

  /* ========================================================
     ERROR
  ======================================================== */

  if (error) {

    return (
      <ErrorState
        message={error}
        onRetry={loadDashboard}
      />
    );

  }

  /* ========================================================
     NO FREELANCER ID
  ======================================================== */

  if (!freelancerId) {

    return (
      <div
        className="
          flex
          min-h-[500px]
          items-center
          justify-center
          p-6
        "
      >

        <div
          className="
            rounded-3xl
            bg-white
            p-10
            text-center
            shadow-xl
          "
        >

          <FaComments
            className="
              mx-auto
              text-6xl
              text-slate-300
            "
          />

          <h2
            className="
              mt-5
              text-2xl
              font-bold
              text-slate-800
            "
          >
            Freelancer not selected
          </h2>

          <p className="mt-2 text-slate-500">
            A freelancer ID is required to load reviews.
          </p>

        </div>

      </div>
    );

  }

  /* ========================================================
     RENDER
  ======================================================== */

  return (

    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-slate-50
        via-blue-50
        to-indigo-100
        p-4
        sm:p-6
      "
    >

      <div className="mx-auto max-w-7xl">

        {/* ==================================================
            HERO
        ================================================== */}

        <motion.section
          initial={{
            opacity: 0,
            y: -25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            relative
            overflow-hidden
            rounded-3xl
            bg-gradient-to-r
            from-indigo-700
            via-blue-600
            to-cyan-500
            p-6
            text-white
            shadow-2xl
            sm:p-10
          "
        >

          <div
            className="
              absolute
              -right-20
              -top-20
              h-72
              w-72
              rounded-full
              bg-white/10
              blur-3xl
            "
          />

          <div className="relative z-10">

            <div
              className="
                flex
                flex-col
                gap-6
                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >

              <div>

                <div className="flex items-center gap-3">

                  <FaChartLine className="text-3xl" />

                  <span
                    className="
                      rounded-full
                      bg-white/15
                      px-4
                      py-1
                      text-sm
                      font-semibold
                    "
                  >
                    Freelancer Reputation
                  </span>

                </div>

                <h1
                  className="
                    mt-5
                    text-4xl
                    font-black
                    sm:text-5xl
                  "
                >
                  Review Dashboard
                </h1>

                <p
                  className="
                    mt-4
                    max-w-2xl
                    text-base
                    leading-7
                    text-blue-100
                    sm:text-lg
                  "
                >
                  Monitor client satisfaction, ratings,
                  recommendations, helpful votes, and
                  your overall professional reputation.
                </p>

              </div>

              <button
                onClick={refreshDashboard}
                disabled={refreshing}
                className="
                  flex
                  items-center
                  justify-center
                  gap-3
                  rounded-2xl
                  bg-white
                  px-6
                  py-4
                  font-bold
                  text-indigo-700
                  shadow-lg
                  transition
                  hover:scale-105
                  disabled:cursor-not-allowed
                  disabled:opacity-70
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
                  : "Refresh Dashboard"}

              </button>

            </div>

          </div>

        </motion.section>

        {/* ==================================================
            STATISTICS
        ================================================== */}

        <section
          className="
            mt-8
            grid
            gap-5
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >

          <StatCard
            title="Average Rating"
            value={formatRating(
              stats.averageRating
            )}
            subtitle="Out of 5.0"
            icon={<FaStar size={26} />}
            className="
              bg-gradient-to-br
              from-yellow-400
              via-amber-500
              to-orange-500
            "
          />

          <StatCard
            title="Total Reviews"
            value={stats.totalReviews}
            subtitle="Client reviews received"
            icon={<FaComments size={26} />}
            className="
              bg-gradient-to-br
              from-blue-600
              via-indigo-600
              to-purple-700
            "
          />

          <StatCard
            title="Recommendation Rate"
            value={formatPercentage(
              stats.recommendationRate
            )}
            subtitle="Clients recommending you"
            icon={<FaAward size={26} />}
            className="
              bg-gradient-to-br
              from-green-500
              via-emerald-600
              to-teal-600
            "
          />

          <StatCard
            title="Hire Again Rate"
            value={formatPercentage(
              stats.hireAgainRate
            )}
            subtitle="Clients willing to rehire"
            icon={<FaChartLine size={26} />}
            className="
              bg-gradient-to-br
              from-pink-500
              via-rose-600
              to-red-600
            "
          />

        </section>

        {/* ==================================================
            SECONDARY STATISTICS
        ================================================== */}

        <section
          className="
            mt-6
            grid
            gap-5
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >

          <div
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-lg
            "
          >

            <div className="flex items-center gap-4">

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-blue-100
                  text-blue-600
                "
              >
                <FaShieldAlt />
              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Verified Reviews
                </p>

                <p className="text-2xl font-black text-slate-800">
                  {stats.verifiedReviews}
                </p>

              </div>

            </div>

          </div>

          <div
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-lg
            "
          >

            <div className="flex items-center gap-4">

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-green-100
                  text-green-600
                "
              >
                <FaThumbsUp />
              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Helpful Votes
                </p>

                <p className="text-2xl font-black text-slate-800">
                  {stats.helpfulVotes}
                </p>

              </div>

            </div>

          </div>

          <div
            className={`
              rounded-3xl
              border
              p-6
              shadow-lg
              ${reputation.className}
            `}
          >

            <p className="text-sm font-semibold">
              Reputation Status
            </p>

            <h3 className="mt-2 text-xl font-black">
              {reputation.title}
            </h3>

            <p className="mt-2 text-sm opacity-80">
              {reputation.description}
            </p>

          </div>

        </section>

        {/* ==================================================
            ANALYTICS
        ================================================== */}

        <section className="mt-8">

          <ReviewAnalytics
            freelancerId={freelancerId}
          />

        </section>

        {/* ==================================================
            REVIEW MANAGEMENT
        ================================================== */}

        <motion.section
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            mt-8
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
              flex
              flex-col
              gap-5
              border-b
              border-slate-200
              bg-gradient-to-r
              from-slate-50
              to-blue-50
              p-6
              sm:p-8
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >

            <div>

              <h2
                className="
                  text-2xl
                  font-black
                  text-slate-800
                  sm:text-3xl
                "
              >
                Review Management
              </h2>

              <p className="mt-2 text-slate-500">
                Search, filter, and manage reviews
                associated with this freelancer.
              </p>

            </div>

            <button
              onClick={refreshDashboard}
              disabled={refreshing}
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-indigo-600
                px-5
                py-3
                font-semibold
                text-white
                transition
                hover:bg-indigo-700
                disabled:opacity-70
              "
            >

              <FaSyncAlt
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh Reviews

            </button>

          </div>

          <div className="p-4 sm:p-8">

            <ReviewList
              key={refreshKey}
              freelancerId={freelancerId}
              showActions
            />

          </div>

        </motion.section>

        {/* ==================================================
            PERFORMANCE SUMMARY
        ================================================== */}

        <section className="mt-8">

          <div
            className="
              rounded-3xl
              bg-gradient-to-r
              from-indigo-700
              via-blue-700
              to-cyan-600
              p-6
              text-white
              shadow-2xl
              sm:p-10
            "
          >

            <div
              className="
                grid
                gap-8
                lg:grid-cols-2
              "
            >

              <div>

                <h2 className="text-3xl font-black sm:text-4xl">
                  Performance Summary
                </h2>

                <p
                  className="
                    mt-5
                    leading-8
                    text-blue-100
                  "
                >
                  Your review performance is calculated
                  from client ratings, recommendations,
                  repeat-hiring intent, and verified
                  feedback.
                </p>

                <div
                  className="
                    mt-8
                    grid
                    gap-4
                    sm:grid-cols-2
                  "
                >

                  <div className="rounded-2xl bg-white/10 p-5">

                    <p className="text-sm text-blue-100">
                      Average Rating
                    </p>

                    <p className="mt-2 text-3xl font-black">
                      {formatRating(
                        stats.averageRating
                      )} / 5
                    </p>

                  </div>

                  <div className="rounded-2xl bg-white/10 p-5">

                    <p className="text-sm text-blue-100">
                      Total Reviews
                    </p>

                    <p className="mt-2 text-3xl font-black">
                      {stats.totalReviews}
                    </p>

                  </div>

                  <div className="rounded-2xl bg-white/10 p-5">

                    <p className="text-sm text-blue-100">
                      Recommendation
                    </p>

                    <p className="mt-2 text-3xl font-black">
                      {formatPercentage(
                        stats.recommendationRate
                      )}
                    </p>

                  </div>

                  <div className="rounded-2xl bg-white/10 p-5">

                    <p className="text-sm text-blue-100">
                      Hire Again
                    </p>

                    <p className="mt-2 text-3xl font-black">
                      {formatPercentage(
                        stats.hireAgainRate
                      )}
                    </p>

                  </div>

                </div>

              </div>

              <div
                className="
                  flex
                  items-center
                "
              >

                <div
                  className="
                    w-full
                    rounded-3xl
                    bg-white
                    p-6
                    text-slate-800
                    shadow-xl
                    sm:p-8
                  "
                >

                  <h3 className="text-2xl font-black">
                    Dashboard Insights
                  </h3>

                  <div className="mt-6 space-y-4">

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-slate-100
                        pb-4
                      "
                    >

                      <span className="text-slate-500">
                        Average Rating
                      </span>

                      <strong>
                        {formatRating(
                          stats.averageRating
                        )} / 5
                      </strong>

                    </div>

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-slate-100
                        pb-4
                      "
                    >

                      <span className="text-slate-500">
                        Reviews Received
                      </span>

                      <strong>
                        {stats.totalReviews}
                      </strong>

                    </div>

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-slate-100
                        pb-4
                      "
                    >

                      <span className="text-slate-500">
                        Recommendation
                      </span>

                      <strong>
                        {formatPercentage(
                          stats.recommendationRate
                        )}
                      </strong>

                    </div>

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                      "
                    >

                      <span className="text-slate-500">
                        Hire Again
                      </span>

                      <strong>
                        {formatPercentage(
                          stats.hireAgainRate
                        )}
                      </strong>

                    </div>

                  </div>

                  <div
                    className="
                      mt-8
                      rounded-2xl
                      bg-slate-50
                      p-5
                      text-center
                    "
                  >

                    <p
                      className="
                        text-lg
                        font-black
                        text-slate-800
                      "
                    >
                      {reputation.title}
                    </p>

                    <p
                      className="
                        mt-2
                        text-sm
                        text-slate-500
                      "
                    >
                      {reputation.description}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

      </div>

    </div>

  );

};

export default ReviewDashboard;