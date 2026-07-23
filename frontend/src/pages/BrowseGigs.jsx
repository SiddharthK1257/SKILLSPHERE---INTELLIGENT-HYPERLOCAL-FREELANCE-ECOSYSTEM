import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaFilter,
  FaRedoAlt,
  FaSortAmountDown,
  FaExclamationTriangle,
  FaBriefcase,
} from "react-icons/fa";

import Navbar from "../components/Navbar";
import GigCard from "../components/GigCard";
import API from "../services/api";

const CATEGORIES = [
  "All",
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "Graphic Design",
  "Video Editing",
  "Content Writing",
  "Digital Marketing",
  "Data Science",
  "AI & Machine Learning",
  "Other",
];

const SORT_OPTIONS = [
  {
    value: "newest",
    label: "Newest",
  },
  {
    value: "priceLow",
    label: "Price: Low to High",
  },
  {
    value: "priceHigh",
    label: "Price: High to Low",
  },
  {
    value: "rating",
    label: "Highest Rated",
  },
  {
    value: "popular",
    label: "Most Popular",
  },
];

const INITIAL_FILTERS = {
  search: "",
  category: "All",
  minPrice: "",
  maxPrice: "",
  sort: "newest",
};

function BrowseGigs() {
  const [gigs, setGigs] = useState([]);

  const [filters, setFilters] =
    useState(INITIAL_FILTERS);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [refreshing, setRefreshing] =
    useState(false);

  /* =====================================================
     FETCH GIGS
  ===================================================== */

  const fetchGigs = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response = await API.get("/gigs");

        const data = response?.data;

        let fetchedGigs = [];

        if (Array.isArray(data)) {
          fetchedGigs = data;
        } else if (Array.isArray(data?.gigs)) {
          fetchedGigs = data.gigs;
        } else if (Array.isArray(data?.data)) {
          fetchedGigs = data.data;
        }

        setGigs(fetchedGigs);
      } catch (err) {
        console.error(
          "Fetch Gigs Error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to fetch gigs. Please try again."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  /* =====================================================
     INITIAL FETCH
  ===================================================== */

  useEffect(() => {
    fetchGigs();
  }, [fetchGigs]);

  /* =====================================================
     UPDATE FILTER
  ===================================================== */

  const updateFilter = (key, value) => {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  /* =====================================================
     RESET FILTERS
  ===================================================== */

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  /* =====================================================
     FILTER + SORT
  ===================================================== */

  const filteredGigs = useMemo(() => {
    const searchTerm =
      filters.search.trim().toLowerCase();

    const minPrice = filters.minPrice
      ? Number(filters.minPrice)
      : null;

    const maxPrice = filters.maxPrice
      ? Number(filters.maxPrice)
      : null;

    const result = gigs.filter((gig) => {
      const title =
        gig?.title?.toLowerCase() || "";

      const description =
        gig?.description?.toLowerCase() || "";

      const shortDescription =
        gig?.shortDescription?.toLowerCase() ||
        "";

      const category =
        gig?.category || "";

      const tags = Array.isArray(gig?.tags)
        ? gig.tags.join(" ").toLowerCase()
        : "";

      const price = Number(
        gig?.basicPackage?.price ||
          gig?.price ||
          gig?.startingPrice ||
          0
      );

      /* Search */

      const matchesSearch =
        !searchTerm ||
        title.includes(searchTerm) ||
        description.includes(searchTerm) ||
        shortDescription.includes(searchTerm) ||
        tags.includes(searchTerm);

      /* Category */

      const matchesCategory =
        filters.category === "All" ||
        category === filters.category;

      /* Minimum Price */

      const matchesMinPrice =
        minPrice === null ||
        price >= minPrice;

      /* Maximum Price */

      const matchesMaxPrice =
        maxPrice === null ||
        price <= maxPrice;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMinPrice &&
        matchesMaxPrice
      );
    });

    /* Sorting */

    return [...result].sort((a, b) => {
      const priceA = Number(
        a?.basicPackage?.price ||
          a?.price ||
          a?.startingPrice ||
          0
      );

      const priceB = Number(
        b?.basicPackage?.price ||
          b?.price ||
          b?.startingPrice ||
          0
      );

      const ratingA = Number(
        a?.rating || 0
      );

      const ratingB = Number(
        b?.rating || 0
      );

      const ordersA = Number(
        a?.completedOrders ||
          a?.orders ||
          0
      );

      const ordersB = Number(
        b?.completedOrders ||
          b?.orders ||
          0
      );

      switch (filters.sort) {
        case "priceLow":
          return priceA - priceB;

        case "priceHigh":
          return priceB - priceA;

        case "rating":
          return ratingB - ratingA;

        case "popular":
          return ordersB - ordersA;

        case "newest":
        default:
          return (
            new Date(
              b?.createdAt || 0
            ) -
            new Date(
              a?.createdAt || 0
            )
          );
      }
    });
  }, [gigs, filters]);

  /* =====================================================
     ACTIVE FILTER COUNT
  ===================================================== */

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (filters.search) count++;
    if (filters.category !== "All") count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.sort !== "newest") count++;

    return count;
  }, [filters]);

  /* =====================================================
     LOADING STATE
  ===================================================== */

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-slate-50 px-6 py-12">

          <div className="mx-auto max-w-7xl">

            <div className="mb-10 text-center">

              <div className="mx-auto h-10 w-72 animate-pulse rounded-xl bg-slate-200" />

              <div className="mx-auto mt-4 h-5 w-96 max-w-full animate-pulse rounded-lg bg-slate-200" />

            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

              {Array.from({ length: 6 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-3xl bg-white shadow-md"
                  >
                    <div className="h-64 animate-pulse bg-slate-200" />

                    <div className="space-y-4 p-6">

                      <div className="h-5 animate-pulse rounded bg-slate-200" />

                      <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200" />

                      <div className="h-20 animate-pulse rounded-2xl bg-slate-200" />

                      <div className="h-12 animate-pulse rounded-xl bg-slate-200" />

                    </div>
                  </div>
                )
              )}

            </div>

          </div>

        </main>
      </>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600">

          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-6 py-16 text-center">

            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-md">

                <FaBriefcase />

                Discover Professional Services

              </div>

              <h1 className="text-4xl font-black text-white md:text-6xl">

                Find the Perfect Gig

              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">

                Explore talented freelancers and discover
                professional services for your next project.

              </p>

            </motion.div>

          </div>

        </section>

        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="w-full px-6 py-10 lg:px-10 xl:px-16">

          {/* SEARCH CARD */}

          <div className="mb-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">

            <div className="grid gap-4 lg:grid-cols-[1fr_250px_180px]">

              {/* Search */}

              <div className="relative">

                <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  placeholder="Search gigs, skills, technologies..."
                  value={filters.search}
                  onChange={(e) =>
                    updateFilter(
                      "search",
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-5
                    py-4
                    pl-14
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:bg-white
                    focus:ring-4
                    focus:ring-blue-100
                  "
                />

              </div>

              {/* Category */}

              <select
                value={filters.category}
                onChange={(e) =>
                  updateFilter(
                    "category",
                    e.target.value
                  )
                }
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-5
                  py-4
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:bg-white
                  focus:ring-4
                  focus:ring-blue-100
                "
              >

                {CATEGORIES.map(
                  (category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  )
                )}

              </select>

              {/* Sort */}

              <select
                value={filters.sort}
                onChange={(e) =>
                  updateFilter(
                    "sort",
                    e.target.value
                  )
                }
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-5
                  py-4
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:bg-white
                  focus:ring-4
                  focus:ring-blue-100
                "
              >

                {SORT_OPTIONS.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* PRICE FILTERS */}

            <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

                <div className="flex items-center gap-2">

                  <FaFilter className="text-blue-600" />

                  <span className="font-semibold text-slate-700">
                    Price Range
                  </span>

                </div>

                <input
                  type="number"
                  min="0"
                  placeholder="Min ₹"
                  value={filters.minPrice}
                  onChange={(e) =>
                    updateFilter(
                      "minPrice",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 sm:w-32"
                />

                <input
                  type="number"
                  min="0"
                  placeholder="Max ₹"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    updateFilter(
                      "maxPrice",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 sm:w-32"
                />

              </div>

              <div className="flex items-center gap-3">

                {activeFilterCount > 0 && (
                  <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">

                    {activeFilterCount} Active Filter
                    {activeFilterCount > 1
                      ? "s"
                      : ""}

                  </span>
                )}

                <button
                  onClick={resetFilters}
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-red-50
                    px-4
                    py-3
                    font-semibold
                    text-red-600
                    transition
                    hover:bg-red-500
                    hover:text-white
                  "
                >

                  <FaRedoAlt />

                  Reset

                </button>

                <button
                  onClick={() => fetchGigs(true)}
                  disabled={refreshing}
                  className="
                    rounded-xl
                    bg-blue-600
                    px-5
                    py-3
                    font-semibold
                    text-white
                    transition
                    hover:bg-blue-700
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >

                  {refreshing
                    ? "Refreshing..."
                    : "Refresh"}

                </button>

              </div>

            </div>

          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="mb-10 rounded-3xl border border-red-200 bg-red-50 p-8 text-center">

              <FaExclamationTriangle className="mx-auto mb-4 text-4xl text-red-500" />

              <h2 className="text-xl font-bold text-red-700">
                Something went wrong
              </h2>

              <p className="mt-2 text-red-600">
                {error}
              </p>

              <button
                onClick={() => fetchGigs()}
                className="mt-5 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
              >
                Try Again
              </button>

            </div>
          )}

          {/* =================================================
              RESULTS HEADER
          ================================================= */}

          {!error && (
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div>

                <h2 className="text-3xl font-black text-slate-900">
                  Available Gigs
                </h2>

                <p className="mt-2 text-slate-600">

                  Showing{" "}
                  <span className="font-bold text-blue-600">
                    {filteredGigs.length}
                  </span>{" "}
                  {filteredGigs.length === 1
                    ? "gig"
                    : "gigs"}

                </p>

              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500">

                <FaSortAmountDown />

                Sorted by{" "}

                <span className="font-semibold text-slate-800">
                  {
                    SORT_OPTIONS.find(
                      (item) =>
                        item.value ===
                        filters.sort
                    )?.label
                  }
                </span>

              </div>

            </div>
          )}

          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {!error &&
            filteredGigs.length === 0 && (
              <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-lg">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">

                  <FaSearch className="text-3xl text-blue-600" />

                </div>

                <h2 className="mt-6 text-2xl font-bold text-slate-900">
                  No gigs found
                </h2>

                <p className="mx-auto mt-3 max-w-md text-slate-600">

                  Try changing your search term,
                  category, or price filters.

                </p>

                <button
                  onClick={resetFilters}
                  className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  Clear Filters
                </button>

              </div>
            )}

          {/* =================================================
              GIG GRID
          ================================================= */}

          {!error &&
            filteredGigs.length > 0 && (
              <motion.div
                layout
                className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
              >

                {filteredGigs.map(
                  (gig, index) => (
                    <motion.div
                      layout
                      key={gig._id}
                      initial={{
                        opacity: 0,
                        y: 30,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: index * 0.05,
                      }}
                    >
                      <GigCard gig={gig} />
                    </motion.div>
                  )
                )}

              </motion.div>
            )}

        </section>

      </main>
    </>
  );
}

export default BrowseGigs;