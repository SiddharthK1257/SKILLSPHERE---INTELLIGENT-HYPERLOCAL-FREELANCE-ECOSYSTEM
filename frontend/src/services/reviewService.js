import API from "./api";

/* ==========================================================
   ERROR HANDLER
========================================================== */

const handleError = (
  error,
  defaultMessage = "Something went wrong."
) => {
  console.error(
    "Review Service Error:",
    error?.response?.data || error
  );

  throw new Error(
    error?.response?.data?.message ||
      defaultMessage
  );
};

/* ==========================================================
   CREATE REVIEW
   POST /reviews
========================================================== */

export const createReview = async (
  reviewData
) => {
  try {
    const { data } = await API.post(
      "/reviews",
      reviewData
    );

    return data;
  } catch (error) {
    handleError(
      error,
      "Failed to create review."
    );
  }
};

/* ==========================================================
   GET ALL REVIEWS
   GET /reviews
========================================================== */

export const getReviews = async ({
  page = 1,
  limit = 10,
  rating = "",
  verified = "",
  freelancerId = "",
  clientId = "",
  gigId = "",
  search = "",
  sort = "newest",
} = {}) => {
  try {
    const params = {
      page,
      limit,
    };

    if (rating)
      params.rating = rating;

    if (verified !== "")
      params.verified = verified;

    if (freelancerId)
      params.freelancerId =
        freelancerId;

    if (clientId)
      params.clientId = clientId;

    if (gigId)
      params.gigId = gigId;

    if (search)
      params.search = search;

    if (sort)
      params.sort = sort;

    const { data } = await API.get(
      "/reviews",
      {
        params,
      }
    );

    return data;
  } catch (error) {
    handleError(
      error,
      "Failed to fetch reviews."
    );
  }
};

/* ==========================================================
   GET SINGLE REVIEW
   GET /reviews/:reviewId
========================================================== */

export const getReview = async (
  reviewId
) => {
  try {
    const { data } = await API.get(
      `/reviews/${reviewId}`
    );

    return data;
  } catch (error) {
    handleError(
      error,
      "Failed to fetch review."
    );
  }
};

/* ==========================================================
   COMPATIBILITY ALIAS
========================================================== */

export const getReviewById = async (
  reviewId
) => {
  return getReview(reviewId);
};

/* ==========================================================
   GET GIG REVIEWS
   GET /reviews/gig/:gigId
========================================================== */

export const getGigReviews = async (
  gigId,
  options = {}
) => {
  try {
    const {
      page = 1,
      limit = 10,
      rating = "",
      sort = "newest",
    } = options;

    const params = {
      page,
      limit,
    };

    if (rating)
      params.rating = rating;

    if (sort)
      params.sort = sort;

    const { data } = await API.get(
      `/reviews/gig/${gigId}`,
      {
        params,
      }
    );

    return data;
  } catch (error) {
    handleError(
      error,
      "Failed to fetch gig reviews."
    );
  }
};

/* ==========================================================
   GET FREELANCER REVIEWS
   GET /reviews/freelancer/:freelancerId
========================================================== */

export const getFreelancerReviews = async (
  freelancerId,
  options = {}
) => {
  try {
    const {
      page = 1,
      limit = 10,
      rating = "",
      sort = "newest",
    } = options;

    const params = {
      page,
      limit,
    };

    if (rating)
      params.rating = rating;

    if (sort)
      params.sort = sort;

    const { data } = await API.get(
      `/reviews/freelancer/${freelancerId}`,
      {
        params,
      }
    );

    return data;
  } catch (error) {
    handleError(
      error,
      "Failed to fetch freelancer reviews."
    );
  }
};

/* ==========================================================
   GET MY REVIEWS
   GET /reviews/my/reviews
========================================================== */

export const getMyReviews = async (
  options = {}
) => {
  try {
    const {
      page = 1,
      limit = 10,
      type = "given",
    } = options;

    const { data } = await API.get(
      "/reviews/my/reviews",
      {
        params: {
          page,
          limit,
          type,
        },
      }
    );

    return data;
  } catch (error) {
    handleError(
      error,
      "Failed to fetch your reviews."
    );
  }
};

/* ==========================================================
   UPDATE REVIEW
   PUT /reviews/:reviewId
========================================================== */

export const updateReview = async (
  reviewId,
  reviewData
) => {
  try {
    const { data } = await API.put(
      `/reviews/${reviewId}`,
      reviewData
    );

    return data;
  } catch (error) {
    handleError(
      error,
      "Failed to update review."
    );
  }
};

/* ==========================================================
   DELETE REVIEW
   DELETE /reviews/:reviewId
========================================================== */

export const deleteReview = async (
  reviewId
) => {
  try {
    const { data } = await API.delete(
      `/reviews/${reviewId}`
    );

    return data;
  } catch (error) {
    handleError(
      error,
      "Failed to delete review."
    );
  }
};

/* ==========================================================
   MARK HELPFUL
   PUT /reviews/:reviewId/helpful
========================================================== */

export const markHelpful = async (
  reviewId
) => {
  try {
    const { data } = await API.put(
      `/reviews/${reviewId}/helpful`
    );

    return data;
  } catch (error) {
    handleError(
      error,
      "Failed to mark review as helpful."
    );
  }
};

/* ==========================================================
   MARK NOT HELPFUL
   PUT /reviews/:reviewId/not-helpful
========================================================== */

export const markNotHelpful = async (
  reviewId
) => {
  try {
    const { data } = await API.put(
      `/reviews/${reviewId}/not-helpful`
    );

    return data;
  } catch (error) {
    handleError(
      error,
      "Failed to mark review as not helpful."
    );
  }
};

/* ==========================================================
   REPORT REVIEW
   PUT /reviews/:reviewId/report
========================================================== */

export const reportReview = async (
  reviewId,
  reportData = {}
) => {
  try {
    const { data } = await API.put(
      `/reviews/${reviewId}/report`,
      reportData
    );

    return data;
  } catch (error) {
    handleError(
      error,
      "Failed to report review."
    );
  }
};

/* ==========================================================
   REPLY TO REVIEW
   PUT /reviews/:reviewId/reply
========================================================== */

export const replyReview = async (
  reviewId,
  replyData
) => {
  try {
    const { data } = await API.put(
      `/reviews/${reviewId}/reply`,
      replyData
    );

    return data;
  } catch (error) {
    handleError(
      error,
      "Failed to reply to review."
    );
  }
};

/* ==========================================================
   APPROVE REVIEW
   PUT /reviews/:reviewId/approve
========================================================== */

export const approveReview = async (
  reviewId
) => {
  try {
    const { data } = await API.put(
      `/reviews/${reviewId}/approve`
    );

    return data;
  } catch (error) {
    handleError(
      error,
      "Failed to approve review."
    );
  }
};

/* ==========================================================
   FEATURE REVIEW
   PUT /reviews/:reviewId/feature
========================================================== */

export const featureReview = async (
  reviewId
) => {
  try {
    const { data } = await API.put(
      `/reviews/${reviewId}/feature`
    );

    return data;
  } catch (error) {
    handleError(
      error,
      "Failed to feature review."
    );
  }
};

/* ==========================================================
   HIDE REVIEW
   PUT /reviews/:reviewId/hide
========================================================== */

export const hideReview = async (
  reviewId
) => {
  try {
    const { data } = await API.put(
      `/reviews/${reviewId}/hide`
    );

    return data;
  } catch (error) {
    handleError(
      error,
      "Failed to hide review."
    );
  }
};

/* ==========================================================
   REVIEW ANALYTICS
   GET /reviews/analytics/:freelancerId
========================================================== */

export const getReviewAnalytics = async (
  freelancerId
) => {
  try {
    const { data } = await API.get(
      `/reviews/analytics/${freelancerId}`
    );

    return data;
  } catch (error) {
    handleError(
      error,
      "Failed to fetch review analytics."
    );
  }
};

/* ==========================================================
   REPUTATION
   GET /reviews/reputation/:freelancerId
========================================================== */

export const getReputation = async (
  freelancerId
) => {
  try {
    const { data } = await API.get(
      `/reviews/reputation/${freelancerId}`
    );

    return data;
  } catch (error) {
    handleError(
      error,
      "Failed to fetch reputation."
    );
  }
};

/* ==========================================================
   ADMIN GET ALL REVIEWS
   GET /reviews/admin/all
========================================================== */

export const getAllReviews = async ({
  page = 1,
  limit = 20,
  status = "",
  search = "",
  sort = "newest",
} = {}) => {
  try {
    const params = {
      page,
      limit,
    };

    if (status)
      params.status = status;

    if (search)
      params.search = search;

    if (sort)
      params.sort = sort;

    const { data } = await API.get(
      "/reviews/admin/all",
      {
        params,
      }
    );

    return data;
  } catch (error) {
    handleError(
      error,
      "Failed to fetch all reviews."
    );
  }
};

/* ==========================================================
   REJECT REVIEW
   NOTE:
   Your current backend router does NOT contain this route.
   Use only after adding:
   router.put("/:reviewId/reject", rejectReview);
========================================================== */

export const rejectReview = async (
  reviewId,
  rejectionData = {}
) => {
  try {
    const { data } = await API.put(
      `/reviews/${reviewId}/reject`,
      rejectionData
    );

    return data;
  } catch (error) {
    handleError(
      error,
      "Failed to reject review."
    );
  }
};