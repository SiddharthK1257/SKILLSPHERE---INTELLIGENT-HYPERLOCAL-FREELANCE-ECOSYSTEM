import { motion } from "framer-motion";
import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className="
        relative
        flex
        h-12
        w-12
        items-center
        justify-center
        rounded-2xl
        border
        border-slate-200
        bg-white
        text-slate-700
        shadow-lg
        transition-all
        duration-300
        hover:border-blue-500
        hover:shadow-xl

        dark:bg-slate-900
        dark:border-slate-700
        dark:text-yellow-300
      "
    >
      <motion.div
        key={isDark ? "sun" : "moon"}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {isDark ? (
          <FaSun size={20} />
        ) : (
          <FaMoon size={18} />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;