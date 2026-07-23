import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Search,
  RefreshCw,
  Grid3X3,
  List,
  Briefcase,
} from "lucide-react";

import SearchHero from "../components/search/SearchHero";
import SearchBar from "../components/search/SearchBar";
import FilterSidebar from "../components/search/FilterSidebar";
import SearchResults from "../components/search/SearchResults";
import SearchPagination from "../components/search/SearchPagination";
import SearchSkeleton from "../components/search/SearchSkeleton";

import { searchGigs } from "../services/searchService";

export default function SearchPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [gigs, setGigs] = useState([]);
  const [view, setView] = useState("grid");

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
  });

  const [filters, setFilters] = useState({
    keyword: "",
    category: "",
    location: "",
    level: "",
    rating: "",
    minPrice: "",
    maxPrice: "",
    sort: "newest",
    page: 1,
    limit: 12,
  });

  const loadGigs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await searchGigs(filters);

      setGigs(response.gigs || []);

      setPagination({
        currentPage: response.currentPage || 1,
        totalPages: response.totalPages || 1,
        totalResults: response.totalResults || 0,
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load services."
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadGigs();
  }, [loadGigs]);

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Hero */}

      <SearchHero />

      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 py-10">

        {/* Search */}

        <SearchBar
          filters={filters}
          setFilters={setFilters}
        />

        <div className="mt-8 grid lg:grid-cols-4 gap-8">

          {/* Sidebar */}

          <aside className="lg:sticky lg:top-24 self-start">

            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
            />

          </aside>

          {/* Results */}

          <motion.section
            className="lg:col-span-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >

            {/* Top Bar */}

            <div className="bg-white rounded-2xl shadow-md p-5 mb-6">

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                <div>

                  <h2 className="text-2xl font-bold flex items-center gap-2">

                    <Briefcase size={26} />

                    {pagination.totalResults} Services Found

                  </h2>

                  <p className="text-gray-500 mt-1">
                    Browse freelancers and AI matched gigs.
                  </p>

                </div>

                <div className="flex gap-3">

                  <button
                    onClick={loadGigs}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition"
                  >
                    <RefreshCw size={18} />
                    Refresh
                  </button>

                  <button
                    onClick={() => setView("grid")}
                    className={`p-3 rounded-xl ${
                      view === "grid"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    <Grid3X3 size={18} />
                  </button>

                  <button
                    onClick={() => setView("list")}
                    className={`p-3 rounded-xl ${
                      view === "list"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    <List size={18} />
                  </button>

                </div>

              </div>

            </div>

            {/* Error */}

            {error && (
              <div className="bg-red-100 border border-red-300 rounded-xl p-5 text-red-600 mb-6">
                {error}
              </div>
            )}

            {/* Loading */}

            {loading ? (
              <SearchSkeleton />
            ) : gigs.length === 0 ? (

              <div className="bg-white rounded-2xl shadow-lg p-20 text-center">

                <Search
                  size={70}
                  className="mx-auto text-blue-500"
                />

                <h2 className="text-3xl font-bold mt-6">
                  No Services Found
                </h2>

                <p className="text-gray-500 mt-3">
                  Try changing your filters or search keywords.
                </p>

              </div>

            ) : (

              <>
                <SearchResults
                  gigs={gigs}
                  view={view}
                />

                <div className="mt-10 flex justify-center">

                  <SearchPagination
                    page={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={(page) =>
                      setFilters((prev) => ({
                        ...prev,
                        page,
                      }))
                    }
                  />

                </div>

              </>

            )}

          </motion.section>

        </div>

      </div>

    </div>
  );
}