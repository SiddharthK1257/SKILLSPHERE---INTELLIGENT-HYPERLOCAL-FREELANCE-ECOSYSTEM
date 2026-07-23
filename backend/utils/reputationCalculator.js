import Review from "../models/Review.js";
import Reputation from "../models/Reputation.js";
import Proposal from "../models/Proposal.js";

/* ==========================================================
   CONSTANTS
========================================================== */

const DEFAULT_RATING = 0;

/* ==========================================================
   SAFE NUMBER
========================================================== */

const safeNumber = (value, fallback = 0) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
};

/* ==========================================================
   ROUND
========================================================== */

const round = (value, decimals = 2) => {
  const number = safeNumber(value);

  return Number(number.toFixed(decimals));
};

/* ==========================================================
   AVERAGE
========================================================== */

const calculateAverage = (reviews, field) => {
  if (!reviews.length) return 0;

  const total = reviews.reduce(
    (sum, review) =>
      sum + safeNumber(review[field]),
    0
  );

  return total / reviews.length;
};

/* ==========================================================
   PERCENTAGE
========================================================== */

const calculatePercentage = (
  value,
  total
) => {
  if (!total || total <= 0) return 0;

  return (value / total) * 100;
};

/* ==========================================================
   BADGES
========================================================== */

const calculateBadges = ({
  reputationScore,
  weightedRating,
  totalReviews,
  completedProjects,
  trustScore,
  communication,
  delivery,
  recommendationRate,
}) => {
  const badges = [];

  if (reputationScore >= 98) {
    badges.push("Legend");
  }

  if (reputationScore >= 92) {
    badges.push("Premium");
  }

  if (
    weightedRating >= 4.9 &&
    totalReviews >= 50
  ) {
    badges.push("Top Rated");
  }

  if (completedProjects >= 100) {
    badges.push("Top Seller");
  }

  if (
    completedProjects >= 20 &&
    completedProjects < 100
  ) {
    badges.push("Rising Talent");
  }

  if (trustScore >= 95) {
    badges.push("Trusted");
  }

  if (communication >= 4.8) {
    badges.push("Excellent Communication");
  }

  if (delivery >= 4.8) {
    badges.push("Fast Delivery");
  }

  if (recommendationRate >= 95) {
    badges.push("Highly Recommended");
  }

  return badges;
};

/* ==========================================================
   LEVEL
========================================================== */

const calculateLevel = (score) => {
  if (score >= 95) return "Diamond";
  if (score >= 85) return "Platinum";
  if (score >= 70) return "Gold";
  if (score >= 55) return "Silver";
  if (score >= 35) return "Bronze";

  return "New";
};

/* ==========================================================
   EMPTY REPUTATION
========================================================== */

const createEmptyReputation = (
  freelancerId,
  completedProjects
) => {
  return {
    freelancer: freelancerId,

    reputationScore: 0,
    trustScore: 0,
    confidenceScore: 0,

    weightedRating: 0,
    averageRating: 0,

    totalReviews: 0,
    verifiedReviews: 0,

    completedProjects,

    recommendationRate: 0,
    hireAgainRate: 0,

    communication: 0,
    quality: 0,
    delivery: 0,
    professionalism: 0,
    valueForMoney: 0,

    helpfulVotes: 0,

    featuredReviews: 0,

    suspiciousReviews: 0,

    reports: 0,

    consistency: 0,

    ratingDistribution: {
      fiveStar: 0,
      fourStar: 0,
      threeStar: 0,
      twoStar: 0,
      oneStar: 0,
    },

    level: "New",

    badges: [],

    lastCalculated: new Date(),
  };
};

/* ==========================================================
   UPDATE REPUTATION
========================================================== */

export const updateReputation = async (
  freelancerId
) => {
  try {
    if (!freelancerId) {
      throw new Error(
        "Freelancer ID is required."
      );
    }

    /* ======================================================
       GET COMPLETED PROJECTS
    ====================================================== */

    const completedProjects =
      await Proposal.countDocuments({
        freelancer: freelancerId,
        status: "Completed",
      });

    /* ======================================================
       GET ALL APPROVED PUBLIC REVIEWS
    ====================================================== */

    const reviews =
      await Review.find({
        freelancer: freelancerId,
        approved: true,
        hidden: false,
      }).sort({
        createdAt: -1,
      });

    /* ======================================================
       NO REVIEWS
    ====================================================== */

    if (!reviews.length) {
      const emptyReputation =
        createEmptyReputation(
          freelancerId,
          completedProjects
        );

      return await Reputation.findOneAndUpdate(
        {
          freelancer: freelancerId,
        },
        emptyReputation,
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );
    }

    /* ======================================================
       SUSPICIOUS REVIEWS
    ====================================================== */

    const suspiciousReviews =
      reviews.filter(
        (review) => review.suspicious === true
      );

    /* ======================================================
       VALID REVIEWS
    ====================================================== */

    const validReviews =
      reviews.filter(
        (review) =>
          review.suspicious !== true
      );

    /* ======================================================
       ALL REVIEWS ARE SUSPICIOUS
    ====================================================== */

    if (!validReviews.length) {
      const reputationData = {
        freelancer: freelancerId,

        reputationScore: 0,
        trustScore: 0,
        confidenceScore: 0,

        weightedRating: 0,
        averageRating: 0,

        totalReviews: 0,
        verifiedReviews: 0,

        completedProjects,

        recommendationRate: 0,
        hireAgainRate: 0,

        communication: 0,
        quality: 0,
        delivery: 0,
        professionalism: 0,
        valueForMoney: 0,

        helpfulVotes: 0,

        featuredReviews: 0,

        suspiciousReviews:
          suspiciousReviews.length,

        reports: 0,

        consistency: 0,

        ratingDistribution: {
          fiveStar: 0,
          fourStar: 0,
          threeStar: 0,
          twoStar: 0,
          oneStar: 0,
        },

        level: "New",

        badges: [],

        lastCalculated: new Date(),
      };

      return await Reputation.findOneAndUpdate(
        {
          freelancer: freelancerId,
        },
        reputationData,
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );
    }

    /* ======================================================
       BASIC STATISTICS
    ====================================================== */

    const total =
      validReviews.length;

    const communication =
      calculateAverage(
        validReviews,
        "communication"
      );

    const quality =
      calculateAverage(
        validReviews,
        "quality"
      );

    const delivery =
      calculateAverage(
        validReviews,
        "delivery"
      );

    const professionalism =
      calculateAverage(
        validReviews,
        "professionalism"
      );

    const valueForMoney =
      calculateAverage(
        validReviews,
        "valueForMoney"
      );

    const averageRating =
      calculateAverage(
        validReviews,
        "overallRating"
      );

    /* ======================================================
       VERIFIED REVIEWS
    ====================================================== */

    const verifiedReviews =
      validReviews.filter(
        (review) =>
          review.verified === true
      ).length;

    /* ======================================================
       RECOMMENDATION
    ====================================================== */

    const recommendCount =
      validReviews.filter(
        (review) =>
          review.recommendFreelancer === true
      ).length;

    const hireAgainCount =
      validReviews.filter(
        (review) =>
          review.wouldHireAgain === true
      ).length;

    const recommendationRate =
      calculatePercentage(
        recommendCount,
        total
      );

    const hireAgainRate =
      calculatePercentage(
        hireAgainCount,
        total
      );

    /* ======================================================
       HELPFUL VOTES
    ====================================================== */

    const helpfulVotes =
      validReviews.reduce(
        (sum, review) =>
          sum +
          safeNumber(
            review.helpfulCount
          ),
        0
      );

    /* ======================================================
       REPORTS
    ====================================================== */

    const reports =
      validReviews.reduce(
        (sum, review) =>
          sum +
          safeNumber(
            review.reportCount
          ),
        0
      );

    /* ======================================================
       FEATURED REVIEWS
    ====================================================== */

    const featuredReviews =
      validReviews.filter(
        (review) =>
          review.featured === true
      ).length;

    /* ======================================================
       RATING DISTRIBUTION
    ====================================================== */

    const ratingDistribution = {
      fiveStar:
        validReviews.filter(
          (review) =>
            safeNumber(
              review.overallRating
            ) >= 4.5
        ).length,

      fourStar:
        validReviews.filter(
          (review) => {
            const rating =
              safeNumber(
                review.overallRating
              );

            return (
              rating >= 3.5 &&
              rating < 4.5
            );
          }
        ).length,

      threeStar:
        validReviews.filter(
          (review) => {
            const rating =
              safeNumber(
                review.overallRating
              );

            return (
              rating >= 2.5 &&
              rating < 3.5
            );
          }
        ).length,

      twoStar:
        validReviews.filter(
          (review) => {
            const rating =
              safeNumber(
                review.overallRating
              );

            return (
              rating >= 1.5 &&
              rating < 2.5
            );
          }
        ).length,

      oneStar:
        validReviews.filter(
          (review) =>
            safeNumber(
              review.overallRating
            ) < 1.5
        ).length,
    };

    /* ======================================================
       WEIGHTED RATING
    ====================================================== */

    const weightedRating =
      averageRating * 0.65 +
      communication * 0.08 +
      quality * 0.10 +
      delivery * 0.07 +
      professionalism * 0.05 +
      valueForMoney * 0.05;

    /* ======================================================
       TRUST SCORE
    ====================================================== */

    let trustScore = 0;

    trustScore +=
      calculatePercentage(
        verifiedReviews,
        total
      ) * 0.35;

    trustScore +=
      recommendationRate * 0.25;

    trustScore +=
      hireAgainRate * 0.20;

    const reportPenalty =
      Math.min(
        20,
        reports * 2
      );

    const suspiciousPenalty =
      Math.min(
        20,
        suspiciousReviews.length * 2
      );

    trustScore +=
      Math.max(
        0,
        20 -
          reportPenalty -
          suspiciousPenalty
      );

    trustScore =
      Math.max(
        0,
        Math.min(
          100,
          trustScore
        )
      );

    /* ======================================================
       CONFIDENCE SCORE
    ====================================================== */

    const confidenceScore =
      Math.min(
        100,
        total * 2
      );

    /* ======================================================
       CONSISTENCY
    ====================================================== */

    const consistency =
      Math.min(
        100,
        weightedRating * 20
      );

    /* ======================================================
       REPUTATION SCORE
    ====================================================== */

    let reputationScore = 0;

    reputationScore +=
      weightedRating * 15;

    reputationScore +=
      trustScore * 0.35;

    reputationScore +=
      recommendationRate * 0.15;

    reputationScore +=
      hireAgainRate * 0.10;

    reputationScore +=
      confidenceScore * 0.10;

    reputationScore +=
      consistency * 0.15;

    reputationScore -=
      suspiciousReviews.length * 2;

    reputationScore =
      Math.max(
        0,
        Math.min(
          100,
          reputationScore
        )
      );

    /* ======================================================
       BADGES
    ====================================================== */

    const badges =
      calculateBadges({
        reputationScore,
        weightedRating,
        totalReviews: total,
        completedProjects,
        trustScore,
        communication,
        delivery,
        recommendationRate,
      });

    /* ======================================================
       LEVEL
    ====================================================== */

    const level =
      calculateLevel(
        reputationScore
      );

    /* ======================================================
       FINAL REPUTATION
    ====================================================== */

    const reputationData = {
      freelancer: freelancerId,

      reputationScore:
        round(reputationScore),

      trustScore:
        round(trustScore),

      confidenceScore:
        round(confidenceScore),

      weightedRating:
        round(weightedRating),

      averageRating:
        round(averageRating),

      totalReviews: total,

      verifiedReviews,

      completedProjects,

      recommendationRate:
        round(recommendationRate),

      hireAgainRate:
        round(hireAgainRate),

      communication:
        round(communication),

      quality:
        round(quality),

      delivery:
        round(delivery),

      professionalism:
        round(professionalism),

      valueForMoney:
        round(valueForMoney),

      helpfulVotes,

      featuredReviews,

      suspiciousReviews:
        suspiciousReviews.length,

      reports,

      consistency:
        round(consistency),

      ratingDistribution,

      level,

      badges,

      lastCalculated: new Date(),
    };

    /* ======================================================
       SAVE REPUTATION
    ====================================================== */

    const reputation =
      await Reputation.findOneAndUpdate(
        {
          freelancer: freelancerId,
        },
        reputationData,
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

    return reputation;
  } catch (error) {
    console.error(
      "Reputation Calculator Error:",
      error
    );

    throw error;
  }
};