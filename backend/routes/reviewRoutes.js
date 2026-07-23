import express from "express";

import {
  createReview,
  updateReview,
  deleteReview,
  getReview,
  getReviews,
  getGigReviews,
  getFreelancerReviews,
  getMyReviews,
  replyReview,
  markHelpful,
  markNotHelpful,
  reportReview,
  approveReview,
  rejectReview,
  featureReview,
  hideReview,
  getReviewAnalytics,
  getReputation,
  getAllReviews,
} from "../controllers/reviewController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* ==========================================================
   PUBLIC ROUTES
========================================================== */

// Get all public reviews
router.get("/", getReviews);

// Get reviews for a specific gig
router.get(
  "/gig/:gigId",
  getGigReviews
);

// Get reviews for a specific freelancer
router.get(
  "/freelancer/:freelancerId",
  getFreelancerReviews
);

// Get freelancer review analytics
router.get(
  "/analytics/:freelancerId",
  getReviewAnalytics
);

// Get freelancer reputation
router.get(
  "/reputation/:freelancerId",
  getReputation
);

// Get single review
router.get(
  "/:reviewId",
  getReview
);

/* ==========================================================
   AUTHENTICATED USER ROUTES
========================================================== */

router.use(protect);

/* ==========================================================
   CREATE REVIEW
========================================================== */

router.post(
  "/",
  createReview
);

/* ==========================================================
   MY REVIEWS
========================================================== */

router.get(
  "/my/reviews",
  getMyReviews
);

/* ==========================================================
   UPDATE / DELETE REVIEW
========================================================== */

router.put(
  "/:reviewId",
  updateReview
);

router.delete(
  "/:reviewId",
  deleteReview
);

/* ==========================================================
   REVIEW VOTING
========================================================== */

router.put(
  "/:reviewId/helpful",
  markHelpful
);

router.put(
  "/:reviewId/not-helpful",
  markNotHelpful
);

/* ==========================================================
   REPORT REVIEW
========================================================== */

router.put(
  "/:reviewId/report",
  reportReview
);

/* ==========================================================
   FREELANCER REPLY
========================================================== */

router.put(
  "/:reviewId/reply",
  replyReview
);

/* ==========================================================
   ADMIN ROUTES
========================================================== */

// Get all reviews
router.get(
  "/admin/all",
  adminOnly,
  getAllReviews
);

// Approve review
router.put(
  "/:reviewId/approve",
  adminOnly,
  approveReview
);

// Reject review
router.put(
  "/:reviewId/reject",
  adminOnly,
  rejectReview
);

// Feature / unfeature review
router.put(
  "/:reviewId/feature",
  adminOnly,
  featureReview
);

// Hide / unhide review
router.put(
  "/:reviewId/hide",
  adminOnly,
  hideReview
);

export default router;