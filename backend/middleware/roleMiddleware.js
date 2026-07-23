/* ==========================================================
   ROLE AUTHORIZATION MIDDLEWARE
========================================================== */

/**
 * Generic Role Authorization
 *
 * Usage:
 * authorizeRoles("admin")
 * authorizeRoles("client")
 * authorizeRoles("freelancer")
 * authorizeRoles("admin", "freelancer")
 */

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    try {
      // Ensure user is authenticated
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      // Validate user role
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to perform this action.",
          requiredRoles: roles,
          currentRole: req.user.role,
        });
      }

      next();
    } catch (error) {
      console.error("ROLE AUTHORIZATION ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Authorization failed.",
      });
    }
  };
};

/* ==========================================================
   PREDEFINED ROLE MIDDLEWARE
========================================================== */

// Admin only
export const adminOnly = authorizeRoles("admin");

// Client only
export const clientOnly = authorizeRoles("client");

// Freelancer only
export const freelancerOnly = authorizeRoles("freelancer");

/* ==========================================================
   MULTIPLE ROLE MIDDLEWARE
========================================================== */

// Admin or Client
export const adminOrClient = authorizeRoles(
  "admin",
  "client"
);

// Admin or Freelancer
export const adminOrFreelancer = authorizeRoles(
  "admin",
  "freelancer"
);

// Client or Freelancer
export const clientOrFreelancer = authorizeRoles(
  "client",
  "freelancer"
);

// Any authenticated role
export const authenticatedUser = authorizeRoles(
  "admin",
  "client",
  "freelancer"
);