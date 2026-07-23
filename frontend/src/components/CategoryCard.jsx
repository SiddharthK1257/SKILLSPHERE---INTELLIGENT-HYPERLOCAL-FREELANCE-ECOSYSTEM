import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CategoryCard = ({
  title,
  description,
  image,
  gigs = 0,
  color = "from-blue-600 to-cyan-500",
}) => {
  const imageUrl =
    image ||
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900";

  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      transition={{
        duration: 0.25,
      }}
      className="group overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl border border-gray-100"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900";
          }}
        />

        <div
          className={`absolute inset-0 bg-gradient-to-t ${color} opacity-70`}
        />

        <div className="absolute top-4 right-4 rounded-full bg-white/95 backdrop-blur-sm px-4 py-2 shadow-lg">
          <span className="text-sm font-semibold text-blue-600">
            {gigs}+ Gigs
          </span>
        </div>

        <div className="absolute bottom-5 left-5">
          <h2 className="text-3xl font-bold text-white">
            {title}
          </h2>
        </div>
      </div>

      <div className="p-6">
        <p className="mb-6 text-gray-600 leading-relaxed">
          {description}
        </p>

        <Link
          to={`/browse-gigs?category=${encodeURIComponent(title)}`}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition-all duration-300 hover:bg-blue-700 hover:gap-3"
        >
          Explore
          <ArrowRight size={18} />
        </Link>
      </div>
    </motion.div>
  );
};

export default CategoryCard;