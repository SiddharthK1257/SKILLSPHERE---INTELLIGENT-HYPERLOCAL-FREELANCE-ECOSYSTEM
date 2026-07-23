import { motion } from "framer-motion";
import {
  FaFilter,
  FaRedoAlt,
  FaMapMarkerAlt,
  FaStar,
  FaLayerGroup,
  FaMoneyBillWave,
  FaCheckCircle,
} from "react-icons/fa";

import SortDropdown from "./SortDropdown";

const categories = [
  "Web Development",
  "App Development",
  "UI/UX Design",
  "Graphic Design",
  "AI & Machine Learning",
  "Digital Marketing",
  "Content Writing",
  "Video Editing",
  "SEO",
  "Cyber Security",
];

const experienceLevels = [
  "Beginner",
  "Intermediate",
  "Expert",
];

const ratings = [
  { value: "", label: "Any Rating" },
  { value: "5", label: "★★★★★" },
  { value: "4", label: "★★★★ & Above" },
  { value: "3", label: "★★★ & Above" },
];

const quickPrices = [
  {
    label: "₹0 - ₹1K",
    min: 0,
    max: 1000,
  },
  {
    label: "₹1K - ₹5K",
    min: 1000,
    max: 5000,
  },
  {
    label: "₹5K - ₹10K",
    min: 5000,
    max: 10000,
  },
  {
    label: "₹10K+",
    min: 10000,
    max: "",
  },
];

export default function FilterSidebar({
  filters,
  setFilters,
}) {
  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const resetFilters = () => {
    setFilters({
      keyword: "",
      category: "",
      location: "",
      level: "",
      rating: "",
      minPrice: "",
      maxPrice: "",
      sort: "newest",
      page: 1,
      limit: 12,
    });
  };

  const activeFilters = Object.entries(filters).filter(
    ([key, value]) =>
      ![
        "",
        null,
        undefined,
      ].includes(value) &&
      ![
        "page",
        "limit",
        "sort",
        "keyword",
      ].includes(key)
  ).length;

  return (
    <motion.aside
      initial={{
        opacity: 0,
        x: -30,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        duration: 0.4,
      }}
      className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl"
    >
      {/* Header */}

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800">
            <FaFilter className="text-blue-600" />
            Filters
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Refine your freelancer search.
          </p>

        </div>

        {activeFilters > 0 && (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
            {activeFilters} Active
          </span>
        )}

      </div>

      {/* Category */}

      <section className="mb-7">

        <label className="mb-3 flex items-center gap-2 font-semibold text-slate-700">
          <FaLayerGroup className="text-blue-600" />
          Category
        </label>

        <select
          value={filters.category}
          onChange={(e) =>
            updateFilter(
              "category",
              e.target.value
            )
          }
          className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
        >
          <option value="">
            All Categories
          </option>

          {categories.map((category) => (
            <option
              key={category}
              value={category}
            >
              {category}
            </option>
          ))}

        </select>

      </section>

      {/* Location */}

      <section className="mb-7">

        <label className="mb-3 flex items-center gap-2 font-semibold text-slate-700">
          <FaMapMarkerAlt className="text-red-500" />
          Location
        </label>

        <input
          type="text"
          placeholder="India, USA, UK..."
          value={filters.location}
          onChange={(e) =>
            updateFilter(
              "location",
              e.target.value
            )
          }
          className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
        />

      </section>

      {/* Experience */}

      <section className="mb-7">

        <label className="mb-3 flex items-center gap-2 font-semibold text-slate-700">
          <FaCheckCircle className="text-emerald-500" />
          Experience Level
        </label>

        <select
          value={filters.level}
          onChange={(e) =>
            updateFilter(
              "level",
              e.target.value
            )
          }
          className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
        >
          <option value="">
            All Levels
          </option>

          {experienceLevels.map((level) => (
            <option
              key={level}
              value={level}
            >
              {level}
            </option>
          ))}

        </select>

      </section>

      {/* Rating */}

      <section className="mb-7">

        <label className="mb-3 flex items-center gap-2 font-semibold text-slate-700">
          <FaStar className="text-yellow-500" />
          Minimum Rating
        </label>

        <select
          value={filters.rating}
          onChange={(e) =>
            updateFilter(
              "rating",
              e.target.value
            )
          }
          className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
        >
          {ratings.map((rating) => (
            <option
              key={rating.label}
              value={rating.value}
            >
              {rating.label}
            </option>
          ))}

        </select>

      </section>

      {/* Price */}

      <section className="mb-8">

        <label className="mb-3 flex items-center gap-2 font-semibold text-slate-700">
          <FaMoneyBillWave className="text-green-600" />
          Price Range
        </label>

        <div className="grid grid-cols-2 gap-3 mb-4">

          <input
            type="number"
            placeholder="Minimum"
            value={filters.minPrice}
            onChange={(e) =>
              updateFilter(
                "minPrice",
                e.target.value
              )
            }
            className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 transition focus:border-blue-500 focus:bg-white"
          />

          <input
            type="number"
            placeholder="Maximum"
            value={filters.maxPrice}
            onChange={(e) =>
              updateFilter(
                "maxPrice",
                e.target.value
              )
            }
            className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 transition focus:border-blue-500 focus:bg-white"
          />

        </div>

        <div className="grid grid-cols-2 gap-2">

          {quickPrices.map((price) => (

            <button
              key={price.label}
              onClick={() => {
                updateFilter(
                  "minPrice",
                  price.min
                );

                updateFilter(
                  "maxPrice",
                  price.max
                );
              }}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold transition hover:bg-blue-600 hover:text-white"
            >
              {price.label}
            </button>

          ))}

        </div>

      </section>

      {/* Sort */}

      <SortDropdown
        value={filters.sort}
        onChange={(value) =>
          updateFilter(
            "sort",
            value
          )
        }
      />

      {/* Reset */}

      <button
        onClick={resetFilters}
        className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 px-5 py-4 font-semibold text-white transition hover:shadow-xl"
      >
        <FaRedoAlt />
        Clear All Filters
      </button>

    </motion.aside>
  );
}