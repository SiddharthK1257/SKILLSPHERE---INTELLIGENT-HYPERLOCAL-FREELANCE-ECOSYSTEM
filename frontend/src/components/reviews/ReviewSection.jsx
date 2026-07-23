import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FaStar,
  FaRegStar,
  FaUserCircle,
  FaPen,
  FaSpinner,
} from "react-icons/fa";

import API from "../../services/api";

const ReviewSection = ({ gigId }) => {
  // =====================================================
  // STATES
  // =====================================================

  const [reviews, setReviews] = useState([]);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);

  // =====================================================
  // LOAD USER
  // =====================================================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("User parsing error:", error);
      }
    }
  }, []);

  // =====================================================
  // FETCH REVIEWS
  // =====================================================

  useEffect(() => {
    if (!gigId) return;

    fetchReviews();
  }, [gigId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const { data } = await API.get(
        `/reviews/gig/${gigId}`
      );

      const reviewData =
        data?.reviews ||
        data?.data ||
        [];

      setReviews(reviewData);
    } catch (error) {
      console.error(
        "Fetch Reviews Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to load reviews."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CALCULATE RATING
  // =====================================================

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;

    const total = reviews.reduce(
      (sum, review) =>
        sum + Number(review.rating || 0),
      0
    );

    return total / reviews.length;
  }, [reviews]);

  const ratingDistribution = useMemo(() => {
    const distribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    reviews.forEach((review) => {
      const reviewRating = Number(
        review.rating
      );

      if (distribution[reviewRating] !== undefined) {
        distribution[reviewRating]++;
      }
    });

    return distribution;
  }, [reviews]);

  // =====================================================
  // LOGIN CHECK
  // =====================================================

  const requireLogin = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error(
        "Please login to write a review."
      );

      return false;
    }

    return true;
  };

  // =====================================================
  // SUBMIT REVIEW
  // =====================================================

  const handleSubmitReview = async (event) => {
    event.preventDefault();

    if (!requireLogin()) return;

    if (!rating) {
      toast.error(
        "Please select a rating."
      );

      return;
    }

    if (!comment.trim()) {
      toast.error(
        "Please write a review."
      );

      return;
    }

    if (comment.trim().length < 10) {
      toast.error(
        "Review must be at least 10 characters."
      );

      return;
    }

    try {
      setSubmitting(true);

      const { data } = await API.post(
        "/reviews",
        {
          gigId,
          rating,
          comment: comment.trim(),
        }
      );

      const newReview =
        data?.review ||
        data?.data;

      if (newReview) {
        setReviews((previous) => [
          newReview,
          ...previous,
        ]);
      } else {
        await fetchReviews();
      }

      setRating(0);
      setHoverRating(0);
      setComment("");

      toast.success(
        data?.message ||
          "Review submitted successfully!"
      );
    } catch (error) {
      console.error(
        "Submit Review Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to submit review."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // STAR COMPONENT
  // =====================================================

  const renderStars = (
    value,
    interactive = false
  ) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const active =
            star <= value;

          return (
            <button
              key={star}
              type={
                interactive
                  ? "button"
                  : undefined
              }
              onClick={
                interactive
                  ? () => setRating(star)
                  : undefined
              }
              onMouseEnter={
                interactive
                  ? () => setHoverRating(star)
                  : undefined
              }
              onMouseLeave={
                interactive
                  ? () => setHoverRating(0)
                  : undefined
              }
              className={
                interactive
                  ? "text-2xl transition hover:scale-110"
                  : "cursor-default text-lg"
              }
            >
              {active ? (
                <FaStar className="text-yellow-400" />
              ) : (
                <FaRegStar className="text-slate-300" />
              )}
            </button>
          );
        })}
      </div>
    );
  };

  // =====================================================
  // RATING PERCENTAGE
  // =====================================================

  const getPercentage = (star) => {
    if (!reviews.length) return 0;

    return Math.round(
      (ratingDistribution[star] /
        reviews.length) *
        100
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="border-b border-slate-200 p-8">

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

          <div className="flex items-start gap-4">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-yellow-100 text-2xl text-yellow-500">
              <FaStar />
            </div>

            <div>

              <h2 className="text-2xl font-black text-slate-900">
                Reviews & Ratings
              </h2>

              <p className="mt-1 text-slate-500">
                Real feedback from verified clients
              </p>

            </div>

          </div>

          <div className="text-left md:text-right">

            <div className="flex items-center gap-3 md:justify-end">

              <span className="text-5xl font-black text-slate-900">
                {averageRating.toFixed(1)}
              </span>

              {renderStars(
                Math.round(averageRating)
              )}

            </div>

            <p className="mt-1 text-sm text-slate-500">
              Based on {reviews.length} review
              {reviews.length !== 1
                ? "s"
                : ""}
            </p>

          </div>

        </div>

      </div>

      {/* =================================================
          RATING BREAKDOWN
      ================================================= */}

      <div className="border-b border-slate-200 bg-slate-50 p-8">

        <h3 className="mb-5 font-bold text-slate-900">
          Rating Breakdown
        </h3>

        <div className="space-y-3">

          {[5, 4, 3, 2, 1].map((star) => (

            <div
              key={star}
              className="flex items-center gap-3"
            >

              <div className="flex w-12 items-center gap-1 text-sm font-bold text-slate-700">
                {star}
                <FaStar className="text-yellow-400" />
              </div>

              <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-200">

                <div
                  className="h-full rounded-full bg-yellow-400 transition-all duration-500"
                  style={{
                    width: `${getPercentage(
                      star
                    )}%`,
                  }}
                />

              </div>

              <span className="w-12 text-right text-sm text-slate-500">
                {getPercentage(star)}%
              </span>

            </div>

          ))}

        </div>

      </div>

      {/* =================================================
          WRITE REVIEW
      ================================================= */}

      <div className="border-b border-slate-200 p-8">

        <div className="mb-5 flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <FaPen />
          </div>

          <div>

            <h3 className="text-xl font-black text-slate-900">
              Write a Review
            </h3>

            <p className="text-sm text-slate-500">
              Share your experience with this freelancer
            </p>

          </div>

        </div>

        {!currentUser ? (

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 text-center">

            <p className="text-blue-800">
              Please login to write a review.
            </p>

          </div>

        ) : (

          <form
            onSubmit={handleSubmitReview}
            className="space-y-5"
          >

            {/* RATING */}

            <div>

              <label className="mb-2 block font-bold text-slate-700">
                Your Rating
              </label>

              <div className="flex items-center gap-3">

                <div className="flex">

                  {[1, 2, 3, 4, 5].map(
                    (star) => (

                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setRating(star)
                        }
                        onMouseEnter={() =>
                          setHoverRating(star)
                        }
                        onMouseLeave={() =>
                          setHoverRating(0)
                        }
                        className="p-1 text-3xl transition hover:scale-110"
                      >

                        {star <=
                          (hoverRating ||
                            rating) ? (
                          <FaStar className="text-yellow-400" />
                        ) : (
                          <FaRegStar className="text-slate-300" />
                        )}

                      </button>

                    )
                  )}

                </div>

                <span className="font-bold text-slate-600">

                  {rating
                    ? `${rating}/5`
                    : "Select rating"}

                </span>

              </div>

            </div>

            {/* COMMENT */}

            <div>

              <label className="mb-2 block font-bold text-slate-700">
                Your Review
              </label>

              <textarea
                value={comment}
                onChange={(event) =>
                  setComment(
                    event.target.value
                  )
                }
                rows={5}
                maxLength={1000}
                placeholder="Tell other clients about your experience..."
                className="w-full resize-none rounded-2xl border border-slate-300 p-4 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              <div className="mt-2 text-right text-xs text-slate-500">
                {comment.length}/1000
              </div>

            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-4 font-bold text-white shadow-lg transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
            >

              {submitting && (
                <FaSpinner className="animate-spin" />
              )}

              {submitting
                ? "Submitting Review..."
                : "Submit Review"}

            </button>

          </form>

        )}

      </div>

      {/* =================================================
          REVIEWS LIST
      ================================================= */}

      <div className="p-8">

        <div className="mb-6 flex items-center justify-between">

          <h3 className="text-xl font-black text-slate-900">
            Customer Reviews
          </h3>

          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">
            {reviews.length} Total
          </span>

        </div>

        {loading ? (

          <div className="py-12 text-center">

            <FaSpinner className="mx-auto animate-spin text-3xl text-blue-600" />

            <p className="mt-3 text-slate-500">
              Loading reviews...
            </p>

          </div>

        ) : reviews.length === 0 ? (

          <div className="rounded-2xl bg-slate-50 py-12 text-center">

            <FaStar className="mx-auto text-4xl text-slate-300" />

            <h3 className="mt-4 text-xl font-bold text-slate-700">
              No Reviews Yet
            </h3>

            <p className="mt-2 text-slate-500">
              Be the first client to share your experience.
            </p>

          </div>

        ) : (

          <div className="space-y-5">

            {reviews.map((review) => {

              const reviewer =
                review.user ||
                review.client ||
                {};

              const reviewerName =
                reviewer.name ||
                review.userName ||
                "Anonymous User";

              const reviewerAvatar =
                reviewer.profileImage ||
                reviewer.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  reviewerName
                )}&background=2563eb&color=fff`;

              return (

                <article
                  key={
                    review._id ||
                    review.id
                  }
                  className="rounded-2xl border border-slate-200 p-5 transition hover:shadow-md"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex items-center gap-3">

                      <img
                        src={reviewerAvatar}
                        alt={reviewerName}
                        className="h-12 w-12 rounded-full object-cover"
                      />

                      <div>

                        <h4 className="font-bold text-slate-900">
                          {reviewerName}
                        </h4>

                        <div className="mt-1 flex items-center gap-2">

                          {renderStars(
                            Number(
                              review.rating
                            )
                          )}

                          <span className="text-sm text-slate-500">
                            {review.rating}/5
                          </span>

                        </div>

                      </div>

                    </div>

                    {review.createdAt && (

                      <time className="text-xs text-slate-400">

                        {new Date(
                          review.createdAt
                        ).toLocaleDateString()}

                      </time>

                    )}

                  </div>

                  <p className="mt-4 leading-7 text-slate-600">
                    {review.comment ||
                      review.review ||
                      review.text}
                  </p>

                </article>

              );

            })}

          </div>

        )}

      </div>

    </section>
  );
};

export default ReviewSection;