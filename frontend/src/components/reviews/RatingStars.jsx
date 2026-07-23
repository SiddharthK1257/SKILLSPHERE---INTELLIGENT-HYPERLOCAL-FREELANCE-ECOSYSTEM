import {
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

import {
  FaStar,
} from "react-icons/fa";

/* =========================================================
   CONSTANTS
========================================================= */

const MIN_RATING = 0;
const MAX_RATING = 5;

/* =========================================================
   HELPERS
========================================================= */

/**
 * Keeps rating inside 0–5.
 */
const clampRating = (
  value,
  min = MIN_RATING,
  max = MAX_RATING
) => {
  const numericValue =
    Number(value);

  if (
    Number.isNaN(numericValue)
  ) {
    return min;
  }

  return Math.min(
    max,
    Math.max(
      min,
      numericValue
    )
  );
};

/**
 * Rounds a rating based on precision.
 *
 * precision = 1
 * 4.6 → 4.6
 *
 * precision = 0.5
 * 4.6 → 4.5
 */
const roundToPrecision = (
  value,
  precision
) => {
  if (
    !precision ||
    precision <= 0
  ) {
    return value;
  }

  return (
    Math.round(
      value / precision
    ) * precision
  );
};

/**
 * Converts precision into a
 * readable step value.
 */
const getStep = (
  precision
) => {
  if (
    precision === 0.5
  ) {
    return 0.5;
  }

  if (
    precision === 0.25
  ) {
    return 0.25;
  }

  return 1;
};

/**
 * Returns rating label.
 */
const getRatingLabel = (
  rating
) => {
  if (rating <= 0) {
    return "No rating";
  }

  if (rating >= 4.5) {
    return "Excellent";
  }

  if (rating >= 4) {
    return "Very Good";
  }

  if (rating >= 3) {
    return "Good";
  }

  if (rating >= 2) {
    return "Average";
  }

  return "Poor";
};

/* =========================================================
   STAR COMPONENT
========================================================= */

const StarIcon = ({
  index,
  rating,
  size,
  activeColor,
  inactiveColor,
}) => {
  const fillPercentage =
    Math.min(
      100,
      Math.max(
        0,
        (rating - index + 1) * 100
      )
    );

  const gradientId =
    useId();

  const isFullyActive =
    fillPercentage >= 100;

  const isInactive =
    fillPercentage <= 0;

  if (isFullyActive) {
    return (
      <FaStar
        size={size}
        color={activeColor}
        aria-hidden="true"
      />
    );
  }

  if (isInactive) {
    return (
      <FaStar
        size={size}
        color={inactiveColor}
        aria-hidden="true"
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 576 512"
      aria-hidden="true"
    >
      <defs>

        <linearGradient
          id={gradientId}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >

          <stop
            offset={`${fillPercentage}%`}
            stopColor={activeColor}
          />

          <stop
            offset={`${fillPercentage}%`}
            stopColor={inactiveColor}
          />

        </linearGradient>

      </defs>

      <path
        fill={`url(#${gradientId})`}
        d="
          M259.3 17.8
          L194 150.2
          48.2 171.5
          c-26.2 3.8-36.7 36-17.7 54.6
          l105.7 103-25 145.5
          c-4.5 26.3 23.2 46 46.4 33.7
          L288 439.6
          l130.2 68.5
          c23.2 12.2 50.9-7.4 46.4-33.7
          l-25-145.5 105.7-103
          c19-18.6 8.5-50.8-17.7-54.6
          L381.8 150.2 316.7 17.8
          c-11.7-23.6-45.3-23.9-57.4 0z
        "
      />

    </svg>
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const RatingStars = ({
  rating = 0,

  editable = false,

  onChange = () => {},

  onHoverChange = () => {},

  size = 22,

  showValue = true,

  showLabel = false,

  precision = 1,

  className = "",

  activeColor = "#f59e0b",

  inactiveColor = "#e2e8f0",

  disabled = false,

  allowClear = false,

  showEmptyText = false,

  emptyText = "No rating",

  valueFormatter,

  ariaLabel,

  name = "rating",

  gap = "gap-1",

}) => {
  /* =====================================================
      STATE
  ===================================================== */

  const [hoveredRating, setHoveredRating] =
    useState(null);

  const [focusedRating, setFocusedRating] =
    useState(null);

  /* =====================================================
      NORMALIZE VALUES
  ===================================================== */

  const safePrecision =
    precision > 0
      ? precision
      : 1;

  const safeRating =
    clampRating(
      rating
    );

  const roundedRating =
    roundToPrecision(
      safeRating,
      safePrecision
    );

  const displayRating =
    hoveredRating !== null
      ? hoveredRating
      : roundedRating;

  const step =
    getStep(
      safePrecision
    );

  const formattedRating =
    valueFormatter
      ? valueFormatter(
          safeRating
        )
      : safeRating.toFixed(
          safePrecision === 0.5
            ? 1
            : safePrecision === 0.25
            ? 2
            : 1
        );

  const ratingLabel =
    getRatingLabel(
      safeRating
    );

  /* =====================================================
      STAR IDs
  ===================================================== */

  const ratingGroupId =
    useId();

  /* =====================================================
      CLEAR HOVER
  ===================================================== */

  useEffect(() => {
    if (!editable) {
      setHoveredRating(null);
    }
  }, [
    editable,
  ]);

  /* =====================================================
      HANDLE RATING CHANGE
  ===================================================== */

  const handleRatingChange = (
    value
  ) => {
    if (
      !editable ||
      disabled
    ) {
      return;
    }

    const normalizedValue =
      roundToPrecision(
        clampRating(value),
        step
      );

    if (
      allowClear &&
      normalizedValue ===
        roundedRating
    ) {
      onChange(0);
      return;
    }

    onChange(
      normalizedValue
    );
  };

  /* =====================================================
      HANDLE HOVER
  ===================================================== */

  const handleHover = (
    value
  ) => {
    if (
      !editable ||
      disabled
    ) {
      return;
    }

    setHoveredRating(
      value
    );

    onHoverChange(
      value
    );
  };

  /* =====================================================
      HANDLE MOUSE LEAVE
  ===================================================== */

  const handleMouseLeave = () => {
    if (
      !editable ||
      disabled
    ) {
      return;
    }

    setHoveredRating(
      null
    );

    onHoverChange(
      null
    );
  };

  /* =====================================================
      KEYBOARD NAVIGATION
  ===================================================== */

  const handleKeyDown = (
    event,
    currentValue
  ) => {
    if (
      !editable ||
      disabled
    ) {
      return;
    }

    let nextValue =
      currentValue;

    switch (
      event.key
    ) {
      case "ArrowRight":
      case "ArrowUp":
        event.preventDefault();

        nextValue =
          Math.min(
            MAX_RATING,
            currentValue + step
          );

        break;

      case "ArrowLeft":
      case "ArrowDown":
        event.preventDefault();

        nextValue =
          Math.max(
            MIN_RATING,
            currentValue - step
          );

        break;

      case "Home":
        event.preventDefault();

        nextValue =
          MIN_RATING;

        break;

      case "End":
        event.preventDefault();

        nextValue =
          MAX_RATING;

        break;

      case "Enter":
      case " ":
        event.preventDefault();

        handleRatingChange(
          currentValue
        );

        return;

      default:
        return;
    }

    setFocusedRating(
      nextValue
    );

    handleHover(
      nextValue
    );
  };

  /* =====================================================
      RATING OPTIONS
  ===================================================== */

  const ratingOptions =
    useMemo(() => {
      return [
        1,
        2,
        3,
        4,
        5,
      ];
    }, []);

  /* =====================================================
      EMPTY STATE
  ===================================================== */

  if (
    !editable &&
    safeRating <= 0 &&
    showEmptyText
  ) {
    return (
      <div
        className={`
          flex
          items-center
          gap-2
          text-slate-400
          ${className}
        `}
        aria-label={emptyText}
      >
        <span
          className="
            text-sm
            font-medium
          "
        >
          {emptyText}
        </span>
      </div>
    );
  }

  /* =====================================================
      RENDER
  ===================================================== */

  return (
    <div
      className={`
        flex
        items-center
        ${gap}
        ${className}
      `}
      role={
        editable
          ? "radiogroup"
          : undefined
      }
      aria-label={
        ariaLabel ||
        (
          editable
            ? `Select rating. Current rating ${formattedRating} out of 5`
            : `Rating ${formattedRating} out of 5`
        )
      }
      aria-disabled={
        disabled
          ? "true"
          : undefined
      }
    >

      {/* =================================================
          STARS
      ================================================= */}

      <div
        className="
          flex
          items-center
        "
        onMouseLeave={
          handleMouseLeave
        }
      >

        {ratingOptions.map(
          (star) => {

            const isSelected =
              focusedRating ===
              star;

            const starValue =
              star;

            if (!editable) {
              return (
                <div
                  key={star}
                  className="
                    flex
                    items-center
                    justify-center
                  "
                  style={{
                    width: size + 6,
                    height: size + 6,
                  }}
                >
                  <StarIcon
                    index={star}
                    rating={
                      displayRating
                    }
                    size={size}
                    activeColor={
                      activeColor
                    }
                    inactiveColor={
                      inactiveColor
                    }
                  />
                </div>
              );
            }

            return (
              <motion.button
                key={star}
                type="button"
                role="radio"
                aria-checked={
                  Math.round(
                    displayRating
                  ) === star
                }
                aria-label={`${star} star${
                  star > 1
                    ? "s"
                    : ""
                }`}
                disabled={disabled}
                tabIndex={
                  isSelected ||
                  (
                    focusedRating ===
                    null &&
                    star ===
                      Math.round(
                        safeRating
                      )
                  )
                    ? 0
                    : -1
                }
                onMouseEnter={() =>
                  handleHover(
                    starValue
                  )
                }
                onFocus={() =>
                  setFocusedRating(
                    starValue
                  )
                }
                onBlur={() =>
                  setFocusedRating(
                    null
                  )
                }
                onKeyDown={(event) =>
                  handleKeyDown(
                    event,
                    starValue
                  )
                }
                onClick={() =>
                  handleRatingChange(
                    starValue
                  )
                }
                whileHover={{
                  scale: disabled
                    ? 1
                    : 1.15,
                }}
                whileTap={{
                  scale: disabled
                    ? 1
                    : 0.9,
                }}
                className="
                  flex
                  items-center
                  justify-center
                  rounded-md
                  p-1
                  outline-none
                  transition
                  focus-visible:ring-2
                  focus-visible:ring-amber-400
                  focus-visible:ring-offset-2
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                <StarIcon
                  index={star}
                  rating={
                    displayRating
                  }
                  size={size}
                  activeColor={
                    activeColor
                  }
                  inactiveColor={
                    inactiveColor
                  }
                />

              </motion.button>
            );
          }
        )}

      </div>

      {/* =================================================
          RATING VALUE
      ================================================= */}

      {showValue && (

        <span
          className="
            whitespace-nowrap
            font-bold
            text-slate-700
          "
          style={{
            fontSize:
              Math.max(
                12,
                size * 0.7
              ),
          }}
        >
          {formattedRating}
        </span>

      )}

      {/* =================================================
          LABEL
      ================================================= */}

      {showLabel && (

        <span
          className="
            whitespace-nowrap
            text-sm
            text-slate-500
          "
        >
          {ratingLabel}
        </span>

      )}

    </div>
  );
};

export default RatingStars;