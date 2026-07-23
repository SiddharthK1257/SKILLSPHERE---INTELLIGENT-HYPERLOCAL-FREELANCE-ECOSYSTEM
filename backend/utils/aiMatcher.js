// ============================================
// AI Recommendation Engine
// SkillSphere
// ============================================

// -----------------------------
// Normalize Array
// -----------------------------
const normalize = (arr = []) => {
  if (!Array.isArray(arr)) return [];
  return arr
    .filter(Boolean)
    .map((item) => {
      if (typeof item === "object" && item !== null) {
        return (item.name || item.language || item.title || "").toString().toLowerCase().trim();
      }
      return item.toString().toLowerCase().trim();
    })
    .filter(Boolean);
};

// -----------------------------
// Calculate Profile Completion
// -----------------------------
const calculateProfileCompletion = (user) => {
  let completed = 0;

  const fields = [
    user.name,
    user.email,
    user.bio,
    user.headline,
    user.location,
    user.profileImage,
    user.website,
    user.github,
    user.linkedin,
    user.portfolio,
    user.resume,
    user.education,
    user.preferredJob,
    user.preferredCategory,
    user.preferredJobType,
  ];

  fields.forEach((field) => {
    if (field && field.toString().trim() !== "") {
      completed++;
    }
  });

  if (user.skills?.length) completed++;
  if (user.languages?.length) completed++;
  if (user.certifications?.length) completed++;
  if (user.interests?.length) completed++;
  if (user.preferredTechnologies?.length) completed++;
  if (user.softSkills?.length) completed++;
  if (user.experience > 0) completed++;

  return Math.round((completed / 22) * 100);
};

// -----------------------------
// AI Matching Function
// -----------------------------
const calculateMatch = (user, gig) => {
  let score = 0;

  const reasons = [];
  const suggestions = [];

  // -----------------------------
  // Normalize Data
  // -----------------------------
  const userSkills = normalize(user.skills);
  const gigSkills = normalize(gig.skills);

  const userLanguages = normalize(user.languages);
  const gigLanguages = normalize(gig.languageRequired);

  const userCertifications = normalize(user.certifications);
  const gigCertifications = normalize(gig.certifications);

  const userInterests = normalize(user.interests);
  const gigKeywords = normalize(gig.keywords);

  const userTechnologies = normalize(
    user.preferredTechnologies
  );

  const gigTechnologies = normalize(
    gig.preferredTechnologies
  );

  const userSoftSkills = normalize(
    user.softSkills
  );

  const gigSoftSkills = normalize(
    gig.softSkills
  );

  // -----------------------------
  // Skills Matching
  // 40 Marks
  // -----------------------------
  const matchedSkills = gigSkills.filter((skill) =>
    userSkills.includes(skill)
  );

  const missingSkills = gigSkills.filter(
    (skill) => !userSkills.includes(skill)
  );

  if (gigSkills.length > 0) {
    const skillScore =
      (matchedSkills.length / gigSkills.length) * 40;

    score += skillScore;

    reasons.push(
      `${matchedSkills.length}/${gigSkills.length} required skills matched`
    );

    if (missingSkills.length) {
      suggestions.push(
        `Learn ${missingSkills.join(", ")}`
      );
    }
  }

  // -----------------------------
  // Experience Matching
  // 15 Marks
  // -----------------------------
  if (user.experience >= gig.experienceRequired) {
    score += 15;

    reasons.push("Experience requirement satisfied");
  } else {
    const gap = gig.experienceRequired - user.experience;

    suggestions.push(
      `Gain ${gap} more year(s) of experience`
    );
  }

  // -----------------------------
  // Preferred Category
  // 10 Marks
  // -----------------------------
  if (
    user.preferredCategory &&
    gig.category &&
    user.preferredCategory.toLowerCase() ===
      gig.category.toLowerCase()
  ) {
    score += 10;

    reasons.push("Preferred category matched");
  }

  // -----------------------------
  // Job Type
  // 10 Marks
  // -----------------------------
  if (
    user.preferredJobType &&
    gig.jobType &&
    user.preferredJobType.toLowerCase() ===
      gig.jobType.toLowerCase()
  ) {
    score += 10;

    reasons.push("Preferred job type matched");
  }

  // -----------------------------
  // Languages
  // 5 Marks
  // -----------------------------
  if (gigLanguages.length > 0) {
    const matchedLanguages = gigLanguages.filter((lang) =>
      userLanguages.includes(lang)
    );

    const languageScore =
      (matchedLanguages.length / gigLanguages.length) * 5;

    score += languageScore;

    if (matchedLanguages.length > 0) {
      reasons.push(
        `${matchedLanguages.length} language(s) matched`
      );
    }
  }

  // -----------------------------
  // Certifications
  // 5 Marks
  // -----------------------------
  if (gigCertifications.length > 0) {
    const matchedCertifications =
      gigCertifications.filter((cert) =>
        userCertifications.includes(cert)
      );

    const certScore =
      (matchedCertifications.length /
        gigCertifications.length) *
      5;

    score += certScore;

    if (matchedCertifications.length > 0) {
      reasons.push("Certification requirement matched");
    }
  }

  // -----------------------------
  // Preferred Technologies
  // 5 Marks
  // -----------------------------
  if (gigTechnologies.length > 0) {
    const matchedTechnologies =
      gigTechnologies.filter((tech) =>
        userTechnologies.includes(tech)
      );

    const techScore =
      (matchedTechnologies.length /
        gigTechnologies.length) *
      5;

    score += techScore;

    if (matchedTechnologies.length > 0) {
      reasons.push(
        `${matchedTechnologies.length} technology matched`
      );
    }
  }

  // -----------------------------
  // Soft Skills
  // 5 Marks
  // -----------------------------
  if (gigSoftSkills.length > 0) {
    const matchedSoftSkills =
      gigSoftSkills.filter((skill) =>
        userSoftSkills.includes(skill)
      );

    const softSkillScore =
      (matchedSoftSkills.length /
        gigSoftSkills.length) *
      5;

    score += softSkillScore;

    if (matchedSoftSkills.length > 0) {
      reasons.push("Soft skills matched");
    }
  }

  // -----------------------------
  // Interests & Keywords
  // 5 Marks
  // -----------------------------
  if (gigKeywords.length > 0) {
    const matchedKeywords =
      gigKeywords.filter((keyword) =>
        userInterests.includes(keyword)
      );

    const keywordScore =
      (matchedKeywords.length /
        gigKeywords.length) *
      5;

    score += keywordScore;

    if (matchedKeywords.length > 0) {
      reasons.push(
        `${matchedKeywords.length} interest(s) matched`
      );
    }
  }

  // -----------------------------
  // Profile Completion Bonus
  // 5 Marks
  // -----------------------------
  const profileCompletion =
    calculateProfileCompletion(user);

  if (profileCompletion >= 80) {
    score += 5;
    reasons.push("Strong profile");
  } else if (profileCompletion >= 60) {
    score += 3;
    reasons.push("Profile is fairly complete");
  } else {
    suggestions.push(
      "Complete your profile for better AI recommendations"
    );
  }

  // -----------------------------
  // Budget Compatibility
  // -----------------------------
  if (
    user.expectedSalary &&
    gig.maxBudget &&
    user.expectedSalary <= gig.maxBudget
  ) {
    reasons.push("Budget expectation matches");
  } else if (
    user.expectedSalary &&
    gig.maxBudget &&
    user.expectedSalary > gig.maxBudget
  ) {
    suggestions.push(
      "Expected salary is higher than this project's budget"
    );
  }

  // -----------------------------
  // Location Compatibility
  // -----------------------------
  if (
    gig.jobType === "Remote" ||
    !gig.location ||
    !user.location
  ) {
    reasons.push("Location compatible");
  } else if (
    gig.location.toLowerCase() ===
    user.location.toLowerCase()
  ) {
    reasons.push("Same location");
  } else {
    suggestions.push(
      "Different work location"
    );
  }

  // -----------------------------
  // Final Score
  // -----------------------------
  score = Math.round(score);

  if (score > 100) score = 100;

  // -----------------------------
  // Match Level
  // -----------------------------
  let matchLevel = "Low";

  if (score >= 90) {
    matchLevel = "Excellent";
  } else if (score >= 75) {
    matchLevel = "Very Good";
  } else if (score >= 60) {
    matchLevel = "Good";
  } else if (score >= 40) {
    matchLevel = "Average";
  }

  // -----------------------------
  // AI Insights
  // -----------------------------
  const aiInsights = [];

  if (matchedSkills.length >= 5) {
    aiInsights.push(
      "Excellent technical skill match."
    );
  } else if (matchedSkills.length >= 3) {
    aiInsights.push(
      "Good technical background."
    );
  } else {
    aiInsights.push(
      "Improve your technical skills for better matches."
    );
  }

  if (profileCompletion >= 90) {
    aiInsights.push(
      "Your profile is highly optimized."
    );
  }

  if (profileCompletion < 70) {
    aiInsights.push(
      "Complete your profile to increase recommendation accuracy."
    );
  }

  if (
    user.preferredCategory &&
    gig.category &&
    user.preferredCategory === gig.category
  ) {
    aiInsights.push(
      "This gig matches your preferred career path."
    );
  }

  // -----------------------------
  // Return AI Result
  // -----------------------------
  return {
    matchScore: score,

    profileCompletion,

    matchLevel,

    matchedSkills,

    missingSkills,

    reasons,

    suggestions,

    aiInsights,
  };
};

export default calculateMatch;
