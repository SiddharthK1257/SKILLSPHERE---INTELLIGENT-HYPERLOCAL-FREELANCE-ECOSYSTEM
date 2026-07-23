import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search,
  Users,
  Briefcase,
  Star,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "25K+",
    label: "Verified Freelancers",
    color: "text-blue-400",
  },
  {
    icon: Briefcase,
    value: "15K+",
    label: "Active Gigs",
    color: "text-emerald-400",
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "Average Rating",
    color: "text-yellow-400",
  },
  {
    icon: ShieldCheck,
    value: "100%",
    label: "Secure Payments",
    color: "text-cyan-400",
  },
];

const popularSkills = [
  "React",
  "Node.js",
  "Next.js",
  "UI/UX",
  "Flutter",
  "Python",
  "AI",
  "SEO",
];

export default function SearchHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900">

      {/* Animated Background */}

      <div className="absolute inset-0 overflow-hidden">

        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, 40, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 14,
          }}
          className="absolute -left-32 -top-20 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"
        />

        <motion.div
          animate={{
            x: [0, -60, 0],
            y: [0, -40, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 12,
          }}
          className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-cyan-500/20 blur-3xl"
        />

        <motion.div
          animate={{
            scale: [1, 1.15, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 10,
          }}
          className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl"
        />

      </div>

      <div className="relative mx-auto flex min-h-[760px] max-w-7xl items-center px-6 py-20">

        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* Left */}

          <motion.div
            initial={{
              opacity: 0,
              x: -40,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
            }}
          >

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-5 py-2 text-sm font-semibold text-cyan-200 backdrop-blur">

              <Sparkles size={18} />

              World's Fastest Growing Freelance Marketplace

            </div>

            <h1 className="text-5xl font-black leading-tight text-white md:text-6xl xl:text-7xl">

              Find the

              <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-white bg-clip-text text-transparent">

                Perfect Freelancer

              </span>

              For Every Project

            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">

              Hire trusted professionals from around the globe.
              Build websites, mobile apps, AI solutions,
              graphic designs, content, marketing campaigns,
              and much more—all in one secure marketplace.

            </p>

            {/* Search */}

            <div className="mt-10 rounded-3xl bg-white p-3 shadow-2xl">

              <div className="flex flex-col gap-3 md:flex-row">

                <div className="relative flex-1">

                  <Search
                    size={22}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    placeholder="Search freelancers, skills or services..."
                    className="w-full rounded-2xl border-none py-4 pl-14 pr-4 text-lg outline-none"
                  />

                </div>

                <button className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-10 py-4 font-bold text-white transition hover:scale-105 hover:shadow-xl">

                  Search

                </button>

              </div>

            </div>

            {/* Popular Skills */}

            <div className="mt-8 flex flex-wrap items-center gap-3">

              <span className="font-semibold text-slate-300">

                Popular:

              </span>

              {popularSkills.map((skill) => (

                <button
                  key={skill}
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-cyan-500 hover:border-cyan-500"
                >
                  {skill}
                </button>

              ))}

            </div>

            {/* Buttons */}

            <div className="mt-10 flex flex-wrap gap-4">

              <Link
                to="/browse-gigs"
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-4 font-bold text-white transition hover:scale-105"
              >

                Browse Gigs

                <ArrowRight size={18} />

              </Link>

              <Link
                to="/register"
                className="rounded-2xl border border-white/30 px-8 py-4 font-bold text-white backdrop-blur transition hover:bg-white hover:text-slate-900"
              >

                Become a Freelancer

              </Link>

            </div>

          </motion.div>

          {/* Right */}

          <motion.div
            initial={{
              opacity: 0,
              x: 40,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.8,
            }}
            className="grid gap-6 sm:grid-cols-2"
          >

            {stats.map((item) => {

              const Icon = item.icon;

              return (

                <motion.div
                  key={item.label}
                  whileHover={{
                    y: -8,
                    scale: 1.03,
                  }}
                  className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-xl shadow-xl"
                >

                  <div
                    className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ${item.color}`}
                  >
                    <Icon size={34} />
                  </div>

                  <h2 className="text-4xl font-black text-white">
                    {item.value}
                  </h2>

                  <p className="mt-3 text-slate-300">
                    {item.label}
                  </p>

                </motion.div>

              );
            })}

            {/* Extra Card */}

            <motion.div
              whileHover={{
                scale: 1.03,
              }}
              className="col-span-full rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 p-8 shadow-2xl"
            >

              <div className="flex items-center gap-3">

                <TrendingUp
                  size={36}
                  className="text-white"
                />

                <div>

                  <h3 className="text-2xl font-bold text-white">
                    Growing Every Day
                  </h3>

                  <p className="mt-2 text-cyan-100">
                    Join thousands of businesses and freelancers
                    building successful careers on SkillSphere.
                  </p>

                </div>

              </div>

            </motion.div>

          </motion.div>

        </div>

      </div>

    </section>
  );
}