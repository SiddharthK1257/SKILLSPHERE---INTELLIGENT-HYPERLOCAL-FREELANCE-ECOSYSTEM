import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

import {
  FaArrowLeft,
  FaStar,
  FaPaperPlane,
  FaCheckCircle,
  FaLightbulb,
  FaShieldAlt,
  FaChartLine,
  FaUsers,
  FaSpinner,
} from "react-icons/fa";

import ReviewForm from "../components/reviews/ReviewForm";
import { createReview } from "../services/reviewService";

/* =========================================================
   CONSTANTS
========================================================= */

const REVIEW_TIPS = [
  {
    icon: FaCheckCircle,
    title: "Be Honest",
    description:
      "Write genuine feedback based on your actual experience.",
  },
  {
    icon: FaLightbulb,
    title: "Include Details",
    description:
      "Mention communication, quality, delivery, professionalism, and value.",
  },
  {
    icon: FaShieldAlt,
    title: "Stay Respectful",
    description:
      "Keep your review professional, constructive, and respectful.",
  },
];

const RATING_GUIDE = [
  {
    rating: 5,
    label: "Excellent",
    description: "Exceptional experience",
  },
  {
    rating: 4,
    label: "Very Good",
    description: "Exceeded expectations",
  },
  {
    rating: 3,
    label: "Good",
    description: "Met expectations",
  },
  {
    rating: 2,
    label: "Fair",
    description: "Some improvements needed",
  },
  {
    rating: 1,
    label: "Poor",
    description: "Did not meet expectations",
  },
];

/* =========================================================
   ANIMATION VARIANTS
========================================================= */

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const slideLeft = {
  hidden: {
    opacity: 0,
    x: -40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const slideRight = {
  hidden: {
    opacity: 0,
    x: 40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

/* =========================================================
   COMPONENT
========================================================= */

const CreateReview = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  /* =======================================================
     SUBMIT REVIEW
  ======================================================= */

  const handleSubmit = async (reviewData) => {
    if (loading) return;

    try {
      setLoading(true);

      const response = await createReview(reviewData);

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Unable to submit review."
        );
      }

      toast.success(
        response.message ||
          "Review submitted successfully.",
        {
          duration: 3000,
        }
      );

      setTimeout(() => {
        navigate("/reviews");
      }, 1000);
    } catch (error) {
      console.error(
        "Create Review Error:",
        error
      );

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to submit review. Please try again.";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     CANCEL
  ======================================================= */

  const handleCancel = () => {
    if (loading) return;

    navigate(-1);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main
      className="
        min-h-screen
        bg-gradient-to-br
        from-slate-50
        via-blue-50
        to-indigo-100
        px-4
        py-8
        sm:px-6
        sm:py-12
        lg:px-8
      "
    >
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <motion.header
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="
            mb-10
            flex
            flex-col
            gap-6
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-gradient-to-br
                  from-yellow-400
                  to-orange-500
                  text-white
                  shadow-lg
                "
              >
                <FaStar size={22} />
              </div>

              <span
                className="
                  rounded-full
                  bg-blue-100
                  px-4
                  py-2
                  text-sm
                  font-bold
                  text-blue-700
                "
              >
                Customer Feedback
              </span>
            </div>

            <h1
              className="
                text-4xl
                font-black
                tracking-tight
                text-slate-900
                sm:text-5xl
              "
            >
              Create Review
            </h1>

            <p
              className="
                mt-4
                max-w-3xl
                text-base
                leading-8
                text-slate-600
                sm:text-lg
              "
            >
              Share your experience and help future
              clients make better hiring decisions
              through honest and meaningful feedback.
            </p>
          </div>

          <motion.button
            type="button"
            whileHover={{
              scale: 1.03,
              y: -2,
            }}
            whileTap={{
              scale: 0.97,
            }}
            onClick={handleCancel}
            disabled={loading}
            className="
              inline-flex
              items-center
              justify-center
              gap-3
              rounded-2xl
              border
              border-slate-200
              bg-white
              px-6
              py-4
              font-bold
              text-slate-700
              shadow-lg
              transition
              hover:border-blue-300
              hover:text-blue-600
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <FaArrowLeft />
            Back
          </motion.button>
        </motion.header>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div
          className="
            grid
            gap-8
            xl:grid-cols-12
          "
        >

          {/* =================================================
              LEFT SIDEBAR
          ================================================= */}

          <motion.aside
            variants={slideLeft}
            initial="hidden"
            animate="visible"
            className="
              space-y-6
              xl:col-span-4
            "
          >

            {/* Experience Card */}

            <section
              className="
                relative
                overflow-hidden
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
              <div
                className="
                  absolute
                  -right-20
                  -top-20
                  h-64
                  w-64
                  rounded-full
                  bg-white/10
                  blur-3xl
                "
              />

              <div className="relative">
                <div
                  className="
                    mb-6
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-2xl
                    bg-white/20
                    shadow-lg
                    backdrop-blur-md
                  "
                >
                  <FaPaperPlane size={28} />
                </div>

                <h2 className="text-3xl font-black">
                  Share Your Experience
                </h2>

                <p
                  className="
                    mt-4
                    leading-8
                    text-blue-100
                  "
                >
                  Your feedback helps future clients
                  choose the right freelancer and
                  encourages professionals to deliver
                  high-quality work.
                </p>

                <div
                  className="
                    mt-8
                    grid
                    grid-cols-3
                    gap-3
                  "
                >
                  <div
                    className="
                      rounded-2xl
                      bg-white/10
                      p-4
                      text-center
                      backdrop-blur-md
                    "
                  >
                    <FaUsers className="mx-auto mb-2" />

                    <span className="text-xs text-blue-100">
                      Trust
                    </span>
                  </div>

                  <div
                    className="
                      rounded-2xl
                      bg-white/10
                      p-4
                      text-center
                      backdrop-blur-md
                    "
                  >
                    <FaChartLine className="mx-auto mb-2" />

                    <span className="text-xs text-blue-100">
                      Growth
                    </span>
                  </div>

                  <div
                    className="
                      rounded-2xl
                      bg-white/10
                      p-4
                      text-center
                      backdrop-blur-md
                    "
                  >
                    <FaShieldAlt className="mx-auto mb-2" />

                    <span className="text-xs text-blue-100">
                      Safety
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Writing Tips */}

            <section
              className="
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-7
                shadow-xl
              "
            >
              <h2
                className="
                  mb-6
                  text-2xl
                  font-black
                  text-slate-900
                "
              >
                Writing Tips
              </h2>

              <div className="space-y-6">
                {REVIEW_TIPS.map(
                  ({
                    icon: Icon,
                    title,
                    description,
                  }) => (
                    <div
                      key={title}
                      className="
                        flex
                        gap-4
                      "
                    >
                      <div
                        className="
                          flex
                          h-10
                          w-10
                          flex-shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-green-100
                          text-green-600
                        "
                      >
                        <Icon />
                      </div>

                      <div>
                        <h3
                          className="
                            font-bold
                            text-slate-800
                          "
                        >
                          {title}
                        </h3>

                        <p
                          className="
                            mt-1
                            text-sm
                            leading-6
                            text-slate-500
                          "
                        >
                          {description}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>

            {/* Rating Guide */}

            <section
              className="
                rounded-3xl
                border
                border-yellow-200
                bg-yellow-50
                p-7
                shadow-xl
              "
            >
              <h2
                className="
                  mb-6
                  text-2xl
                  font-black
                  text-yellow-800
                "
              >
                Rating Guide
              </h2>

              <div className="space-y-4">
                {RATING_GUIDE.map(
                  ({
                    rating,
                    label,
                    description,
                  }) => (
                    <div
                      key={rating}
                      className="
                        flex
                        items-center
                        justify-between
                        gap-4
                      "
                    >
                      <div className="flex items-center gap-1">
                        {Array.from({
                          length: rating,
                        }).map((_, index) => (
                          <FaStar
                            key={index}
                            className="text-yellow-500"
                            size={15}
                          />
                        ))}
                      </div>

                      <div className="text-right">
                        <p
                          className="
                            text-sm
                            font-bold
                            text-slate-700
                          "
                        >
                          {label}
                        </p>

                        <p
                          className="
                            text-xs
                            text-slate-500
                          "
                        >
                          {description}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>
          </motion.aside>

          {/* =================================================
              REVIEW FORM AREA
          ================================================= */}

          <motion.section
            variants={slideRight}
            initial="hidden"
            animate="visible"
            className="
              xl:col-span-8
            "
          >
            <div
              className="
                overflow-hidden
                rounded-3xl
                border
                border-slate-200
                bg-white
                shadow-2xl
              "
            >

              {/* Form Header */}

              <div
                className="
                  relative
                  overflow-hidden
                  bg-gradient-to-r
                  from-indigo-600
                  via-blue-600
                  to-cyan-500
                  p-8
                  text-white
                  sm:p-10
                "
              >
                <div
                  className="
                    absolute
                    -right-20
                    -top-20
                    h-64
                    w-64
                    rounded-full
                    bg-white/10
                    blur-3xl
                  "
                />

                <div className="relative">
                  <div
                    className="
                      mb-5
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-2xl
                      bg-white/20
                      backdrop-blur-md
                    "
                  >
                    <FaStar size={24} />
                  </div>

                  <h2 className="text-3xl font-black">
                    Submit Your Review
                  </h2>

                  <p
                    className="
                      mt-3
                      max-w-2xl
                      leading-7
                      text-blue-100
                    "
                  >
                    Rate your experience and share
                    detailed feedback about the service
                    you received.
                  </p>
                </div>
              </div>

              {/* Review Form */}

              <div className="p-6 sm:p-10">
                <ReviewForm
                  loading={loading}
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                />
              </div>
            </div>

            {/* Why Reviews Matter */}

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{
                delay: 0.3,
              }}
              className="
                mt-6
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-7
                shadow-lg
              "
            >
              <div className="flex gap-5">
                <div
                  className="
                    flex
                    h-12
                    w-12
                    flex-shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-blue-100
                    text-blue-600
                  "
                >
                  <FaChartLine />
                </div>

                <div>
                  <h3
                    className="
                      text-xl
                      font-black
                      text-slate-900
                    "
                  >
                    Why Reviews Matter
                  </h3>

                  <p
                    className="
                      mt-3
                      leading-8
                      text-slate-600
                    "
                  >
                    Reviews improve transparency, build
                    trust between freelancers and clients,
                    and help maintain a high-quality
                    marketplace. Honest feedback also
                    supports reputation systems, analytics,
                    rankings, and recommendations.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.section>
        </div>

        {/* =================================================
            FOOTER CTA
        ================================================= */}

        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{
            delay: 0.5,
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
              p-8
              text-white
              shadow-2xl
              sm:p-12
            "
          >
            <div
              className="
                absolute
                -right-24
                -top-24
                h-72
                w-72
                rounded-full
                bg-white/10
                blur-3xl
              "
            />

            <div className="relative">
              <h2
                className="
                  text-3xl
                  font-black
                  sm:text-4xl
                "
              >
                Thank You for Your Feedback
              </h2>

              <p
                className="
                  mt-5
                  max-w-3xl
                  text-base
                  leading-8
                  text-blue-100
                  sm:text-lg
                "
              >
                Your review helps create a trusted
                freelance marketplace by encouraging
                quality work and helping future clients
                make informed decisions.
              </p>

              <div
                className="
                  mt-8
                  flex
                  flex-wrap
                  gap-4
                "
              >
                <motion.button
                  type="button"
                  whileHover={{
                    scale: 1.03,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  onClick={() =>
                    navigate("/reviews")
                  }
                  className="
                    rounded-2xl
                    bg-white
                    px-7
                    py-4
                    font-bold
                    text-indigo-700
                    shadow-lg
                  "
                >
                  View All Reviews
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{
                    scale: 1.03,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  onClick={() =>
                    navigate("/dashboard")
                  }
                  className="
                    rounded-2xl
                    border
                    border-white/30
                    bg-white/10
                    px-7
                    py-4
                    font-bold
                    text-white
                    backdrop-blur-md
                  "
                >
                  Go to Dashboard
                </motion.button>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
};

export default CreateReview;