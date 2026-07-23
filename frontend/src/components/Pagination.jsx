import { motion } from "framer-motion";
import {
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) => {
  /* ===========================
      DON'T SHOW IF ONLY ONE PAGE
  =========================== */

  if (totalPages <= 1) {
    return null;
  }

  /* ===========================
      CREATE PAGE ARRAY
  =========================== */

  const pages = [];

  const start = Math.max(
    1,
    currentPage - 2
  );

  const end = Math.min(
    totalPages,
    currentPage + 2
  );

  for (
    let i = start;
    i <= end;
    i++
  ) {
    pages.push(i);
  }

  /* ===========================
      CHANGE PAGE
  =========================== */

  const goToPage = (page) => {
    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage
    )
      return;

    onPageChange(page);
  };

  return (
    <>
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
          mt-8
          flex
          flex-wrap
          items-center
          justify-center
          gap-2
        "
      >
      {/* ===========================
          PREVIOUS BUTTON
      =========================== */}

      <motion.button
        whileHover={{
          scale: 1.05,
        }}
        whileTap={{
          scale: 0.95,
        }}
        disabled={currentPage === 1}
        onClick={() =>
          goToPage(currentPage - 1)
        }
        className={`
          flex
          items-center
          gap-2
          rounded-xl
          border
          px-4
          py-2
          font-medium
          transition-all
          ${
            currentPage === 1
              ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
              : "border-blue-500 bg-white text-blue-600 hover:bg-blue-600 hover:text-white"
          }
        `}
      >
        <FaChevronLeft />

        Previous
      </motion.button>
            {/* ===========================
          FIRST PAGE
      =========================== */}

      {start > 1 && (
        <>
          <motion.button
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.95,
            }}
            onClick={() => goToPage(1)}
            className="
              h-11
              w-11
              rounded-xl
              border
              border-gray-300
              bg-white
              font-semibold
              text-gray-700
              transition-all
              hover:border-blue-500
              hover:bg-blue-600
              hover:text-white
            "
          >
            1
          </motion.button>

          {start > 2 && (
            <span
              className="
                px-2
                text-lg
                font-bold
                text-gray-500
              "
            >
              ...
            </span>
          )}
        </>
      )}

      {/* ===========================
          PAGE NUMBERS
      =========================== */}

      {pages.map((page) => (
        <motion.button
          key={page}
          whileHover={{
            scale: 1.08,
          }}
          whileTap={{
            scale: 0.95,
          }}
          onClick={() =>
            goToPage(page)
          }
          className={`
            h-11
            w-11
            rounded-xl
            border
            font-semibold
            transition-all
            duration-200

            ${
              currentPage === page
                ? "border-blue-600 bg-blue-600 text-white shadow-lg"
                : "border-gray-300 bg-white text-gray-700 hover:border-blue-500 hover:bg-blue-600 hover:text-white"
            }
          `}
        >
          {page}
        </motion.button>
      ))}

      {/* ===========================
          LAST PAGE
      =========================== */}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && (
            <span
              className="
                px-2
                text-lg
                font-bold
                text-gray-500
              "
            >
              ...
            </span>
          )}

          <motion.button
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.95,
            }}
            onClick={() =>
              goToPage(totalPages)
            }
            className="
              h-11
              w-11
              rounded-xl
              border
              border-gray-300
              bg-white
              font-semibold
              text-gray-700
              transition-all
              hover:border-blue-500
              hover:bg-blue-600
              hover:text-white
            "
          >
            {totalPages}
          </motion.button>
        </>
      )}

      {/* ===========================
          NEXT BUTTON
      =========================== */}

      <motion.button
        whileHover={{
          scale: 1.05,
        }}
        whileTap={{
          scale: 0.95,
        }}
        disabled={currentPage === totalPages}
        onClick={() =>
          goToPage(currentPage + 1)
        }
        className={`
          flex
          items-center
          gap-2
          rounded-xl
          border
          px-4
          py-2
          font-medium
          transition-all

          ${
            currentPage === totalPages
              ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
              : "border-blue-500 bg-white text-blue-600 hover:bg-blue-600 hover:text-white"
          }
        `}
      >
        Next

        <FaChevronRight />
      </motion.button>

    </motion.div>

    {/* ===========================
        PAGE INFO
    =========================== */}

    <div
      className="
        mt-4
        text-center
        text-sm
        text-gray-500
      "
    >
      Page

      <span className="mx-1 font-bold text-blue-600">
        {currentPage}
      </span>

      of

      <span className="mx-1 font-bold">
        {totalPages}
      </span>
    </div>
  </>
  );
};

export default Pagination;