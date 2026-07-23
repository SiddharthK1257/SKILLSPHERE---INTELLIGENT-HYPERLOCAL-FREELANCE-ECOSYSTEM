import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  FaComments,
  FaSearch,
} from "react-icons/fa";

import ReviewCard from "./ReviewCard";
import SearchBar from "../SearchBar";
import FilterPanel from "../FilterPanel";
import Pagination from "../Pagination";
import DeleteModal from "./DeleteModal";
import ReportModal from "./ReportModal";

import {
  getReviews,
  getFreelancerReviews,
  markHelpful,
} from "../../services/reviewService";

/* ==========================================================
   REVIEW LIST
========================================================== */

const ReviewList = ({
  freelancerId = null,
  showActions = true,
}) => {
  /* ========================================================
     STATE
  ======================================================== */

  const [reviews, setReviews] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [rating, setRating] =
    useState("");

  const [verified, setVerified] =
    useState("");

  const [page, setPage] =
    useState(1);

  const limit = 10;

  const [totalPages, setTotalPages] =
    useState(1);

  const [totalReviews, setTotalReviews] =
    useState(0);

  /* ========================================================
     MODALS
  ======================================================== */

  const [selectedReview, setSelectedReview] =
    useState(null);

  const [deleteModal, setDeleteModal] =
    useState(false);

  const [reportModal, setReportModal] =
    useState(false);

  /* ========================================================
     LOAD REVIEWS
  ======================================================== */

  const loadReviews = useCallback(
    async (signal) => {
      try {
        setLoading(true);
        setError("");

        let response;

        /* ================================================
           FREELANCER REVIEWS
        ================================================ */

        if (freelancerId) {
          response =
            await getFreelancerReviews(
              freelancerId,
              {
                page,
                limit,
                rating,
              }
            );
        }

        /* ================================================
           ALL REVIEWS
        ================================================ */

        else {
          response =
            await getReviews({
              page,
              limit,
              rating,
              verified,
              search,
            });
        }

        if (signal?.aborted) return;

        /*
         * Supports common backend response formats:
         *
         * {
         *   reviews: [],
         *   totalPages: 3,
         *   totalReviews: 25
         * }
         *
         * OR
         *
         * {
         *   data: {
         *     reviews: []
         *   }
         */
        const data =
          response?.data ||
          response ||
          {};

        const reviewList =
          data.reviews ||
          data.data ||
          [];

        setReviews(
          Array.isArray(reviewList)
            ? reviewList
            : []
        );

        setTotalPages(
          Number(
            data.totalPages ||
              data.pagination?.totalPages ||
              1
          )
        );

        setTotalReviews(
          Number(
            data.totalReviews ||
              data.total ||
              data.pagination?.totalReviews ||
              reviewList.length ||
              0
          )
        );
      } catch (err) {
        if (signal?.aborted) return;

        console.error(
          "Load Reviews Error:",
          err
        );

        setReviews([]);

        setError(
          err?.message ||
            "Failed to load reviews."
        );
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [
      freelancerId,
      page,
      limit,
      rating,
      verified,
      search,
    ]
  );

  /* ========================================================
     FETCH REVIEWS
  ======================================================== */

  useEffect(() => {
    const controller =
      new AbortController();

    loadReviews(
      controller.signal
    );

    return () => {
      controller.abort();
    };
  }, [loadReviews]);

  /* ========================================================
     SEARCH
  ======================================================== */

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  /* ========================================================
     FILTER
  ======================================================== */

  const handleFilter = ({
    rating: selectedRating = "",
    verified: selectedVerified = "",
  }) => {
    setRating(selectedRating);
    setVerified(selectedVerified);
    setPage(1);
  };

  /* ========================================================
     DELETE MODAL
  ======================================================== */

  const openDeleteModal = (
    review
  ) => {
    setSelectedReview(review);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
    setSelectedReview(null);
  };

  const handleDeleted = () => {
    closeDeleteModal();

    /*
     * Reload current page.
     * If the last review on a page was deleted,
     * move to the previous page.
     */
    if (
      reviews.length === 1 &&
      page > 1
    ) {
      setPage((previousPage) =>
        previousPage - 1
      );
    } else {
      loadReviews();
    }
  };

  /* ========================================================
     REPORT MODAL
  ======================================================== */

  const openReportModal = (
    review
  ) => {
    setSelectedReview(review);
    setReportModal(true);
  };

  const closeReportModal = () => {
    setReportModal(false);
    setSelectedReview(null);
  };

  /* ========================================================
     MARK HELPFUL
  ======================================================== */

  const handleHelpful = async (
    reviewId
  ) => {
    try {
      await markHelpful(reviewId);

      /*
       * Update UI immediately instead of
       * making another full API request.
       */
      setReviews((currentReviews) =>
        currentReviews.map((review) =>
          review._id === reviewId
            ? {
                ...review,
                helpfulCount:
                  (review.helpfulCount || 0) +
                  1,
              }
            : review
        )
      );
    } catch (err) {
      console.error(
        "Helpful Error:",
        err
      );
    }
  };

  /* ========================================================
     LOADING SKELETON
  ======================================================== */

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">

        <div className="mb-8 h-12 w-full animate-pulse rounded-2xl bg-gray-200" />

        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

          {Array.from({
            length: 6,
          }).map((_, index) => (
            <div
              key={index}
              className="
                animate-pulse
                rounded-3xl
                border
                border-gray-200
                bg-white
                p-6
                shadow-sm
              "
            >
              <div className="mb-5 flex items-center gap-4">

                <div className="h-14 w-14 rounded-full bg-gray-200" />

                <div className="flex-1">

                  <div className="mb-2 h-4 w-40 rounded bg-gray-200" />

                  <div className="h-3 w-28 rounded bg-gray-200" />

                </div>

              </div>

              <div className="mb-3 h-5 w-52 rounded bg-gray-200" />

              <div className="mb-2 h-3 rounded bg-gray-200" />

              <div className="mb-2 h-3 rounded bg-gray-200" />

              <div className="mb-2 h-3 w-5/6 rounded bg-gray-200" />

              <div className="mt-6 flex gap-3">

                <div className="h-10 flex-1 rounded-xl bg-gray-200" />

                <div className="h-10 flex-1 rounded-xl bg-gray-200" />

              </div>
            </div>
          ))}

        </div>
      </div>
    );
  }

  /* ========================================================
     RENDER
  ======================================================== */

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">

      {/* ====================================================
          SEARCH
      ==================================================== */}

      <SearchBar
        onSearch={handleSearch}
        placeholder="Search reviews..."
      />

      {/* ====================================================
          FILTERS
      ==================================================== */}

      <div className="mt-8">

        <FilterPanel
          rating={rating}
          verified={verified}
          onChange={handleFilter}
        />

      </div>

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div
        className="
          mb-8
          mt-10
          flex
          flex-col
          items-start
          justify-between
          gap-4
          md:flex-row
          md:items-center
        "
      >
        <div>

          <h2
            className="
              flex
              items-center
              gap-3
              text-3xl
              font-bold
              text-gray-800
            "
          >
            <FaComments className="text-blue-600" />

            Reviews
          </h2>

          <p className="mt-2 text-gray-500">

            {totalReviews ||
              reviews.length}{" "}
            review
            {(totalReviews ||
              reviews.length) !== 1 &&
              "s"}{" "}
            found

          </p>

        </div>
      </div>

      {/* ====================================================
          ERROR
      ==================================================== */}

      {error && (
        <div
          className="
            mb-8
            rounded-2xl
            border
            border-red-200
            bg-red-50
            p-4
            text-center
            text-red-600
          "
        >
          {error}
        </div>
      )}

      {/* ====================================================
          EMPTY STATE
      ==================================================== */}

      {!error &&
      reviews.length === 0 ? (
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="
            rounded-3xl
            border
            border-dashed
            border-gray-300
            bg-gray-50
            py-20
            text-center
          "
        >
          <FaSearch
            className="
              mx-auto
              mb-6
              text-6xl
              text-gray-300
            "
          />

          <h3
            className="
              text-2xl
              font-bold
              text-gray-700
            "
          >
            No Reviews Found
          </h3>

          <p
            className="
              mt-3
              text-gray-500
            "
          >
            Try changing your search
            or filters.
          </p>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">

          <div className="space-y-8">

            {reviews.map(
              (
                review,
                index
              ) => (
                <motion.div
                  key={review._id}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -20,
                  }}
                  transition={{
                    delay:
                      index * 0.05,
                  }}
                >
                  <ReviewCard
                    review={review}
                    showActions={
                      showActions
                    }
                    onHelpful={() =>
                      handleHelpful(
                        review._id
                      )
                    }
                    onDelete={() =>
                      openDeleteModal(
                        review
                      )
                    }
                    onReport={() =>
                      openReportModal(
                        review
                      )
                    }
                  />
                </motion.div>
              )
            )}

          </div>

        </AnimatePresence>
      )}

      {/* ====================================================
          PAGINATION
      ==================================================== */}

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center">

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => {
              if (
                newPage >= 1 &&
                newPage <= totalPages
              ) {
                setPage(newPage);

                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }
            }}
          />

        </div>
      )}

      {/* ====================================================
          DELETE MODAL
      ==================================================== */}

      <DeleteModal
        show={deleteModal}
        reviewId={
          selectedReview?._id
        }
        onClose={
          closeDeleteModal
        }
        onDeleted={
          handleDeleted
        }
      />

      {/* ====================================================
          REPORT MODAL
      ==================================================== */}

      <ReportModal
        show={reportModal}
        reviewId={
          selectedReview?._id
        }
        onClose={
          closeReportModal
        }
      />

    </div>
  );
};

export default ReviewList;