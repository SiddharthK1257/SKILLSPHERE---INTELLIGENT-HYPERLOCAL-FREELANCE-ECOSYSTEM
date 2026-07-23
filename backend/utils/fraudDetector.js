import Review from "../models/Review.js";
import Payment from "../models/Payment.js";
import User from "../models/User.js";

/* ==========================================================
   CONFIGURATION
========================================================== */

const FRAUD_THRESHOLD = 40;

const SETTINGS = {
  duplicateReview: 100,
  duplicatePayment: 100,

  multipleReviews: 25,
  identicalRatings: 15,

  shortReview: 15,
  longReview: 10,

  excessivePunctuation: 10,
  excessiveCaps: 10,

  repeatedWords: 20,
  repeatedCharacters: 20,

  externalLinks: 30,

  reviewTooFast: 20,
  newAccount: 20,
  manyReviewsToday: 20,
};

/* ==========================================================
   HELPERS
========================================================== */

const safeText = (value) => {
  if (typeof value !== "string") return "";

  return value.trim();
};

/* ==========================================================
   EXTERNAL LINK DETECTION
========================================================== */

const hasExternalLink = (text = "") => {
  return /(https?:\/\/|www\.|[a-z0-9-]+\.(com|net|org|io|xyz|co|in))/i.test(
    text
  );
};

/* ==========================================================
   REPEATED CHARACTERS
========================================================== */

const hasRepeatedCharacters = (text = "") => {
  return /(.)\1{6,}/i.test(text);
};

/* ==========================================================
   REPEATED WORD PERCENTAGE
========================================================== */

const repeatedWordPercentage = (text = "") => {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);

  if (words.length < 5) {
    return 0;
  }

  const wordCount = {};

  words.forEach((word) => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  const repeatedWords = Object.values(wordCount)
    .filter((count) => count > 1)
    .reduce((sum, count) => sum + count, 0);

  return repeatedWords / words.length;
};

/* ==========================================================
   PUNCTUATION
========================================================== */

const punctuationCount = (text = "") => {
  return (text.match(/[!?]/g) || []).length;
};

/* ==========================================================
   CAPITAL LETTER PERCENTAGE
========================================================== */

const capitalPercentage = (text = "") => {
  const letters = text.match(/[a-zA-Z]/g) || [];

  if (!letters.length) {
    return 0;
  }

  const capitals = text.match(/[A-Z]/g) || [];

  return capitals.length / letters.length;
};

/* ==========================================================
   SAFE DATE
========================================================== */

const getValidDate = (date) => {
  if (!date) return null;

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
};

/* ==========================================================
   MAIN FRAUD DETECTOR
========================================================== */

export const detectReviewFraud = async ({
  client,
  freelancer,
  proposal,
  payment,

  overallRating,
  communication,
  quality,
  delivery,
  professionalism,
  valueForMoney,

  comment = "",
}) => {
  try {
    let fraudScore = 0;

    const reasons = [];

    const reviewComment = safeText(comment);

    /* ======================================================
       VALIDATION
    ====================================================== */

    if (!client || !freelancer || !proposal || !payment) {
      return {
        suspicious: true,
        fraudScore: 100,
        fraudReasons: [
          "Missing required fraud detection references.",
        ],
        fraudReason:
          "Missing required fraud detection references.",
      };
    }

    /* ======================================================
       1. DUPLICATE PROPOSAL REVIEW
    ====================================================== */

    const duplicateProposalReview =
      await Review.exists({
        proposal,
      });

    if (duplicateProposalReview) {
      fraudScore += SETTINGS.duplicateReview;

      reasons.push(
        "A review already exists for this proposal."
      );
    }

    /* ======================================================
       2. DUPLICATE PAYMENT REVIEW
    ====================================================== */

    const duplicatePaymentReview =
      await Review.exists({
        payment,
      });

    if (duplicatePaymentReview) {
      fraudScore += SETTINGS.duplicatePayment;

      reasons.push(
        "A review already exists for this payment."
      );
    }

    /* ======================================================
       3. MULTIPLE REVIEWS FOR SAME FREELANCER
    ====================================================== */

    const previousReviews =
      await Review.countDocuments({
        client,
        freelancer,
      });

    if (previousReviews >= 5) {
      fraudScore += SETTINGS.multipleReviews;

      reasons.push(
        "Client has submitted an unusually high number of reviews for this freelancer."
      );
    }

    /* ======================================================
       4. IDENTICAL RATINGS
    ====================================================== */

    const ratings = [
      Number(overallRating),
      Number(communication),
      Number(quality),
      Number(delivery),
      Number(professionalism),
      Number(valueForMoney),
    ];

    const validRatings = ratings.filter(
      (rating) => Number.isFinite(rating)
    );

    if (
      validRatings.length === 6 &&
      new Set(validRatings).size === 1
    ) {
      fraudScore += SETTINGS.identicalRatings;

      reasons.push(
        "All rating categories have exactly the same rating."
      );
    }

    /* ======================================================
       5. VERY SHORT REVIEW
    ====================================================== */

    if (
      reviewComment.length > 0 &&
      reviewComment.length < 20
    ) {
      fraudScore += SETTINGS.shortReview;

      reasons.push(
        "Review comment is unusually short."
      );
    }

    /* ======================================================
       6. UNUSUALLY LONG REVIEW
    ====================================================== */

    if (reviewComment.length > 2500) {
      fraudScore += SETTINGS.longReview;

      reasons.push(
        "Review comment is unusually long."
      );
    }

    /* ======================================================
       7. EXCESSIVE PUNCTUATION
    ====================================================== */

    if (
      punctuationCount(reviewComment) > 20
    ) {
      fraudScore +=
        SETTINGS.excessivePunctuation;

      reasons.push(
        "Review contains excessive punctuation."
      );
    }

    /* ======================================================
       8. EXCESSIVE CAPITALIZATION
    ====================================================== */

    if (
      reviewComment.length >= 10 &&
      capitalPercentage(reviewComment) > 0.6
    ) {
      fraudScore += SETTINGS.excessiveCaps;

      reasons.push(
        "Review contains excessive capitalization."
      );
    }

    /* ======================================================
       9. REPEATED WORDS
    ====================================================== */

    if (
      repeatedWordPercentage(reviewComment) > 0.5
    ) {
      fraudScore += SETTINGS.repeatedWords;

      reasons.push(
        "Review contains excessive repeated words."
      );
    }

    /* ======================================================
       10. REPEATED CHARACTERS
    ====================================================== */

    if (
      hasRepeatedCharacters(reviewComment)
    ) {
      fraudScore +=
        SETTINGS.repeatedCharacters;

      reasons.push(
        "Review contains suspicious repeated characters."
      );
    }

    /* ======================================================
       11. EXTERNAL LINKS
    ====================================================== */

    if (
      hasExternalLink(reviewComment)
    ) {
      fraudScore += SETTINGS.externalLinks;

      reasons.push(
        "Review contains an external link."
      );
    }

    /* ======================================================
       12. PAYMENT TIMING
    ====================================================== */

    const paymentDoc =
      await Payment.findById(payment).select(
        "paidAt createdAt paymentStatus"
      );

    if (paymentDoc) {
      const paymentDate =
        getValidDate(paymentDoc.paidAt) ||
        getValidDate(paymentDoc.createdAt);

      if (paymentDate) {
        const minutesSincePayment =
          (Date.now() -
            paymentDate.getTime()) /
          (1000 * 60);

        if (
          minutesSincePayment >= 0 &&
          minutesSincePayment < 2
        ) {
          fraudScore +=
            SETTINGS.reviewTooFast;

          reasons.push(
            "Review was submitted immediately after payment."
          );
        }
      }
    }

    /* ======================================================
       13. NEW CLIENT ACCOUNT
    ====================================================== */

    const clientUser =
      await User.findById(client).select(
        "createdAt"
      );

    if (clientUser) {
      const accountCreatedAt =
        getValidDate(
          clientUser.createdAt
        );

      if (accountCreatedAt) {
        const accountAgeDays =
          (Date.now() -
            accountCreatedAt.getTime()) /
          (1000 * 60 * 60 * 24);

        if (
          accountAgeDays >= 0 &&
          accountAgeDays < 7
        ) {
          fraudScore += SETTINGS.newAccount;

          reasons.push(
            "Client account is less than seven days old."
          );
        }
      }
    }

    /* ======================================================
       14. TOO MANY REVIEWS IN ONE DAY
    ====================================================== */

    const startOfToday = new Date();

    startOfToday.setHours(
      0,
      0,
      0,
      0
    );

    const reviewsToday =
      await Review.countDocuments({
        client,
        createdAt: {
          $gte: startOfToday,
        },
      });

    if (reviewsToday >= 5) {
      fraudScore +=
        SETTINGS.manyReviewsToday;

      reasons.push(
        "Client has submitted too many reviews today."
      );
    }

    /* ======================================================
       FINAL SCORE
    ====================================================== */

    fraudScore = Math.min(
      100,
      Math.max(
        0,
        Math.round(fraudScore)
      )
    );

    const suspicious =
      fraudScore >= FRAUD_THRESHOLD;

    return {
      suspicious,

      fraudScore,

      fraudReasons: reasons,

      fraudReason:
        reasons.length > 0
          ? reasons.join(", ")
          : "No suspicious activity detected.",
    };
  } catch (error) {
    console.error(
      "Review Fraud Detection Error:",
      error
    );

    /*
     * Important:
     * Do not crash review creation if fraud
     * detection has a database or unexpected error.
     */

    return {
      suspicious: false,

      fraudScore: 0,

      fraudReasons: [
        "Fraud detection temporarily unavailable.",
      ],

      fraudReason:
        "Fraud detection temporarily unavailable.",
    };
  }
};