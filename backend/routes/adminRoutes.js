import express from "express";

import {
  // Dashboard
  getDashboardStats,

  // Users
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  deleteUser,

  // Gigs
  getAllGigs,
  getGigById,
  approveGig,
  rejectGig,
  toggleGigStatus,
  toggleFeaturedGig,
  deleteGig,

  // Proposals
  getAllProposals,
  deleteProposal,

  // Payments
  getAllPayments,
  getPaymentById,
  deletePayment,

  // Reviews
  getAllReviews,
  getReviewById,
  toggleFeaturedReview,
  toggleReviewVisibility,
  deleteReview,

  // Reports
  getAllReports,
  getReportById,
  resolveReport,
  rejectReport,
  deleteReport,

  // Settings
  getSettings,
  updateSettings,
} from "../controllers/adminController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* ==========================================================
   Dashboard
========================================================== */

router.get(
  "/dashboard",
  protect,
  adminOnly,
  getDashboardStats
);

/* ==========================================================
   User Management
========================================================== */

router.get(
  "/users",
  protect,
  adminOnly,
  getAllUsers
);

router.put(
  "/users/:id/role",
  protect,
  adminOnly,
  updateUserRole
);

router.put(
  "/users/:id/status",
  protect,
  adminOnly,
  toggleUserStatus
);

router.delete(
  "/users/:id",
  protect,
  adminOnly,
  deleteUser
);

/* ==========================================================
   Gig Management
========================================================== */

router.get(
  "/gigs",
  protect,
  adminOnly,
  getAllGigs
);

router.get(
  "/gigs/:id",
  protect,
  adminOnly,
  getGigById
);

router.put(
  "/gigs/:id/approve",
  protect,
  adminOnly,
  approveGig
);

router.put(
  "/gigs/:id/reject",
  protect,
  adminOnly,
  rejectGig
);

router.put(
  "/gigs/:id/status",
  protect,
  adminOnly,
  toggleGigStatus
);

router.put(
  "/gigs/:id/featured",
  protect,
  adminOnly,
  toggleFeaturedGig
);

router.delete(
  "/gigs/:id",
  protect,
  adminOnly,
  deleteGig
);

/* ==========================================================
   Proposal Management
========================================================== */

router.get(
  "/proposals",
  protect,
  adminOnly,
  getAllProposals
);

router.delete(
  "/proposals/:id",
  protect,
  adminOnly,
  deleteProposal
);

/* ==========================================================
   Payment Management
========================================================== */

router.get(
  "/payments",
  protect,
  adminOnly,
  getAllPayments
);

router.get(
  "/payments/:id",
  protect,
  adminOnly,
  getPaymentById
);

router.delete(
  "/payments/:id",
  protect,
  adminOnly,
  deletePayment
);

/* ==========================================================
   Review Management
========================================================== */

router.get(
  "/reviews",
  protect,
  adminOnly,
  getAllReviews
);

router.get(
  "/reviews/:id",
  protect,
  adminOnly,
  getReviewById
);

router.put(
  "/reviews/:id/featured",
  protect,
  adminOnly,
  toggleFeaturedReview
);

router.put(
  "/reviews/:id/hide",
  protect,
  adminOnly,
  toggleReviewVisibility
);

router.delete(
  "/reviews/:id",
  protect,
  adminOnly,
  deleteReview
);

/* ==========================================================
   Report Management
========================================================== */

router.get(
  "/reports",
  protect,
  adminOnly,
  getAllReports
);

router.get(
  "/reports/:id",
  protect,
  adminOnly,
  getReportById
);

router.put(
  "/reports/:id/resolve",
  protect,
  adminOnly,
  resolveReport
);

router.put(
  "/reports/:id/reject",
  protect,
  adminOnly,
  rejectReport
);

router.delete(
  "/reports/:id",
  protect,
  adminOnly,
  deleteReport
);

/* ==========================================================
   Settings Management
========================================================== */

router.get(
  "/settings",
  protect,
  adminOnly,
  getSettings
);

router.put(
  "/settings",
  protect,
  adminOnly,
  updateSettings
);

export default router;