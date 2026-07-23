import { motion } from "framer-motion";
import {
  FaAward,
  FaStar,
  FaChartBar,
  FaRegStar,
} from "react-icons/fa";

/* =========================================================
   RATING DISTRIBUTION
========================================================= */

const RatingDistribution = ({ analytics = {} }) => {
  /* =======================================================
     SAFE DATA
  ======================================================= */

  const averageRating = Number(
    analytics?.averageRating || 0
  );

  const totalReviews = Number(
    analytics?.totalReviews || 0
  );

  const rawDistribution =
    analytics?.distribution || {};

  /* =======================================================
     NORMALIZE DISTRIBUTION

     Supports:
     {
       5: 10,
       4: 5
     }

     and:

     {
       "5": 10,
       "4": 5
     }
  ======================================================= */

  const distribution = {
    5: Math.max(
      0,
      Number(
        rawDistribution[5] ??
          rawDistribution["5"] ??
          0
      )
    ),

    4: Math.max(
      0,
      Number(
        rawDistribution[4] ??
          rawDistribution["4"] ??
          0
      )
    ),

    3: Math.max(
      0,
      Number(
        rawDistribution[3] ??
          rawDistribution["3"] ??
          0
      )
    ),

    2: Math.max(
      0,
      Number(
        rawDistribution[2] ??
          rawDistribution["2"] ??
          0
      )
    ),

    1: Math.max(
      0,
      Number(
        rawDistribution[1] ??
          rawDistribution["1"] ??
          0
      )
    ),
  };

  /* =======================================================
     RATING ROWS
  ======================================================= */

  const ratingRows = [5, 4, 3, 2, 1].map(
    (star) => ({
      star,
      count: distribution[star],
    })
  );

  /* =======================================================
     HELPERS
  ======================================================= */

  const getPercentage = (count) => {
    if (!totalReviews || !count) {
      return 0;
    }

    return Math.min(
      100,
      Math.round(
        (count / totalReviews) * 100
      )
    );
  };

  const safeAverage = Math.min(
    5,
    Math.max(0, averageRating)
  );

  const formattedAverage =
    safeAverage.toFixed(1);

  const roundedAverage =
    Math.round(safeAverage);

  const satisfactionScore = Math.min(
    100,
    Math.round(safeAverage * 20)
  );

  /* =======================================================
     RATING LABEL
  ======================================================= */

  const getRatingLabel = () => {
    if (!totalReviews) {
      return "No reviews yet";
    }

    if (safeAverage >= 4.8) {
      return "Exceptional";
    }

    if (safeAverage >= 4.5) {
      return "Excellent";
    }

    if (safeAverage >= 4) {
      return "Very Good";
    }

    if (safeAverage >= 3) {
      return "Good";
    }

    if (safeAverage >= 2) {
      return "Needs Improvement";
    }

    return "Poor";
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 24,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
        ease: "easeOut",
      }}
      aria-labelledby="rating-distribution-title"
      className="
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-xl
      "
    >
      {/* ===================================================
          HEADER
      =================================================== */}

      <div
        className="
          relative
          overflow-hidden
          bg-gradient-to-br
          from-blue-600
          via-indigo-600
          to-purple-700
          p-6
          text-white
          sm:p-8
        "
      >
        {/* Decorative Background */}

        <div
          aria-hidden="true"
          className="
            absolute
            -right-16
            -top-20
            h-64
            w-64
            rounded-full
            bg-white/10
            blur-3xl
          "
        />

        <div
          aria-hidden="true"
          className="
            absolute
            -bottom-24
            -left-20
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
            flex
            flex-col
            gap-8
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          {/* TITLE */}

          <div className="flex items-center gap-4">
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
                shadow-lg
                backdrop-blur-md
              "
            >
              <FaAward size={26} />
            </div>

            <div>
              <h2
                id="rating-distribution-title"
                className="
                  text-2xl
                  font-extrabold
                  sm:text-3xl
                "
              >
                Rating Overview
              </h2>

              <p
                className="
                  mt-2
                  text-sm
                  text-blue-100
                  sm:text-base
                "
              >
                Review distribution and customer satisfaction
              </p>
            </div>
          </div>

          {/* AVERAGE RATING */}

          <motion.div
            whileHover={{
              scale: 1.03,
            }}
            transition={{
              duration: 0.2,
            }}
            className="
              rounded-3xl
              border
              border-white/10
              bg-white/10
              p-5
              shadow-xl
              backdrop-blur-xl
              sm:p-6
            "
          >
            <div
              className="
                flex
                items-center
                gap-5
              "
            >
              {/* SCORE */}

              <div>
                <div
                  className="
                    text-5xl
                    font-black
                    tracking-tight
                    sm:text-6xl
                  "
                >
                  {formattedAverage}
                </div>

                <p className="mt-1 text-sm text-blue-100">
                  Average Rating
                </p>
              </div>

              {/* STARS */}

              <div>
                <div
                  className="flex gap-1"
                  aria-label={`${formattedAverage} out of 5 stars`}
                >
                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <FaStar
                        key={star}
                        size={20}
                        className={
                          star <= roundedAverage
                            ? "text-yellow-300"
                            : "text-white/30"
                        }
                      />
                    )
                  )}
                </div>

                <p className="mt-3 text-sm text-blue-100">
                  {totalReviews}{" "}
                  {totalReviews === 1
                    ? "Review"
                    : "Reviews"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ===================================================
          CONTENT
      =================================================== */}

      <div className="p-6 sm:p-8">
        {/* EMPTY STATE */}

        {!totalReviews ? (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            className="
              flex
              flex-col
              items-center
              justify-center
              rounded-2xl
              border
              border-dashed
              border-slate-300
              bg-slate-50
              px-6
              py-12
              text-center
            "
          >
            <FaRegStar
              size={42}
              className="text-slate-400"
            />

            <h3
              className="
                mt-4
                text-xl
                font-bold
                text-slate-700
              "
            >
              No reviews yet
            </h3>

            <p
              className="
                mt-2
                max-w-md
                text-sm
                leading-6
                text-slate-500
              "
            >
              Rating distribution will appear here once
              customers start submitting reviews.
            </p>
          </motion.div>
        ) : (
          <>
            {/* =================================================
                DISTRIBUTION ROWS
            ================================================= */}

            <div
              className="
                space-y-5
              "
            >
              {ratingRows.map(
                (item, index) => {
                  const percentage =
                    getPercentage(
                      item.count
                    );

                  return (
                    <motion.div
                      key={item.star}
                      initial={{
                        opacity: 0,
                        x: -20,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: index * 0.08,
                        duration: 0.35,
                      }}
                      className="
                        group
                      "
                    >
                      {/* ROW HEADER */}

                      <div
                        className="
                          mb-2
                          flex
                          items-center
                          justify-between
                          gap-3
                        "
                      >
                        <div
                          className="
                            flex
                            min-w-[52px]
                            items-center
                            gap-1.5
                            font-semibold
                            text-slate-700
                          "
                        >
                          <span>
                            {item.star}
                          </span>

                          <FaStar
                            size={15}
                            className="text-yellow-400"
                          />
                        </div>

                        <span
                          className="
                            min-w-[48px]
                            text-right
                            text-sm
                            font-semibold
                            text-slate-600
                          "
                        >
                          {percentage}%
                        </span>

                        <span
                          className="
                            min-w-[55px]
                            text-right
                            text-sm
                            text-slate-500
                          "
                        >
                          {item.count}
                        </span>
                      </div>

                      {/* PROGRESS BAR */}

                      <div
                        className="
                          h-3
                          overflow-hidden
                          rounded-full
                          bg-slate-200
                        "
                        role="progressbar"
                        aria-label={`${item.star} star reviews`}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-valuenow={percentage}
                      >
                        <motion.div
                          initial={{
                            width: 0,
                          }}
                          animate={{
                            width: `${percentage}%`,
                          }}
                          transition={{
                            duration: 0.9,
                            delay:
                              index * 0.1,
                            ease: "easeOut",
                          }}
                          className="
                            h-full
                            rounded-full
                            bg-gradient-to-r
                            from-yellow-400
                            via-amber-500
                            to-orange-500
                            transition-all
                            duration-300
                            group-hover:brightness-110
                          "
                        />
                      </div>
                    </motion.div>
                  );
                }
              )}
            </div>

            {/* =================================================
                SATISFACTION SUMMARY
            ================================================= */}

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
                delay: 0.55,
              }}
              className="
                mt-10
                rounded-2xl
                border
                border-blue-100
                bg-gradient-to-br
                from-blue-50
                to-indigo-50
                p-6
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-6
                  md:flex-row
                  md:items-center
                  md:justify-between
                "
              >
                {/* DESCRIPTION */}

                <div>
                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <div
                      className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-100
                        text-blue-600
                      "
                    >
                      <FaChartBar size={20} />
                    </div>

                    <h3
                      className="
                        text-xl
                        font-bold
                        text-slate-800
                      "
                    >
                      Customer Satisfaction
                    </h3>
                  </div>

                  <p
                    className="
                      mt-3
                      text-sm
                      leading-6
                      text-slate-600
                    "
                  >
                    Based on{" "}
                    <strong>
                      {totalReviews}
                    </strong>{" "}
                    verified{" "}
                    {totalReviews === 1
                      ? "customer review"
                      : "customer reviews"}
                    .
                  </p>

                  <p
                    className="
                      mt-2
                      text-sm
                      font-semibold
                      text-indigo-600
                    "
                  >
                    {getRatingLabel()}
                  </p>
                </div>

                {/* SCORE */}

                <div
                  className="
                    min-w-[150px]
                    rounded-2xl
                    bg-gradient-to-r
                    from-green-500
                    to-emerald-600
                    px-6
                    py-5
                    text-center
                    text-white
                    shadow-lg
                  "
                >
                  <div
                    className="
                      text-4xl
                      font-black
                    "
                  >
                    {satisfactionScore}%
                  </div>

                  <div
                    className="
                      mt-1
                      text-sm
                      text-green-50
                    "
                  >
                    Satisfaction Score
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </motion.section>
  );
};

export default RatingDistribution;