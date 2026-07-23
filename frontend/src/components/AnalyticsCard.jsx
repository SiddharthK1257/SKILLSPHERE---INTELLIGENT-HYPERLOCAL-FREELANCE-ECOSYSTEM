import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

const AnalyticsCard = ({
  title,
  value,
  icon,
  color = "from-blue-500 to-blue-600",
  bg = "bg-blue-50",
  textColor = "text-blue-600",
  trend,
  trendType = "up",
  progress,
}) => {
  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.02,
      }}
      transition={{ duration: 0.25 }}
      className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-md hover:shadow-2xl"
    >
      {/* Background Glow */}

      <div
        className={`absolute -top-10 -right-10 h-28 w-28 rounded-full ${bg} blur-3xl opacity-70`}
      />

      <div className="relative z-10">

        {/* Header */}

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              {title}
            </p>

            <h2 className="mt-3 text-4xl font-bold text-gray-900">
              {value}
            </h2>

          </div>

          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${color} text-white shadow-lg`}
          >
            {icon}
          </div>

        </div>

        {/* Trend */}

        {trend && (
          <div className="mt-5 flex items-center gap-2">

            {trendType === "up" ? (
              <TrendingUp
                size={18}
                className="text-green-500"
              />
            ) : (
              <TrendingDown
                size={18}
                className="text-red-500"
              />
            )}

            <span
              className={`text-sm font-semibold ${
                trendType === "up"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {trend}
            </span>

            <span className="text-sm text-gray-500">
              vs last month
            </span>

          </div>
        )}

        {/* Progress */}

        {progress !== undefined && (
          <div className="mt-6">

            <div className="mb-2 flex justify-between text-sm">

              <span className="text-gray-500">
                Progress
              </span>

              <span className={`font-semibold ${textColor}`}>
                {progress}%
              </span>

            </div>

            <div className="h-2 overflow-hidden rounded-full bg-gray-200">

              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${progress}%`,
                }}
                transition={{
                  duration: 1,
                }}
                className={`h-full rounded-full bg-gradient-to-r ${color}`}
              />

            </div>

          </div>
        )}

      </div>
    </motion.div>
  );
};

export default AnalyticsCard;