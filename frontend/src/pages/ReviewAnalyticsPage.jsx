import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BarChart3,
  Star,
  TrendingUp,
} from "lucide-react";

import ReviewAnalytics from "../components/reviews/ReviewAnalytics";

const ReviewAnalyticsPage = () => {
  const { freelancerId } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-100">

      {/* Background Effects */}
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10">

        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">

          <Link
            to="/"
            className="hover:text-blue-600"
          >
            Home
          </Link>

          <span>/</span>

          <Link
            to="/reviews"
            className="hover:text-blue-600"
          >
            Reviews
          </Link>

          <span>/</span>

          <span className="font-medium text-gray-700">
            Analytics
          </span>

        </div>

        {/* Header */}
        <motion.div
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="mb-8 rounded-3xl bg-white p-8 shadow-xl"
        >

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">

                <BarChart3
                  className="text-blue-600"
                  size={34}
                />

              </div>

              <h1 className="text-4xl font-bold text-gray-800">
                Review Analytics
              </h1>

              <p className="mt-3 max-w-2xl text-gray-500">
                Analyze freelancer performance, customer
                satisfaction, rating trends, review insights,
                and overall project quality through detailed
                analytics.
              </p>

            </div>

            <Link
              to="/reviews"
              className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium transition hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
              Back to Reviews
            </Link>

          </div>

        </motion.div>

        {/* Quick Highlights */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.2,
          }}
          className="mb-8 grid gap-6 md:grid-cols-3"
        >

          <div className="rounded-2xl bg-white p-6 shadow-md">

            <Star
              className="mb-4 text-yellow-500"
              size={32}
            />

            <h3 className="text-lg font-semibold">
              Overall Rating
            </h3>

            <p className="mt-2 text-gray-500">
              View average ratings across all completed
              projects and client reviews.
            </p>

          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">

            <TrendingUp
              className="mb-4 text-green-600"
              size={32}
            />

            <h3 className="text-lg font-semibold">
              Performance Trends
            </h3>

            <p className="mt-2 text-gray-500">
              Track rating improvements and identify
              long-term performance trends.
            </p>

          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">

            <BarChart3
              className="mb-4 text-blue-600"
              size={32}
            />

            <h3 className="text-lg font-semibold">
              Review Breakdown
            </h3>

            <p className="mt-2 text-gray-500">
              Analyze communication, delivery,
              professionalism, quality, and value.
            </p>

          </div>

        </motion.div>

        {/* Analytics Card */}
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.4,
          }}
          className="rounded-3xl bg-white p-8 shadow-xl"
        >

          <ReviewAnalytics
            freelancerId={freelancerId}
          />

        </motion.div>

      </div>

    </div>
  );
};

export default ReviewAnalyticsPage;