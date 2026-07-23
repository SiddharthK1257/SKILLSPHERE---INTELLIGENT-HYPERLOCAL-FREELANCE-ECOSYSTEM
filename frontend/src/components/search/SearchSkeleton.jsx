import { motion } from "framer-motion";

const shimmer =
  "relative overflow-hidden bg-slate-200 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/70 before:to-transparent";

const SkeletonBox = ({ className = "" }) => (
  <div className={`${shimmer} ${className}`} />
);

const SkeletonCard = ({ view = "grid" }) => {
  if (view === "list") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg"
      >
        <div className="flex flex-col md:flex-row">

          {/* Image */}

          <SkeletonBox className="h-72 w-full md:h-auto md:w-80" />

          {/* Content */}

          <div className="flex flex-1 flex-col justify-between p-6">

            <div>

              <div className="mb-5 flex items-center gap-4">

                <SkeletonBox className="h-14 w-14 rounded-full" />

                <div className="flex-1 space-y-3">

                  <SkeletonBox className="h-4 w-40 rounded-lg" />

                  <SkeletonBox className="h-3 w-28 rounded-lg" />

                </div>

              </div>

              <div className="space-y-3">

                <SkeletonBox className="h-6 w-full rounded-lg" />

                <SkeletonBox className="h-6 w-3/4 rounded-lg" />

              </div>

              <div className="mt-6 space-y-2">

                <SkeletonBox className="h-3 w-full rounded-lg" />

                <SkeletonBox className="h-3 w-full rounded-lg" />

                <SkeletonBox className="h-3 w-2/3 rounded-lg" />

              </div>

              <div className="mt-6 flex flex-wrap gap-3">

                {[1, 2, 3].map((item) => (
                  <SkeletonBox
                    key={item}
                    className="h-8 w-24 rounded-full"
                  />
                ))}

              </div>

            </div>

            <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">

              <div className="space-y-3">

                <SkeletonBox className="h-3 w-20 rounded-lg" />

                <SkeletonBox className="h-8 w-32 rounded-lg" />

              </div>

              <SkeletonBox className="h-12 w-40 rounded-2xl" />

            </div>

          </div>

        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.35,
      }}
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg"
    >
      {/* Image */}

      <SkeletonBox className="h-64 w-full" />

      {/* Body */}

      <div className="space-y-6 p-6">

        {/* Profile */}

        <div className="flex items-center gap-4">

          <SkeletonBox className="h-14 w-14 rounded-full" />

          <div className="flex-1 space-y-3">

            <SkeletonBox className="h-4 w-40 rounded-lg" />

            <SkeletonBox className="h-3 w-28 rounded-lg" />

          </div>

        </div>

        {/* Title */}

        <div className="space-y-3">

          <SkeletonBox className="h-5 w-full rounded-lg" />

          <SkeletonBox className="h-5 w-5/6 rounded-lg" />

        </div>

        {/* Description */}

        <div className="space-y-2">

          <SkeletonBox className="h-3 w-full rounded-lg" />

          <SkeletonBox className="h-3 w-full rounded-lg" />

          <SkeletonBox className="h-3 w-2/3 rounded-lg" />

        </div>

        {/* Skills */}

        <div className="flex flex-wrap gap-2">

          {[1, 2, 3].map((item) => (
            <SkeletonBox
              key={item}
              className="h-8 w-20 rounded-full"
            />
          ))}

        </div>

        {/* Statistics */}

        <div className="grid grid-cols-3 gap-3">

          {[1, 2, 3].map((item) => (
            <SkeletonBox
              key={item}
              className="h-20 rounded-2xl"
            />
          ))}

        </div>

        {/* Footer */}

        <div className="flex items-center justify-between border-t border-slate-100 pt-5">

          <div className="space-y-3">

            <SkeletonBox className="h-3 w-20 rounded-lg" />

            <SkeletonBox className="h-8 w-28 rounded-lg" />

          </div>

          <SkeletonBox className="h-12 w-36 rounded-2xl" />

        </div>

      </div>
    </motion.div>
  );
};

const SearchSkeleton = ({
  count = 6,
  view = "grid",
}) => {
  return (
    <>
      {/* Shimmer Animation */}

      <style>
        {`
          @keyframes shimmer {
            100% {
              transform: translateX(100%);
            }
          }
        `}
      </style>

      <div
        className={
          view === "grid"
            ? "grid gap-8 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
            : "space-y-8"
        }
      >
        {Array.from({ length: count }).map((_, index) => (
          <SkeletonCard
            key={index}
            view={view}
          />
        ))}
      </div>
    </>
  );
};

export default SearchSkeleton;