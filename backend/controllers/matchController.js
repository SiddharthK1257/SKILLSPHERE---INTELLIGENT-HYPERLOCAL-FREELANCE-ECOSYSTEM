import User from "../models/User.js";
import Gig from "../models/Gig.js";
import calculateMatch from "../utils/aiMatcher.js";
import semanticMatcher from "../utils/semanticMatcher.js";

const sanitizeGig = (gig) => {
  if (!gig) return null;
  const g = typeof gig.toObject === "function" ? gig.toObject({ virtuals: true }) : gig;

  if (!g.basicPackage) {
    g.basicPackage = {
      name: "Basic",
      description: "Basic Package Description",
      price: g.price || 0,
      deliveryTime: g.deliveryTime || 0,
      features: [],
    };
  }
  if (!g.basicPackage.features) {
    g.basicPackage.features = [];
  }
  if (!g.standardPackage) g.standardPackage = null;
  if (!g.premiumPackage) g.premiumPackage = null;
  if (!g.skills) g.skills = [];
  if (!g.gallery) g.gallery = [];
  if (!g.requirements) g.requirements = [];
  if (!g.faqs) g.faqs = [];
  if (!g.coverImage) g.coverImage = g.image || "";

  return g;
};

/*
====================================================
Get AI Recommendations
GET /api/match/:userId
====================================================
*/
export const getAIRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;

    // -----------------------------
    // Find User
    // -----------------------------
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // -----------------------------
    // Get Active Gigs
    // -----------------------------
    const gigs = await Gig.find({ isActive: true }).populate(
      "freelancer",
      `
      name
      email
      profileImage
      headline
      bio
      location
      website
      github
      linkedin
      portfolio
      skills
      experience
      education
      jobTitle
      preferredJob
      profileScore
      rating
      reviews
      completedProjects
      totalProjects
      `
    );

    // -----------------------------
    // AI Matching
    // -----------------------------
    const recommendations = await Promise.all(
  gigs.map(async (gig) => {

    // -------------------------
    // Rule Based Matching
    // -------------------------
    const ruleMatch = calculateMatch(user, gig);

    // -------------------------
    // Semantic AI Matching
    // -------------------------
    const userProfile = `
      ${user.jobTitle || ""}
      ${user.preferredJob || ""}
      ${(user.skills || []).map(s => typeof s === "object" ? s.name : s).join(" ")}
      ${(user.languages || []).map(l => typeof l === "object" ? l.language : l).join(" ")}
      ${(user.certifications || []).map(c => typeof c === "object" ? c.name : c).join(" ")}
      ${user.education || ""}
      ${user.bio || ""}
    `;

    const gigProfile = `
      ${gig.title || ""}
      ${gig.category || ""}
      ${gig.description || ""}
      ${(gig.skills || []).join(" ")}
      ${(gig.languageRequired || []).join(" ")}
      ${(gig.certifications || []).join(" ")}
      ${gig.educationRequired || ""}
    `;

    const semanticScore = await semanticMatcher(
      userProfile,
      gigProfile
    );

    // -------------------------
    // Final AI Score
    // -------------------------
    const finalScore = Math.round(
      ruleMatch.matchScore * 0.7 +
      semanticScore * 0.3
    );

    const sanitizedGig = sanitizeGig(gig);

    return {
      ...sanitizedGig,

      ruleScore: ruleMatch.matchScore,

      semanticScore,

      matchScore: finalScore,

      matchLevel: ruleMatch.matchLevel,

      profileCompletion:
        ruleMatch.profileCompletion,

      matchedSkills:
        ruleMatch.matchedSkills,

      missingSkills:
        ruleMatch.missingSkills,

      reasons:
        ruleMatch.reasons,

      suggestions:
        ruleMatch.suggestions,

      aiInsights:
        ruleMatch.aiInsights,
    };
  })
);

recommendations.sort(
  (a, b) => b.matchScore - a.matchScore
);

const topRecommendations = recommendations.slice(0, 5);

    // -----------------------------
    // Response
    // -----------------------------
    res.status(200).json({
      success: true,

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        headline: user.headline,
        bio: user.bio,
        skills: user.skills,
        experience: user.experience,
        education: user.education,
        jobTitle: user.jobTitle,
        preferredJob: user.preferredJob,
        languages: user.languages,
        certifications: user.certifications,
        location: user.location,
        website: user.website,
        github: user.github,
        linkedin: user.linkedin,
        portfolio: user.portfolio,
        profileScore: user.profileScore,
        rating: user.rating,
        reviews: user.reviews,
        totalProjects: user.totalProjects,
        completedProjects: user.completedProjects,
      },

      statistics: {
  totalRecommendations: recommendations.length,

  excellent: recommendations.filter(
    (g) => g.matchScore >= 90
  ).length,

  veryGood: recommendations.filter(
    (g) => g.matchScore >= 75 && g.matchScore < 90
  ).length,

  good: recommendations.filter(
    (g) => g.matchScore >= 60 && g.matchScore < 75
  ).length,

  average: recommendations.filter(
    (g) => g.matchScore >= 40 && g.matchScore < 60
  ).length,

  low: recommendations.filter(
    (g) => g.matchScore < 40
  ).length,

  highestScore:
    recommendations.length > 0
      ? recommendations[0].matchScore
      : 0,

  averageScore:
    recommendations.length > 0
      ? Math.round(
          recommendations.reduce(
            (sum, gig) => sum + gig.matchScore,
            0
          ) / recommendations.length
        )
      : 0,
},

      recommendations,
    });
  } catch (error) {
    console.error("AI Recommendation Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
====================================================
Get Top 5 Matches
GET /api/match/top/:userId
====================================================
*/
export const getTopMatches = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const gigs = await Gig.find({ isActive: true }).populate(
      "freelancer",
      "name profileImage rating"
    );

    const recommendations = gigs
      .map((gig) => {
  const match = calculateMatch(user, gig);

  const sanitizedGig = sanitizeGig(gig);

  return {
    ...sanitizedGig,

    matchScore: match.matchScore,

    matchLevel: match.matchLevel,

    profileCompletion: match.profileCompletion,

    matchedSkills: match.matchedSkills,

    missingSkills: match.missingSkills,

    reasons: match.reasons,

    suggestions: match.suggestions,

    aiInsights: match.aiInsights,
  };
})
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);

    res.status(200).json({
      success: true,
      total: recommendations.length,
      recommendations,
    });
  } catch (error) {
    console.error("Top Match Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};