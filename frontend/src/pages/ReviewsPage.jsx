import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getReviews,
} from "../services/reviewService";

import ReviewCard from "../components/reviews/ReviewCard";

import "./ReviewsPage.css";

function ReviewsPage() {
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [rating, setRating] =
    useState("");

  const [verified, setVerified] =
    useState(false);

  const [error, setError] =
    useState("");

  /* ==========================================
      LOAD REVIEWS
  ========================================== */

  const loadReviews = async () => {
    try {
      setLoading(true);

      const response =
        await getReviews({
          page,
          limit: 10,
          rating,
          verified,
        });

      setReviews(
        response.reviews || []
      );

      setTotalPages(
        response.totalPages || 1
      );

      setError("");
    } catch (err) {
      setError(
        err.message ||
          "Failed to load reviews."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [page, rating, verified]);

  /* ==========================================
      LOADING
  ========================================== */

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-slate-50 px-8 py-8">

        <h2>Loading Reviews...</h2>

      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 px-8 py-8">

      <div className="reviews-header">

        <div>

          <h1>
            Freelancer Reviews
          </h1>

          <p>
            Browse verified client
            feedback.
          </p>

        </div>

        <div className="review-actions">

          <Link
            to="/reviews/create"
            className="btn-primary"
          >
            Write Review
          </Link>

        </div>

      </div>

      {error && (
        <div className="review-error">
          {error}
        </div>
      )}

      {/* FILTERS */}

      <div className="review-filters">

        <select
          value={rating}
          onChange={(e) =>
            setRating(e.target.value)
          }
        >

          <option value="">
            All Ratings
          </option>

          <option value="5">
            5 Stars
          </option>

          <option value="4">
            4 Stars
          </option>

          <option value="3">
            3 Stars
          </option>

          <option value="2">
            2 Stars
          </option>

          <option value="1">
            1 Star
          </option>

        </select>

        <label>

          <input
            type="checkbox"
            checked={verified}
            onChange={(e) =>
              setVerified(
                e.target.checked
              )
            }
          />

          Verified Only

        </label>

        <button
          className="btn-secondary"
          onClick={loadReviews}
        >
          Refresh
        </button>

      </div>
            {/* ==========================
          REVIEW LIST
      ========================== */}

      <div className="reviews-container">

        {reviews.length === 0 ? (
          <div className="no-reviews">

            <h2>No Reviews Found</h2>

            <p>
              No reviews match your filters.
            </p>

          </div>
        ) : (
          reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              onRefresh={loadReviews}
            />
          ))
        )}

      </div>

      {/* ==========================
          PAGINATION
      ========================== */}

      <div className="pagination">

        <button
          className="btn-secondary"
          disabled={page === 1}
          onClick={() =>
            setPage((prev) => prev - 1)
          }
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          className="btn-secondary"
          disabled={page === totalPages}
          onClick={() =>
            setPage((prev) => prev + 1)
          }
        >
          Next
        </button>

      </div>

      {/* ==========================
          ANALYTICS LINK
      ========================== */}

      <div className="analytics-link">

        <Link
          to="/reviews/analytics/me"
          className="btn-primary"
        >
          View Review Analytics
        </Link>

      </div>

    </div>
  );
}

export default ReviewsPage;