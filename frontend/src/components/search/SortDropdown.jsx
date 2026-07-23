import { motion } from "framer-motion";
import {
  FaSortAmountDown,
  FaChevronDown,
} from "react-icons/fa";

const SORT_OPTIONS = [
  {
    value: "newest",
    label: "Newest First",
    description: "Recently published gigs",
  },
  {
    value: "rating",
    label: "Highest Rated",
    description: "Top-rated freelancers",
  },
  {
    value: "popular",
    label: "Most Popular",
    description: "Most viewed gigs",
  },
  {
    value: "orders",
    label: "Best Selling",
    description: "Highest completed orders",
  },
  {
    value: "priceLow",
    label: "Price: Low → High",
    description: "Cheapest first",
  },
  {
    value: "priceHigh",
    label: "Price: High → Low",
    description: "Most expensive first",
  },
];

const SortDropdown = ({
  value = "newest",
  onChange,
}) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
      }}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      {/* Header */}

      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
          <FaSortAmountDown size={18} />
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-800">
            Sort Results
          </h3>

          <p className="text-sm text-slate-500">
            Choose how gigs are displayed.
          </p>
        </div>
      </div>

      {/* Dropdown */}

      <div className="relative">
        <select
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="
            peer
            w-full
            appearance-none
            rounded-2xl
            border
            border-slate-300
            bg-slate-50
            px-5
            py-4
            pr-12
            text-sm
            font-medium
            text-slate-700
            outline-none
            transition-all
            duration-300
            hover:border-blue-400
            focus:border-blue-500
            focus:bg-white
            focus:ring-4
            focus:ring-blue-100
          "
        >
          {SORT_OPTIONS.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        <FaChevronDown
          className="
            pointer-events-none
            absolute
            right-5
            top-1/2
            -translate-y-1/2
            text-slate-400
            transition
            peer-focus:text-blue-600
          "
        />
      </div>

      {/* Selected Option */}

      <motion.div
        key={value}
        initial={{
          opacity: 0,
          y: 8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="mt-5 rounded-2xl bg-blue-50 p-4"
      >
        <h4 className="font-semibold text-blue-700">
          {
            SORT_OPTIONS.find(
              (item) => item.value === value
            )?.label
          }
        </h4>

        <p className="mt-1 text-sm text-slate-600">
          {
            SORT_OPTIONS.find(
              (item) => item.value === value
            )?.description
          }
        </p>
      </motion.div>

      {/* Reset */}

      {value !== "newest" && (
        <motion.button
          whileHover={{
            scale: 1.02,
          }}
          whileTap={{
            scale: 0.98,
          }}
          onClick={() => onChange("newest")}
          className="
            mt-5
            w-full
            rounded-xl
            border
            border-blue-200
            bg-white
            py-3
            text-sm
            font-semibold
            text-blue-600
            transition
            hover:bg-blue-600
            hover:text-white
          "
        >
          Reset Sorting
        </motion.button>
      )}
    </motion.div>
  );
};

export default SortDropdown;