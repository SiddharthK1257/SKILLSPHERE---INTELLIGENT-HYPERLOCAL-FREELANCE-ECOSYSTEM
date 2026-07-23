import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";

/* ==========================================================
   AUTHENTICATE USER
   Protect private routes
========================================================== */

export const protect = async (req, res, next) => {
  try {
    /* ------------------------------------------------------
       1. CHECK AUTHORIZATION HEADER
    ------------------------------------------------------ */

    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing.",
      });
    }

    /* ------------------------------------------------------
       2. EXTRACT TOKEN
    ------------------------------------------------------ */

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    /* ------------------------------------------------------
       3. CHECK JWT SECRET
    ------------------------------------------------------ */

    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRET is missing in environment variables."
      );

      return res.status(500).json({
        success: false,
        message: "Server authentication configuration error.",
      });
    }

    /* ------------------------------------------------------
       4. VERIFY TOKEN
    ------------------------------------------------------ */

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    /*
      Your token may be created like:

      jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET
      )

      Therefore we support both id and _id.
    */

    const userId =
      decoded.id ||
      decoded._id ||
      decoded.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload.",
      });
    }

    /* ------------------------------------------------------
       5. VALIDATE MONGODB ID
    ------------------------------------------------------ */

    if (
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid user ID in token.",
      });
    }

    /* ------------------------------------------------------
       6. FIND USER
    ------------------------------------------------------ */

    const user = await User.findById(userId)
      .select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
      });
    }

    /* ------------------------------------------------------
       7. CHECK ACCOUNT STATUS
    ------------------------------------------------------ */

    if (user.active === false) {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been deactivated.",
      });
    }

    if (user.suspended === true) {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been suspended.",
      });
    }

    /* ------------------------------------------------------
       8. ATTACH USER TO REQUEST
    ------------------------------------------------------ */

    req.user = user;

    next();

  } catch (error) {

    console.error(
      "AUTHENTICATION ERROR:",
      error.message
    );

    /* JWT EXPIRED */

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message:
          "Your session has expired. Please login again.",
      });
    }

    /* INVALID JWT */

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message:
          "Invalid authentication token.",
      });
    }

    /* OTHER SERVER ERROR */

    return res.status(500).json({
      success: false,
      message:
        "Authentication failed due to a server error.",
    });
  }
};


/* ==========================================================
   ROLE AUTHORIZATION
========================================================== */

export const authorize =
  (...allowedRoles) =>
  (req, res, next) => {

    /* ------------------------------------------------------
       CHECK AUTHENTICATION
    ------------------------------------------------------ */

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    /* ------------------------------------------------------
       CHECK USER ROLE
    ------------------------------------------------------ */

    if (
      !allowedRoles.includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to perform this action.",
      });
    }

    next();
  };


/* ==========================================================
   ROLE SHORTCUTS
========================================================== */

export const adminOnly =
  authorize("admin");

export const clientOnly =
  authorize("client");

export const freelancerOnly =
  authorize("freelancer");


/* ==========================================================
   MULTIPLE ROLE SHORTCUTS
========================================================== */

export const adminOrClient =
  authorize(
    "admin",
    "client"
  );

export const adminOrFreelancer =
  authorize(
    "admin",
    "freelancer"
  );

export const clientOrFreelancer =
  authorize(
    "client",
    "freelancer"
  );

export const allRoles =
  authorize(
    "admin",
    "client",
    "freelancer"
  );


/* ==========================================================
   OPTIONAL AUTHENTICATION
   User can be logged in or anonymous
========================================================== */

export const optionalAuth = async (
  req,
  res,
  next
) => {

  try {

    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      req.user = null;
      return next();
    }

    const token =
      authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const userId =
      decoded.id ||
      decoded._id ||
      decoded.userId;

    if (
      userId &&
      mongoose.Types.ObjectId.isValid(userId)
    ) {
      req.user =
        await User.findById(userId)
          .select("-password");
    }

    next();

  } catch (error) {

    /*
      Optional authentication should not
      block public requests if token is invalid.
    */

    req.user = null;

    next();
  }
};


/* ==========================================================
   ADMIN CHECK
========================================================== */

export const isAdmin = (
  req,
  res,
  next
) => {

  if (
    !req.user ||
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      success: false,
      message:
        "Admin access required.",
    });
  }

  next();
};


/* ==========================================================
   AUTHENTICATED USER CHECK
========================================================== */

export const anyAuthenticatedUser = (
  req,
  res,
  next
) => {

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message:
        "Authentication required.",
    });
  }

  next();
};