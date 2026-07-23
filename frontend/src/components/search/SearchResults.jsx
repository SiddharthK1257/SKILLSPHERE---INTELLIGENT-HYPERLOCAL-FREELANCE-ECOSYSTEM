import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  List,
  Briefcase,
} from "lucide-react";

import GigCard from "../GigCard";
import NoResults from "./NoResults";

const SearchResults = ({
  gigs = [],
  loading = false,
  totalResults = 0,
  sortBy = "Newest",
}) => {
  const [view, setView] = useState("grid");

  if (loading) {
    return (
      <section className="mt-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="mb-3 h-7 w-56 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="flex gap-3">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200" />
            <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200" />
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-3xl border bg-white shadow"
            >
              <div className="h-52 animate-pulse bg-gray-200" />

              <div className="space-y-4 p-6">
                <div className="h-5 animate-pulse rounded bg-gray-200" />
                <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />
                <div className="h-4 animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
                <div className="mt-8 h-10 animate-pulse rounded-xl bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!gigs.length) {
    return <NoResults />;
  }

  return (
    <section className="mt-10">

      {/* Header */}

      <div className="mb-8 flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800">

            <Briefcase className="text-blue-600" />

            Search Results

          </h2>

          <p className="mt-2 text-slate-500">
            Found{" "}
            <span className="font-bold text-slate-800">
              {totalResults || gigs.length}
            </span>{" "}
            gigs • Sorted by{" "}
            <span className="font-semibold">
              {sortBy}
            </span>
          </p>

        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-slate-100 p-2">

          <button
            onClick={() => setView("grid")}
            className={`rounded-xl p-3 transition ${
              view === "grid"
                ? "bg-blue-600 text-white shadow"
                : "hover:bg-white"
            }`}
          >
            <LayoutGrid size={20} />
          </button>

          <button
            onClick={() => setView("list")}
            className={`rounded-xl p-3 transition ${
              view === "list"
                ? "bg-blue-600 text-white shadow"
                : "hover:bg-white"
            }`}
          >
            <List size={20} />
          </button>

        </div>

      </div>

      {/* Results */}

      <AnimatePresence mode="wait">

        <motion.div
          key={view}
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.35,
          }}
          className={
            view === "grid"
              ? "grid gap-8 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
              : "space-y-8"
          }
        >
          {gigs.map((gig, index) => (

            <motion.div
              key={gig._id}
              initial={{
                opacity: 0,
                y: 40,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.45,
                delay: index * 0.05,
              }}
            >
              <GigCard
                gig={gig}
                view={view}
              />
            </motion.div>

          ))}
        </motion.div>

      </AnimatePresence>

      {/* Footer */}

      <motion.div
        initial={{
          opacity: 0,
        }}
        whileInView={{
          opacity: 1,
        }}
        viewport={{
          once: true,
        }}
        className="mt-12 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-center text-white shadow-xl"
      >

        <h3 className="text-2xl font-bold">
          Didn't Find the Right Gig?
        </h3>

        <p className="mt-3 text-blue-100">
          Try changing your filters, keywords, category, or
          budget to discover more talented freelancers.
        </p>

      </motion.div>

    </section>
  );
};

export default SearchResults;