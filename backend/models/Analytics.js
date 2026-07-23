import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    // Freelancer
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Total profile views
    profileViews: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Total gig applications
    gigApplications: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Total earnings
    totalEarnings: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Average client rating
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    // Total reviews
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Monthly revenue
    monthlyRevenue: [
      {
        month: {
          type: String,
          required: true,
          trim: true,
        },

        amount: {
          type: Number,
          default: 0,
          min: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// ============================
// Indexes
// ============================

analyticsSchema.index({
  freelancer: 1,
});

// ============================
// Export
// ============================

const Analytics = mongoose.model(
  "Analytics",
  analyticsSchema
);

export default Analytics;