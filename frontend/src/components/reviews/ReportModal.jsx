import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaFlag,
  FaPaperPlane,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";

import {
  reportReview,
} from "../../services/reviewService";

/* =========================================================
   REPORT REASONS
========================================================= */

const REPORT_REASONS = [
  {
    value: "Spam",
    label: "Spam",
    icon: "🚫",
    description:
      "The review appears to be promotional or repetitive spam.",
  },

  {
    value: "Fake Review",
    label: "Fake Review",
    icon: "❌",
    description:
      "The review may not be based on a genuine experience.",
  },

  {
    value: "Harassment",
    label: "Harassment",
    icon: "⚠️",
    description:
      "The review targets or harasses another person.",
  },

  {
    value: "Abusive Language",
    label: "Abusive Language",
    icon: "🤬",
    description:
      "The review contains abusive or offensive language.",
  },

  {
    value: "Misleading Information",
    label: "Misleading Information",
    icon: "📢",
    description:
      "The review contains inaccurate or misleading information.",
  },

  {
    value: "Conflict of Interest",
    label: "Conflict of Interest",
    icon: "⚖️",
    description:
      "The reviewer may have a personal or business conflict.",
  },

  {
    value: "Other",
    label: "Other",
    icon: "📝",
    description:
      "Report another issue not listed above.",
  },
];

/* =========================================================
   CONSTANTS
========================================================= */

const MAX_DESCRIPTION_LENGTH = 500;

/* =========================================================
   COMPONENT
========================================================= */

const ReportModal = ({
  show = false,
  onClose,
  reviewId,
  onSuccess,
}) => {
  /* =====================================================
      STATE
  ===================================================== */

  const [reason, setReason] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  /* =====================================================
      REFS
  ===================================================== */

  const firstReasonRef =
    useRef(null);

  const modalRef =
    useRef(null);

  /* =====================================================
      RESET FORM
  ===================================================== */

  const resetForm = useCallback(() => {
    setReason("");
    setDescription("");
    setLoading(false);
    setError("");
    setSuccess(false);
  }, []);

  /* =====================================================
      CLOSE MODAL
  ===================================================== */

  const handleClose = useCallback(() => {
    if (loading) return;

    resetForm();

    if (onClose) {
      onClose();
    }
  }, [
    loading,
    onClose,
    resetForm,
  ]);

  /* =====================================================
      RESET WHEN OPENED
  ===================================================== */

  useEffect(() => {
    if (!show) return;

    resetForm();

    const timer = setTimeout(() => {
      firstReasonRef.current?.focus();
    }, 250);

    return () => {
      clearTimeout(timer);
    };
  }, [
    show,
    resetForm,
  ]);

  /* =====================================================
      PREVENT BODY SCROLL
  ===================================================== */

  useEffect(() => {
    if (!show) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [show]);

  /* =====================================================
      ESCAPE KEY
  ===================================================== */

  useEffect(() => {
    if (!show) return;

    const handleKeyDown = (event) => {
      if (
        event.key === "Escape" &&
        !loading
      ) {
        handleClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    show,
    loading,
    handleClose,
  ]);

  /* =====================================================
      SELECT REASON
  ===================================================== */

  const handleReasonChange = (value) => {
    setReason(value);

    if (error) {
      setError("");
    }
  };

  /* =====================================================
      DESCRIPTION CHANGE
  ===================================================== */

  const handleDescriptionChange = (
    event
  ) => {
    const value =
      event.target.value.slice(
        0,
        MAX_DESCRIPTION_LENGTH
      );

    setDescription(value);

    if (error) {
      setError("");
    }
  };

  /* =====================================================
      SUBMIT REPORT
  ===================================================== */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");

    /* ---------------------------------
       VALIDATE REVIEW ID
    --------------------------------- */

    if (!reviewId) {
      setError(
        "Unable to identify this review."
      );

      return;
    }

    /* ---------------------------------
       VALIDATE REASON
    --------------------------------- */

    if (!reason) {
      setError(
        "Please select a reason for reporting this review."
      );

      return;
    }

    /* ---------------------------------
       CLEAN DESCRIPTION
    --------------------------------- */

    const cleanedDescription =
      description.trim();

    try {
      setLoading(true);

      const response =
        await reportReview(
          reviewId,
          {
            reason,
            description:
              cleanedDescription,
          }
        );

      if (
        response?.success === false
      ) {
        throw new Error(
          response.message ||
            "Unable to submit report."
        );
      }

      setSuccess(true);

      if (onSuccess) {
        onSuccess(response);
      }

      /*
        Close after success.
      */

      setTimeout(() => {
        handleClose();
      }, 1600);

    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to report this review. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
      MODAL
  ===================================================== */

  return (
    <AnimatePresence>
      {show && (

        <motion.div
          className="
            fixed
            inset-0
            z-[1000]
            flex
            items-center
            justify-center
            bg-black/70
            p-4
            backdrop-blur-sm
          "
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              handleClose();
            }
          }}
        >

          {/* =================================================
              MODAL CONTAINER
          ================================================= */}

          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-review-title"
            aria-describedby="report-review-description"
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 30,
              scale: 0.95,
            }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
            className="
              flex
              max-h-[92vh]
              w-full
              max-w-3xl
              flex-col
              overflow-hidden
              rounded-3xl
              bg-white
              shadow-2xl
            "
          >

            {/* =================================================
                HEADER
            ================================================= */}

            <div
              className="
                relative
                shrink-0
                overflow-hidden
                bg-gradient-to-r
                from-red-600
                via-rose-600
                to-pink-600
                px-6
                py-6
                text-white
                sm:px-8
                sm:py-7
              "
            >

              {/* Decorative Glow */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-20
                  -top-24
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
                  items-start
                  justify-between
                  gap-5
                "
              >

                {/* Header Content */}

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
                      h-14
                      w-14
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      bg-white/20
                      shadow-lg
                      backdrop-blur-md
                      sm:h-16
                      sm:w-16
                    "
                  >

                    <FaFlag
                      size={26}
                    />

                  </div>

                  <div>

                    <h2
                      id="report-review-title"
                      className="
                        text-2xl
                        font-extrabold
                        sm:text-3xl
                      "
                    >
                      Report Review
                    </h2>

                    <p
                      id="report-review-description"
                      className="
                        mt-1
                        max-w-xl
                        text-sm
                        leading-6
                        text-red-100
                        sm:text-base
                      "
                    >
                      Help us maintain a safe and trustworthy community.
                    </p>

                  </div>

                </div>

                {/* Close Button */}

                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  aria-label="Close report modal"
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-white/15
                    transition
                    hover:bg-white/25
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >

                  <FaTimes />

                </button>

              </div>

            </div>

            {/* =================================================
                SCROLLABLE CONTENT
            ================================================= */}

            <div
              className="
                overflow-y-auto
              "
            >

              <form
                onSubmit={handleSubmit}
                className="
                  space-y-7
                  p-5
                  sm:p-8
                "
              >

                {/* =================================================
                    ALERTS
                ================================================= */}

                <AnimatePresence mode="wait">

                  {error && (

                    <motion.div
                      key="error"
                      initial={{
                        opacity: 0,
                        y: -10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -10,
                      }}
                      role="alert"
                      className="
                        flex
                        items-start
                        gap-3
                        rounded-2xl
                        border
                        border-red-200
                        bg-red-50
                        p-4
                        text-sm
                        text-red-700
                      "
                    >

                      <FaExclamationTriangle
                        className="
                          mt-0.5
                          shrink-0
                        "
                      />

                      <span>
                        {error}
                      </span>

                    </motion.div>

                  )}

                  {success && (

                    <motion.div
                      key="success"
                      initial={{
                        opacity: 0,
                        y: -10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -10,
                      }}
                      role="status"
                      className="
                        flex
                        items-center
                        gap-3
                        rounded-2xl
                        border
                        border-green-200
                        bg-green-50
                        p-4
                        text-sm
                        text-green-700
                      "
                    >

                      <FaCheckCircle />

                      <span>
                        Report submitted successfully.
                      </span>

                    </motion.div>

                  )}

                </AnimatePresence>

                {/* =================================================
                    REPORT REASON
                ================================================= */}

                <section>

                  <div className="mb-4">

                    <h3
                      className="
                        text-xl
                        font-bold
                        text-gray-900
                      "
                    >
                      Why are you reporting this review?
                    </h3>

                    <p
                      className="
                        mt-1
                        text-sm
                        text-gray-500
                      "
                    >
                      Select the reason that best describes the issue.
                    </p>

                  </div>

                  <div
                    className="
                      grid
                      gap-3
                      sm:grid-cols-2
                    "
                  >

                    {REPORT_REASONS.map(
                      (item, index) => {

                        const isSelected =
                          reason ===
                          item.value;

                        return (

                          <motion.button
                            key={item.value}
                            ref={
                              index === 0
                                ? firstReasonRef
                                : null
                            }
                            type="button"
                            onClick={() =>
                              handleReasonChange(
                                item.value
                              )
                            }
                            whileHover={{
                              y: -2,
                            }}
                            whileTap={{
                              scale: 0.98,
                            }}
                            aria-pressed={
                              isSelected
                            }
                            className={`
                              group
                              flex
                              items-start
                              gap-3
                              rounded-2xl
                              border
                              p-4
                              text-left
                              transition-all
                              duration-200

                              ${
                                isSelected
                                  ? "border-red-500 bg-red-50 shadow-md ring-2 ring-red-100"
                                  : "border-gray-200 bg-white hover:border-red-300 hover:bg-red-50/50"
                              }
                            `}
                          >

                            {/* Icon */}

                            <span
                              className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-gray-100
                                text-2xl
                                transition
                                group-hover:scale-105
                              "
                            >
                              {item.icon}
                            </span>

                            {/* Text */}

                            <span>

                              <span
                                className="
                                  block
                                  font-semibold
                                  text-gray-900
                                "
                              >
                                {item.label}
                              </span>

                              <span
                                className="
                                  mt-1
                                  block
                                  text-xs
                                  leading-5
                                  text-gray-500
                                "
                              >
                                {item.description}
                              </span>

                            </span>

                          </motion.button>

                        );
                      }
                    )}

                  </div>

                </section>

                {/* =================================================
                    DESCRIPTION
                ================================================= */}

                <section>

                  <div
                    className="
                      mb-3
                      flex
                      items-center
                      justify-between
                      gap-4
                    "
                  >

                    <label
                      htmlFor="report-description"
                      className="
                        text-xl
                        font-bold
                        text-gray-900
                      "
                    >
                      Additional Details
                      <span
                        className="
                          ml-2
                          text-sm
                          font-normal
                          text-gray-400
                        "
                      >
                        Optional
                      </span>
                    </label>

                    <span
                      className={`
                        shrink-0
                        text-xs
                        font-semibold

                        ${
                          description.length >=
                          MAX_DESCRIPTION_LENGTH * 0.9
                            ? "text-red-500"
                            : "text-gray-500"
                        }
                      `}
                    >
                      {description.length}/
                      {MAX_DESCRIPTION_LENGTH}
                    </span>

                  </div>

                  <textarea
                    id="report-description"
                    value={description}
                    onChange={
                      handleDescriptionChange
                    }
                    maxLength={
                      MAX_DESCRIPTION_LENGTH
                    }
                    rows={6}
                    placeholder="
                      Explain what happened and provide any useful details...
                    "
                    className="
                      w-full
                      resize-none
                      rounded-2xl
                      border
                      border-gray-300
                      bg-gray-50
                      px-4
                      py-4
                      text-sm
                      text-gray-800
                      outline-none
                      transition
                      placeholder:text-gray-400
                      focus:border-red-500
                      focus:bg-white
                      focus:ring-4
                      focus:ring-red-100
                    "
                  />

                  <p
                    className="
                      mt-2
                      text-xs
                      text-gray-500
                    "
                  >
                    Please avoid sharing private or sensitive personal information.
                  </p>

                </section>

                {/* =================================================
                    INFORMATION BOX
                ================================================= */}

                <div
                  className="
                    rounded-2xl
                    border
                    border-amber-200
                    bg-amber-50
                    p-5
                  "
                >

                  <div
                    className="
                      flex
                      items-start
                      gap-3
                    "
                  >

                    <FaExclamationTriangle
                      className="
                        mt-1
                        shrink-0
                        text-amber-600
                      "
                    />

                    <div>

                      <h4
                        className="
                          font-bold
                          text-amber-900
                        "
                      >
                        Before submitting
                      </h4>

                      <ul
                        className="
                          mt-2
                          space-y-1
                          text-sm
                          leading-6
                          text-amber-800
                        "
                      >

                        <li>
                          • Reports are reviewed by our moderation team.
                        </li>

                        <li>
                          • Only report genuine violations.
                        </li>

                        <li>
                          • False or abusive reporting may affect your account.
                        </li>

                      </ul>

                    </div>

                  </div>

                </div>

                {/* =================================================
                    ACTION BUTTONS
                ================================================= */}

                <div
                  className="
                    flex
                    flex-col-reverse
                    gap-3
                    border-t
                    border-gray-200
                    pt-6
                    sm:flex-row
                    sm:justify-end
                  "
                >

                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="
                      rounded-xl
                      border
                      border-gray-300
                      bg-white
                      px-6
                      py-3
                      font-semibold
                      text-gray-700
                      transition
                      hover:border-gray-400
                      hover:bg-gray-50
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      loading ||
                      success ||
                      !reason
                    }
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-gradient-to-r
                      from-red-600
                      to-rose-600
                      px-6
                      py-3
                      font-semibold
                      text-white
                      shadow-md
                      transition
                      hover:from-red-700
                      hover:to-rose-700
                      hover:shadow-lg
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >

                    {loading ? (

                      <>
                        <FaSpinner
                          className="
                            animate-spin
                          "
                        />

                        Submitting...
                      </>

                    ) : (

                      <>
                        <FaPaperPlane />

                        Submit Report
                      </>

                    )}

                  </button>

                </div>

              </form>

            </div>

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>
  );
};

export default ReportModal;