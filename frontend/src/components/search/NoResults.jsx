import { motion } from "framer-motion";
import { FaSearch, FaRedo, FaRocket } from "react-icons/fa";

export default function NoResults() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.9,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: 0.5,
      }}
      className="
        flex
        min-h-[500px]
        flex-col
        items-center
        justify-center
        rounded-3xl
        border
        border-slate-200
        bg-gradient-to-br
        from-white
        via-slate-50
        to-blue-50
        p-10
        text-center
        shadow-xl
      "
    >
      {/* Animated Icon */}

      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
        }}
        className="
          flex
          h-28
          w-28
          items-center
          justify-center
          rounded-full
          bg-gradient-to-r
          from-blue-600
          to-cyan-500
          text-white
          shadow-2xl
        "
      >
        <FaSearch className="text-5xl" />
      </motion.div>

      {/* Heading */}

      <h2 className="mt-8 text-4xl font-black text-slate-900">
        No Services Found
      </h2>

      {/* Description */}

      <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">
        We couldn't find any services matching your search.
        Try changing your filters or search for another skill.
      </p>

      {/* Suggestions */}

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {[
          "React",
          "Node.js",
          "UI/UX",
          "AI",
          "Flutter",
          "Python",
        ].map((item) => (
          <motion.div
            key={item}
            whileHover={{
              scale: 1.08,
            }}
            className="
              cursor-pointer
              rounded-full
              bg-blue-50
              px-5
              py-3
              text-sm
              font-bold
              text-blue-600
              transition
              hover:bg-blue-600
              hover:text-white
            "
          >
            {item}
          </motion.div>
        ))}
      </div>

      {/* Buttons */}

      <div className="mt-12 flex flex-wrap justify-center gap-5">

        <button
          className="
            flex
            items-center
            gap-3
            rounded-2xl
            bg-gradient-to-r
            from-blue-600
            to-cyan-500
            px-8
            py-4
            font-bold
            text-white
            shadow-xl
            transition
            hover:scale-105
          "
        >
          <FaRedo />

          Reset Filters

        </button>

        <button
          className="
            flex
            items-center
            gap-3
            rounded-2xl
            border
            border-blue-600
            px-8
            py-4
            font-bold
            text-blue-600
            transition
            hover:bg-blue-600
            hover:text-white
          "
        >
          <FaRocket />

          Explore Trending

        </button>

      </div>

      {/* Bottom Text */}

      <p className="mt-10 text-sm text-slate-500">
        Tip: Try using fewer filters for better search results.
      </p>

    </motion.div>
  );
}