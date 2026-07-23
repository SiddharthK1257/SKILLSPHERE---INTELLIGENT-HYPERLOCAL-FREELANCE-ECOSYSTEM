import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Home,
  Search,
  ArrowLeft,
  Briefcase,
  Users,
} from "lucide-react";

const quickLinks = [
  {
    title: "Browse Gigs",
    path: "/browse",
    icon: Briefcase,
  },
  {
    title: "Find Freelancers",
    path: "/freelancers",
    icon: Users,
  },
];

const NotFound = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-100 px-6">

      {/* ================= Animated Background ================= */}

      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 12,
        }}
        className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, -20, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 10,
        }}
        className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-cyan-400/20 blur-3xl"
      />

      {/* ================= Card ================= */}

      <motion.div
        initial={{
          opacity: 0,
          y: 40,
          scale: 0.96,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: .6,
        }}
        className="relative z-10 w-full max-w-3xl rounded-3xl border border-white/40 bg-white/90 p-10 shadow-2xl backdrop-blur-xl"
      >

        {/* Floating Icon */}

        <motion.div
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
          className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-red-100 shadow-lg"
        >
          <AlertTriangle
            className="h-14 w-14 text-red-500"
          />
        </motion.div>

        {/* 404 */}

        <motion.h1
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.5,
          }}
          className="mt-8 bg-gradient-to-r from-blue-700 via-cyan-500 to-sky-500 bg-clip-text text-center text-8xl font-black text-transparent md:text-9xl"
        >
          404
        </motion.h1>

        {/* Heading */}

        <h2 className="mt-6 text-center text-4xl font-bold text-slate-800">
          Oops! We couldn't find that page
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-center text-lg leading-8 text-gray-600">
          The page you're looking for may have been removed,
          renamed, or is temporarily unavailable.
          Let's get you back on track.
        </p>

        {/* Search */}

        <div className="mx-auto mt-10 flex max-w-xl overflow-hidden rounded-2xl border border-gray-200 shadow-md">

          <input
            type="text"
            placeholder="Search freelancers, projects, skills..."
            className="flex-1 px-5 py-4 outline-none"
          />

          <button className="bg-blue-600 px-6 text-white transition hover:bg-blue-700">
            <Search size={22} />
          </button>

        </div>

        {/* Buttons */}

        <div className="mt-10 flex flex-wrap justify-center gap-4">

          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:bg-blue-700"
          >
            <Home size={20} />
            Back Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 rounded-xl border-2 border-blue-600 px-8 py-4 font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>

        </div>

        {/* Quick Links */}

        <div className="mt-14 grid gap-5 sm:grid-cols-2">

          {quickLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                to={item.path}
                className="group rounded-2xl border border-gray-200 bg-gray-50 p-6 transition hover:-translate-y-2 hover:border-blue-300 hover:bg-blue-50"
              >
                <Icon className="mb-4 h-10 w-10 text-blue-600 transition group-hover:scale-110" />

                <h3 className="text-xl font-semibold">
                  {item.title}
                </h3>

                <p className="mt-2 text-gray-600">
                  Explore opportunities and discover
                  talented professionals.
                </p>
              </Link>
            );
          })}

        </div>

        {/* Footer */}

        <div className="mt-14 border-t pt-8 text-center">

          <p className="text-gray-500">
            SkillSphere • Connecting Talent with Opportunity
          </p>

          <p className="mt-2 text-sm text-gray-400">
            Need help? Contact our support team anytime.
          </p>

        </div>

      </motion.div>

    </section>
  );
};

export default NotFound;