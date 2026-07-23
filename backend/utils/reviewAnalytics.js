import Review from "../models/Review.js";

/* ==========================================================
   STOP WORDS
========================================================== */

const STOP_WORDS = new Set([
  "the",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "am",
  "do",
  "does",
  "did",
  "done",
  "have",
  "has",
  "had",

  "a",
  "an",
  "and",
  "or",
  "but",
  "for",
  "to",
  "of",
  "in",
  "on",
  "at",
  "with",
  "by",
  "from",
  "as",

  "it",
  "this",
  "that",
  "these",
  "those",

  "my",
  "your",
  "our",
  "their",
  "his",
  "her",
  "its",

  "i",
  "you",
  "he",
  "she",
  "they",
  "we",
  "me",
  "him",
  "them",

  "very",
  "really",
  "quite",
  "just",

  "good",
  "great",
  "nice",
  "awesome",
  "excellent",
  "amazing",

  "work",
  "job",
  "service",
  "freelancer",
  "project",
  "skillsphere",
]);

/* ==========================================================
   POSITIVE WORDS
========================================================== */

const POSITIVE_WORDS = new Set([
  "excellent",
  "awesome",
  "perfect",
  "professional",
  "creative",
  "fast",
  "quick",
  "friendly",
  "recommended",
  "recommend",
  "trustworthy",
  "helpful",
  "amazing",
  "fantastic",
  "best",
  "brilliant",
  "great",
  "responsive",
  "polite",
  "quality",
  "outstanding",
  "efficient",
  "smooth",
  "clean",
  "happy",
  "satisfied",
  "reliable",
  "talented",
  "skilled",
  "easy",
  "clear",
  "excellent",
  "love",
  "liked",
  "impressive",
]);

/* ==========================================================
   NEGATIVE WORDS
========================================================== */

const NEGATIVE_WORDS = new Set([
  "bad",
  "poor",
  "slow",
  "late",
  "worst",
  "terrible",
  "awful",
  "fake",
  "spam",
  "scam",
  "rude",
  "delay",
  "delayed",
  "broken",
  "problem",
  "issue",
  "refund",
  "cancel",
  "cancelled",
  "unprofessional",
  "disappointed",
  "disappointing",
  "low",
  "weak",
  "hard",
  "expensive",
  "difficult",
  "unhappy",
  "unreliable",
  "mistake",
  "mistakes",
  "poorly",
]);

/* ==========================================================
   SAFE NUMBER
========================================================== */

const safeNumber = (
  value,
  fallback = 0
) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
};

/* ==========================================================
   ROUND
========================================================== */

const round = (
  value,
  decimals = 2
) => {
  return Number(
    safeNumber(value).toFixed(decimals)
  );
};

/* ==========================================================
   AVERAGE
========================================================== */

const average = (
  reviews,
  field
) => {
  if (!reviews.length) return 0;

  const total = reviews.reduce(
    (sum, review) =>
      sum +
      safeNumber(review[field]),
    0
  );

  return total / reviews.length;
};

/* ==========================================================
   PERCENTAGE
========================================================== */

const percentage = (
  count,
  total
) => {
  if (!total) return 0;

  return (
    (count / total) *
    100
  );
};

/* ==========================================================
   EMPTY ANALYTICS
========================================================== */

const getEmptyAnalytics = () => {
  return {
    totalReviews: 0,

    averageRating: 0,

    recommendationRate: 0,

    hireAgainRate: 0,

    communicationAverage: 0,

    qualityAverage: 0,

    deliveryAverage: 0,

    professionalismAverage: 0,

    valueForMoneyAverage: 0,

    helpfulVotes: 0,

    reports: 0,

    suspiciousReviews: 0,

    positiveReviews: 0,

    negativeReviews: 0,

    neutralReviews: 0,

    verifiedReviews: 0,

    unverifiedReviews: 0,

    ratingDistribution: {
      fiveStar: 0,
      fourStar: 0,
      threeStar: 0,
      twoStar: 0,
      oneStar: 0,
    },

    categoryRatings: {
      communication: 0,
      quality: 0,
      delivery: 0,
      professionalism: 0,
      valueForMoney: 0,
    },

    monthlyReviews: [],

    yearlyReviews: [],

    ratingTrend: [],

    topKeywords: [],

    recentReviews: [],
  };
};

/* ==========================================================
   GET SENTIMENT
========================================================== */

const analyzeSentiment = (
  comment
) => {
  const text = String(
    comment || ""
  ).toLowerCase();

  const words = text
    .replace(
      /[^a-zA-Z0-9\s]/g,
      " "
    )
    .split(/\s+/)
    .filter(Boolean);

  let positive = 0;
  let negative = 0;

  words.forEach((word) => {
    if (
      POSITIVE_WORDS.has(word)
    ) {
      positive++;
    }

    if (
      NEGATIVE_WORDS.has(word)
    ) {
      negative++;
    }
  });

  if (positive > negative) {
    return "positive";
  }

  if (negative > positive) {
    return "negative";
  }

  return "neutral";
};

/* ==========================================================
   RATING DISTRIBUTION
========================================================== */

const calculateRatingDistribution = (
  reviews
) => {
  return {
    fiveStar: reviews.filter(
      (review) =>
        safeNumber(
          review.overallRating
        ) >= 4.5
    ).length,

    fourStar: reviews.filter(
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

    threeStar: reviews.filter(
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

    twoStar: reviews.filter(
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

    oneStar: reviews.filter(
      (review) =>
        safeNumber(
          review.overallRating
        ) < 1.5
    ).length,
  };
};

/* ==========================================================
   MONTHLY ANALYTICS
========================================================== */

const generateMonthlyAnalytics = (
  reviews
) => {
  const monthlyMap = {};

  reviews.forEach((review) => {
    const date = new Date(
      review.createdAt
    );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return;
    }

    const month =
      `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

    if (!monthlyMap[month]) {
      monthlyMap[month] = {
        month,

        reviews: 0,

        totalRating: 0,

        positiveReviews: 0,

        negativeReviews: 0,

        neutralReviews: 0,
      };
    }

    const rating =
      safeNumber(
        review.overallRating
      );

    monthlyMap[month].reviews++;

    monthlyMap[month].totalRating +=
      rating;

    const sentiment =
      analyzeSentiment(
        review.comment
      );

    if (
      sentiment === "positive"
    ) {
      monthlyMap[
        month
      ].positiveReviews++;
    }

    if (
      sentiment === "negative"
    ) {
      monthlyMap[
        month
      ].negativeReviews++;
    }

    if (
      sentiment === "neutral"
    ) {
      monthlyMap[
        month
      ].neutralReviews++;
    }
  });

  return Object.values(
    monthlyMap
  )
    .sort((a, b) =>
      a.month.localeCompare(
        b.month
      )
    )
    .map((month) => ({
      month: month.month,

      reviews: month.reviews,

      averageRating: round(
        month.totalRating /
          month.reviews
      ),

      positiveReviews:
        month.positiveReviews,

      negativeReviews:
        month.negativeReviews,

      neutralReviews:
        month.neutralReviews,
    }));
};

/* ==========================================================
   YEARLY ANALYTICS
========================================================== */

const generateYearlyAnalytics = (
  reviews
) => {
  const yearlyMap = {};

  reviews.forEach((review) => {
    const date = new Date(
      review.createdAt
    );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return;
    }

    const year =
      date.getFullYear();

    if (!yearlyMap[year]) {
      yearlyMap[year] = {
        year,

        reviews: 0,

        totalRating: 0,
      };
    }

    yearlyMap[year].reviews++;

    yearlyMap[year].totalRating +=
      safeNumber(
        review.overallRating
      );
  });

  return Object.values(
    yearlyMap
  )
    .sort(
      (a, b) =>
        a.year - b.year
    )
    .map((year) => ({
      year: year.year,

      reviews: year.reviews,

      averageRating: round(
        year.totalRating /
          year.reviews
      ),
    }));
};

/* ==========================================================
   KEYWORDS
========================================================== */

const generateTopKeywords = (
  reviews
) => {
  const keywordMap = {};

  reviews.forEach((review) => {
    const text = String(
      review.comment || ""
    ).toLowerCase();

    const words = text
      .replace(
        /[^a-zA-Z0-9\s]/g,
        " "
      )
      .split(/\s+/)
      .filter(Boolean);

    words.forEach((word) => {
      if (
        word.length < 4 ||
        STOP_WORDS.has(word) ||
        /^\d+$/.test(word)
      ) {
        return;
      }

      keywordMap[word] =
        (keywordMap[word] || 0) + 1;
    });
  });

  return Object.entries(
    keywordMap
  )
    .sort(
      (a, b) => b[1] - a[1]
    )
    .slice(0, 20)
    .map(
      ([word, count]) => ({
        word,
        count,
      })
    );
};

/* ==========================================================
   RECENT REVIEWS
========================================================== */

const generateRecentReviews = (
  reviews
) => {
  return reviews
    .slice(-5)
    .reverse()
    .map((review) => ({
      _id: review._id,

      title: review.title,

      comment: review.comment,

      rating:
        safeNumber(
          review.overallRating
        ),

      client: review.client,

      createdAt:
        review.createdAt,

      verified:
        review.verified === true,

      featured:
        review.featured === true,

      helpfulCount:
        safeNumber(
          review.helpfulCount
        ),
    }));
};

/* ==========================================================
   REVIEW ANALYTICS
========================================================== */

export const generateReviewAnalytics =
  async (freelancerId) => {
    try {
      if (!freelancerId) {
        throw new Error(
          "Freelancer ID is required."
        );
      }

      /* ====================================================
         GET PUBLIC REVIEWS
      ==================================================== */

      const reviews =
        await Review.find({
          freelancer:
            freelancerId,

          approved: true,

          hidden: false,
        })
          .sort({
            createdAt: 1,
          })
          .lean();

      /* ====================================================
         NO REVIEWS
      ==================================================== */

      if (!reviews.length) {
        return getEmptyAnalytics();
      }

      /* ====================================================
         SUSPICIOUS REVIEWS
      ==================================================== */

      const suspiciousReviews =
        reviews.filter(
          (review) =>
            review.suspicious === true
        );

      /* ====================================================
         VALID REVIEWS
      ==================================================== */

      const validReviews =
        reviews.filter(
          (review) =>
            review.suspicious !== true
        );

      /*
       * We use valid reviews for
       * ratings and reputation analytics.
       */

      const totalReviews =
        validReviews.length;

      /* ====================================================
         ALL REVIEWS SUSPICIOUS
      ==================================================== */

      if (!validReviews.length) {
        return {
          ...getEmptyAnalytics(),

          suspiciousReviews:
            suspiciousReviews.length,
        };
      }

      /* ====================================================
         BASIC AVERAGES
      ==================================================== */

      const averageRating =
        average(
          validReviews,
          "overallRating"
        );

      const communicationAverage =
        average(
          validReviews,
          "communication"
        );

      const qualityAverage =
        average(
          validReviews,
          "quality"
        );

      const deliveryAverage =
        average(
          validReviews,
          "delivery"
        );

      const professionalismAverage =
        average(
          validReviews,
          "professionalism"
        );

      const valueForMoneyAverage =
        average(
          validReviews,
          "valueForMoney"
        );

      /* ====================================================
         RECOMMENDATION
      ==================================================== */

      const recommendationCount =
        validReviews.filter(
          (review) =>
            review.recommendFreelancer ===
            true
        ).length;

      const hireAgainCount =
        validReviews.filter(
          (review) =>
            review.wouldHireAgain ===
            true
        ).length;

      const recommendationRate =
        percentage(
          recommendationCount,
          totalReviews
        );

      const hireAgainRate =
        percentage(
          hireAgainCount,
          totalReviews
        );

      /* ====================================================
         HELPFUL VOTES
      ==================================================== */

      const helpfulVotes =
        validReviews.reduce(
          (sum, review) =>
            sum +
            safeNumber(
              review.helpfulCount
            ),
          0
        );

      /* ====================================================
         REPORTS
      ==================================================== */

      const reports =
        validReviews.reduce(
          (sum, review) =>
            sum +
            safeNumber(
              review.reportCount
            ),
          0
        );

      /* ====================================================
         SENTIMENT
      ==================================================== */

      let positiveReviews = 0;

      let negativeReviews = 0;

      let neutralReviews = 0;

      validReviews.forEach(
        (review) => {
          const sentiment =
            analyzeSentiment(
              review.comment
            );

          if (
            sentiment === "positive"
          ) {
            positiveReviews++;
          }

          if (
            sentiment === "negative"
          ) {
            negativeReviews++;
          }

          if (
            sentiment === "neutral"
          ) {
            neutralReviews++;
          }
        }
      );

      /* ====================================================
         RATING DISTRIBUTION
      ==================================================== */

      const ratingDistribution =
        calculateRatingDistribution(
          validReviews
        );

      /* ====================================================
         VERIFIED REVIEWS
      ==================================================== */

      const verifiedReviews =
        validReviews.filter(
          (review) =>
            review.verified === true
        ).length;

      const unverifiedReviews =
        totalReviews -
        verifiedReviews;

      /* ====================================================
         MONTHLY ANALYTICS
      ==================================================== */

      const monthlyReviews =
        generateMonthlyAnalytics(
          validReviews
        );

      /* ====================================================
         YEARLY ANALYTICS
      ==================================================== */

      const yearlyReviews =
        generateYearlyAnalytics(
          validReviews
        );

      /* ====================================================
         RATING TREND
      ==================================================== */

      const ratingTrend =
        monthlyReviews.map(
          (month) => ({
            month:
              month.month,

            rating:
              month.averageRating,

            reviews:
              month.reviews,
          })
        );

      /* ====================================================
         TOP KEYWORDS
      ==================================================== */

      const topKeywords =
        generateTopKeywords(
          validReviews
        );

      /* ====================================================
         RECENT REVIEWS
      ==================================================== */

      const recentReviews =
        generateRecentReviews(
          validReviews
        );

      /* ====================================================
         CATEGORY RATINGS
      ==================================================== */

      const categoryRatings = {
        communication:
          round(
            communicationAverage
          ),

        quality:
          round(
            qualityAverage
          ),

        delivery:
          round(
            deliveryAverage
          ),

        professionalism:
          round(
            professionalismAverage
          ),

        valueForMoney:
          round(
            valueForMoneyAverage
          ),
      };

      /* ====================================================
         RETURN
      ==================================================== */

      return {
        totalReviews,

        totalSubmittedReviews:
          reviews.length,

        averageRating:
          round(
            averageRating
          ),

        recommendationRate:
          round(
            recommendationRate
          ),

        hireAgainRate:
          round(
            hireAgainRate
          ),

        communicationAverage:
          round(
            communicationAverage
          ),

        qualityAverage:
          round(
            qualityAverage
          ),

        deliveryAverage:
          round(
            deliveryAverage
          ),

        professionalismAverage:
          round(
            professionalismAverage
          ),

        valueForMoneyAverage:
          round(
            valueForMoneyAverage
          ),

        helpfulVotes,

        reports,

        suspiciousReviews:
          suspiciousReviews.length,

        positiveReviews,

        negativeReviews,

        neutralReviews,

        verifiedReviews,

        unverifiedReviews,

        ratingDistribution,

        categoryRatings,

        monthlyReviews,

        yearlyReviews,

        ratingTrend,

        topKeywords,

        recentReviews,
      };
    } catch (error) {
      console.error(
        "Review Analytics Error:",
        error
      );

      throw error;
    }
  };