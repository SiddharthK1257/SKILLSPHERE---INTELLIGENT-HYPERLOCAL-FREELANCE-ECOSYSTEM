import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FaArrowLeft,
  FaCheckCircle,
  FaCommentDots,
  FaHeart,
  FaShieldAlt,
  FaStar,
} from "react-icons/fa";

import { toast } from "react-hot-toast";

import ReviewForm from "../../components/reviews/ReviewForm";

import {
  createReview,
} from "../../services/reviewService";

/* ==========================================================
   CREATE REVIEW PAGE
========================================================== */

const CreateReviewPage = () => {
  const navigate = useNavigate();

  const {
    proposalId,
  } = useParams();

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    pageError,
    setPageError,
  ] = useState("");

  /* ========================================================
     VALIDATE PROPOSAL ID
  ======================================================== */

  useEffect(() => {
    if (!proposalId) {
      setPageError(
        "The proposal ID is missing. Unable to create a review."
      );
    }
  }, [proposalId]);

  /* ========================================================
     SUBMIT REVIEW
  ======================================================== */

  const handleSubmit = useCallback(
    async (formData) => {
      if (loading) return;

      if (!proposalId) {
        toast.error(
          "Proposal ID is missing."
        );

        return;
      }

      if (!formData) {
        toast.error(
          "Please complete the review form."
        );

        return;
      }

      try {
        setLoading(true);

        const payload = {
          ...formData,
          proposalId,
        };

        const response =
          await createReview(payload);

        if (!response?.success) {
          throw new Error(
            response?.message ||
              "Failed to submit review."
          );
        }

        toast.success(
          response.message ||
            "Review submitted successfully!"
        );

        navigate(
          "/my-reviews",
          {
            replace: true,
          }
        );

      } catch (error) {
        console.error(
          "Create Review Error:",
          error
        );

        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to submit review. Please try again.";

        toast.error(message);

      } finally {
        setLoading(false);
      }
    },
    [
      loading,
      proposalId,
      navigate,
    ]
  );

  /* ========================================================
     MISSING PROPOSAL ID
  ======================================================== */

  if (!proposalId) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-gradient-to-br
          from-slate-50
          via-blue-50
          to-cyan-50
          px-4
          py-10
        "
      >
        <div
          className="
            w-full
            max-w-lg
            rounded-3xl
            border
            border-red-200
            bg-white
            p-8
            text-center
            shadow-xl
          "
        >
          <div
            className="
              mx-auto
              mb-5
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-red-100
              text-red-600
            "
          >
            <FaShieldAlt
              size={26}
            />
          </div>

          <h1
            className="
              text-2xl
              font-bold
              text-slate-900
            "
          >
            Unable to Create Review
          </h1>

          <p
            className="
              mt-3
              leading-7
              text-slate-600
            "
          >
            {pageError ||
              "The proposal information could not be found."}
          </p>

          <Link
            to="/my-reviews"
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-gradient-to-r
              from-blue-600
              to-indigo-600
              px-6
              py-3
              font-semibold
              text-white
              shadow-lg
              transition
              hover:scale-[1.02]
              hover:shadow-xl
            "
          >
            <FaArrowLeft />

            Back to My Reviews
          </Link>
        </div>
      </main>
    );
  }

  /* ========================================================
     PAGE
  ======================================================== */

  return (
    <main
      className="
        min-h-screen
        bg-gradient-to-br
        from-slate-50
        via-blue-50
        to-cyan-50
        px-4
        py-8
        sm:px-6
        sm:py-12
        lg:px-8
      "
    >
      <div
        className="
          mx-auto
          max-w-5xl
        "
      >
        {/* ==================================================
            BACK NAVIGATION
        ================================================== */}

        <div className="mb-8">
          <Link
            to="/my-reviews"
            aria-label="Go back to my reviews"
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-2.5
              text-sm
              font-semibold
              text-slate-600
              shadow-sm
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:border-blue-300
              hover:text-blue-600
              hover:shadow-md
            "
          >
            <FaArrowLeft />

            Back to My Reviews
          </Link>
        </div>

        {/* ==================================================
            PAGE HEADER
        ================================================== */}

        <header
          className="
            mb-10
            text-center
          "
        >
          <div
            className="
              mx-auto
              mb-5
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-3xl
              bg-gradient-to-br
              from-yellow-400
              via-orange-500
              to-red-500
              text-white
              shadow-xl
            "
          >
            <FaStar
              className="text-3xl"
            />
          </div>

          <h1
            className="
              text-3xl
              font-extrabold
              tracking-tight
              text-slate-900
              sm:text-4xl
              lg:text-5xl
            "
          >
            Share Your Experience
          </h1>

          <p
            className="
              mx-auto
              mt-4
              max-w-2xl
              text-sm
              leading-7
              text-slate-600
              sm:text-base
            "
          >
            Your feedback helps freelancers improve
            their services and helps other clients make
            better hiring decisions.
          </p>
        </header>

        {/* ==================================================
            REVIEW FORM
        ================================================== */}

        <section
          aria-label="Create review form"
          className="
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            bg-white
            shadow-2xl
          "
        >
          <div
            className="
              border-b
              border-slate-100
              bg-gradient-to-r
              from-slate-50
              to-blue-50
              px-5
              py-5
              sm:px-8
            "
          >
            <div
              className="
                flex
                items-center
                gap-4
              "
            >
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
                <FaCommentDots
                  size={22}
                />
              </div>

              <div>
                <h2
                  className="
                    text-xl
                    font-bold
                    text-slate-900
                  "
                >
                  Write Your Review
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                  "
                >
                  Tell us about your experience.
                </p>
              </div>
            </div>
          </div>

          <div
            className="
              p-4
              sm:p-8
            "
          >
            <ReviewForm
              loading={loading}
              onSubmit={handleSubmit}
            />
          </div>
        </section>

        {/* ==================================================
            REVIEW GUIDELINES
        ================================================== */}

        <section
          className="
            mt-8
            grid
            gap-4
            sm:grid-cols-3
          "
        >
          {/* Honest */}

          <div
            className="
              rounded-2xl
              border
              border-green-100
              bg-green-50
              p-5
            "
          >
            <FaCheckCircle
              className="
                mb-3
                text-2xl
                text-green-600
              "
            />

            <h3
              className="
                font-bold
                text-green-900
              "
            >
              Be Honest
            </h3>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-green-800
              "
            >
              Share your genuine experience
              with the freelancer.
            </p>
          </div>

          {/* Respectful */}

          <div
            className="
              rounded-2xl
              border
              border-blue-100
              bg-blue-50
              p-5
            "
          >
            <FaHeart
              className="
                mb-3
                text-2xl
                text-blue-600
              "
            />

            <h3
              className="
                font-bold
                text-blue-900
              "
            >
              Be Respectful
            </h3>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-blue-800
              "
            >
              Keep your feedback professional
              and constructive.
            </p>
          </div>

          {/* Helpful */}

          <div
            className="
              rounded-2xl
              border
              border-amber-100
              bg-amber-50
              p-5
            "
          >
            <FaStar
              className="
                mb-3
                text-2xl
                text-amber-500
              "
            />

            <h3
              className="
                font-bold
                text-amber-900
              "
            >
              Be Helpful
            </h3>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-amber-800
              "
            >
              Explain what went well and
              where improvements may help.
            </p>
          </div>
        </section>

        {/* ==================================================
            TRUST INFORMATION
        ================================================== */}

        <div
          className="
            mt-8
            rounded-2xl
            border
            border-blue-100
            bg-blue-50
            p-5
            text-center
          "
        >
          <div
            className="
              flex
              items-center
              justify-center
              gap-2
              text-blue-700
            "
          >
            <FaShieldAlt />

            <span
              className="
                font-semibold
              "
            >
              Community Guidelines
            </span>
          </div>

          <p
            className="
              mx-auto
              mt-2
              max-w-3xl
              text-sm
              leading-6
              text-blue-800
            "
          >
            Please provide honest and respectful
            feedback based on your actual experience
            with the freelancer. Reviews that contain
            harassment, spam, threats, or misleading
            information may be removed.
          </p>
        </div>
      </div>
    </main>
  );
};

export default CreateReviewPage;