import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Sparkles,
  Clock3,
  TrendingUp,
  X,
} from "lucide-react";

const POPULAR_SKILLS = [
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "MongoDB",
  "TypeScript",
  "Python",
  "Java",
  "Flutter",
  "React Native",
  "UI/UX Design",
  "Figma",
  "WordPress",
  "AI",
  "Machine Learning",
  "SEO",
];

const SearchBar = ({
  filters,
  setFilters,
  totalResults = 0,
  loading = false,
}) => {
  const [keyword, setKeyword] = useState(
    filters.keyword || ""
  );

  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved =
      JSON.parse(
        localStorage.getItem("searchHistory")
      ) || [];

    setHistory(saved);
  }, []);

  const suggestions = useMemo(() => {
    if (!keyword.trim()) return [];

    return POPULAR_SKILLS.filter((item) =>
      item
        .toLowerCase()
        .includes(keyword.toLowerCase())
    ).slice(0, 6);
  }, [keyword]);

  const saveHistory = (text) => {
    if (!text.trim()) return;

    let items = JSON.parse(
      localStorage.getItem("searchHistory")
    ) || [];

    items = [
      text,
      ...items.filter(
        (item) => item !== text
      ),
    ];

    items = items.slice(0, 6);

    localStorage.setItem(
      "searchHistory",
      JSON.stringify(items)
    );

    setHistory(items);
  };

  const performSearch = (text = keyword) => {
    const value = text.trim();

    saveHistory(value);

    setFilters((prev) => ({
      ...prev,
      keyword: value,
      page: 1,
    }));
  };

  const clearSearch = () => {
    setKeyword("");

    setFilters((prev) => ({
      ...prev,
      keyword: "",
      page: 1,
    }));
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="-mt-12 relative z-20"
    >
      <div className="overflow-hidden rounded-3xl border border-white/50 bg-white shadow-2xl">

        {/* Header */}

        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 px-8 py-6 text-white">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="flex items-center gap-2 text-2xl font-bold">

                <Sparkles size={24} />

                Find Your Perfect Freelancer

              </h2>

              <p className="mt-2 text-blue-100">
                Search thousands of verified professionals.
              </p>

            </div>

            {totalResults > 0 && (
              <div className="rounded-2xl bg-white/20 px-5 py-3 backdrop-blur">
                <p className="text-xs uppercase tracking-wide">
                  Results
                </p>

                <h3 className="text-2xl font-bold">
                  {totalResults}
                </h3>
              </div>
            )}

          </div>

        </div>

        {/* Search */}

        <div className="p-8">

          <div className="flex flex-col gap-4 lg:flex-row">

            <div className="relative flex-1">

              <Search
                size={20}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search skills, technologies or freelancers..."
                value={keyword}
                onChange={(e) =>
                  setKeyword(e.target.value)
                }
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  performSearch()
                }
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pl-14 pr-12 text-lg outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />

              {keyword && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-red-500"
                >
                  <X size={18} />
                </button>
              )}

            </div>

            <button
              onClick={() =>
                performSearch()
              }
              disabled={loading}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-10 py-4 font-bold text-white transition hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading
                ? "Searching..."
                : "Search"}
            </button>

          </div>

          {/* Suggestions */}

          {suggestions.length > 0 && (

            <div className="mt-6 rounded-2xl border bg-gray-50 p-5">

              <h3 className="mb-4 flex items-center gap-2 font-semibold">

                <Search
                  size={16}
                  className="text-blue-600"
                />

                Suggestions

              </h3>

              <div className="flex flex-wrap gap-3">

                {suggestions.map((item) => (

                  <button
                    key={item}
                    onClick={() => {
                      setKeyword(item);
                      performSearch(item);
                    }}
                    className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow transition hover:bg-blue-600 hover:text-white"
                  >
                    {item}
                  </button>

                ))}

              </div>

            </div>

          )}

          {/* Popular */}

          <div className="mt-8">

            <h3 className="mb-4 flex items-center gap-2 font-semibold">

              <TrendingUp
                size={18}
                className="text-blue-600"
              />

              Trending Skills

            </h3>

            <div className="flex flex-wrap gap-3">

              {POPULAR_SKILLS.map((skill) => (

                <button
                  key={skill}
                  onClick={() => {
                    setKeyword(skill);
                    performSearch(skill);
                  }}
                  className="rounded-full bg-blue-50 px-5 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                >
                  {skill}
                </button>

              ))}

            </div>

          </div>

          {/* History */}

          {history.length > 0 && (

            <div className="mt-8">

              <h3 className="mb-4 flex items-center gap-2 font-semibold">

                <Clock3
                  size={18}
                  className="text-gray-500"
                />

                Recent Searches

              </h3>

              <div className="flex flex-wrap gap-3">

                {history.map((item) => (

                  <button
                    key={item}
                    onClick={() => {
                      setKeyword(item);
                      performSearch(item);
                    }}
                    className="rounded-full border px-4 py-2 text-sm transition hover:border-blue-500 hover:bg-blue-50"
                  >
                    {item}
                  </button>

                ))}

              </div>

            </div>

          )}

        </div>

      </div>
    </motion.div>
  );
};

export default SearchBar;