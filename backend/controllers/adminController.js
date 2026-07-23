import User from "../models/User.js";
import Gig from "../models/Gig.js";
import Proposal from "../models/Proposal.js";
import Payment from "../models/Payment.js";
import Review from "../models/Review.js";
import Report from "../models/Report.js";
import Settings from "../models/Settings.js";

/* ==========================================================
   ADMIN DASHBOARD STATS
   GET /api/admin/dashboard
========================================================== */

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalFreelancers = await User.countDocuments({
      role: "freelancer",
    });

    const totalClients = await User.countDocuments({
      role: "client",
    });

    const totalAdmins = await User.countDocuments({
      role: "admin",
    });

    const totalGigs = await Gig.countDocuments();

    const totalProposals = await Proposal.countDocuments();

    const totalPayments = await Payment.countDocuments();

    const revenue = await Payment.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalFreelancers,
        totalClients,
        totalAdmins,
        totalGigs,
        totalProposals,
        totalPayments,
        totalRevenue:
          revenue.length > 0 ? revenue[0].total : 0,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================================
   GET ALL USERS
========================================================== */

export const getAllUsers = async (req, res) => {
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
    console.error("Get Users Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================================
   UPDATE USER ROLE
========================================================== */

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (
      !["client", "freelancer", "admin"].includes(role)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid role selected.",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.role = role;

    await user.save();

    const updatedUser = await User.findById(user._id)
      .select("-password");

    res.status(200).json({
      success: true,
      message: "User role updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Role Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================================
   BLOCK / UNBLOCK USER
========================================================== */

export const toggleUserStatus = async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot block your own account.",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.suspended = !user.suspended;

    await user.save();

    res.status(200).json({
      success: true,
      message: user.suspended
        ? "User blocked successfully."
        : "User unblocked successfully.",
      user: await User.findById(user._id).select("-password"),
    });
  } catch (error) {
    console.error("Toggle Status Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================================
   DELETE USER
========================================================== */

export const deleteUser = async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account.",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("Delete User Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================================
   GET ALL PROPOSALS
   GET /api/admin/proposals
========================================================== */

export const getAllProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find()
      .populate("gig", "title")
      .populate("freelancer", "name email")
      .populate("client", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: proposals.length,
      proposals,
    });
  } catch (error) {
    console.error("Get Proposals Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================================
   DELETE PROPOSAL
   DELETE /api/admin/proposals/:id
========================================================== */

export const deleteProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found.",
      });
    }

    await proposal.deleteOne();

    res.status(200).json({
      success: true,
      message: "Proposal deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Proposal Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/* ==========================================================
   GET ALL GIGS
   GET /api/admin/gigs
========================================================== */

export const getAllGigs = async (req, res) => {
  try {
    const gigs = await Gig.find()
      .populate("freelancer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: gigs.length,
      gigs,
    });
  } catch (error) {
    console.error("Get Gigs Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================================
   GET SINGLE GIG
========================================================== */

export const getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate("freelancer", "name email");

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found.",
      });
    }

    res.status(200).json({
      success: true,
      gig,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================================
   APPROVE GIG
========================================================== */

export const approveGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found.",
      });
    }

    gig.status = "approved";
    gig.approvedBy = req.user._id;
    gig.approvedAt = new Date();
    gig.rejectionReason = "";

    await gig.save();

    res.status(200).json({
      success: true,
      message: "Gig approved successfully.",
      gig,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================================
   REJECT GIG
========================================================== */

export const rejectGig = async (req, res) => {
  try {
    const { reason } = req.body;

    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found.",
      });
    }

    gig.status = "rejected";
    gig.rejectionReason = reason || "";

    await gig.save();

    res.status(200).json({
      success: true,
      message: "Gig rejected successfully.",
      gig,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================================
   TOGGLE GIG STATUS
========================================================== */

export const toggleGigStatus = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found.",
      });
    }

    gig.isActive = !gig.isActive;

    await gig.save();

    res.status(200).json({
      success: true,
      message: gig.isActive
        ? "Gig activated successfully."
        : "Gig deactivated successfully.",
      gig,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================================
   FEATURE GIG
========================================================== */

export const toggleFeaturedGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found.",
      });
    }

    gig.featured = !gig.featured;

    await gig.save();

    res.status(200).json({
      success: true,
      message: gig.featured
        ? "Gig marked as featured."
        : "Gig removed from featured.",
      gig,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================================
   DELETE GIG
========================================================== */

export const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found.",
      });
    }

    await gig.deleteOne();

    res.status(200).json({
      success: true,
      message: "Gig deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/* ==========================================================
   GET ALL PAYMENTS
   GET /api/admin/payments
========================================================== */

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("client", "name email")
      .populate("freelancer", "name email")
      .populate("gig", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("Get Payments Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================================
   GET SINGLE PAYMENT
   GET /api/admin/payments/:id
========================================================== */

export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("client", "name email")
      .populate("freelancer", "name email")
      .populate("gig", "title");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("Get Payment Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================================
   DELETE PAYMENT
   DELETE /api/admin/payments/:id
========================================================== */

export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    await payment.deleteOne();

    res.status(200).json({
      success: true,
      message: "Payment deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Payment Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/* ==========================================================
   REVIEW MANAGEMENT
========================================================== */

/* ==========================================================
   GET ALL REVIEWS
   GET /api/admin/reviews
========================================================== */

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("client", "name email")
      .populate("freelancer", "name email")
      .populate("gig", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get Reviews Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================================
   GET REVIEW BY ID
   GET /api/admin/reviews/:id
========================================================== */

export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("client", "name email")
      .populate("freelancer", "name email")
      .populate("gig", "title")
      .populate("proposal")
      .populate("payment");

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    console.error("Get Review Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================================
   FEATURE / UNFEATURE REVIEW
   PUT /api/admin/reviews/:id/featured
========================================================== */

export const toggleFeaturedReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    review.featured = !review.featured;

    await review.save();

    res.status(200).json({
      success: true,
      message: review.featured
        ? "Review marked as featured."
        : "Review removed from featured.",
      review,
    });
  } catch (error) {
    console.error("Feature Review Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================================
   HIDE / UNHIDE REVIEW
   PUT /api/admin/reviews/:id/hide
========================================================== */

export const toggleReviewVisibility = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    review.hidden = !review.hidden;

    await review.save();

    res.status(200).json({
      success: true,
      message: review.hidden
        ? "Review hidden successfully."
        : "Review is now visible.",
      review,
    });
  } catch (error) {
    console.error("Hide Review Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================================
   DELETE REVIEW
   DELETE /api/admin/reviews/:id
========================================================== */

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Review Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/* ==========================================================
   GET ALL REPORTS
   GET /api/admin/reports
========================================================== */

export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("reporter", "name email")
      .populate("reportedUser", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error("Get Reports Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================================
   GET SINGLE REPORT
   GET /api/admin/reports/:id
========================================================== */

export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate("reporter", "name email")
      .populate("reportedUser", "name email role");

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found.",
      });
    }

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    console.error("Get Report Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================================
   RESOLVE REPORT
   PUT /api/admin/reports/:id/resolve
========================================================== */

export const resolveReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found.",
      });
    }

    report.status = "Resolved";
    report.resolvedBy = req.user._id;
    report.resolvedAt = new Date();

    await report.save();

    res.status(200).json({
      success: true,
      message: "Report resolved successfully.",
      report,
    });
  } catch (error) {
    console.error("Resolve Report Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================================
   REJECT REPORT
   PUT /api/admin/reports/:id/reject
========================================================== */

export const rejectReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found.",
      });
    }

    report.status = "Rejected";
    report.resolvedBy = req.user._id;
    report.resolvedAt = new Date();

    await report.save();

    res.status(200).json({
      success: true,
      message: "Report rejected successfully.",
      report,
    });
  } catch (error) {
    console.error("Reject Report Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================================
   DELETE REPORT
   DELETE /api/admin/reports/:id
========================================================== */

export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found.",
      });
    }

    await report.deleteOne();

    res.status(200).json({
      success: true,
      message: "Report deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Report Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/* ==========================================================
   GET SETTINGS
   GET /api/admin/settings
========================================================== */

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    return res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Get Settings Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================================
   UPDATE SETTINGS
   PUT /api/admin/settings
========================================================== */

export const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    // Platform
    if (req.body.platformName !== undefined)
      settings.platformName = req.body.platformName;

    if (req.body.platformEmail !== undefined)
      settings.platformEmail = req.body.platformEmail;

    if (req.body.supportEmail !== undefined)
      settings.supportEmail = req.body.supportEmail;

    if (req.body.contactNumber !== undefined)
      settings.contactNumber = req.body.contactNumber;

    if (req.body.maintenanceMode !== undefined)
      settings.maintenanceMode = req.body.maintenanceMode;

    if (req.body.registrationEnabled !== undefined)
      settings.registrationEnabled = req.body.registrationEnabled;

    // Commission
    if (req.body.commission) {
      settings.commission.platformFee =
        req.body.commission.platformFee ??
        settings.commission.platformFee;

      settings.commission.minimumWithdrawal =
        req.body.commission.minimumWithdrawal ??
        settings.commission.minimumWithdrawal;

      settings.commission.taxPercentage =
        req.body.commission.taxPercentage ??
        settings.commission.taxPercentage;
    }

    // Payment
    if (req.body.payment) {
      settings.payment.razorpayEnabled =
        req.body.payment.razorpayEnabled ??
        settings.payment.razorpayEnabled;

      settings.payment.stripeEnabled =
        req.body.payment.stripeEnabled ??
        settings.payment.stripeEnabled;

      settings.payment.walletEnabled =
        req.body.payment.walletEnabled ??
        settings.payment.walletEnabled;

      settings.payment.cashEnabled =
        req.body.payment.cashEnabled ??
        settings.payment.cashEnabled;

      settings.payment.currency =
        req.body.payment.currency ??
        settings.payment.currency;
    }

    // Email
    if (req.body.email) {
      settings.email.smtpHost =
        req.body.email.smtpHost ??
        settings.email.smtpHost;

      settings.email.smtpPort =
        req.body.email.smtpPort ??
        settings.email.smtpPort;

      settings.email.smtpUser =
        req.body.email.smtpUser ??
        settings.email.smtpUser;

      if (req.body.email.smtpPassword !== undefined) {
        settings.email.smtpPassword =
          req.body.email.smtpPassword;
      }

      settings.email.senderName =
        req.body.email.senderName ??
        settings.email.senderName;

      settings.email.senderEmail =
        req.body.email.senderEmail ??
        settings.email.senderEmail;
    }

    // Security
    if (req.body.security) {
      settings.security.jwtExpire =
        req.body.security.jwtExpire ??
        settings.security.jwtExpire;

      settings.security.refreshExpire =
        req.body.security.refreshExpire ??
        settings.security.refreshExpire;

      settings.security.maxLoginAttempts =
        req.body.security.maxLoginAttempts ??
        settings.security.maxLoginAttempts;

      settings.security.accountLockTime =
        req.body.security.accountLockTime ??
        settings.security.accountLockTime;

      settings.security.twoFactorRequired =
        req.body.security.twoFactorRequired ??
        settings.security.twoFactorRequired;
    }

    // AI
    if (req.body.ai) {
      settings.ai.enabled =
        req.body.ai.enabled ??
        settings.ai.enabled;

      settings.ai.recommendationThreshold =
        req.body.ai.recommendationThreshold ??
        settings.ai.recommendationThreshold;

      settings.ai.autoProfileScore =
        req.body.ai.autoProfileScore ??
        settings.ai.autoProfileScore;

      settings.ai.autoSkillDetection =
        req.body.ai.autoSkillDetection ??
        settings.ai.autoSkillDetection;
    }

    await settings.save();

    return res.status(200).json({
      success: true,
      message: "Settings updated successfully.",
      settings,
    });
  } catch (error) {
    console.error("Update Settings Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};