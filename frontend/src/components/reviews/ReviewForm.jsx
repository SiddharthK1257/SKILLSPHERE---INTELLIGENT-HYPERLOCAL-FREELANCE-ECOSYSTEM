import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaPaperPlane,
  FaEdit,
  FaCheckCircle,
  FaStar,
} from "react-icons/fa";

import RatingStars from "./RatingStars";

/* ==========================================================
   DEFAULT FORM
========================================================== */

const DEFAULT_FORM = {
  overallRating: 5,
  communication: 5,
  quality: 5,
  delivery: 5,
  professionalism: 5,
  valueForMoney: 5,

  title: "",
  comment: "",

  recommendFreelancer: true,
  wouldHireAgain: true,
};

/* ==========================================================
   NORMALIZE EDIT DATA
========================================================== */

const normalizeReviewData = (data) => ({
  overallRating: Number(data?.overallRating) || 5,

  communication: Number(data?.communication) || 5,

  quality: Number(data?.quality) || 5,

  delivery: Number(data?.delivery) || 5,

  professionalism:
    Number(data?.professionalism) || 5,

  valueForMoney:
    Number(data?.valueForMoney) || 5,

  title: data?.title || "",

  comment: data?.comment || "",

  recommendFreelancer:
    data?.recommendFreelancer ?? true,

  wouldHireAgain:
    data?.wouldHireAgain ?? true,
});

/* ==========================================================
   REVIEW FORM
========================================================== */

const ReviewForm = ({
  initialData = null,
  loading = false,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] =
    useState(DEFAULT_FORM);

  const [errors, setErrors] =
    useState({});

  const MAX_CHARACTERS = 2500;

  /* ========================================================
     LOAD EDIT DATA
  ======================================================== */

  useEffect(() => {
    if (initialData) {
      setFormData(
        normalizeReviewData(initialData)
      );
    } else {
      setFormData(DEFAULT_FORM);
    }

    setErrors({});
  }, [initialData]);

  /* ========================================================
     INPUT CHANGE
  ======================================================== */

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  /* ========================================================
     RATING CHANGE
  ======================================================== */

  const handleRatingChange = (
    field,
    value
  ) => {
    const numericValue = Number(value);

    setFormData((previous) => ({
      ...previous,

      [field]: numericValue,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: "",
    }));
  };

  /* ========================================================
     VALIDATION
  ======================================================== */

  const validate = () => {
    const validationErrors = {};

    const ratingFields = [
      "overallRating",
      "communication",
      "quality",
      "delivery",
      "professionalism",
      "valueForMoney",
    ];

    ratingFields.forEach((field) => {
      const value = Number(formData[field]);

      if (
        !Number.isInteger(value) ||
        value < 1 ||
        value > 5
      ) {
        validationErrors[field] =
          "Rating must be between 1 and 5.";
      }
    });

    if (!formData.title.trim()) {
      validationErrors.title =
        "Review title is required.";
    } else if (
      formData.title.trim().length < 3
    ) {
      validationErrors.title =
        "Review title must contain at least 3 characters.";
    }

    const comment =
      formData.comment.trim();

    if (!comment) {
      validationErrors.comment =
        "Review comment is required.";
    } else if (comment.length < 20) {
      validationErrors.comment =
        "Review must contain at least 20 characters.";
    } else if (
      comment.length > MAX_CHARACTERS
    ) {
      validationErrors.comment =
        `Review cannot exceed ${MAX_CHARACTERS} characters.`;
    }

    setErrors(validationErrors);

    return (
      Object.keys(validationErrors)
        .length === 0
    );
  };

  /* ========================================================
     SUBMIT
  ======================================================== */

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) return;

    /*
      IMPORTANT:
      This payload exactly matches the backend.
    */

    const payload = {
      overallRating:
        Number(formData.overallRating),

      communication:
        Number(formData.communication),

      quality:
        Number(formData.quality),

      delivery:
        Number(formData.delivery),

      professionalism:
        Number(formData.professionalism),

      valueForMoney:
        Number(formData.valueForMoney),

      title:
        formData.title.trim(),

      comment:
        formData.comment.trim(),

      recommendFreelancer:
        Boolean(
          formData.recommendFreelancer
        ),

      wouldHireAgain:
        Boolean(
          formData.wouldHireAgain
        ),
    };

    if (onSubmit) {
      onSubmit(payload);
    }
  };

  /* ========================================================
     RATING DATA
  ======================================================== */

  const ratings = [
    {
      label: "Overall Rating",
      field: "overallRating",
    },
    {
      label: "Communication",
      field: "communication",
    },
    {
      label: "Quality of Work",
      field: "quality",
    },
    {
      label: "Delivery & Deadline",
      field: "delivery",
    },
    {
      label: "Professionalism",
      field: "professionalism",
    },
    {
      label: "Value for Money",
      field: "valueForMoney",
    },
  ];

  /* ========================================================
     RENDER
  ======================================================== */

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
      transition={{
        duration: 0.4,
      }}
      className="
        mx-auto
        max-w-5xl
        overflow-hidden
        rounded-3xl
        border
        border-gray-200
        bg-white
        shadow-2xl
      "
    >
      {/* ====================================================
          HEADER
      ==================================================== */}

      <div
        className="
          bg-gradient-to-r
          from-blue-600
          via-cyan-500
          to-indigo-600
          p-8
          text-white
        "
      >
        <div className="flex items-center gap-4">

          <div
            className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-white/20
              backdrop-blur-lg
            "
          >
            {initialData ? (
              <FaEdit size={28} />
            ) : (
              <FaPaperPlane size={26} />
            )}
          </div>

          <div>
            <h2 className="text-3xl font-bold">
              {initialData
                ? "Edit Review"
                : "Write a Review"}
            </h2>

            <p className="mt-2 text-blue-100">
              Share your honest experience and help
              other clients make better decisions.
            </p>
          </div>

        </div>
      </div>

      {/* ====================================================
          FORM
      ==================================================== */}

      <form
        onSubmit={handleSubmit}
        className="space-y-8 p-6 md:p-8"
      >

        {/* ==================================================
            RATINGS
        ================================================== */}

        <section>

          <div className="mb-6">

            <h3
              className="
                flex
                items-center
                gap-3
                text-2xl
                font-bold
                text-gray-800
              "
            >
              <FaStar className="text-yellow-500" />

              Rate Your Experience
            </h3>

            <p className="mt-2 text-gray-500">
              Please rate every aspect of your
              experience from 1 to 5 stars.
            </p>

          </div>

          <div
            className="
              grid
              gap-5
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >

            {ratings.map((rating) => (
              <div
                key={rating.field}
                className={`
                  rounded-2xl
                  border
                  p-5
                  transition-all

                  ${
                    errors[rating.field]
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 bg-gray-50"
                  }
                `}
              >

                <h4
                  className="
                    mb-4
                    font-semibold
                    text-gray-800
                  "
                >
                  {rating.label}
                </h4>

                <RatingStars
                  rating={
                    formData[rating.field]
                  }
                  editable
                  onChange={(value) =>
                    handleRatingChange(
                      rating.field,
                      value
                    )
                  }
                />

                {errors[rating.field] && (
                  <p
                    className="
                      mt-2
                      text-xs
                      text-red-500
                    "
                  >
                    {errors[rating.field]}
                  </p>
                )}

              </div>
            ))}

          </div>

        </section>

        {/* ==================================================
            TITLE
        ================================================== */}

        <section>

          <label
            htmlFor="title"
            className="
              mb-2
              block
              text-lg
              font-semibold
              text-gray-800
            "
          >
            Review Title
          </label>

          <input
            id="title"
            name="title"
            type="text"
            maxLength={150}
            value={formData.title}
            onChange={handleChange}
            placeholder="
              Example: Excellent developer and highly recommended!
            "
            className={`
              w-full
              rounded-2xl
              border
              px-5
              py-4
              text-gray-700
              outline-none
              transition

              ${
                errors.title
                  ? "border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              }
            `}
          />

          {errors.title && (
            <p className="mt-2 text-sm text-red-500">
              {errors.title}
            </p>
          )}

        </section>

        {/* ==================================================
            COMMENT
        ================================================== */}

        <section>

          <div
            className="
              mb-2
              flex
              items-center
              justify-between
            "
          >

            <label
              htmlFor="comment"
              className="
                text-lg
                font-semibold
                text-gray-800
              "
            >
              Review Description
            </label>

            <span
              className={`
                text-sm
                font-medium

                ${
                  formData.comment.length >
                  MAX_CHARACTERS * 0.9
                    ? "text-red-500"
                    : "text-gray-500"
                }
              `}
            >
              {formData.comment.length} /{" "}
              {MAX_CHARACTERS}
            </span>

          </div>

          <textarea
            id="comment"
            name="comment"
            rows={8}
            maxLength={MAX_CHARACTERS}
            value={formData.comment}
            onChange={handleChange}
            placeholder="
              Share your complete experience with this freelancer...
            "
            className={`
              w-full
              resize-none
              rounded-2xl
              border
              px-5
              py-4
              text-gray-700
              outline-none
              transition

              ${
                errors.comment
                  ? "border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              }
            `}
          />

          {errors.comment && (
            <p className="mt-2 text-sm text-red-500">
              {errors.comment}
            </p>
          )}

        </section>

        {/* ==================================================
            RECOMMENDATION
        ================================================== */}

        <section
          className="
            rounded-2xl
            border
            border-gray-200
            bg-gray-50
            p-6
          "
        >

          <h3
            className="
              mb-5
              text-xl
              font-bold
              text-gray-800
            "
          >
            Your Recommendation
          </h3>

          <div className="space-y-5">

            <label
              className="
                flex
                cursor-pointer
                items-center
                gap-4
              "
            >

              <input
                type="checkbox"
                name="recommendFreelancer"
                checked={
                  formData.recommendFreelancer
                }
                onChange={handleChange}
                className="
                  h-5
                  w-5
                  accent-blue-600
                "
              />

              <span className="text-gray-700">
                I recommend this freelancer to others.
              </span>

            </label>

            <label
              className="
                flex
                cursor-pointer
                items-center
                gap-4
              "
            >

              <input
                type="checkbox"
                name="wouldHireAgain"
                checked={
                  formData.wouldHireAgain
                }
                onChange={handleChange}
                className="
                  h-5
                  w-5
                  accent-blue-600
                "
              />

              <span className="text-gray-700">
                I would hire this freelancer again.
              </span>

            </label>

          </div>

        </section>

        {/* ==================================================
            ACTIONS
        ================================================== */}

        <div
          className="
            flex
            flex-col
            gap-4
            border-t
            border-gray-200
            pt-8
            sm:flex-row
            sm:justify-end
          "
        >

          {onCancel && (
            <motion.button
              type="button"
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.96,
              }}
              onClick={onCancel}
              disabled={loading}
              className="
                rounded-xl
                border
                border-gray-300
                bg-white
                px-8
                py-3
                font-semibold
                text-gray-700
                transition
                hover:border-red-400
                hover:bg-red-50
                hover:text-red-600
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Cancel
            </motion.button>
          )}

          <motion.button
            type="submit"
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.96,
            }}
            disabled={loading}
            className="
              flex
              items-center
              justify-center
              gap-3
              rounded-xl
              bg-gradient-to-r
              from-blue-600
              via-cyan-500
              to-indigo-600
              px-8
              py-3
              font-semibold
              text-white
              shadow-lg
              transition
              hover:shadow-xl
              disabled:cursor-not-allowed
              disabled:opacity-70
            "
          >

            {loading ? (
              <>
                <span
                  className="
                    h-5
                    w-5
                    animate-spin
                    rounded-full
                    border-2
                    border-white
                    border-t-transparent
                  "
                />

                Saving...
              </>
            ) : initialData ? (
              <>
                <FaEdit />

                Update Review
              </>
            ) : (
              <>
                <FaCheckCircle />

                Submit Review
              </>
            )}

          </motion.button>

        </div>

      </form>

    </motion.div>
  );
};

export default ReviewForm;