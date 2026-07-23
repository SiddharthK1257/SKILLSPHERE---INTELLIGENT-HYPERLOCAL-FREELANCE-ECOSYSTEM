import mongoose from "mongoose";

/* ==========================================================
   SETTINGS SCHEMA
========================================================== */

const settingsSchema = new mongoose.Schema(
  {
    /* ==========================================
       PLATFORM
    ========================================== */

    platformName: {
      type: String,
      default: "SkillSphere",
      trim: true,
    },

    platformEmail: {
      type: String,
      default: "",
      trim: true,
    },

    supportEmail: {
      type: String,
      default: "",
      trim: true,
    },

    contactNumber: {
      type: String,
      default: "",
      trim: true,
    },

    maintenanceMode: {
      type: Boolean,
      default: false,
    },

    registrationEnabled: {
      type: Boolean,
      default: true,
    },

    /* ==========================================
       COMMISSION
    ========================================== */

    commission: {
      platformFee: {
        type: Number,
        default: 10,
        min: 0,
        max: 100,
      },

      minimumWithdrawal: {
        type: Number,
        default: 500,
      },

      taxPercentage: {
        type: Number,
        default: 0,
      },
    },

    /* ==========================================
       PAYMENT
    ========================================== */

    payment: {
      razorpayEnabled: {
        type: Boolean,
        default: true,
      },

      stripeEnabled: {
        type: Boolean,
        default: false,
      },

      walletEnabled: {
        type: Boolean,
        default: true,
      },

      cashEnabled: {
        type: Boolean,
        default: false,
      },

      currency: {
        type: String,
        default: "INR",
      },
    },

    /* ==========================================
       EMAIL
    ========================================== */

    email: {
      smtpHost: {
        type: String,
        default: "",
      },

      smtpPort: {
        type: Number,
        default: 587,
      },

      smtpUser: {
        type: String,
        default: "",
      },

      smtpPassword: {
        type: String,
        default: "",
        select: false,
      },

      senderName: {
        type: String,
        default: "SkillSphere",
      },

      senderEmail: {
        type: String,
        default: "",
      },
    },

    /* ==========================================
       SECURITY
    ========================================== */

    security: {
      jwtExpire: {
        type: String,
        default: "7d",
      },

      refreshExpire: {
        type: String,
        default: "30d",
      },

      maxLoginAttempts: {
        type: Number,
        default: 5,
      },

      accountLockTime: {
        type: Number,
        default: 30,
      },

      twoFactorRequired: {
        type: Boolean,
        default: false,
      },
    },

    /* ==========================================
       AI SETTINGS
    ========================================== */

    ai: {
      enabled: {
        type: Boolean,
        default: true,
      },

      recommendationThreshold: {
        type: Number,
        default: 70,
      },

      autoProfileScore: {
        type: Boolean,
        default: true,
      },

      autoSkillDetection: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

/* ==========================================================
   EXPORT
========================================================== */

export default mongoose.model(
  "Settings",
  settingsSchema
);