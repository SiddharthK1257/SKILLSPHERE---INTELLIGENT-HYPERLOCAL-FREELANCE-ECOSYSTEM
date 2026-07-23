import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  BrainCircuit,
  Star,
  Users,
  Briefcase,
  Award,
  CheckCircle2,
} from "lucide-react";

import heroImage from "../assets/hero.png";

import googleLogo from "../assets/companies/google.png";
import microsoftLogo from "../assets/companies/microsoft.png";
import amazonLogo from "../assets/companies/amazon.png";
import metaLogo from "../assets/companies/meta.png";
import adobeLogo from "../assets/companies/adobe.png";
import openaiLogo from "../assets/companies/openai.png";

const Hero = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/browse-gigs");
    }
  };

  const skills = [
    "React",
    "Node.js",
    "Next.js",
    "AI",
    "Python",
    "UI/UX",
    "WordPress",
    "SEO",
  ];

  const stats = [
    {
      number: "50K+",
      label: "Freelancers",
    },
    {
      number: "120K+",
      label: "Projects",
    },
    {
      number: "99%",
      label: "Success Rate",
    },
    {
      number: "4.9★",
      label: "User Rating",
    },
  ];

  const companies = [
    {
      name: "Google",
      logo: googleLogo,
    },
    {
      name: "Microsoft",
      logo: microsoftLogo,
    },
    {
      name: "Amazon",
      logo: amazonLogo,
    },
    {
      name: "Meta",
      logo: metaLogo,
    },
    {
      name: "Adobe",
      logo: adobeLogo,
    },
    {
      name: "OpenAI",
      logo: openaiLogo,
    },
  ];

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">

      {/* Background */}

      <div className="absolute inset-0">

        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-300/30 blur-[130px]" />

        <div className="absolute right-0 top-20 h-[500px] w-[500px] rounded-full bg-cyan-300/30 blur-[140px]" />

        <div className="absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full bg-indigo-300/20 blur-[120px]" />

      </div>

      {/* Grid */}

      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(#3b82f6 1px, transparent 1px),linear-gradient(90deg,#3b82f6 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative flex min-h-screen w-full flex-col-reverse items-center justify-between gap-16 px-8 py-16 lg:flex-row lg:px-20 xl:px-32">

        {/* LEFT SIDE */}

        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2"
        >

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-6 py-3 shadow-lg">

            <Sparkles className="text-blue-600" size={18} />

            <span className="font-semibold text-blue-700">

              AI Powered Freelance Marketplace

            </span>

          </div>

          <h1 className="mt-8 text-5xl font-black leading-tight text-slate-900 lg:text-7xl">

            Hire The Perfect

            <span className="block bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent">

              Freelancer With AI

            </span>

            In Minutes

          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-600">

            SkillSphere intelligently connects businesses with verified
            freelancers using AI-powered recommendations.

            Hire experts for Web Development,
            Mobile Apps,
            UI/UX,
            AI,
            Digital Marketing,
            SEO,
            Content Writing
            and much more.

          </p>

          {/* Pills */}

          <div className="mt-10 flex flex-wrap gap-4">

            <div className="flex items-center gap-2 rounded-full bg-white px-5 py-3 shadow-lg">

              <BrainCircuit className="text-blue-600" />

              AI Matching

            </div>

            <div className="flex items-center gap-2 rounded-full bg-white px-5 py-3 shadow-lg">

              <ShieldCheck className="text-green-600" />

              Verified Talent

            </div>

            <div className="flex items-center gap-2 rounded-full bg-white px-5 py-3 shadow-lg">

              <Star className="fill-yellow-400 text-yellow-400" />

              4.9 Rating

            </div>

            <div className="flex items-center gap-2 rounded-full bg-white px-5 py-3 shadow-lg">

              <CheckCircle2 className="text-cyan-600" />

              Secure Payments

            </div>

          </div>

          {/* Search */}

          <form onSubmit={handleSearchSubmit} className="mt-10 overflow-hidden rounded-3xl border bg-white shadow-2xl">

            <div className="flex flex-col lg:flex-row">

              <div className="flex flex-1 items-center px-6">

                <Search className="text-slate-400" />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent px-4 py-6 outline-none"
                  placeholder="Search Web Development, AI, UI/UX..."
                />

              </div>

              <button type="submit" className="bg-gradient-to-r from-blue-600 to-cyan-500 px-10 py-6 font-semibold text-white cursor-pointer hover:opacity-90 transition">

                Search

              </button>

            </div>

          </form>

          {/* =========================
              TRENDING SKILLS
          ========================= */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >

            <span className="font-semibold text-slate-700">
              Trending:
            </span>

            {skills.map((skill) => (

              <motion.button
                key={skill}
                type="button"
                onClick={() => navigate(`/browse-gigs?category=${encodeURIComponent(skill)}`)}
                whileHover={{
                  y: -5,
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                className="rounded-full border border-blue-200 bg-white px-5 py-2 text-sm font-medium shadow-md transition-all hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 hover:text-white cursor-pointer"
              >
                {skill}
              </motion.button>

            ))}

          </motion.div>

          {/* =========================
                  CTA BUTTONS
          ========================= */}

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
              delay: 1.2,
            }}
            className="mt-12 flex flex-wrap gap-5"
          >

            <motion.button
              type="button"
              onClick={() => navigate("/browse-gigs")}
              whileHover={{
                scale: 1.04,
                y: -3,
              }}
              whileTap={{
                scale: 0.98,
              }}
              className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-2xl cursor-pointer"
            >

              Explore Services

              <ArrowRight
                size={22}
                className="transition-transform group-hover:translate-x-1"
              />

            </motion.button>

            <motion.button
              type="button"
              onClick={() => navigate("/register")}
              whileHover={{
                scale: 1.04,
                y: -3,
              }}
              whileTap={{
                scale: 0.98,
              }}
              className="rounded-2xl border-2 border-blue-600 bg-white px-8 py-4 text-lg font-bold text-blue-600 shadow-lg transition-all hover:bg-blue-600 hover:text-white cursor-pointer"
            >

              Become a Freelancer

            </motion.button>

          </motion.div>

          {/* =========================
                  STATISTICS
          ========================= */}

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 1.5,
            }}
            className="mt-16 grid w-full max-w-4xl grid-cols-2 gap-6 lg:grid-cols-4"
          >

            {stats.map((item) => (

              <motion.div
                key={item.label}
                whileHover={{
                  y: -8,
                  scale: 1.03,
                }}
                className="rounded-3xl border border-white/50 bg-white/80 p-6 text-center shadow-xl backdrop-blur-md"
              >

                <h2 className="bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-4xl font-black text-transparent">

                  {item.number}

                </h2>

                <p className="mt-3 font-medium text-slate-600">

                  {item.label}

                </p>

              </motion.div>

            ))}

          </motion.div>

        </motion.div>

        {/* =========================
                RIGHT SIDE
        ========================= */}

        <motion.div
          initial={{
            opacity: 0,
            x: 80,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 1,
          }}
          className="relative flex w-full items-center justify-center lg:w-1/2"
        >

          {/* Background Glow */}

          <div className="absolute h-[620px] w-[620px] rounded-full bg-gradient-to-r from-blue-500/20 via-cyan-400/20 to-indigo-500/20 blur-[120px]" />

          {/* Decorative Rings */}

          <div className="absolute h-[560px] w-[560px] rounded-full border border-blue-200/40"></div>

          <div className="absolute h-[450px] w-[450px] rounded-full border border-cyan-200/40"></div>

          {/* AI Badge */}

          <div className="absolute top-8 right-10 z-30 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-2xl">

            🤖 AI Powered

          </div>

          {/* =========================
                HERO IMAGE
          ========================= */}

          {/* Hero Image remains steady */}

          <img
            src={heroImage}
            alt="SkillSphere Hero"
            className="relative z-20 w-full max-w-3xl xl:max-w-4xl drop-shadow-[0_40px_90px_rgba(37,99,235,0.35)]"
          />
                    {/* =========================
                  AI MATCH CARD
          ========================= */}

          <motion.div
            whileHover={{
              y: -8,
              scale: 1.03,
            }}
            className="absolute left-0 top-10 z-30 w-72 rounded-3xl border border-white/60 bg-white/90 p-6 shadow-2xl backdrop-blur-xl"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  AI Match Score
                </p>

                <h2 className="mt-2 text-4xl font-black text-blue-600">
                  98%
                </h2>

              </div>

              <div className="rounded-2xl bg-blue-100 p-4">

                <BrainCircuit
                  size={30}
                  className="text-blue-600"
                />

              </div>

            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200">

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "98%" }}
                transition={{ duration: 2 }}
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500"
              />

            </div>

          </motion.div>

          {/* =========================
              VERIFIED FREELANCERS
          ========================= */}

          <motion.div
            whileHover={{
              y: -8,
              scale: 1.03,
            }}
            className="absolute right-0 top-36 z-30 w-72 rounded-3xl border border-white/60 bg-white/90 p-6 shadow-2xl backdrop-blur-xl"
          >

            <div className="flex items-center gap-4">

              <div className="rounded-2xl bg-green-100 p-4">

                <Users
                  size={30}
                  className="text-green-600"
                />

              </div>

              <div>

                <h3 className="text-3xl font-black">
                  50K+
                </h3>

                <p className="text-slate-500">
                  Verified Freelancers
                </p>

              </div>

            </div>

          </motion.div>

          {/* =========================
                ACTIVE PROJECTS
          ========================= */}

          <motion.div
            whileHover={{
              y: -8,
              scale: 1.03,
            }}
            className="absolute bottom-12 left-8 z-30 w-72 rounded-3xl border border-white/60 bg-white/90 p-6 shadow-2xl backdrop-blur-xl"
          >

            <div className="flex items-center gap-4">

              <div className="rounded-2xl bg-yellow-100 p-4">

                <Briefcase
                  size={30}
                  className="text-yellow-600"
                />

              </div>

              <div>

                <h3 className="text-3xl font-black">
                  120K+
                </h3>

                <p className="text-slate-500">
                  Active Projects
                </p>

              </div>

            </div>

          </motion.div>

          {/* =========================
                  TRUST CARD
          ========================= */}

          <motion.div
            whileHover={{
              y: -8,
              scale: 1.03,
            }}
            className="absolute bottom-6 right-8 z-30 w-72 rounded-3xl border border-white/60 bg-white/90 p-6 shadow-2xl backdrop-blur-xl"
          >

            <div className="flex items-center gap-4">

              <div className="rounded-2xl bg-indigo-100 p-4">

                <Award
                  size={30}
                  className="text-indigo-600"
                />

              </div>

              <div>

                <h3 className="text-xl font-bold">
                  Trusted Worldwide
                </h3>

                <p className="text-slate-500">
                  Secure Payments
                </p>

              </div>

            </div>

          </motion.div>

          {/* =========================
                  RATING CARD
          ========================= */}

          <motion.div
            whileHover={{
              y: -8,
              scale: 1.05,
            }}
            className="absolute bottom-72 left-16 z-30 rounded-3xl bg-white/95 px-6 py-5 shadow-2xl backdrop-blur-xl"
          >

            <div className="flex items-center gap-4">

              <Star
                size={28}
                className="fill-yellow-400 text-yellow-400"
              />

              <div>

                <h3 className="text-2xl font-black">
                  4.9/5
                </h3>

                <p className="text-sm text-slate-500">
                  Average Rating
                </p>

              </div>

            </div>

          </motion.div>

        </motion.div>

      </div>

      {/* =========================
          TRUSTED COMPANIES
      ========================= */}

      <section className="border-t border-slate-200 bg-white py-20">

        <div className="w-full px-8 py-20 lg:px-20 xl:px-32">

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >

            <p className="text-center text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">

              Trusted by professionals from

            </p>

            <h2 className="mt-5 text-center text-4xl font-black text-slate-900">

              World's Leading Companies

            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-center text-lg text-slate-600">

              Companies worldwide rely on SkillSphere to discover verified
              freelancers, manage projects and hire top talent faster.

            </p>

          </motion.div>

          {/* Companies */}

          <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">

            {companies.map((company) => (

              <motion.div
                key={company.name}
                whileHover={{
                  y: -8,
                  scale: 1.05,
                }}
                transition={{
                  duration: 0.3,
                }}
                className="group flex flex-col items-center rounded-3xl border border-slate-200 bg-white p-8 shadow-lg transition-all hover:border-blue-200 hover:shadow-2xl"
              >

                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-16 w-auto object-contain transition duration-300 group-hover:scale-110"
                />

                <h3 className="mt-5 text-base font-semibold text-slate-700">

                  {company.name}

                </h3>

              </motion.div>

            ))}

          </div>

        </div>

      </section>
            {/* =========================
            FEATURES BAR
      ========================= */}

      <section className="bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-900">

        <div className="mx-auto flex max-w-screen-2xl flex-wrap items-center justify-center gap-10 px-6 py-8 text-white">

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3"
          >

            <Star
              size={22}
              className="fill-yellow-400 text-yellow-400"
            />

            <span className="font-semibold">
              Rated 4.9/5
            </span>

          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3"
          >

            <ShieldCheck
              size={22}
              className="text-green-400"
            />

            <span>
              Secure Payments
            </span>

          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3"
          >

            <Users
              size={22}
              className="text-cyan-400"
            />

            <span>
              50K+ Verified Freelancers
            </span>

          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3"
          >

            <Briefcase
              size={22}
              className="text-yellow-400"
            />

            <span>
              120K+ Completed Projects
            </span>

          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3"
          >

            <Award
              size={22}
              className="text-indigo-300"
            />

            <span>
              AI Powered Matching
            </span>

          </motion.div>

        </div>

      </section>

      {/* =========================
              FINAL CTA
      ========================= */}

      <section className="bg-gradient-to-br from-blue-700 via-cyan-600 to-indigo-700 py-24">

        <div className="mx-auto max-w-screen-xl px-6 text-center text-white">

          <motion.h2
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{ once: true }}
            className="text-4xl font-black md:text-6xl"
          >

            Ready To Build Your Next Project?

          </motion.h2>

          <motion.p
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
            }}
            viewport={{ once: true }}
            className="mx-auto mt-8 max-w-3xl text-xl leading-8 text-blue-100"
          >

            Join thousands of businesses and freelancers already using
            SkillSphere to collaborate, grow and build amazing products.

          </motion.p>

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.4,
            }}
            viewport={{ once: true }}
            className="mt-12 flex flex-wrap justify-center gap-6"
          >

            <motion.button
              whileHover={{
                scale: 1.05,
                y: -3,
              }}
              whileTap={{
                scale: 0.98,
              }}
              className="rounded-2xl bg-white px-10 py-5 text-lg font-bold text-blue-700 shadow-2xl"
            >

              Hire Freelancer

            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.05,
                y: -3,
              }}
              whileTap={{
                scale: 0.98,
              }}
              className="rounded-2xl border-2 border-white px-10 py-5 text-lg font-bold text-white transition hover:bg-white hover:text-blue-700"
            >

              Become Freelancer

            </motion.button>

          </motion.div>

          {/* Stats */}

          <div className="mt-20 grid gap-8 md:grid-cols-4">

            <div>

              <h3 className="text-5xl font-black">
                50K+
              </h3>

              <p className="mt-2 text-blue-100">
                Freelancers
              </p>

            </div>

            <div>

              <h3 className="text-5xl font-black">
                120K+
              </h3>

              <p className="mt-2 text-blue-100">
                Projects
              </p>

            </div>

            <div>

              <h3 className="text-5xl font-black">
                4.9★
              </h3>

              <p className="mt-2 text-blue-100">
                User Rating
              </p>

            </div>

            <div>

              <h3 className="text-5xl font-black">
                99%
              </h3>

              <p className="mt-2 text-blue-100">
                Success Rate
              </p>

            </div>

          </div>

        </div>

      </section>

    </section>
  );
};

export default Hero;