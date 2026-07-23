import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* ==========================================================
   HELPERS
========================================================== */

const getUserId = (req) => {
  return req.user?._id || req.user?.id;
};

const findCurrentUser = async (req) => {
  const userId = getUserId(req);

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return null;
  }

  return User.findById(userId);
};

const handleError = (res, error, message) => {
  console.error(`${message}:`, error);

  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: Object.values(error.errors).map(
        (err) => err.message
      ),
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate value already exists",
      fields: error.keyValue,
    });
  }

  return res.status(500).json({
    success: false,
    message,
  });
};

const isValidIndex = (index, array) => {
  const parsedIndex = Number(index);

  return (
    Number.isInteger(parsedIndex) &&
    parsedIndex >= 0 &&
    parsedIndex < array.length
  );
};

const toArray = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

/* ==========================================================
   GET PROFILE
   GET /api/users/profile
========================================================== */

export const getProfile = async (req, res) => {
  try {
    const user = await findCurrentUser(req);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to fetch profile"
    );
  }
};

/* ==========================================================
   UPDATE PROFILE
   PUT /api/users/profile
========================================================== */

export const updateProfile = async (req, res) => {
  try {
    const user = await findCurrentUser(req);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const {
      name,
      headline,
      bio,
      phone,
      location,
      country,
      city,
      website,
      github,
      linkedin,
      portfolioWebsite,
      resume,
      profileImage,
      coverImage,

      jobTitle,
      preferredJob,
      preferredCategory,
      preferredJobType,
      experience,
      education,
      expectedSalary,
      availability,
      openToWork,
      timezone,

      skills,
      languages,
      softSkills,
      preferredTechnologies,
      interests,
      weeklyAvailability,

      pricing,
    } = req.body;

    /* ======================================================
       BASIC PROFILE
    ====================================================== */

    if (name !== undefined) {
      user.name = String(name).trim();
    }

    if (headline !== undefined) {
      user.headline = headline;
    }

    if (bio !== undefined) {
      user.bio = bio;
    }

    if (phone !== undefined) {
      user.phone = phone;
    }

    if (location !== undefined) {
      user.location = location;
    }

    if (country !== undefined) {
      user.country = country;
    }

    if (city !== undefined) {
      user.city = city;
    }

    if (website !== undefined) {
      user.website = website;
    }

    if (github !== undefined) {
      user.github = github;
    }

    if (linkedin !== undefined) {
      user.linkedin = linkedin;
    }

    if (portfolioWebsite !== undefined) {
      user.portfolioWebsite = portfolioWebsite;
    }

    if (resume !== undefined) {
      user.resume = resume;
    }

    if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }

    if (coverImage !== undefined) {
      user.coverImage = coverImage;
    }

    /* ======================================================
       PROFESSIONAL INFORMATION
    ====================================================== */

    if (jobTitle !== undefined) {
      user.jobTitle = jobTitle;
    }

    if (preferredJob !== undefined) {
      user.preferredJob = preferredJob;
    }

    if (preferredCategory !== undefined) {
      user.preferredCategory = preferredCategory;
    }

    if (preferredJobType !== undefined) {
      user.preferredJobType = preferredJobType;
    }

    if (experience !== undefined) {
      const experienceValue = Number(experience);

      if (
        Number.isNaN(experienceValue) ||
        experienceValue < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Experience must be a valid positive number",
        });
      }

      user.experience = experienceValue;
    }

    if (education !== undefined) {
      user.education = education;
    }

    if (expectedSalary !== undefined) {
      const salary = Number(expectedSalary);

      if (Number.isNaN(salary) || salary < 0) {
        return res.status(400).json({
          success: false,
          message:
            "Expected salary must be a valid positive number",
        });
      }

      user.expectedSalary = salary;
    }

    if (availability !== undefined) {
      user.availability = availability;
    }

    if (openToWork !== undefined) {
      user.openToWork = Boolean(openToWork);
    }

    if (timezone !== undefined) {
      user.timezone = timezone;
    }

    /* ======================================================
       ARRAYS
    ====================================================== */

    if (skills !== undefined) {
      user.skills = toArray(skills);
    }

    if (languages !== undefined) {
      user.languages = toArray(languages);
    }

    if (softSkills !== undefined) {
      user.softSkills = toArray(softSkills);
    }

    if (preferredTechnologies !== undefined) {
      user.preferredTechnologies =
        toArray(preferredTechnologies);
    }

    if (interests !== undefined) {
      user.interests = toArray(interests);
    }

    if (weeklyAvailability !== undefined) {
      user.weeklyAvailability =
        toArray(weeklyAvailability);
    }

    /* ======================================================
       PRICING
    ====================================================== */

    if (pricing !== undefined) {
      if (
        typeof pricing !== "object" ||
        Array.isArray(pricing)
      ) {
        return res.status(400).json({
          success: false,
          message: "Pricing must be an object",
        });
      }

      if (
        pricing.hourlyRate !== undefined
      ) {
        pricing.hourlyRate = Number(
          pricing.hourlyRate
        );
      }

      if (
        pricing.milestoneRate !== undefined
      ) {
        pricing.milestoneRate = Number(
          pricing.milestoneRate
        );
      }

      user.pricing = {
        ...(user.pricing?.toObject?.() ||
          user.pricing ||
          {}),
        ...pricing,
      };
    }

    user.lastActive = new Date();

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to update profile"
    );
  }
};

/* ==========================================================
   PORTFOLIO
========================================================== */

/* GET PORTFOLIO */

export const getPortfolio = async (req, res) => {
  try {
    const user = await findCurrentUser(req);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      count: user.portfolio?.length || 0,
      portfolio: user.portfolio || [],
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to fetch portfolio"
    );
  }
};

/* ADD PORTFOLIO */

export const addPortfolio = async (req, res) => {
  try {
    const user = await findCurrentUser(req);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const {
      title,
      description = "",
      image = "",
      projectUrl = "",
      githubUrl = "",
      technologies = [],
      featured = false,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project title is required",
      });
    }

    user.portfolio.push({
      title: title.trim(),
      description,
      image,
      projectUrl,
      githubUrl,
      technologies: toArray(technologies),
      featured: Boolean(featured),
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "Portfolio project added successfully",
      portfolio: user.portfolio,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to add portfolio project"
    );
  }
};

/* UPDATE PORTFOLIO */

export const updatePortfolio = async (req, res) => {
  try {
    const user = await findCurrentUser(req);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      !isValidIndex(
        req.params.index,
        user.portfolio
      )
    ) {
      return res.status(404).json({
        success: false,
        message: "Portfolio project not found",
      });
    }

    const index = Number(req.params.index);

    const allowedFields = [
      "title",
      "description",
      "image",
      "projectUrl",
      "githubUrl",
      "technologies",
      "featured",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user.portfolio[index][field] =
          field === "technologies"
            ? toArray(req.body[field])
            : req.body[field];
      }
    });

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Portfolio project updated successfully",
      portfolio: user.portfolio,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to update portfolio project"
    );
  }
};

/* DELETE PORTFOLIO */

export const deletePortfolio = async (req, res) => {
  try {
    const user = await findCurrentUser(req);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      !isValidIndex(
        req.params.index,
        user.portfolio
      )
    ) {
      return res.status(404).json({
        success: false,
        message: "Portfolio project not found",
      });
    }

    user.portfolio.splice(
      Number(req.params.index),
      1
    );

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Portfolio project deleted successfully",
      portfolio: user.portfolio,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to delete portfolio project"
    );
  }
};

/* ==========================================================
   WORK EXPERIENCE
========================================================== */

/* GET WORK EXPERIENCE */

export const getWorkExperience = async (
  req,
  res
) => {
  try {
    const user = await findCurrentUser(req);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      count: user.workExperience?.length || 0,
      workExperience:
        user.workExperience || [],
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to fetch work experience"
    );
  }
};

/* ADD WORK EXPERIENCE */

export const addWorkExperience = async (
  req,
  res
) => {
  try {
    const user = await findCurrentUser(req);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const {
      company,
      position,
      location = "",
      employmentType = "Full Time",
      startDate = null,
      endDate = null,
      currentlyWorking = false,
      description = "",
    } = req.body;

    if (!company?.trim() || !position?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Company and position are required",
      });
    }

    user.workExperience.push({
      company: company.trim(),
      position: position.trim(),
      location,
      employmentType,
      startDate: startDate || null,
      endDate: currentlyWorking
        ? null
        : endDate || null,
      currentlyWorking: Boolean(
        currentlyWorking
      ),
      description,
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message:
        "Work experience added successfully",
      workExperience:
        user.workExperience,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to add work experience"
    );
  }
};

/* UPDATE WORK EXPERIENCE */

export const updateWorkExperience = async (
  req,
  res
) => {
  try {
    const user = await findCurrentUser(req);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      !isValidIndex(
        req.params.index,
        user.workExperience
      )
    ) {
      return res.status(404).json({
        success: false,
        message: "Work experience not found",
      });
    }

    const index = Number(req.params.index);

    const allowedFields = [
      "company",
      "position",
      "location",
      "employmentType",
      "startDate",
      "endDate",
      "currentlyWorking",
      "description",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user.workExperience[index][field] =
          req.body[field];
      }
    });

    if (
      user.workExperience[index]
        .currentlyWorking
    ) {
      user.workExperience[index].endDate =
        null;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Work experience updated successfully",
      workExperience:
        user.workExperience,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to update work experience"
    );
  }
};

/* DELETE WORK EXPERIENCE */

export const deleteWorkExperience = async (
  req,
  res
) => {
  try {
    const user = await findCurrentUser(req);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      !isValidIndex(
        req.params.index,
        user.workExperience
      )
    ) {
      return res.status(404).json({
        success: false,
        message: "Work experience not found",
      });
    }

    user.workExperience.splice(
      Number(req.params.index),
      1
    );

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Work experience deleted successfully",
      workExperience:
        user.workExperience,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to delete work experience"
    );
  }
};

/* ==========================================================
   CERTIFICATIONS
========================================================== */

/* GET CERTIFICATIONS */

export const getCertifications = async (
  req,
  res
) => {
  try {
    const user = await findCurrentUser(req);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      count: user.certifications?.length || 0,
      certifications:
        user.certifications || [],
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to fetch certifications"
    );
  }
};

/* ADD CERTIFICATION */

export const addCertification = async (
  req,
  res
) => {
  try {
    const user = await findCurrentUser(req);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    /*
      Profile.jsx sends:

      {
        title,
        issuer,
        issueDate,
        expiryDate,
        credentialId,
        credentialUrl
      }
    */

    const {
      title,
      issuer,
      issueDate = null,
      expiryDate = null,
      credentialId = "",
      credentialUrl = "",
    } = req.body;

    if (!title?.trim() || !issuer?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Certificate title and issuer are required",
      });
    }

    user.certifications.push({
      title: title.trim(),
      issuer: issuer.trim(),
      issueDate: issueDate || null,
      expiryDate: expiryDate || null,
      credentialId,
      credentialUrl,
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message:
        "Certification added successfully",
      certifications:
        user.certifications,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to add certification"
    );
  }
};

/* UPDATE CERTIFICATION */

export const updateCertification = async (
  req,
  res
) => {
  try {
    const user = await findCurrentUser(req);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      !isValidIndex(
        req.params.index,
        user.certifications
      )
    ) {
      return res.status(404).json({
        success: false,
        message: "Certification not found",
      });
    }

    const index = Number(req.params.index);

    const allowedFields = [
      "title",
      "issuer",
      "issueDate",
      "expiryDate",
      "credentialId",
      "credentialUrl",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user.certifications[index][field] =
          req.body[field];
      }
    });

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Certification updated successfully",
      certifications:
        user.certifications,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to update certification"
    );
  }
};

/* DELETE CERTIFICATION */

export const deleteCertification = async (
  req,
  res
) => {
  try {
    const user = await findCurrentUser(req);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      !isValidIndex(
        req.params.index,
        user.certifications
      )
    ) {
      return res.status(404).json({
        success: false,
        message: "Certification not found",
      });
    }

    user.certifications.splice(
      Number(req.params.index),
      1
    );

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Certification deleted successfully",
      certifications:
        user.certifications,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to delete certification"
    );
  }
};

/* ==========================================================
   AVAILABILITY
========================================================== */

export const getAvailability = async (
  req,
  res
) => {
  try {
    const user = await findCurrentUser(req);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      weeklyAvailability:
        user.weeklyAvailability || [],
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to fetch availability"
    );
  }
};

export const updateAvailability = async (
  req,
  res
) => {
  try {
    const user = await findCurrentUser(req);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const {
      weeklyAvailability,
    } = req.body;

    user.weeklyAvailability =
      toArray(weeklyAvailability);

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Availability updated successfully",
      weeklyAvailability:
        user.weeklyAvailability,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to update availability"
    );
  }
};

/* ==========================================================
   PRICING
========================================================== */

export const getPricing = async (
  req,
  res
) => {
  try {
    const user = await findCurrentUser(req);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      pricing: user.pricing,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to fetch pricing"
    );
  }
};

export const updatePricing = async (
  req,
  res
) => {
  try {
    const user = await findCurrentUser(req);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const {
      hourlyRate,
      milestoneRate,
      currency,
      negotiable,
    } = req.body;

    if (hourlyRate !== undefined) {
      user.pricing.hourlyRate =
        Number(hourlyRate);
    }

    if (milestoneRate !== undefined) {
      user.pricing.milestoneRate =
        Number(milestoneRate);
    }

    if (currency !== undefined) {
      user.pricing.currency = currency;
    }

    if (negotiable !== undefined) {
      user.pricing.negotiable =
        Boolean(negotiable);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Pricing updated successfully",
      pricing: user.pricing,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to update pricing"
    );
  }
};

/* ==========================================================
   VERIFICATION
========================================================== */

export const getVerification = async (
  req,
  res
) => {
  try {
    const user = await findCurrentUser(req);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      verification: user.verification,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to fetch verification"
    );
  }
};

/*
  This should eventually be protected by admin middleware.
*/

export const updateVerification = async (
  req,
  res
) => {
  try {
    const {
      emailVerified,
      phoneVerified,
      identityVerified,
      paymentVerified,
      badge,
    } = req.body;

    const user = await User.findById(
      req.params.userId
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (emailVerified !== undefined) {
      user.verification.emailVerified =
        Boolean(emailVerified);
    }

    if (phoneVerified !== undefined) {
      user.verification.phoneVerified =
        Boolean(phoneVerified);
    }

    if (identityVerified !== undefined) {
      user.verification.identityVerified =
        Boolean(identityVerified);
    }

    if (paymentVerified !== undefined) {
      user.verification.paymentVerified =
        Boolean(paymentVerified);
    }

    if (badge !== undefined) {
      user.verification.badge = badge;
    }

    user.verification.verifiedAt =
      new Date();

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Verification updated successfully",
      verification:
        user.verification,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to update verification"
    );
  }
};

/* ==========================================================
   CHANGE USER ROLE
   PUT /api/users/change-role
========================================================== */

export const changeRole = async (req, res) => {
  try {
    /* ======================================================
       1. CHECK AUTHENTICATION
    ====================================================== */

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    /* ======================================================
       2. GET ROLE
    ====================================================== */

    const { role } = req.body;

    /* ======================================================
       3. VALIDATE ROLE
    ====================================================== */

    if (!["client", "freelancer"].includes(role)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid role. Choose either client or freelancer.",
      });
    }

    /* ======================================================
       4. ADMIN PROTECTION
    ====================================================== */

    if (req.user.role === "admin") {
      return res.status(403).json({
        success: false,
        message:
          "Administrator accounts cannot change roles.",
      });
    }

    /* ======================================================
       5. SAME ROLE CHECK
    ====================================================== */

    if (req.user.role === role) {
      return res.status(400).json({
        success: false,
        message: `You are already a ${role}.`,
      });
    }

    /* ======================================================
       6. FIND USER
    ====================================================== */

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    /* ======================================================
       7. UPDATE ROLE
    ====================================================== */

    user.role = role;
    user.lastActive = new Date();

    console.log("Education:", user.education);
console.log("Type:", typeof user.education);

    await user.save();

    /* ======================================================
       8. GENERATE NEW TOKEN
    ====================================================== */

    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRET is missing from environment variables."
      );

      return res.status(500).json({
        success: false,
        message:
          "JWT_SECRET is not configured on the server.",
      });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    /* ======================================================
       9. REMOVE PASSWORD FROM RESPONSE
    ====================================================== */

    const userResponse = user.toObject();

    delete userResponse.password;

    /* ======================================================
       10. RESPONSE
    ====================================================== */

    return res.status(200).json({
      success: true,
      message: "Role updated successfully.",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error(
      "CHANGE ROLE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to change account role.",
    });
  }
};