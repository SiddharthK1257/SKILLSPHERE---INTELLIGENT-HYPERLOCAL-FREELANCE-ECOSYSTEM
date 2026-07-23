import Analytics from "../models/Analytics.js";

// ======================================
// Get Freelancer Analytics
// ======================================

export const getAnalytics = async (req, res) => {
  try {
    let analytics = await Analytics.findOne({
      freelancer: req.user._id,
    });

    // Create analytics if it doesn't exist
    if (!analytics) {
      analytics = await Analytics.create({
        freelancer: req.user._id,
        profileViews: 0,
        gigApplications: 0,
        totalEarnings: 0,
        averageRating: 0,
        totalReviews: 0,
        monthlyRevenue: [],
      });
    }

    return res.status(200).json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error("Get Analytics Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ======================================
// Reset Analytics (Optional)
// ======================================

export const resetAnalytics = async (req, res) => {
  try {
    const analytics = await Analytics.findOne({
      freelancer: req.user._id,
    });

    if (!analytics) {
      return res.status(404).json({
        success: false,
        message: "Analytics not found.",
      });
    }

    analytics.profileViews = 0;
    analytics.gigApplications = 0;
    analytics.totalEarnings = 0;
    analytics.averageRating = 0;
    analytics.totalReviews = 0;
    analytics.monthlyRevenue = [];

    await analytics.save();

    return res.status(200).json({
      success: true,
      message: "Analytics reset successfully.",
      analytics,
    });
  } catch (error) {
    console.error("Reset Analytics Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};