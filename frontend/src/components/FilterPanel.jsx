import { useState, useEffect } from "react";

import { motion } from "framer-motion";

import {
  FaFilter,
  FaStar,
  FaCheckCircle,
  FaSortAmountDown,
  FaUndo,
} from "react-icons/fa";

const FilterPanel = ({
  rating = "",
  verified = "",
  sort = "newest",
  onChange,
}) => {
  /* ===========================
      STATES
  =========================== */

  const [filters, setFilters] =
    useState({
      rating,
      verified,
      sort,
    });

  /* ===========================
      UPDATE WHEN PROPS CHANGE
  =========================== */

  useEffect(() => {
    setFilters({
      rating,
      verified,
      sort,
    });
  }, [
    rating,
    verified,
    sort,
  ]);

  /* ===========================
      CHANGE FILTER
  =========================== */

  const updateFilter = (
    key,
    value
  ) => {
    const updated = {
      ...filters,
      [key]: value,
    };

    setFilters(updated);

    if (onChange) {
      onChange(updated);
    }
  };

  /* ===========================
      RESET
  =========================== */

  const resetFilters = () => {
    const reset = {
      rating: "",
      verified: "",
      sort: "newest",
    };

    setFilters(reset);

    if (onChange) {
      onChange(reset);
    }
  };

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
      className="
        mb-5
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-5
        shadow-lg
      "
    >
      {/* Header */}

      <div
        className="
          mb-5
          flex
          items-center
          gap-3
        "
      >
        <FaFilter
          className="
            text-blue-600
          "
          size={20}
        />

        <h5
          className="
            m-0
            text-lg
            font-bold
          "
        >
          Filter Reviews
        </h5>
      </div>

      <div
        className="
          grid
          gap-5
          md:grid-cols-3
        "
      >
                {/* ===========================
            RATING FILTER
        =========================== */}

        <div>

          <label
            className="
              mb-2
              flex
              items-center
              gap-2
              font-semibold
              text-gray-700
            "
          >
            <FaStar className="text-yellow-500" />

            Rating
          </label>

          <select
            value={filters.rating}
            onChange={(e) =>
              updateFilter(
                "rating",
                e.target.value
              )
            }
            className="
              w-full
              rounded-xl
              border
              border-gray-300
              bg-white
              p-3
              outline-none
              transition
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
            "
          >
            <option value="">
              All Ratings
            </option>

            <option value="5">
              ⭐⭐⭐⭐⭐ (5 Stars)
            </option>

            <option value="4">
              ⭐⭐⭐⭐ & Up
            </option>

            <option value="3">
              ⭐⭐⭐ & Up
            </option>

            <option value="2">
              ⭐⭐ & Up
            </option>

            <option value="1">
              ⭐ & Up
            </option>

          </select>

        </div>

        {/* ===========================
            VERIFIED
        =========================== */}

        <div>

          <label
            className="
              mb-2
              flex
              items-center
              gap-2
              font-semibold
              text-gray-700
            "
          >

            <FaCheckCircle
              className="
                text-green-500
              "
            />

            Verified

          </label>

          <select
            value={filters.verified}
            onChange={(e) =>
              updateFilter(
                "verified",
                e.target.value
              )
            }
            className="
              w-full
              rounded-xl
              border
              border-gray-300
              bg-white
              p-3
              outline-none
              transition
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
            "
          >
            <option value="">
              All Reviews
            </option>

            <option value="true">
              Verified Only
            </option>

            <option value="false">
              Unverified
            </option>

          </select>

        </div>

        {/* ===========================
            SORT
        =========================== */}

        <div>

          <label
            className="
              mb-2
              flex
              items-center
              gap-2
              font-semibold
              text-gray-700
            "
          >

            <FaSortAmountDown
              className="
                text-blue-600
              "
            />

            Sort By

          </label>

          <select
            value={filters.sort}
            onChange={(e) =>
              updateFilter(
                "sort",
                e.target.value
              )
            }
            className="
              w-full
              rounded-xl
              border
              border-gray-300
              bg-white
              p-3
              outline-none
              transition
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
            "
          >
            <option value="newest">
              Newest First
            </option>

            <option value="oldest">
              Oldest First
            </option>

            <option value="highest">
              Highest Rating
            </option>

            <option value="lowest">
              Lowest Rating
            </option>

          </select>

        </div>
              </div>

      {/* ===========================
          FOOTER
      =========================== */}

      <div
        className="
          mt-6
          flex
          flex-col
          items-center
          justify-between
          gap-4
          border-t
          border-gray-100
          pt-5
          md:flex-row
        "
      >
        <div className="text-sm text-gray-500">
          Use filters to quickly find the reviews you're looking for.
        </div>

        <motion.button
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.95,
          }}
          onClick={resetFilters}
          className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-red-500
            px-5
            py-3
            font-semibold
            text-white
            shadow-md
            transition
            hover:bg-red-600
          "
        >
          <FaUndo />

          Reset Filters
        </motion.button>
      </div>

    </motion.div>
  );
};

export default FilterPanel;