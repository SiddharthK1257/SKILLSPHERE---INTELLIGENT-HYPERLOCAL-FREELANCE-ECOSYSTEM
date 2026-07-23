import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";

const SearchBar = ({
  value = "",
  onSearch = () => {},
  placeholder = "Search...",
  loading = false,
  suggestions = [],
  showSuggestions = true,
}) => {
  /* ============================================
      STATE
  ============================================ */

  const [query, setQuery] = useState(value);

  const [focused, setFocused] = useState(false);

  /* ============================================
      SYNC VALUE FROM PARENT
  ============================================ */

  useEffect(() => {
    setQuery(value);
  }, [value]);

  /* ============================================
      FILTER SUGGESTIONS
  ============================================ */

  const filteredSuggestions = useMemo(() => {
    if (!showSuggestions) return [];

    if (!query.trim()) return [];

    if (!Array.isArray(suggestions)) return [];

    return suggestions
      .filter(
        (item) =>
          typeof item === "string" &&
          item
            .toLowerCase()
            .includes(query.toLowerCase())
      )
      .slice(0, 6);
  }, [
    query,
    suggestions,
    showSuggestions,
  ]);

  /* ============================================
      SEARCH
  ============================================ */

  const handleSearch = () => {
    onSearch(query.trim());
    setFocused(false);
  };

  /* ============================================
      CLEAR
  ============================================ */

  const clearSearch = () => {
    setQuery("");
    onSearch("");
    setFocused(false);
  };

  /* ============================================
      KEYBOARD
  ============================================ */

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }

    if (e.key === "Escape") {
      setFocused(false);
    }
  };

  /* ============================================
      RENDER
  ============================================ */

  return (
    <div className="relative w-full">

      <motion.div
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.35,
        }}
        className="
        flex
        items-center
        overflow-hidden
        rounded-2xl
        border
        border-gray-200
        bg-white
        shadow-lg
        transition-all
        duration-300
        focus-within:border-blue-500
        focus-within:ring-4
        focus-within:ring-blue-100
        "
      >
        <div className="pl-5 text-gray-500">
          <FaSearch size={18} />
        </div>

        <input
          type="text"
          value={query}
          placeholder={placeholder}
          autoComplete="off"
          onChange={(e) =>
            setQuery(e.target.value)
          }
          onFocus={() =>
            setFocused(true)
          }
          onBlur={() =>
            setTimeout(
              () => setFocused(false),
              150
            )
          }
          onKeyDown={handleKeyDown}
          className="
          h-14
          flex-1
          bg-transparent
          px-4
          text-gray-700
          outline-none
          placeholder:text-gray-400
          "
        />

        {loading && (
          <div className="mr-3">
            <FaSpinner
              size={18}
              className="animate-spin text-blue-600"
            />
          </div>
        )}

        {!loading && query && (
          <motion.button
            type="button"
            whileHover={{
              rotate: 90,
            }}
            whileTap={{
              scale: 0.9,
            }}
            onClick={clearSearch}
            className="
            mr-2
            rounded-full
            p-2
            text-gray-500
            transition
            hover:bg-red-50
            hover:text-red-500
            "
          >
            <FaTimes />
          </motion.button>
        )}

        <motion.button
          type="button"
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.95,
          }}
          disabled={loading}
          onClick={handleSearch}
          className="
          mr-2
          rounded-xl
          bg-gradient-to-r
          from-blue-600
          to-cyan-500
          px-5
          py-2.5
          font-semibold
          text-white
          shadow-md
          transition
          hover:shadow-lg
          disabled:opacity-60
          "
        >
          Search
        </motion.button>
      </motion.div>

      <AnimatePresence>

        {focused &&
          filteredSuggestions.length >
            0 && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              className="
              absolute
              z-50
              mt-2
              w-full
              overflow-hidden
              rounded-2xl
              border
              border-gray-200
              bg-white
              shadow-2xl
              "
            >
              {filteredSuggestions.map(
                (item) => (
                  <motion.button
                    key={item}
                    type="button"
                    whileHover={{
                      backgroundColor:
                        "#EFF6FF",
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    onMouseDown={() => {
                      setQuery(item);
                      onSearch(item);
                      setFocused(false);
                    }}
                    className="
                    flex
                    w-full
                    items-center
                    gap-3
                    border-b
                    border-gray-100
                    px-4
                    py-3
                    text-left
                    transition
                    last:border-none
                    hover:text-blue-600
                    "
                  >
                    <FaSearch
                      size={14}
                      className="text-gray-400"
                    />

                    <span>{item}</span>
                  </motion.button>
                )
              )}
            </motion.div>
          )}

      </AnimatePresence>
    </div>
  );
};

export default SearchBar;