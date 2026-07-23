import { motion } from "framer-motion";

import {
  FaAward,
  FaShieldAlt,
  FaMedal,
  FaStar,
  FaCheckCircle,
  FaCrown,
  FaChartLine,
  FaUsers,
} from "react-icons/fa";

/* ==========================================================
   CONSTANTS
========================================================== */

const MAX_RATING = 5;

/* ==========================================================
   HELPERS
========================================================== */

const safeNumber = (value, fallback = 0) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
};

const clamp = (value, min, max) =>
  Math.min(
    max,
    Math.max(min, value)
  );

const formatRating = (rating) =>
  clamp(
    safeNumber(rating),
    0,
    MAX_RATING
  ).toFixed(1);

/* ==========================================================
   BADGE CONFIGURATION
========================================================== */

const BADGES = {
  elite: {
    title: "Elite Freelancer",
    subtitle: "Top-Tier Reputation",
    description:
      "Exceptional service quality with outstanding client satisfaction and a highly trusted professional reputation.",
    icon: FaCrown,
    gradient:
      "from-yellow-400 via-amber-500 to-orange-500",
    background:
      "bg-yellow-50",
    border:
      "border-yellow-300",
    text:
      "text-yellow-800",
    accent:
      "text-yellow-600",
  },

  gold: {
    title: "Gold Freelancer",
    subtitle: "Highly Trusted Professional",
    description:
      "Consistently delivers excellent work and maintains a strong reputation among clients.",
    icon: FaAward,
    gradient:
      "from-yellow-500 to-amber-600",
    background:
      "bg-amber-50",
    border:
      "border-amber-300",
    text:
      "text-amber-800",
    accent:
      "text-amber-600",
  },

  silver: {
    title: "Silver Freelancer",
    subtitle: "Reliable Professional",
    description:
      "A reliable professional with a proven record of delivering quality work to clients.",
    icon: FaShieldAlt,
    gradient:
      "from-slate-300 to-gray-500",
    background:
      "bg-slate-50",
    border:
      "border-slate-300",
    text:
      "text-slate-700",
    accent:
      "text-slate-600",
  },

  bronze: {
    title: "Bronze Freelancer",
    subtitle: "Growing Reputation",
    description:
      "Building a positive reputation through successful projects and satisfied clients.",
    icon: FaMedal,
    gradient:
      "from-orange-400 to-amber-700",
    background:
      "bg-orange-50",
    border:
      "border-orange-300",
    text:
      "text-orange-800",
    accent:
      "text-orange-600",
  },

  new: {
    title: "New Freelancer",
    subtitle: "Getting Started",
    description:
      "This freelancer is building their platform reputation through successful projects and client feedback.",
    icon: FaMedal,
    gradient:
      "from-slate-500 to-gray-700",
    background:
      "bg-slate-50",
    border:
      "border-slate-300",
    text:
      "text-slate-700",
    accent:
      "text-slate-600",
  },
};

/* ==========================================================
   GET BADGE
========================================================== */

const getBadge = (
  averageRating,
  totalReviews
) => {
  if (
    averageRating >= 4.9 &&
    totalReviews >= 100
  ) {
    return BADGES.elite;
  }

  if (
    averageRating >= 4.7 &&
    totalReviews >= 50
  ) {
    return BADGES.gold;
  }

  if (
    averageRating >= 4.5 &&
    totalReviews >= 20
  ) {
    return BADGES.silver;
  }

  if (
    averageRating >= 4.0 &&
    totalReviews >= 10
  ) {
    return BADGES.bronze;
  }

  return BADGES.new;
};

/* ==========================================================
   STAT CARD
========================================================== */

const StatCard = ({
  icon: Icon,
  label,
  value,
  description,
  iconClassName = "text-indigo-600",
}) => {
  return (
    <motion.div
      whileHover={{
        y: -5,
        scale: 1.02,
      }}
      transition={{
        duration: 0.25,
      }}
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        transition-shadow
        hover:shadow-lg
      "
    >
      <div className="flex items-start justify-between gap-4">

        <div>

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
              mt-2
              text-3xl
              font-black
              text-slate-800
            "
          >
            {value}
          </p>

          {description && (

            <p
              className="
                mt-1
                text-xs
                text-slate-400
              "
            >
              {description}
            </p>

          )}

        </div>

        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-slate-100
          "
        >
          <Icon
            className={iconClassName}
            size={20}
          />
        </div>

      </div>
    </motion.div>
  );
};

/* ==========================================================
   PROGRESS BAR
========================================================== */

const ProgressBar = ({
  label,
  value,
  gradient,
  suffix = "%",
}) => {
  const percentage = clamp(
    safeNumber(value),
    0,
    100
  );

  return (
    <div>

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
            text-slate-800
          "
        >
          {Math.round(percentage)}
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
        role="progressbar"
        aria-label={label}
        aria-valuenow={percentage}
        aria-valuemin="0"
        aria-valuemax="100"
      >

        <motion.div
          initial={{
            width: 0,
          }}
          animate={{
            width: `${percentage}%`,
          }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
          className={`
            h-full
            rounded-full
            bg-gradient-to-r
            ${gradient}
          `}
        />

      </div>

    </div>
  );
};

/* ==========================================================
   STAR RATING
========================================================== */

const StarRating = ({
  rating,
}) => {
  const normalizedRating = clamp(
    safeNumber(rating),
    0,
    MAX_RATING
  );

  return (
    <div
      className="
        flex
        items-center
        gap-1
      "
      aria-label={`Rating ${normalizedRating} out of 5`}
    >

      {[1, 2, 3, 4, 5].map(
        (star) => (

          <FaStar
            key={star}
            className={
              star <=
              Math.round(
                normalizedRating
              )
                ? "text-yellow-300"
                : "text-white/30"
            }
          />

        )
      )}

    </div>
  );
};

/* ==========================================================
   MAIN COMPONENT
========================================================== */

const ReputationBadge = ({
  analytics = {},
  size = "md",
  showDescription = true,
}) => {

  /* ======================================================
     NORMALIZE DATA
  ====================================================== */

  const averageRating = clamp(
    safeNumber(
      analytics.averageRating
    ),
    0,
    MAX_RATING
  );

  const totalReviews = Math.max(
    0,
    Math.round(
      safeNumber(
        analytics.totalReviews
      )
    )
  );

  const recommendationRate =
    clamp(
      safeNumber(
        analytics.recommendationRate
      ),
      0,
      100
    );

  const hireAgainRate =
    clamp(
      safeNumber(
        analytics.hireAgainRate
      ),
      0,
      100
    );

  const verified =
    Boolean(
      analytics.verifiedFreelancer
    );

  /* ======================================================
     REPUTATION SCORE
  ====================================================== */

  /*
    Rating contributes 50%
    Recommendation contributes 25%
    Hire Again contributes 25%
  */

  const ratingScore =
    averageRating * 20;

  const reputationScore = Math.round(
    ratingScore * 0.5 +
      recommendationRate * 0.25 +
      hireAgainRate * 0.25
  );

  /* ======================================================
     BADGE
  ====================================================== */

  const badge = getBadge(
    averageRating,
    totalReviews
  );

  const BadgeIcon = badge.icon;

  /* ======================================================
     SIZE
  ====================================================== */

  const sizeConfig = {
    sm: {
      icon: "h-14 w-14",
      iconSize: 28,
      title: "text-2xl",
      rating: "text-4xl",
      padding: "p-5",
    },

    md: {
      icon: "h-18 w-18",
      iconSize: 36,
      title: "text-3xl",
      rating: "text-5xl",
      padding: "p-7",
    },

    lg: {
      icon: "h-24 w-24",
      iconSize: 48,
      title: "text-4xl",
      rating: "text-6xl",
      padding: "p-10",
    },
  };

  const currentSize =
    sizeConfig[size] ||
    sizeConfig.md;

  /* ======================================================
     RENDER
  ====================================================== */

  return (

    <motion.section
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
      }}
      whileHover={{
        y: -4,
      }}
      className={`
        overflow-hidden
        rounded-3xl
        border
        ${badge.border}
        ${badge.background}
        shadow-xl
      `}
      aria-label="Freelancer reputation"
    >

      {/* ==================================================
          HERO
      ================================================== */}

      <div
        className={`
          relative
          overflow-hidden
          bg-gradient-to-r
          ${badge.gradient}
          ${currentSize.padding}
          text-white
        `}
      >

        {/* Decorative background elements */}

        <div
          className="
            pointer-events-none
            absolute
            -right-16
            -top-16
            h-64
            w-64
            rounded-full
            bg-white/10
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-20
            -left-16
            h-64
            w-64
            rounded-full
            bg-white/10
            blur-3xl
          "
        />

        <div
          className="
            relative
            z-10
            flex
            flex-col
            items-center
            gap-6
            lg:flex-row
          "
        >

          {/* Badge Icon */}

          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 3, -3, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`
              ${currentSize.icon}
              flex
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-white/20
              shadow-2xl
              backdrop-blur-xl
            `}
          >

            <BadgeIcon
              size={
                currentSize.iconSize
              }
            />

          </motion.div>

          {/* Badge Information */}

          <div
            className="
              flex-1
              text-center
              lg:text-left
            "
          >

            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-white/15
                px-3
                py-1
                text-xs
                font-bold
                uppercase
                tracking-wider
                backdrop-blur-md
              "
            >
              <FaShieldAlt />

              Trusted Reputation

            </div>

            <h2
              className={`
                mt-3
                ${currentSize.title}
                font-black
              `}
            >
              {badge.title}
            </h2>

            <p
              className="
                mt-2
                text-lg
                font-medium
                text-white/90
              "
            >
              {badge.subtitle}
            </p>

            {showDescription && (

              <p
                className="
                  mt-4
                  max-w-2xl
                  text-sm
                  leading-7
                  text-white/80
                "
              >
                {badge.description}
              </p>

            )}

          </div>

          {/* Rating */}

          <div
            className="
              min-w-[170px]
              rounded-3xl
              bg-white/15
              p-5
              text-center
              shadow-lg
              backdrop-blur-xl
            "
          >

            <StarRating
              rating={averageRating}
            />

            <p
              className={`
                mt-2
                ${currentSize.rating}
                font-black
              `}
            >
              {formatRating(
                averageRating
              )}
            </p>

            <p
              className="
                mt-1
                text-sm
                text-white/80
              "
            >
              Average Rating
            </p>

          </div>

        </div>

      </div>

      {/* ==================================================
          CONTENT
      ================================================== */}

      <div
        className="
          space-y-7
          bg-white
          p-6
          sm:p-8
        "
      >

        {/* Verified Freelancer */}

        {verified && (

          <motion.div
            initial={{
              opacity: 0,
              x: -15,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            className="
              flex
              items-center
              gap-4
              rounded-2xl
              border
              border-green-200
              bg-green-50
              p-4
            "
          >

            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-green-500
                text-white
              "
            >

              <FaCheckCircle
                size={24}
              />

            </div>

            <div>

              <h3
                className="
                  font-bold
                  text-green-800
                "
              >
                Verified Freelancer
              </h3>

              <p
                className="
                  mt-1
                  text-sm
                  text-green-700
                "
              >
                This freelancer has successfully
                completed platform verification.
              </p>

            </div>

          </motion.div>

        )}

        {/* Statistics */}

        <div
          className="
            grid
            gap-4
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >

          <StatCard
            icon={FaUsers}
            label="Total Reviews"
            value={totalReviews}
            description="Client feedback received"
            iconClassName="text-blue-600"
          />

          <StatCard
            icon={FaStar}
            label="Average Rating"
            value={`${formatRating(
              averageRating
            )} / 5`}
            description="Overall client rating"
            iconClassName="text-yellow-500"
          />

          <StatCard
            icon={FaChartLine}
            label="Reputation Score"
            value={`${reputationScore}%`}
            description="Combined trust score"
            iconClassName="text-indigo-600"
          />

        </div>

        {/* Trust Progress */}

        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            p-6
          "
        >

          <div
            className="
              mb-5
              flex
              items-center
              justify-between
            "
          >

            <div>

              <h3
                className="
                  text-lg
                  font-bold
                  text-slate-800
                "
              >
                Reputation Strength
              </h3>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Based on ratings, recommendations,
                and repeat hiring.
              </p>

            </div>

            <span
              className={`
                rounded-full
                px-3
                py-1
                text-sm
                font-bold
                ${badge.background}
                ${badge.text}
              `}
            >
              {reputationScore}%
            </span>

          </div>

          <div
            className="
              h-4
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
                width: `${reputationScore}%`,
              }}
              transition={{
                duration: 1.2,
                ease: "easeOut",
              }}
              className={`
                h-full
                rounded-full
                bg-gradient-to-r
                ${badge.gradient}
              `}
            />

          </div>

        </div>

        {/* Performance Breakdown */}

        <div
          className="
            grid
            gap-6
            md:grid-cols-3
          "
        >

          <ProgressBar
            label="Client Recommendations"
            value={recommendationRate}
            gradient="
              from-green-500
              to-emerald-600
            "
          />

          <ProgressBar
            label="Would Hire Again"
            value={hireAgainRate}
            gradient="
              from-pink-500
              to-rose-600
            "
          />

          <ProgressBar
            label="Rating Quality"
            value={ratingScore}
            gradient={badge.gradient}
          />

        </div>

        {/* Footer */}

        <div
          className="
            rounded-2xl
            bg-gradient-to-r
            from-slate-50
            to-blue-50
            p-5
            text-center
          "
        >

          <p
            className="
              text-sm
              leading-7
              text-slate-600
            "
          >
            Reputation is calculated from client
            ratings, review volume, recommendations,
            repeat hiring behavior, and verified
            platform activity.
          </p>

        </div>

      </div>

    </motion.section>

  );
};

export default ReputationBadge;