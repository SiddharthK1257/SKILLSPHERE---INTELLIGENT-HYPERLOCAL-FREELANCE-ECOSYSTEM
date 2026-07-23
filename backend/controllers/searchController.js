import Gig from "../models/Gig.js";

/*
=========================================================
ADVANCED SEARCH GIGS
GET /api/search
=========================================================
*/

export const searchGigs = async (req, res) => {
  try {
    const {
      keyword = "",
      category,
      location,
      level,
      minPrice,
      maxPrice,
      rating,
      sort = "newest",
      page = 1,
      limit = 12,
    } = req.query;

    const query = {
      status: "approved",
      isActive: true,
      suspended: false,
    };

    // -----------------------------
    // Keyword Search
    // -----------------------------
    if (keyword.trim()) {
      query.$text = {
        $search: keyword.trim(),
      };
    }

    // -----------------------------
    // Category
    // -----------------------------
    if (category) {
      query.category = category;
    }

    // -----------------------------
    // Location
    // -----------------------------
    if (location) {
      query.location = {
        $regex: location,
        $options: "i",
      };
    }

    // -----------------------------
    // Experience Level
    // -----------------------------
    if (level) {
      query.level = level;
    }

    // -----------------------------
    // Minimum Rating
    // -----------------------------
    if (rating) {
      query.rating = {
        $gte: Number(rating),
      };
    }

    // -----------------------------
    // Price Filter
    // -----------------------------
    if (minPrice || maxPrice) {
      query["basicPackage.price"] = {};

      if (minPrice) {
        query["basicPackage.price"].$gte =
          Number(minPrice);
      }

      if (maxPrice) {
        query["basicPackage.price"].$lte =
          Number(maxPrice);
      }
    }

    // -----------------------------
    // Sorting
    // -----------------------------
    let sortOption = {};

    switch (sort) {
      case "priceLow":
        sortOption = {
          "basicPackage.price": 1,
        };
        break;

      case "priceHigh":
        sortOption = {
          "basicPackage.price": -1,
        };
        break;

      case "rating":
        sortOption = {
          rating: -1,
          reviews: -1,
        };
        break;

      case "popular":
        sortOption = {
          views: -1,
        };
        break;

      case "orders":
        sortOption = {
          completedOrders: -1,
        };
        break;

      case "newest":
      default:
        sortOption = {
          createdAt: -1,
        };
    }

    const currentPage = Number(page);
    const perPage = Number(limit);
    const skip = (currentPage - 1) * perPage;

    const totalResults =
      await Gig.countDocuments(query);

    const gigs = await Gig.find(query)
      .populate(
        "freelancer",
        "name profileImage rating verified country"
      )
      .sort(sortOption)
      .skip(skip)
      .limit(perPage);

    res.status(200).json({
      success: true,

      results: gigs.length,

      totalResults,

      currentPage,

      totalPages: Math.ceil(
        totalResults / perPage
      ),

      hasNextPage:
        currentPage <
        Math.ceil(totalResults / perPage),

      hasPrevPage: currentPage > 1,

      filters: {
        keyword,
        category,
        location,
        level,
        minPrice,
        maxPrice,
        rating,
        sort,
      },

      gigs,
    });
  } catch (error) {
    console.error("Search Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to search gigs.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};