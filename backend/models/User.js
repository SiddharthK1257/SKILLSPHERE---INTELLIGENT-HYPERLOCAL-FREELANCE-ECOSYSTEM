import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ==========================================================
   SMALL HELPERS
========================================================== */

const stringArray = {
  type: [String],
  default: [],
};

const cleanString = {
  type: String,
  default: "",
  trim: true,
};

/* ==========================================================
   PORTFOLIO SCHEMA
========================================================== */

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 3000,
    },

    image: cleanString,

    projectUrl: cleanString,

    githubUrl: cleanString,

    technologies: {
      type: [String],
      default: [],
    },

    featured: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: true,
  }
);

/* ==========================================================
   WORK EXPERIENCE SCHEMA
========================================================== */

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },

    position: {
      type: String,
      required: true,
      trim: true,
    },

    location: cleanString,

    employmentType: {
      type: String,
      enum: [
        "Full Time",
        "Part Time",
        "Internship",
        "Freelance",
        "Contract",
      ],
      default: "Full Time",
    },

    startDate: {
      type: Date,
      default: null,
    },

    endDate: {
      type: Date,
      default: null,
    },

    currentlyWorking: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 3000,
    },
  },
  {
    _id: true,
  }
);

/* ==========================================================
   CERTIFICATION SCHEMA
========================================================== */

const certificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    issuer: {
      type: String,
      required: true,
      trim: true,
    },

    issueDate: {
      type: Date,
      default: null,
    },

    expiryDate: {
      type: Date,
      default: null,
    },

    credentialId: cleanString,

    credentialUrl: cleanString,
  },
  {
    _id: true,
  }
);

/* ==========================================================
   PRICING SCHEMA
========================================================== */

const pricingSchema = new mongoose.Schema(
  {
    hourlyRate: {
      type: Number,
      default: 0,
      min: 0,
    },

    milestoneRate: {
      type: Number,
      default: 0,
      min: 0,
    },

    currency: {
      type: String,
      enum: ["INR", "USD", "EUR", "GBP"],
      default: "INR",
    },

    negotiable: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
  }
);

/* ==========================================================
   WEEKLY AVAILABILITY SCHEMA
========================================================== */

const weeklyAvailabilitySchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      required: true,
    },

    available: {
      type: Boolean,
      default: true,
    },

    startTime: {
      type: String,
      default: "",
    },

    endTime: {
      type: String,
      default: "",
    },
  },
  {
    _id: true,
  }
);

/* ==========================================================
   AI PROFILE SCHEMA
========================================================== */

const aiProfileSchema = new mongoose.Schema(
  {
    summary: {
      type: String,
      default: "",
    },

    recommendedJobs: {
      type: [String],
      default: [],
    },

    recommendedSkills: {
      type: [String],
      default: [],
    },

    recommendedCategories: {
      type: [String],
      default: [],
    },

    profileScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    lastUpdated: {
      type: Date,
      default: null,
    },
  },
  {
    _id: false,
  }
);

/* ==========================================================
   NOTIFICATION SETTINGS
========================================================== */

const notificationSettingsSchema = new mongoose.Schema(
  {
    email: {
      type: Boolean,
      default: true,
    },

    sms: {
      type: Boolean,
      default: false,
    },

    push: {
      type: Boolean,
      default: true,
    },

    marketing: {
      type: Boolean,
      default: false,
    },

    messages: {
      type: Boolean,
      default: true,
    },

    proposals: {
      type: Boolean,
      default: true,
    },

    orders: {
      type: Boolean,
      default: true,
    },

    payments: {
      type: Boolean,
      default: true,
    },

    reviews: {
      type: Boolean,
      default: true,
    },

    security: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
  }
);

/* ==========================================================
   WALLET
========================================================== */

const walletSchema = new mongoose.Schema(
  {
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalEarned: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalWithdrawn: {
      type: Number,
      default: 0,
      min: 0,
    },

    pendingBalance: {
      type: Number,
      default: 0,
      min: 0,
    },

    escrowBalance: {
      type: Number,
      default: 0,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
      uppercase: true,
    },
  },
  {
    _id: false,
  }
);

/* ==========================================================
   USER SCHEMA
========================================================== */

const userSchema = new mongoose.Schema(
  {
    /* ======================================================
       BASIC INFORMATION
    ====================================================== */

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      minlength: 6,
      select: false,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    country: {
      type: String,
      default: "",
      trim: true,
    },

    city: {
      type: String,
      default: "",
      trim: true,
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },

    /* ======================================================
       ROLE
    ====================================================== */

    role: {
      type: String,
      enum: ["client", "freelancer", "admin"],
      default: "client",
      index: true,
    },

    /* ======================================================
       GOOGLE AUTH
    ====================================================== */

    googleId: {
      type: String,
      default: "",
      index: true,
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    /* ======================================================
       PROFILE
    ====================================================== */

    headline: {
      type: String,
      default: "",
      trim: true,
      maxlength: 150,
    },

    bio: {
      type: String,
      default: "",
      trim: true,
      maxlength: 3000,
    },

    profileImage: {
      type: String,
      default: "",
    },

    coverImage: {
      type: String,
      default: "",
    },

    website: cleanString,

    github: cleanString,

    linkedin: cleanString,

    portfolioWebsite: cleanString,

    resume: cleanString,

    /* ======================================================
       PROFESSIONAL INFORMATION
    ====================================================== */

    jobTitle: cleanString,

    preferredJob: cleanString,

    preferredCategory: cleanString,

    preferredJobType: {
      type: String,
      enum: ["", "Remote", "Hybrid", "On-site"],
      default: "",
    },

    experience: {
      type: Number,
      default: 0,
      min: 0,
    },

    education: {
  type: [
    {
      degree: {
        type: String,
        trim: true,
      },

      institution: {
        type: String,
        trim: true,
      },

      fieldOfStudy: {
        type: String,
        trim: true,
      },

      startYear: {
        type: Number,
      },

      endYear: {
        type: Number,
      },

      description: {
        type: String,
        trim: true,
      },
    },
  ],

  default: [],
},

    expectedSalary: {
      type: Number,
      default: 0,
      min: 0,
    },

    availability: {
      type: String,
      enum: [
        "",
        "Available",
        "Busy",
        "Unavailable",
      ],
      default: "Available",
    },

    openToWork: {
      type: Boolean,
      default: true,
    },

    /* ======================================================
       SKILLS
    ====================================================== */

    skills: stringArray,

    languages: stringArray,

    softSkills: stringArray,

    preferredTechnologies: stringArray,

    interests: stringArray,

    /* ======================================================
       PORTFOLIO
    ====================================================== */

    portfolio: {
      type: [portfolioSchema],
      default: [],
    },

    /* ======================================================
       EXPERIENCE
    ====================================================== */

    workExperience: {
      type: [experienceSchema],
      default: [],
    },

    /* ======================================================
       CERTIFICATIONS
    ====================================================== */

    certifications: {
      type: [certificationSchema],
      default: [],
    },

    /* ======================================================
       WEEKLY AVAILABILITY
    ====================================================== */

    weeklyAvailability: {
      type: [weeklyAvailabilitySchema],
      default: [],
    },

    /* ======================================================
       PRICING
    ====================================================== */

    pricing: {
      type: pricingSchema,
      default: () => ({}),
    },

    /* ======================================================
       AI PROFILE
    ====================================================== */

    aiProfile: {
      type: aiProfileSchema,
      default: () => ({}),
    },

    /* ======================================================
       ACCOUNT STATUS
    ====================================================== */

    verified: {
      type: Boolean,
      default: false,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    phoneVerified: {
      type: Boolean,
      default: false,
    },

    active: {
      type: Boolean,
      default: true,
    },

    suspended: {
      type: Boolean,
      default: false,
    },

    suspensionReason: {
      type: String,
      default: "",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    online: {
      type: Boolean,
      default: false,
    },

    lastSeen: {
      type: Date,
      default: Date.now,
    },

    /* ======================================================
       RATING AND MARKETPLACE STATS
    ====================================================== */

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalOrders: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalGigs: {
      type: Number,
      default: 0,
      min: 0,
    },

    profileViews: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* ======================================================
       WALLET
    ====================================================== */

    wallet: {
      type: walletSchema,
      default: () => ({}),
    },

    /* ======================================================
       NOTIFICATIONS
    ====================================================== */

    notificationSettings: {
      type: notificationSettingsSchema,
      default: () => ({}),
    },

    /* ======================================================
       AUTH TOKENS
    ====================================================== */

    emailVerificationToken: {
      type: String,
      default: "",
      select: false,
    },

    emailVerificationExpires: {
      type: Date,
      default: null,
      select: false,
    },

    passwordResetToken: {
      type: String,
      default: "",
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      default: null,
      select: false,
    },

    refreshTokens: [
      {
        token: {
          type: String,
          required: true,
          select: false,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },

        expiresAt: {
          type: Date,
          required: true,
        },

        device: {
          type: String,
          default: "",
        },

        ipAddress: {
          type: String,
          default: "",
        },
      },
    ],

    /* ======================================================
       ADMIN
    ====================================================== */

    reports: {
      type: Number,
      default: 0,
      min: 0,
    },

    reportReason: {
      type: String,
      default: "",
    },

    adminNotes: {
      type: String,
      default: "",
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,

    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
        delete ret.emailVerificationToken;
        delete ret.passwordResetToken;
        delete ret.refreshTokens;

        return ret;
      },
    },

    toObject: {
      virtuals: true,
    },
  }
);

/* ==========================================================
   VIRTUALS
========================================================== */

userSchema.virtual("isFreelancer").get(function () {
  return this.role === "freelancer";
});

userSchema.virtual("isClient").get(function () {
  return this.role === "client";
});

userSchema.virtual("isAdmin").get(function () {
  return this.role === "admin";
});

userSchema.virtual("profileCompletion").get(function () {
  const fields = [
    this.name,
    this.headline,
    this.bio,
    this.location,
    this.country,
    this.city,
    this.jobTitle,
    this.education,
    this.profileImage,
  ];

  let score = fields.filter(Boolean).length * 5;

  if (this.skills?.length) score += 15;
  if (this.languages?.length) score += 10;
  if (this.portfolio?.length) score += 15;
  if (this.workExperience?.length) score += 15;
  if (this.certifications?.length) score += 10;

  return Math.min(score, 100);
});

/* ==========================================================
   PASSWORD HASHING
========================================================== */

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  if (!this.password) {
    return next();
  }

  const salt = await bcrypt.genSalt(12);

  this.password = await bcrypt.hash(
    this.password,
    salt
  );

  next();
});

/* ==========================================================
   PASSWORD COMPARISON
========================================================== */

userSchema.methods.matchPassword = async function (
  enteredPassword
) {
  if (!this.password) return false;

  return bcrypt.compare(
    enteredPassword,
    this.password
  );
};

/* ==========================================================
   JWT ACCESS TOKEN
========================================================== */

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || "7d",
    }
  );
};

/* ==========================================================
   JWT REFRESH TOKEN
========================================================== */

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn:
        process.env.JWT_REFRESH_EXPIRE || "30d",
    }
  );
};

/* ==========================================================
   REFRESH TOKEN METHODS
========================================================== */

userSchema.methods.addRefreshToken = async function (
  token,
  expiresAt,
  device = "",
  ipAddress = ""
) {
  this.refreshTokens.push({
    token,
    expiresAt,
    device,
    ipAddress,
  });

  return this.save();
};

userSchema.methods.removeRefreshToken = async function (
  token
) {
  this.refreshTokens =
    this.refreshTokens.filter(
      (item) => item.token !== token
    );

  return this.save();
};

userSchema.methods.clearRefreshTokens = async function () {
  this.refreshTokens = [];

  return this.save();
};

/* ==========================================================
   ONLINE STATUS
========================================================== */

userSchema.methods.setOnline = async function () {
  this.online = true;
  this.lastSeen = new Date();

  return this.save();
};

userSchema.methods.setOffline = async function () {
  this.online = false;
  this.lastSeen = new Date();

  return this.save();
};

/* ==========================================================
   PROFILE METHODS
========================================================== */

userSchema.methods.incrementProfileViews =
  async function () {
    this.profileViews += 1;

    return this.save();
  };

userSchema.methods.addPortfolioProject =
  async function (project) {
    this.portfolio.push(project);

    return this.save();
  };

userSchema.methods.removePortfolioProject =
  async function (index) {
    if (
      index < 0 ||
      index >= this.portfolio.length
    ) {
      throw new Error(
        "Invalid portfolio project index"
      );
    }

    this.portfolio.splice(index, 1);

    return this.save();
  };

userSchema.methods.addWorkExperience =
  async function (experience) {
    this.workExperience.push(experience);

    return this.save();
  };

userSchema.methods.removeWorkExperience =
  async function (index) {
    if (
      index < 0 ||
      index >= this.workExperience.length
    ) {
      throw new Error(
        "Invalid experience index"
      );
    }

    this.workExperience.splice(index, 1);

    return this.save();
  };

userSchema.methods.addCertification =
  async function (certification) {
    this.certifications.push(certification);

    return this.save();
  };

userSchema.methods.removeCertification =
  async function (index) {
    if (
      index < 0 ||
      index >= this.certifications.length
    ) {
      throw new Error(
        "Invalid certification index"
      );
    }

    this.certifications.splice(index, 1);

    return this.save();
  };

/* ==========================================================
   ADMIN METHODS
========================================================== */

userSchema.methods.verifyUser = async function () {
  this.verified = true;
  this.emailVerified = true;

  return this.save();
};

userSchema.methods.suspendUser = async function (
  reason = ""
) {
  this.suspended = true;
  this.active = false;
  this.suspensionReason = reason;

  return this.save();
};

userSchema.methods.activateUser = async function () {
  this.suspended = false;
  this.active = true;
  this.suspensionReason = "";

  return this.save();
};

/* ==========================================================
   QUERY MIDDLEWARE
========================================================== */

userSchema.pre(/^find/, function (next) {
  this.where({
    deletedAt: null,
  });

  next();
});

/* ==========================================================
   INDEXES
========================================================== */

userSchema.index({
  role: 1,
  active: 1,
  suspended: 1,
});

userSchema.index({
  rating: -1,
});

userSchema.index({
  country: 1,
});

userSchema.index({
  city: 1,
});

userSchema.index({
  createdAt: -1,
});

userSchema.index({
  lastSeen: -1,
});

userSchema.index({
  name: "text",
  headline: "text",
  bio: "text",
  jobTitle: "text",
  preferredJob: "text",
  preferredCategory: "text",
});

/* ==========================================================
   MODEL
========================================================== */

const User = mongoose.model(
  "User",
  userSchema
);

export default User;