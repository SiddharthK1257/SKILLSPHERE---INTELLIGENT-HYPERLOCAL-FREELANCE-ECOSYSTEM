import User from "../models/User.js";

/* ==========================================================
   ADMIN ONLY MIDDLEWARE
========================================================== */

export const adminOnly = async (
  req,
  res,
  next
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. Admin only.",
      });
    }

    next();
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Authorization failed.",
      error: error.message,
    });
  }
};