import mongoose from "mongoose";

import Review from "../models/Review.js";
import Reputation from "../models/Reputation.js";
import Proposal from "../models/Proposal.js";
import Payment from "../models/Payment.js";

import { updateReputation } from "../utils/reputationCalculator.js";
import { detectReviewFraud } from "../utils/fraudDetector.js";
import { generateReviewAnalytics } from "../utils/reviewAnalytics.js";

/* ==========================================================
   CONSTANTS
========================================================== */

const REVIEW_REASONS = [
  "Spam",
  "Fake Review",
  "Harassment",
  "Scam",
  "Copyright",
  "Abusive Language",
  "Other",
];

/* ==========================================================
   HELPERS
========================================================== */

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const toObjectId = (id) => {
  return new mongoose.Types.ObjectId(id);
};

const isSameUser = (id1, id2) => {
  return id1?.toString() === id2?.toString();
};

const validateRating = (rating) => {
  return (
    rating !== undefined &&
    rating !== null &&
    Number.isFinite(Number(rating)) &&
    Number(rating) >= 1 &&
    Number(rating) <= 5
  );
};

const calculateAverageRating = ({
  communication,
  quality,
  delivery,
  professionalism,
  valueForMoney,
}) => {
  return Number(
    (
      (Number(communication) +
        Number(quality) +
        Number(delivery) +
        Number(professionalism) +
        Number(valueForMoney)) /
      5
    ).toFixed(1)
  );
};

const normalizeArray = (value) => {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => String(item).trim())
    .filter(Boolean);
};

const getPagination = (req) => {
  const page = Math.max(
    1,
    Number.parseInt(req.query.page, 10) || 1
  );

  const limit = Math.min(
    50,
    Math.max(
      1,
      Number.parseInt(req.query.limit, 10) || 10
    )
  );

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

const refreshFreelancerReputation = async (freelancerId) => {
  if (!freelancerId) return;

  await updateReputation(freelancerId);
};

/* ==========================================================
   CREATE REVIEW
========================================================== */

export const createReview = async (req, res) => {
  try {
    const {
      proposalId,
      paymentId,

      communication,
      quality,
      delivery,
      professionalism,
      valueForMoney,

      title,
      comment,

      pros = [],
      cons = [],
      tags = [],

      recommendFreelancer = true,
      wouldHireAgain = true,
    } = req.body;

    /* ======================================================
       BASIC VALIDATION
    ====================================================== */

    if (!proposalId || !paymentId) {
      return res.status(400).json({
        success: false,
        message:
          "Proposal ID and Payment ID are required.",
      });
    }

    if (
      !isValidObjectId(proposalId) ||
      !isValidObjectId(paymentId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Proposal ID or Payment ID.",
      });
    }

    const ratings = {
      communication,
      quality,
      delivery,
      professionalism,
      valueForMoney,
    };

    for (const [key, value] of Object.entries(ratings)) {
      if (!validateRating(value)) {
        return res.status(400).json({
          success: false,
          message: `${key} must be between 1 and 5.`,
        });
      }
    }

    if (
      typeof title !== "string" ||
      !title.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Review title is required.",
      });
    }

    if (
      typeof comment !== "string" ||
      !comment.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Review comment is required.",
      });
    }

    if (title.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message:
          "Review title cannot exceed 100 characters.",
      });
    }

    if (comment.trim().length > 3000) {
      return res.status(400).json({
        success: false,
        message:
          "Review comment cannot exceed 3000 characters.",
      });
    }

    /* ======================================================
       FIND PROPOSAL
    ====================================================== */

    const proposal = await Proposal.findById(
      proposalId
    )
      .populate("gig")
      .populate("client")
      .populate("freelancer");

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found.",
      });
    }

    if (
      !proposal.client ||
      !proposal.freelancer ||
      !proposal.gig
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Proposal relationship data is incomplete.",
      });
    }

    /* ======================================================
       ONLY CLIENT CAN REVIEW
    ====================================================== */

    if (
      !isSameUser(
        proposal.client._id,
        req.user._id
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only the client can review this project.",
      });
    }

    /* ======================================================
       FIND PAYMENT
    ====================================================== */

    const payment = await Payment.findById(
      paymentId
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    /* ======================================================
       PAYMENT STATUS
    ====================================================== */

    if (
      payment.paymentStatus !== "Completed"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment must be completed before reviewing.",
      });
    }

    /* ======================================================
       PAYMENT OWNERSHIP
    ====================================================== */

    if (
      !isSameUser(
        payment.client,
        proposal.client._id
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment does not belong to this client.",
      });
    }

    if (
      !isSameUser(
        payment.freelancer,
        proposal.freelancer._id
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment does not belong to this freelancer.",
      });
    }

    /* ======================================================
       PREVENT DUPLICATE REVIEW
    ====================================================== */

    const existingReview =
      await Review.findOne({
        proposal: proposalId,
      });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message:
          "A review already exists for this project.",
      });
    }

    /* ======================================================
       CALCULATE OVERALL RATING
    ====================================================== */

    const overallRating =
      calculateAverageRating(ratings);

    /* ======================================================
       FRAUD DETECTION
    ====================================================== */

    const fraud = await detectReviewFraud({
      client: proposal.client._id,
      freelancer: proposal.freelancer._id,
      proposal: proposalId,
      payment: paymentId,

      overallRating,

      communication,
      quality,
      delivery,
      professionalism,
      valueForMoney,

      comment: comment.trim(),
    });

    /* ======================================================
       CREATE REVIEW
    ====================================================== */

    const review = await Review.create({
      gig: proposal.gig._id,

      proposal: proposal._id,

      payment: payment._id,

      client: proposal.client._id,

      freelancer: proposal.freelancer._id,

      verified: true,

      overallRating,

      communication: Number(communication),
      quality: Number(quality),
      delivery: Number(delivery),
      professionalism: Number(professionalism),
      valueForMoney: Number(valueForMoney),

      title: title.trim(),

      comment: comment.trim(),

      pros: normalizeArray(pros),
      cons: normalizeArray(cons),
      tags: normalizeArray(tags),

      recommendFreelancer:
        Boolean(recommendFreelancer),

      wouldHireAgain:
        Boolean(wouldHireAgain),

      suspicious: Boolean(
        fraud?.suspicious
      ),

      fraudScore: Number(
        fraud?.fraudScore || 0
      ),

      fraudReason:
        fraud?.fraudReason || "",
    });

    /* ======================================================
       UPDATE REPUTATION
    ====================================================== */

    await refreshFreelancerReputation(
      proposal.freelancer._id
    );

    /* ======================================================
       ANALYTICS
    ====================================================== */

    const analytics =
      await generateReviewAnalytics(
        proposal.freelancer._id
      );

    return res.status(201).json({
      success: true,
      message:
        "Review submitted successfully.",
      review,
      analytics,
    });
  } catch (error) {
    console.error(
      "CREATE REVIEW ERROR:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "A review already exists for this project.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to create review.",
    });
  }
};

/* ==========================================================
   GET SINGLE REVIEW
========================================================== */

export const getReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    if (!isValidObjectId(reviewId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID.",
      });
    }

    const review = await Review.findOne({
      _id: reviewId,
      approved: true,
      hidden: false,
    })
      .populate(
        "client",
        "name profileImage"
      )
      .populate(
        "freelancer",
        "name profileImage"
      )
      .populate(
        "gig",
        "title category"
      );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    return res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    console.error(
      "GET REVIEW ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch review.",
    });
  }
};

/* ==========================================================
   GET PUBLIC REVIEWS
========================================================== */

export const getReviews = async (req, res) => {
  try {
    const {
      page,
      limit,
      skip,
    } = getPagination(req);

    const filter = {
      approved: true,
      hidden: false,
    };

    if (
      req.query.rating &&
      !Number.isNaN(
        Number(req.query.rating)
      )
    ) {
      filter.overallRating =
        Number(req.query.rating);
    }

    if (
      req.query.verified === "true"
    ) {
      filter.verified = true;
    }

    if (
      req.query.featured === "true"
    ) {
      filter.featured = true;
    }

    if (
      req.query.freelancer &&
      isValidObjectId(
        req.query.freelancer
      )
    ) {
      filter.freelancer =
        req.query.freelancer;
    }

    if (
      req.query.gig &&
      isValidObjectId(req.query.gig)
    ) {
      filter.gig = req.query.gig;
    }

    let sort = {
      createdAt: -1,
    };

    switch (req.query.sort) {
      case "highest":
        sort = {
          overallRating: -1,
          createdAt: -1,
        };
        break;

      case "lowest":
        sort = {
          overallRating: 1,
          createdAt: -1,
        };
        break;

      case "helpful":
        sort = {
          helpfulCount: -1,
          createdAt: -1,
        };
        break;

      case "featured":
        sort = {
          featured: -1,
          createdAt: -1,
        };
        break;
    }

    const [
      totalReviews,
      reviews,
    ] = await Promise.all([
      Review.countDocuments(filter),

      Review.find(filter)
        .populate(
          "client",
          "name profileImage"
        )
        .populate(
          "freelancer",
          "name profileImage"
        )
        .populate(
          "gig",
          "title category"
        )
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    return res.status(200).json({
      success: true,

      currentPage: page,

      limit,

      totalPages: Math.ceil(
        totalReviews / limit
      ),

      totalReviews,

      reviews,
    });
  } catch (error) {
    console.error(
      "GET REVIEWS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch reviews.",
    });
  }
};

/* ==========================================================
   GET GIG REVIEWS
========================================================== */

export const getGigReviews = async (
  req,
  res
) => {
  try {
    const { gigId } = req.params;

    if (!isValidObjectId(gigId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gig ID.",
      });
    }

    const {
      page,
      limit,
      skip,
    } = getPagination(req);

    const filter = {
      gig: gigId,
      approved: true,
      hidden: false,
    };

    const [
      totalReviews,
      reviews,
    ] = await Promise.all([
      Review.countDocuments(filter),

      Review.find(filter)
        .populate(
          "client",
          "name profileImage"
        )
        .populate(
          "freelancer",
          "name profileImage"
        )
        .sort({
          featured: -1,
          helpfulCount: -1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const ratingStats =
      await Review.aggregate([
        {
          $match: filter,
        },
        {
          $group: {
            _id: null,
            averageRating: {
              $avg: "$overallRating",
            },
            fiveStar: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      "$overallRating",
                      5,
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            fourStar: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      "$overallRating",
                      4,
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            threeStar: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      "$overallRating",
                      3,
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            twoStar: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      "$overallRating",
                      2,
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            oneStar: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      "$overallRating",
                      1,
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]);

    const stats =
      ratingStats[0] || {
        averageRating: 0,
        fiveStar: 0,
        fourStar: 0,
        threeStar: 0,
        twoStar: 0,
        oneStar: 0,
      };

    return res.status(200).json({
      success: true,

      gigId,

      currentPage: page,

      totalPages: Math.ceil(
        totalReviews / limit
      ),

      totalReviews,

      averageRating: Number(
        Number(
          stats.averageRating || 0
        ).toFixed(1)
      ),

      ratingDistribution: {
        fiveStar: stats.fiveStar,
        fourStar: stats.fourStar,
        threeStar: stats.threeStar,
        twoStar: stats.twoStar,
        oneStar: stats.oneStar,
      },

      reviews,
    });
  } catch (error) {
    console.error(
      "GET GIG REVIEWS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch gig reviews.",
    });
  }
};

/* ==========================================================
   GET FREELANCER REVIEWS
========================================================== */

export const getFreelancerReviews = async (
  req,
  res
) => {
  try {
    const {
      freelancerId,
    } = req.params;

    if (
      !isValidObjectId(freelancerId)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid freelancer ID.",
      });
    }

    const {
      page,
      limit,
      skip,
    } = getPagination(req);

    const filter = {
      freelancer: freelancerId,
      approved: true,
      hidden: false,
    };

    const [
      totalReviews,
      reviews,
      reputation,
    ] = await Promise.all([
      Review.countDocuments(filter),

      Review.find(filter)
        .populate(
          "client",
          "name profileImage"
        )
        .populate(
          "gig",
          "title category"
        )
        .sort({
          featured: -1,
          helpfulCount: -1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      Reputation.findOne({
        freelancer: freelancerId,
      }).lean(),
    ]);

    return res.status(200).json({
      success: true,

      freelancerId,

      currentPage: page,

      totalPages: Math.ceil(
        totalReviews / limit
      ),

      totalReviews,

      reputation,

      reviews,
    });
  } catch (error) {
    console.error(
      "GET FREELANCER REVIEWS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch freelancer reviews.",
    });
  }
};

/* ==========================================================
   GET MY REVIEWS
========================================================== */

export const getMyReviews = async (
  req,
  res
) => {
  try {
    const reviews =
      await Review.find({
        client: req.user._id,
      })
        .populate(
          "gig",
          "title category"
        )
        .populate(
          "freelancer",
          "name profileImage"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      totalReviews: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error(
      "GET MY REVIEWS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch your reviews.",
    });
  }
};

/* ==========================================================
   UPDATE REVIEW
========================================================== */

export const updateReview = async (
  req,
  res
) => {
  try {
    const { reviewId } = req.params;

    if (!isValidObjectId(reviewId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID.",
      });
    }

    const review =
      await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    if (
      !isSameUser(
        review.client,
        req.user._id
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only edit your own review.",
      });
    }

    const ratingFields = [
      "communication",
      "quality",
      "delivery",
      "professionalism",
      "valueForMoney",
    ];

    for (const field of ratingFields) {
      if (
        req.body[field] !== undefined &&
        !validateRating(
          req.body[field]
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            `${field} must be between 1 and 5.`,
        });
      }
    }

    if (
      req.body.title !== undefined
    ) {
      if (
        typeof req.body.title !==
          "string" ||
        !req.body.title.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Title cannot be empty.",
        });
      }

      review.title =
        req.body.title.trim();
    }

    if (
      req.body.comment !== undefined
    ) {
      if (
        typeof req.body.comment !==
          "string" ||
        !req.body.comment.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Comment cannot be empty.",
        });
      }

      review.comment =
        req.body.comment.trim();
    }

    ratingFields.forEach((field) => {
      if (
        req.body[field] !==
        undefined
      ) {
        review[field] =
          Number(req.body[field]);
      }
    });

    if (
      req.body.pros !== undefined
    ) {
      review.pros =
        normalizeArray(
          req.body.pros
        );
    }

    if (
      req.body.cons !== undefined
    ) {
      review.cons =
        normalizeArray(
          req.body.cons
        );
    }

    if (
      req.body.tags !== undefined
    ) {
      review.tags =
        normalizeArray(
          req.body.tags
        );
    }

    if (
      req.body.recommendFreelancer !==
      undefined
    ) {
      review.recommendFreelancer =
        Boolean(
          req.body.recommendFreelancer
        );
    }

    if (
      req.body.wouldHireAgain !==
      undefined
    ) {
      review.wouldHireAgain =
        Boolean(
          req.body.wouldHireAgain
        );
    }

    review.overallRating =
      calculateAverageRating({
        communication:
          review.communication,

        quality:
          review.quality,

        delivery:
          review.delivery,

        professionalism:
          review.professionalism,

        valueForMoney:
          review.valueForMoney,
      });

    /* Re-check fraud after editing */

    const fraud =
      await detectReviewFraud({
        client: review.client,
        freelancer: review.freelancer,
        proposal: review.proposal,
        payment: review.payment,

        overallRating:
          review.overallRating,

        communication:
          review.communication,

        quality:
          review.quality,

        delivery:
          review.delivery,

        professionalism:
          review.professionalism,

        valueForMoney:
          review.valueForMoney,

        comment: review.comment,
      });

    review.suspicious =
      Boolean(fraud?.suspicious);

    review.fraudScore =
      Number(fraud?.fraudScore || 0);

    review.fraudReason =
      fraud?.fraudReason || "";

    review.edited = true;
    review.editedAt = new Date();

    await review.save();

    await refreshFreelancerReputation(
      review.freelancer
    );

    const analytics =
      await generateReviewAnalytics(
        review.freelancer
      );

    return res.status(200).json({
      success: true,
      message:
        "Review updated successfully.",
      review,
      analytics,
    });
  } catch (error) {
    console.error(
      "UPDATE REVIEW ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update review.",
    });
  }
};

/* ==========================================================
   DELETE REVIEW
========================================================== */

export const deleteReview = async (
  req,
  res
) => {
  try {
    const { reviewId } = req.params;

    const review =
      await Review.findById(
        reviewId
      );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    if (
      !isSameUser(
        review.client,
        req.user._id
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only delete your own review.",
      });
    }

    const freelancer =
      review.freelancer;

    await review.deleteOne();

    await refreshFreelancerReputation(
      freelancer
    );

    return res.status(200).json({
      success: true,
      message:
        "Review deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE REVIEW ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete review.",
    });
  }
};

/* ==========================================================
   MARK HELPFUL
========================================================== */

export const markHelpful = async (
  req,
  res
) => {
  try {
    const { reviewId } = req.params;

    const review =
      await Review.findById(
        reviewId
      );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    const userId =
      req.user._id.toString();

    const alreadyHelpful =
      review.helpfulUsers.some(
        (id) =>
          id.toString() === userId
      );

    if (alreadyHelpful) {
      return res.status(400).json({
        success: false,
        message:
          "You already marked this review as helpful.",
      });
    }

    review.notHelpfulUsers =
      review.notHelpfulUsers.filter(
        (id) =>
          id.toString() !== userId
      );

    review.helpfulUsers.push(
      toObjectId(userId)
    );

    review.helpfulCount =
      review.helpfulUsers.length;

    review.notHelpfulCount =
      review.notHelpfulUsers.length;

    await review.save();

    return res.status(200).json({
      success: true,
      helpfulCount:
        review.helpfulCount,
      notHelpfulCount:
        review.notHelpfulCount,
    });
  } catch (error) {
    console.error(
      "MARK HELPFUL ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to mark review helpful.",
    });
  }
};

/* ==========================================================
   MARK NOT HELPFUL
========================================================== */

export const markNotHelpful = async (
  req,
  res
) => {
  try {
    const { reviewId } = req.params;

    const review =
      await Review.findById(
        reviewId
      );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    const userId =
      req.user._id.toString();

    const alreadyNotHelpful =
      review.notHelpfulUsers.some(
        (id) =>
          id.toString() === userId
      );

    if (alreadyNotHelpful) {
      return res.status(400).json({
        success: false,
        message:
          "You already marked this review as not helpful.",
      });
    }

    review.helpfulUsers =
      review.helpfulUsers.filter(
        (id) =>
          id.toString() !== userId
      );

    review.notHelpfulUsers.push(
      toObjectId(userId)
    );

    review.helpfulCount =
      review.helpfulUsers.length;

    review.notHelpfulCount =
      review.notHelpfulUsers.length;

    await review.save();

    return res.status(200).json({
      success: true,
      helpfulCount:
        review.helpfulCount,
      notHelpfulCount:
        review.notHelpfulCount,
    });
  } catch (error) {
    console.error(
      "MARK NOT HELPFUL ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update review vote.",
    });
  }
};

/* ==========================================================
   REPLY TO REVIEW
========================================================== */

export const replyReview = async (
  req,
  res
) => {
  try {
    const { reviewId } = req.params;

    const { message } = req.body;

    if (
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Reply message is required.",
      });
    }

    if (
      message.trim().length > 1000
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Reply cannot exceed 1000 characters.",
      });
    }

    const review =
      await Review.findById(
        reviewId
      );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    if (
      !isSameUser(
        review.freelancer,
        req.user._id
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only the freelancer can reply.",
      });
    }

    review.reply = {
      message: message.trim(),
      repliedBy: req.user._id,
      repliedAt: new Date(),
      edited: false,
    };

    await review.save();

    return res.status(200).json({
      success: true,
      message:
        "Reply added successfully.",
      review,
    });
  } catch (error) {
    console.error(
      "REPLY REVIEW ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to reply to review.",
    });
  }
};

/* ==========================================================
   REPORT REVIEW
========================================================== */

export const reportReview = async (
  req,
  res
) => {
  try {
    const { reviewId } = req.params;

    const {
      reason,
      description = "",
    } = req.body;

    if (
      !REVIEW_REASONS.includes(
        reason
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid report reason.",
      });
    }

    const review =
      await Review.findById(
        reviewId
      );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    const alreadyReported =
      review.reports.some(
        (report) =>
          isSameUser(
            report.reportedBy,
            req.user._id
          )
      );

    if (alreadyReported) {
      return res.status(409).json({
        success: false,
        message:
          "You have already reported this review.",
      });
    }

    review.reports.push({
      reportedBy: req.user._id,
      reason,
      description:
        String(description).trim(),
    });

    review.reportCount =
      review.reports.length;

    review.reported = true;

    if (
      review.reportCount >= 5
    ) {
      review.hidden = true;
    }

    await review.save();

    await refreshFreelancerReputation(
      review.freelancer
    );

    return res.status(200).json({
      success: true,
      message:
        "Review reported successfully.",
      reportCount:
        review.reportCount,
    });
  } catch (error) {
    console.error(
      "REPORT REVIEW ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to report review.",
    });
  }
};

/* ==========================================================
   ADMIN - APPROVE REVIEW
========================================================== */

export const approveReview = async (
  req,
  res
) => {
  try {
    const review =
      await Review.findById(
        req.params.reviewId
      );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    review.approved = true;
    review.hidden = false;

    await review.save();

    await refreshFreelancerReputation(
      review.freelancer
    );

    return res.status(200).json({
      success: true,
      message:
        "Review approved successfully.",
      review,
    });
  } catch (error) {
    console.error(
      "APPROVE REVIEW ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to approve review.",
    });
  }
};

/* ==========================================================
   ADMIN - REJECT REVIEW
========================================================== */

export const rejectReview = async (
  req,
  res
) => {
  try {
    const review =
      await Review.findById(
        req.params.reviewId
      );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    review.approved = false;
    review.hidden = true;

    await review.save();

    await refreshFreelancerReputation(
      review.freelancer
    );

    return res.status(200).json({
      success: true,
      message:
        "Review rejected successfully.",
      review,
    });
  } catch (error) {
    console.error(
      "REJECT REVIEW ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to reject review.",
    });
  }
};

/* ==========================================================
   ADMIN - FEATURE / UNFEATURE
========================================================== */

export const featureReview = async (
  req,
  res
) => {
  try {
    const review =
      await Review.findById(
        req.params.reviewId
      );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    review.featured =
      !review.featured;

    await review.save();

    return res.status(200).json({
      success: true,
      featured:
        review.featured,
      review,
    });
  } catch (error) {
    console.error(
      "FEATURE REVIEW ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to feature review.",
    });
  }
};

/* ==========================================================
   ADMIN - HIDE / UNHIDE
========================================================== */

export const hideReview = async (
  req,
  res
) => {
  try {
    const review =
      await Review.findById(
        req.params.reviewId
      );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    review.hidden =
      !review.hidden;

    await review.save();

    await refreshFreelancerReputation(
      review.freelancer
    );

    return res.status(200).json({
      success: true,
      hidden:
        review.hidden,
      review,
    });
  } catch (error) {
    console.error(
      "HIDE REVIEW ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update review visibility.",
    });
  }
};

/* ==========================================================
   GET REVIEW ANALYTICS
========================================================== */

export const getReviewAnalytics = async (
  req,
  res
) => {
  try {
    const {
      freelancerId,
    } = req.params;

    if (
      !isValidObjectId(
        freelancerId
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid freelancer ID.",
      });
    }

    const analytics =
      await generateReviewAnalytics(
        freelancerId
      );

    return res.status(200).json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error(
      "GET REVIEW ANALYTICS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch review analytics.",
    });
  }
};

/* ==========================================================
   GET REPUTATION
========================================================== */

export const getReputation = async (
  req,
  res
) => {
  try {
    const {
      freelancerId,
    } = req.params;

    if (
      !isValidObjectId(
        freelancerId
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid freelancer ID.",
      });
    }

    const reputation =
      await Reputation.findOne({
        freelancer: freelancerId,
      });

    if (!reputation) {
      return res.status(404).json({
        success: false,
        message:
          "Reputation not found.",
      });
    }

    return res.status(200).json({
      success: true,
      reputation,
    });
  } catch (error) {
    console.error(
      "GET REPUTATION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch reputation.",
    });
  }
};

/* ==========================================================
   ADMIN - GET ALL REVIEWS
========================================================== */

export const getAllReviews = async (
  req,
  res
) => {
  try {
    const {
      page,
      limit,
      skip,
    } = getPagination(req);

    const filter = {};

    if (
      req.query.approved !==
      undefined
    ) {
      filter.approved =
        req.query.approved ===
        "true";
    }

    if (
      req.query.hidden !==
      undefined
    ) {
      filter.hidden =
        req.query.hidden ===
        "true";
    }

    if (
      req.query.suspicious !==
      undefined
    ) {
      filter.suspicious =
        req.query.suspicious ===
        "true";
    }

    if (
      req.query.featured !==
      undefined
    ) {
      filter.featured =
        req.query.featured ===
        "true";
    }

    if (
      req.query.freelancer &&
      isValidObjectId(
        req.query.freelancer
      )
    ) {
      filter.freelancer =
        req.query.freelancer;
    }

    const [
      totalReviews,
      reviews,
    ] = await Promise.all([
      Review.countDocuments(filter),

      Review.find(filter)
        .populate(
          "client",
          "name email profileImage"
        )
        .populate(
          "freelancer",
          "name email profileImage"
        )
        .populate(
          "gig",
          "title category"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),
    ]);

    return res.status(200).json({
      success: true,

      currentPage: page,

      totalPages: Math.ceil(
        totalReviews / limit
      ),

      totalReviews,

      reviews,
    });
  } catch (error) {
    console.error(
      "ADMIN GET REVIEWS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch reviews.",
    });
  }
};

