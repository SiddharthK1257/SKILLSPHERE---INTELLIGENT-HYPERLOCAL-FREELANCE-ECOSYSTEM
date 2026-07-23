import mongoose from "mongoose";

/* ==========================================================
   REPUTATION SCHEMA
========================================================== */

const reputationSchema = new mongoose.Schema(
  {
    /* ======================================================
       FREELANCER
    ====================================================== */

    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    /* ======================================================
       OVERALL SCORES
    ====================================================== */

    reputationScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    trustScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    weightedRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    /* ======================================================
       REVIEW STATS
    ====================================================== */

    totalReviews: {
      type: Number,
      default: 0,
    },

    verifiedReviews: {
      type: Number,
      default: 0,
    },

    recommendationRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    hireAgainRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    /* ======================================================
       CATEGORY SCORES
    ====================================================== */

    communication: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    quality: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    delivery: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    professionalism: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    valueForMoney: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    /* ======================================================
       WORK PERFORMANCE
    ====================================================== */

    completedProjects: {
      type: Number,
      default: 0,
    },

    cancelledProjects: {
      type: Number,
      default: 0,
    },

    completionRate: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },

    onTimeDeliveryRate: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },

    repeatClients: {
      type: Number,
      default: 0,
    },

    repeatClientRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    /* ======================================================
       ENGAGEMENT
    ====================================================== */

    helpfulVotes: {
      type: Number,
      default: 0,
    },

    featuredReviews: {
      type: Number,
      default: 0,
    },

    reports: {
      type: Number,
      default: 0,
    },

    suspiciousReviews: {
      type: Number,
      default: 0,
    },

    /* ======================================================
       BADGES
    ====================================================== */

    badges: [
      {
        type: String,
        enum: [
          "Top Rated",
          "Top Seller",
          "Rising Talent",
          "Trusted",
          "Fast Delivery",
          "Excellent Communication",
          "Highly Recommended",
          "Expert",
          "Premium",
        ],
      },
    ],

    level: {
      type: String,
      enum: [
        "New",
        "Bronze",
        "Silver",
        "Gold",
        "Platinum",
        "Diamond",
      ],
      default: "New",
    },

    /* ======================================================
       ANALYTICS
    ====================================================== */

    monthlyRatings: [
      {
        month: String,
        average: Number,
        reviews: Number,
      },
    ],

    ratingDistribution: {
      fiveStar: {
        type: Number,
        default: 0,
      },

      fourStar: {
        type: Number,
        default: 0,
      },

      threeStar: {
        type: Number,
        default: 0,
      },

      twoStar: {
        type: Number,
        default: 0,
      },

      oneStar: {
        type: Number,
        default: 0,
      },
    },

    /* ======================================================
       LAST UPDATED
    ====================================================== */

    lastCalculated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

/* ==========================================================
   INDEXES
========================================================== */

reputationSchema.index({
  reputationScore: -1,
});

reputationSchema.index({
  weightedRating: -1,
});

reputationSchema.index({
  totalReviews: -1,
});

reputationSchema.index({
  level: 1,
});

reputationSchema.index({
  trustScore: -1,
});

reputationSchema.index({
  completedProjects: -1,
});

reputationSchema.index({
  recommendationRate: -1,
});

/* ==========================================================
   EXPORT
========================================================== */

export default mongoose.model(
  "Reputation",
  reputationSchema
);