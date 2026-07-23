/* ==========================================================
   PAYMENT ROLE MIDDLEWARE
   Used AFTER protect middleware
========================================================== */

/**
 * Generic Role Checker
 */
const checkRole = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to perform this payment action.",
        });
      }

      return next();
    } catch (error) {
      console.error("PAYMENT MIDDLEWARE ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  };
};

/* ==========================================================
   CLIENT ONLY
   Client can create and complete payments
========================================================== */

export const isClient = checkRole("client");

/* ==========================================================
   FREELANCER ONLY
   Freelancer can view earnings, payouts, withdrawals
========================================================== */

export const isFreelancer = checkRole("freelancer");

/* ==========================================================
   ADMIN ONLY
   Admin manages all payments
========================================================== */

export const isAdmin = checkRole("admin");

/* ==========================================================
   CLIENT OR ADMIN
========================================================== */

export const isClientOrAdmin = checkRole(
  "client",
  "admin"
);

/* ==========================================================
   FREELANCER OR ADMIN
========================================================== */

export const isFreelancerOrAdmin = checkRole(
  "freelancer",
  "admin"
);

/* ==========================================================
   ANY AUTHENTICATED USER
========================================================== */

export const isAuthenticatedUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  return next();
};