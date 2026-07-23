import mongoose from "mongoose";

/* ==========================================================
   PACKAGE SCHEMA
========================================================== */

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    price: {
      type: Number,
      required: true,
      min: 1,
    },

    deliveryTime: {
      type: Number,
      required: true,
      min: 1,
    },

    revisions: {
      type: Number,
      default: 1,
      min: 0,
    },

    features: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    _id: false,
  }
);

/* ==========================================================
   GALLERY SCHEMA
========================================================== */

const gallerySchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },

    caption: {
      type: String,
      default: "",
      trim: true,
      maxlength: 150,
    },
  },
  {
    _id: false,
  }
);

/* ==========================================================
   FAQ SCHEMA
========================================================== */

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    answer: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    _id: false,
  }
);

/* ==========================================================
   REQUIREMENT SCHEMA
========================================================== */

const requirementSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    required: {
      type: Boolean,
      default: true,
    },

    type: {
      type: String,
      enum: [
        "text",
        "textarea",
        "file",
        "checkbox",
      ],
      default: "text",
    },

    placeholder: {
      type: String,
      default: "",
      trim: true,
    },

    options: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    _id: false,
  }
);

/* ==========================================================
   EXTRA SERVICE SCHEMA
========================================================== */

const extraServiceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    price: {
      type: Number,
      default: 0,
      min: 0,
    },

    deliveryTime: {
      type: Number,
      default: 0,
      min: 0,
    },

    enabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
  }
);
/* ==========================================================
   AI MATCHING SCHEMA
========================================================== */

const aiMatchingSchema = new mongoose.Schema(
  {
    keywords: [
      {
        type: String,
        trim: true,
      },
    ],

    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],

    preferredSkills: [
      {
        type: String,
        trim: true,
      },
    ],

    preferredTechnologies: [
      {
        type: String,
        trim: true,
      },
    ],

    softSkills: [
      {
        type: String,
        trim: true,
      },
    ],

    languages: [
      {
        type: String,
        trim: true,
      },
    ],

    certifications: [
      {
        type: String,
        trim: true,
      },
    ],

    experienceRequired: {
      type: Number,
      default: 0,
      min: 0,
    },

    educationRequired: {
      type: String,
      default: "",
      trim: true,
    },

    aiScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

/* ==========================================================
   SEO SCHEMA
========================================================== */

const seoSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },

    metaTitle: {
      type: String,
      default: "",
      maxlength: 70,
      trim: true,
    },

    metaDescription: {
      type: String,
      default: "",
      maxlength: 170,
      trim: true,
    },

    canonicalUrl: {
      type: String,
      default: "",
      trim: true,
    },

    focusKeyword: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  }
);

/* ==========================================================
   ANALYTICS SCHEMA
========================================================== */

const analyticsSchema = new mongoose.Schema(
  {
    weeklyViews: {
      type: Number,
      default: 0,
      min: 0,
    },

    monthlyViews: {
      type: Number,
      default: 0,
      min: 0,
    },

    yearlyViews: {
      type: Number,
      default: 0,
      min: 0,
    },

    clicks: {
      type: Number,
      default: 0,
      min: 0,
    },

    shares: {
      type: Number,
      default: 0,
      min: 0,
    },

    saves: {
      type: Number,
      default: 0,
      min: 0,
    },

    conversionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    _id: false,
  }
);

/* ==========================================================
   FREELANCER SNAPSHOT SCHEMA
========================================================== */

const freelancerSnapshotSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        default: "",
      },

      profileImage: {
        type: String,
        default: "",
      },

      headline: {
        type: String,
        default: "",
      },

      rating: {
        type: Number,
        default: 0,
      },

      level: {
        type: String,
        default: "",
      },

      verified: {
        type: Boolean,
        default: false,
      },

      country: {
        type: String,
        default: "",
      },
    },
    {
      _id: false,
    }
  );

/* ==========================================================
   RATING BREAKDOWN SCHEMA
========================================================== */

const ratingBreakdownSchema =
  new mongoose.Schema(
    {
      fiveStar: {
        type: Number,
        default: 0,
      },

      fourStar: {
        type: Number,
        default: 0,
      },

      threeStar: {
        type: Number,
        default: 0,
      },

      twoStar: {
        type: Number,
        default: 0,
      },

      oneStar: {
        type: Number,
        default: 0,
      },
    },
    {
      _id: false,
    }
  );

/* ==========================================================
   GIG SCHEMA
========================================================== */

const gigSchema = new mongoose.Schema(
  {
    /* ======================================================
       BASIC INFORMATION
    ====================================================== */

    title: {
      type: String,
      required: [true, "Gig title is required"],
      trim: true,
      minlength: 5,
      maxlength: 100,
    },

    shortDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 5000,
    },
        /* ======================================================
       CATEGORY
    ====================================================== */

    category: {
      type: String,
      required: true,
      enum: [
        "Web Development",
        "App Development",
        "UI/UX Design",
        "Graphic Design",
        "Video Editing",
        "Content Writing",
        "Digital Marketing",
        "Data Science",
        "AI & Machine Learning",
        "Cyber Security",
        "Cloud Computing",
        "DevOps",
        "Other",
      ],
    },

    subCategory: {
      type: String,
      default: "",
      trim: true,
    },

    serviceType: {
      type: String,
      default: "",
      trim: true,
    },

    /* ======================================================
       SEARCH TAGS
    ====================================================== */

    tags: {
      type: [String],
      default: [],
    },

    keywords: {
      type: [String],
      default: [],
    },

    /* ======================================================
       PACKAGES
    ====================================================== */

    basicPackage: {
      type: packageSchema,
      required: true,
    },

    standardPackage: {
      type: packageSchema,
      default: null,
    },

    premiumPackage: {
      type: packageSchema,
      default: null,
    },

    extraServices: {
      type: [extraServiceSchema],
      default: [],
    },

    currency: {
      type: String,
      default: "INR",
      uppercase: true,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    /* ======================================================
       GALLERY
    ====================================================== */

    coverImage: {
      type: String,
      required: true,
      trim: true,
    },

    gallery: {
      type: [gallerySchema],
      default: [],
    },

    /* ======================================================
       BUYER REQUIREMENTS
    ====================================================== */

    requirements: {
      type: [requirementSchema],
      default: [],
    },

    faqs: {
      type: [faqSchema],
      default: [],
    },

    /* ======================================================
       AI MATCHING
    ====================================================== */

    aiMatching: {
      type: aiMatchingSchema,
      default: () => ({}),
    },

    /* ======================================================
       PROJECT DETAILS
    ====================================================== */

    jobType: {
      type: String,
      enum: [
        "Remote",
        "Hybrid",
        "On-site",
      ],
      default: "Remote",
    },

    level: {
      type: String,
      enum: [
        "Beginner",
        "Intermediate",
        "Expert",
      ],
      default: "Beginner",
    },

    industry: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    estimatedDuration: {
      type: Number,
      default: 0,
      min: 0,
    },

    deadline: {
      type: Date,
      default: null,
    },

    /* ======================================================
       FREELANCER
    ====================================================== */

    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    freelancerSnapshot: {
      type: freelancerSnapshotSchema,
      default: () => ({}),
    },
        /* ======================================================
       STATUS
    ====================================================== */

    status: {
      type: String,
      enum: [
        "draft",
        "pending",
        "approved",
        "rejected",
        "paused",
        "completed",
        "deleted",
      ],
      default: "pending",
    },

    rejectionReason: {
      type: String,
      default: "",
      trim: true,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    /* ======================================================
       VISIBILITY
    ====================================================== */

    isActive: {
      type: Boolean,
      default: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    sponsored: {
      type: Boolean,
      default: false,
    },

    trending: {
      type: Boolean,
      default: false,
    },

    aiRecommended: {
      type: Boolean,
      default: false,
    },

    premiumGig: {
      type: Boolean,
      default: false,
    },

    /* ======================================================
       STATISTICS
    ====================================================== */

    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    uniqueViews: {
      type: Number,
      default: 0,
      min: 0,
    },

    impressions: {
      type: Number,
      default: 0,
      min: 0,
    },

    clicks: {
      type: Number,
      default: 0,
      min: 0,
    },

    favorites: {
      type: Number,
      default: 0,
      min: 0,
    },

    shares: {
      type: Number,
      default: 0,
      min: 0,
    },

    applications: {
      type: Number,
      default: 0,
      min: 0,
    },

    orders: {
      type: Number,
      default: 0,
      min: 0,
    },

    completedOrders: {
      type: Number,
      default: 0,
      min: 0,
    },

    cancelledOrders: {
      type: Number,
      default: 0,
      min: 0,
    },

    activeOrders: {
      type: Number,
      default: 0,
      min: 0,
    },

    revenue: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* ======================================================
       RATINGS
    ====================================================== */

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    ratingBreakdown: {
      type: ratingBreakdownSchema,
      default: () => ({
        fiveStar: 0,
        fourStar: 0,
        threeStar: 0,
        twoStar: 0,
        oneStar: 0,
      }),
    },

    /* ======================================================
       ANALYTICS
    ====================================================== */

    analytics: {
      type: analyticsSchema,
      default: () => ({}),
    },

    /* ======================================================
       SEO
    ====================================================== */

    seo: {
      type: seoSchema,
      default: () => ({}),
    },

    /* ======================================================
       ADMIN
    ====================================================== */

    reports: {
      type: Number,
      default: 0,
    },

    reportReason: {
      type: String,
      default: "",
      trim: true,
    },

    moderationNotes: {
      type: String,
      default: "",
      trim: true,
    },

    suspended: {
      type: Boolean,
      default: false,
    },

    suspensionReason: {
      type: String,
      default: "",
      trim: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    /* ======================================================
       TIMESTAMPS
    ====================================================== */

    publishedAt: {
      type: Date,
      default: Date.now,
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,

    toJSON: {
      virtuals: true,
    },

    toObject: {
      virtuals: true,
    },
  }
);
/* ==========================================================
   VIRTUALS
========================================================== */

gigSchema.virtual("startingPrice").get(function () {
  return this.basicPackage?.price || 0;
});

gigSchema.virtual("formattedPrice").get(function () {
  return `${this.currency} ${this.basicPackage?.price || 0}`;
});

gigSchema.virtual("deliveryText").get(function () {
  return `${this.basicPackage?.deliveryTime || 0} Days`;
});

gigSchema.virtual("completionRate").get(function () {
  if (this.orders === 0) return 100;

  return Math.round(
    (this.completedOrders / this.orders) * 100
  );
});

gigSchema.virtual("isApproved").get(function () {
  return this.status === "approved";
});

gigSchema.virtual("isPublished").get(function () {
  return (
    this.status === "approved" &&
    this.isActive &&
    !this.suspended
  );
});

/* ==========================================================
   PRE SAVE
========================================================== */

gigSchema.pre("save", function (next) {
  this.lastUpdated = new Date();

  next();
});

/* ==========================================================
   AUTO SLUG
========================================================== */

gigSchema.pre("save", function (next) {
  if (
    this.isModified("title") ||
    !this.seo.slug
  ) {
    this.seo.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  next();
});

/* ==========================================================
   VIEW METHODS
========================================================== */

gigSchema.methods.incrementViews =
  async function () {
    this.views += 1;

    this.analytics.weeklyViews += 1;
    this.analytics.monthlyViews += 1;
    this.analytics.yearlyViews += 1;

    return await this.save();
  };

gigSchema.methods.incrementUniqueViews =
  async function () {
    this.uniqueViews += 1;

    return await this.save();
  };

/* ==========================================================
   FAVORITE METHODS
========================================================== */

gigSchema.methods.addFavorite =
  async function () {
    this.favorites += 1;

    this.analytics.saves += 1;

    return await this.save();
  };

gigSchema.methods.removeFavorite =
  async function () {
    if (this.favorites > 0) {
      this.favorites -= 1;
    }

    if (this.analytics.saves > 0) {
      this.analytics.saves -= 1;
    }

    return await this.save();
  };

/* ==========================================================
   SHARE METHODS
========================================================== */

gigSchema.methods.incrementShares =
  async function () {
    this.shares += 1;

    this.analytics.shares += 1;

    return await this.save();
  };

/* ==========================================================
   CLICK METHODS
========================================================== */

gigSchema.methods.incrementClicks =
  async function () {
    this.clicks += 1;

    this.analytics.clicks += 1;

    if (this.impressions > 0) {
      this.analytics.conversionRate =
        Number(
          (
            (this.clicks / this.impressions) *
            100
          ).toFixed(2)
        );
    }

    return await this.save();
  };

/* ==========================================================
   IMPRESSION METHODS
========================================================== */

gigSchema.methods.incrementImpressions =
  async function () {
    this.impressions += 1;

    return await this.save();
  };
  /* ==========================================================
   ORDER METHODS
========================================================== */

gigSchema.methods.placeOrder =
  async function (amount = 0) {
    this.orders += 1;

    this.activeOrders += 1;

    this.revenue += amount;

    return await this.save();
  };

gigSchema.methods.completeOrder =
  async function () {
    this.completedOrders += 1;

    if (this.activeOrders > 0) {
      this.activeOrders -= 1;
    }

    return await this.save();
  };

gigSchema.methods.cancelOrder =
  async function () {
    this.cancelledOrders += 1;

    if (this.activeOrders > 0) {
      this.activeOrders -= 1;
    }

    return await this.save();
  };

/* ==========================================================
   RATING METHODS
========================================================== */

gigSchema.methods.updateRating =
  async function (stars) {

    if (stars < 1 || stars > 5) {
      throw new Error(
        "Rating must be between 1 and 5."
      );
    }

    const totalRating =
      this.rating * this.reviews + stars;

    this.reviews += 1;

    this.rating = Number(
      (totalRating / this.reviews).toFixed(2)
    );

    switch (stars) {

      case 5:
        this.ratingBreakdown.fiveStar++;
        break;

      case 4:
        this.ratingBreakdown.fourStar++;
        break;

      case 3:
        this.ratingBreakdown.threeStar++;
        break;

      case 2:
        this.ratingBreakdown.twoStar++;
        break;

      case 1:
        this.ratingBreakdown.oneStar++;
        break;

      default:
        break;
    }

    return await this.save();
  };

/* ==========================================================
   ADMIN METHODS
========================================================== */

gigSchema.methods.approve =
  async function (adminId) {

    this.status = "approved";

    this.approvedBy = adminId;

    this.approvedAt = new Date();

    this.rejectionReason = "";

    return await this.save();
  };

gigSchema.methods.reject =
  async function (reason = "") {

    this.status = "rejected";

    this.rejectionReason = reason;

    return await this.save();
  };

gigSchema.methods.pause =
  async function () {

    this.status = "paused";

    return await this.save();
  };

gigSchema.methods.resume =
  async function () {

    this.status = "approved";

    return await this.save();
  };

gigSchema.methods.suspend =
  async function (reason = "") {

    this.suspended = true;

    this.suspensionReason = reason;

    return await this.save();
  };

gigSchema.methods.activate =
  async function () {

    this.suspended = false;

    this.suspensionReason = "";

    return await this.save();
  };

gigSchema.methods.softDelete =
  async function () {

    this.status = "deleted";

    this.deletedAt = new Date();

    this.isActive = false;

    return await this.save();
  };

/* ==========================================================
   FEATURE METHODS
========================================================== */

gigSchema.methods.makeFeatured =
  async function () {

    this.featured = true;

    return await this.save();
  };

gigSchema.methods.removeFeatured =
  async function () {

    this.featured = false;

    return await this.save();
  };

gigSchema.methods.makeTrending =
  async function () {

    this.trending = true;

    return await this.save();
  };

gigSchema.methods.removeTrending =
  async function () {

    this.trending = false;

    return await this.save();
  };

gigSchema.methods.makePremium =
  async function () {

    this.premiumGig = true;

    return await this.save();
  };

gigSchema.methods.removePremium =
  async function () {

    this.premiumGig = false;

    return await this.save();
  };

/* ==========================================================
   STATIC METHODS
========================================================== */

gigSchema.statics.getFeatured =
  function () {

    return this.find({
      featured: true,
      status: "approved",
      suspended: false,
    }).populate(
      "freelancer",
      "name profileImage rating verification"
    );
  };

gigSchema.statics.getTrending =
  function () {

    return this.find({
      trending: true,
      status: "approved",
      suspended: false,
    }).sort({
      views: -1,
    });
  };

gigSchema.statics.getPremium =
  function () {

    return this.find({
      premiumGig: true,
      status: "approved",
      suspended: false,
    });
  };

gigSchema.statics.searchGigs =
  function (keyword) {

    return this.find({

      status: "approved",

      suspended: false,

      $text: {
        $search: keyword,
      },
    });
  };
  /* ==========================================================
   QUERY MIDDLEWARE
========================================================== */

// Hide deleted gigs from normal queries
gigSchema.pre(/^find/, function (next) {
  this.where({
    status: {
      $ne: "deleted",
    },
  });

  next();
});

// Hide suspended gigs
gigSchema.pre(/^find/, function (next) {
  this.where({
    suspended: false,
  });

  next();
});

/* ==========================================================
   PLATFORM ANALYTICS
========================================================== */

gigSchema.statics.getPlatformGigStats =
  async function () {

    const total =
      await this.countDocuments();

    const approved =
      await this.countDocuments({
        status: "approved",
      });

    const pending =
      await this.countDocuments({
        status: "pending",
      });

    const rejected =
      await this.countDocuments({
        status: "rejected",
      });

    const draft =
      await this.countDocuments({
        status: "draft",
      });

    const paused =
      await this.countDocuments({
        status: "paused",
      });

    const featured =
      await this.countDocuments({
        featured: true,
      });

    const premium =
      await this.countDocuments({
        premiumGig: true,
      });

    const trending =
      await this.countDocuments({
        trending: true,
      });

    const suspended =
      await this.countDocuments({
        suspended: true,
      });

    return {
      total,
      approved,
      pending,
      rejected,
      draft,
      paused,
      featured,
      premium,
      trending,
      suspended,
    };
  };

/* ==========================================================
   CATEGORY ANALYTICS
========================================================== */

gigSchema.statics.getTopCategories =
  async function () {

    return await this.aggregate([
      {
        $match: {
          status: "approved",
        },
      },

      {
        $group: {
          _id: "$category",

          totalGigs: {
            $sum: 1,
          },

          totalRevenue: {
            $sum: "$revenue",
          },

          totalOrders: {
            $sum: "$orders",
          },

          averageRating: {
            $avg: "$rating",
          },
        },
      },

      {
        $sort: {
          totalRevenue: -1,
        },
      },
    ]);
  };

/* ==========================================================
   TOP GIGS
========================================================== */

gigSchema.statics.getTopRated =
  function () {

    return this.find({
      status: "approved",
      suspended: false,
    })
      .sort({
        rating: -1,
        reviews: -1,
      })
      .limit(10);
  };

gigSchema.statics.getMostViewed =
  function () {

    return this.find({
      status: "approved",
      suspended: false,
    })
      .sort({
        views: -1,
      })
      .limit(10);
  };

gigSchema.statics.getBestSelling =
  function () {

    return this.find({
      status: "approved",
      suspended: false,
    })
      .sort({
        completedOrders: -1,
      })
      .limit(10);
  };

gigSchema.statics.getAIRecommended =
  function () {

    return this.find({
      aiRecommended: true,
      status: "approved",
      suspended: false,
    })
      .sort({
        "aiMatching.aiScore": -1,
      })
      .limit(20);
  };

/* ==========================================================
   JSON TRANSFORM
========================================================== */

gigSchema.set("toJSON", {
  virtuals: true,

  transform(doc, ret) {

    delete ret.__v;

    return ret;
  },
});

/* ==========================================================
   INDEXES
========================================================== */

gigSchema.index({
  title: "text",
  shortDescription: "text",
  description: "text",
  tags: "text",
  keywords: "text",
});

gigSchema.index({
  category: 1,
});

gigSchema.index({
  subCategory: 1,
});

gigSchema.index({
  freelancer: 1,
});

gigSchema.index({
  status: 1,
});

gigSchema.index({
  featured: -1,
});

gigSchema.index({
  premiumGig: -1,
});

gigSchema.index({
  trending: -1,
});

gigSchema.index({
  aiRecommended: -1,
});

gigSchema.index({
  rating: -1,
});

gigSchema.index({
  completedOrders: -1,
});

gigSchema.index({
  revenue: -1,
});

gigSchema.index({
  views: -1,
});

gigSchema.index({
  createdAt: -1,
});

gigSchema.index({
  "seo.slug": 1,
});

/* ==========================================================
   MODEL
========================================================== */

const Gig = mongoose.model(
  "Gig",
  gigSchema
);

export default Gig;