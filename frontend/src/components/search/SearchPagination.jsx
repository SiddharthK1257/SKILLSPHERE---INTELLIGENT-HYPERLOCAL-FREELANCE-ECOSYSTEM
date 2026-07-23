import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";

const SearchPagination = ({
  page = 1,
  totalPages = 1,
  totalResults = 0,
  perPage = 12,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const changePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;

    onPageChange(newPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const generatePages = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    if (page <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
      return pages;
    }

    if (page >= totalPages - 3) {
      pages.push(
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
      return pages;
    }

    pages.push(
      1,
      "...",
      page - 1,
      page,
      page + 1,
      "...",
      totalPages
    );

    return pages;
  };

  const startResult = (page - 1) * perPage + 1;
  const endResult = Math.min(page * perPage, totalResults);

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
      }}
      className="mt-16"
    >
      {/* Top Info */}

      <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row">
        <div>
          <h3 className="text-lg font-bold text-slate-800">
            Search Results
          </h3>

          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold">
              {startResult}
            </span>{" "}
            -{" "}
            <span className="font-semibold">
              {endResult}
            </span>{" "}
            of{" "}
            <span className="font-semibold">
              {totalResults}
            </span>{" "}
            freelancers
          </p>
        </div>

        <div className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
          Page {page} of {totalPages}
        </div>
      </div>

      {/* Pagination */}

      <div className="flex flex-wrap items-center justify-center gap-3">

        {/* First */}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={page === 1}
          onClick={() => changePage(1)}
          className={`flex items-center justify-center rounded-xl p-3 transition ${
            page === 1
              ? "cursor-not-allowed bg-slate-200 text-slate-400"
              : "bg-white shadow hover:bg-blue-600 hover:text-white"
          }`}
        >
          <ChevronsLeft size={18} />
        </motion.button>

        {/* Previous */}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={page === 1}
          onClick={() => changePage(page - 1)}
          className={`flex items-center gap-2 rounded-xl px-5 py-3 font-semibold transition ${
            page === 1
              ? "cursor-not-allowed bg-slate-200 text-slate-400"
              : "bg-white shadow hover:bg-blue-600 hover:text-white"
          }`}
        >
          <ChevronLeft size={18} />
          Previous
        </motion.button>

        {/* Page Numbers */}

        {generatePages().map((item, index) =>
          item === "..." ? (
            <div
              key={index}
              className="flex h-12 w-12 items-center justify-center text-slate-500"
            >
              <MoreHorizontal />
            </div>
          ) : (
            <motion.button
              key={item}
              whileHover={{
                scale: 1.08,
              }}
              whileTap={{
                scale: 0.95,
              }}
              onClick={() => changePage(item)}
              className={`flex h-12 w-12 items-center justify-center rounded-xl font-bold transition ${
                page === item
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-xl"
                  : "bg-white shadow hover:bg-blue-100"
              }`}
            >
              {item}
            </motion.button>
          )
        )}

        {/* Next */}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={page === totalPages}
          onClick={() => changePage(page + 1)}
          className={`flex items-center gap-2 rounded-xl px-5 py-3 font-semibold transition ${
            page === totalPages
              ? "cursor-not-allowed bg-slate-200 text-slate-400"
              : "bg-white shadow hover:bg-blue-600 hover:text-white"
          }`}
        >
          Next
          <ChevronRight size={18} />
        </motion.button>

        {/* Last */}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={page === totalPages}
          onClick={() => changePage(totalPages)}
          className={`flex items-center justify-center rounded-xl p-3 transition ${
            page === totalPages
              ? "cursor-not-allowed bg-slate-200 text-slate-400"
              : "bg-white shadow hover:bg-blue-600 hover:text-white"
          }`}
        >
          <ChevronsRight size={18} />
        </motion.button>
      </div>
    </motion.section>
  );
};

export default SearchPagination;