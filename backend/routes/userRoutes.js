import express from "express";

import {
  /* ======================================================
     PROFILE
  ====================================================== */

  getProfile,
  updateProfile,

  /* ======================================================
     PORTFOLIO
  ====================================================== */

  getPortfolio,
  addPortfolio,
  updatePortfolio,
  deletePortfolio,

  /* ======================================================
     WORK EXPERIENCE
  ====================================================== */

  getWorkExperience,
  addWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,

  /* ======================================================
     CERTIFICATIONS
  ====================================================== */

  getCertifications,
  addCertification,
  updateCertification,
  deleteCertification,

  /* ======================================================
     AVAILABILITY
  ====================================================== */

  getAvailability,
  updateAvailability,

  /* ======================================================
     PRICING
  ====================================================== */

  getPricing,
  updatePricing,

  /* ======================================================
     VERIFICATION
  ====================================================== */

  getVerification,
  updateVerification,

  /* ======================================================
     ROLE
  ====================================================== */

  changeRole,
} from "../controllers/userController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* ==========================================================
   PROFILE
========================================================== */

/*
GET     /api/users/profile
PUT     /api/users/profile
*/

router
  .route("/profile")
  .get(protect, getProfile)
  .put(protect, updateProfile);

/* ==========================================================
   CHANGE ROLE
========================================================== */

/*
PUT /api/users/change-role
*/

router.put(
  "/change-role",
  protect,
  changeRole
);

/* ==========================================================
   PORTFOLIO
========================================================== */

/*
GET     /api/users/portfolio
POST    /api/users/portfolio
*/

router
  .route("/portfolio")
  .get(protect, getPortfolio)
  .post(protect, addPortfolio);

/*
PUT     /api/users/portfolio/:index
DELETE  /api/users/portfolio/:index
*/

router
  .route("/portfolio/:index")
  .put(protect, updatePortfolio)
  .delete(protect, deletePortfolio);

/* ==========================================================
   WORK EXPERIENCE
========================================================== */

/*
GET     /api/users/experience
POST    /api/users/experience
*/

router
  .route("/experience")
  .get(protect, getWorkExperience)
  .post(protect, addWorkExperience);

/*
PUT     /api/users/experience/:index
DELETE  /api/users/experience/:index
*/

router
  .route("/experience/:index")
  .put(protect, updateWorkExperience)
  .delete(protect, deleteWorkExperience);

/* ==========================================================
   CERTIFICATIONS
========================================================== */

/*
GET     /api/users/certifications
POST    /api/users/certifications
*/

router
  .route("/certifications")
  .get(protect, getCertifications)
  .post(protect, addCertification);

/*
PUT     /api/users/certifications/:index
DELETE  /api/users/certifications/:index
*/

router
  .route("/certifications/:index")
  .put(protect, updateCertification)
  .delete(protect, deleteCertification);

/* ==========================================================
   WEEKLY AVAILABILITY
========================================================== */

/*
GET /api/users/availability
PUT /api/users/availability
*/

router
  .route("/availability")
  .get(protect, getAvailability)
  .put(protect, updateAvailability);

/* ==========================================================
   PRICING
========================================================== */

/*
GET /api/users/pricing
PUT /api/users/pricing
*/

router
  .route("/pricing")
  .get(protect, getPricing)
  .put(protect, updatePricing);

/* ==========================================================
   VERIFICATION
========================================================== */

/*
GET /api/users/verification

User can view own verification status.
*/

router.get(
  "/verification",
  protect,
  getVerification
);

/*
PUT /api/users/verification/:userId

Only admin should update verification.
*/

router.put(
  "/verification/:userId",
  protect,
  adminOnly,
  updateVerification
);

/* ==========================================================
   ADMIN - GET ALL USERS
========================================================== */

/*
GET /api/users

ADMIN ONLY
*/

router.get(
  "/",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const users = await User.find()
        .select("-password")
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        count: users.length,
        users,
      });
    } catch (error) {
      console.error(
        "Get All Users Error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Failed to fetch users",
      });
    }
  }
);

export default router;