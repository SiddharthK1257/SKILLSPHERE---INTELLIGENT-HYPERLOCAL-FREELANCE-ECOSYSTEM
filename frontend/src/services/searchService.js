// src/services/searchService.js

import api from "./api";

/**
 * Remove empty values before sending request
 */
const cleanFilters = (filters = {}) => {
  return Object.entries(filters).reduce((acc, [key, value]) => {
    if (
      value !== "" &&
      value !== null &&
      value !== undefined &&
      value !== false &&
      !(Array.isArray(value) && value.length === 0)
    ) {
      acc[key] = value;
    }

    return acc;
  }, {});
};

/**
 * Search gigs
 *
 * Example:
 * searchGigs({
 *   keyword: "React",
 *   category: "Web Development",
 *   location: "India",
 *   minPrice: 500,
 *   maxPrice: 5000,
 *   rating: 4,
 *   sort: "rating",
 *   page: 1,
 *   limit: 12,
 * });
 */
export const searchGigs = async (
  filters = {},
  signal = null
) => {
  try {
    const params = cleanFilters(filters);

    const response = await api.get("/search", {
      params,
      signal,
    });

    return response.data;
  } catch (error) {
    // Request cancelled
    if (
      error.name === "CanceledError" ||
      error.code === "ERR_CANCELED"
    ) {
      return null;
    }

    console.error("Search Service Error:", error);

    throw {
      success: false,
      message:
        error?.response?.data?.message ||
        "Unable to load search results.",
      errors:
        error?.response?.data?.errors || [],
      status:
        error?.response?.status || 500,
    };
  }
};

/**
 * Search Suggestions
 *
 * GET /search/suggestions?keyword=react
 */
export const getSearchSuggestions = async (
  keyword,
  signal = null
) => {
  try {
    if (!keyword?.trim()) return [];

    const { data } = await api.get(
      "/search/suggestions",
      {
        params: {
          keyword,
        },
        signal,
      }
    );

    return data;
  } catch (error) {
    console.error(
      "Suggestion Error:",
      error
    );

    return [];
  }
};

/**
 * Trending Searches
 *
 * GET /search/trending
 */
export const getTrendingSearches =
  async () => {
    try {
      const { data } = await api.get(
        "/search/trending"
      );

      return data;
    } catch (error) {
      console.error(
        "Trending Search Error:",
        error
      );

      return [];
    }
  };

/**
 * Popular Categories
 *
 * GET /search/categories
 */
export const getPopularCategories =
  async () => {
    try {
      const { data } = await api.get(
        "/search/categories"
      );

      return data;
    } catch (error) {
      console.error(
        "Category Error:",
        error
      );

      return [];
    }
  };

/**
 * Featured Freelancers
 *
 * GET /search/freelancers
 */
export const getFeaturedFreelancers =
  async () => {
    try {
      const { data } = await api.get(
        "/search/freelancers"
      );

      return data;
    } catch (error) {
      console.error(
        "Freelancer Error:",
        error
      );

      return [];
    }
  };

export default {
  searchGigs,
  getSearchSuggestions,
  getTrendingSearches,
  getPopularCategories,
  getFeaturedFreelancers,
};