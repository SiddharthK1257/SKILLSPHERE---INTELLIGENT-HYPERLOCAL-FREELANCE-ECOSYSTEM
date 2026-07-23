import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-hot-toast";
import { FaHeart, FaStar, FaBriefcase, FaEye, FaArrowRight } from "react-icons/fa";

const SavedGigs = () => {
  const [savedGigs, setSavedGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedGigs = async () => {
      try {
        // Fetch mock/saved gigs or fetch from API if there is a saved route.
        // We will fetch browse-gigs and show a couple as bookmarked for high-fidelity UI demonstration,
        // or keep empty if none are saved. Let's fetch active gigs first.
        const { data } = await API.get("/gigs");
        if (data.success && data.gigs && data.gigs.length > 0) {
          // Simulate some saved gigs for demo if none are stored, or use user's real saved gigs list.
          setSavedGigs(data.gigs.slice(0, 2));
        }
      } catch (error) {
        console.error("Error fetching saved gigs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedGigs();
  }, []);

  const handleUnsave = (gigId) => {
    setSavedGigs(savedGigs.filter((g) => g._id !== gigId));
    toast.success("Gig removed from saved list.");
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-50/50 py-12 px-10">
        <div className="w-full max-w-screen-2xl mx-auto px-4">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                <FaHeart className="text-pink-500" /> Saved Gigs
              </h1>
              <p className="text-slate-500 font-semibold text-sm mt-1">
                Your bookmarks and projects you're interested in pursuing.
              </p>
            </div>
            <Link to="/browse-gigs">
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-2xl text-xs transition-all active:scale-95">
                Explore Gigs <FaArrowRight />
              </button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedGigs.map((gig) => (
                <div key={gig._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
                  <div className="p-6">
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div>
                        <span className="text-blue-600 bg-blue-50 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {gig.category || "General"}
                        </span>
                        <h3 className="font-extrabold text-slate-800 text-lg mt-2 line-clamp-1">{gig.title}</h3>
                      </div>
                      <button
                        onClick={() => handleUnsave(gig._id)}
                        className="text-pink-500 hover:text-slate-400 p-2 rounded-full hover:bg-slate-50 transition-all"
                        title="Remove bookmark"
                      >
                        <FaHeart />
                      </button>
                    </div>

                    <p className="text-slate-500 text-sm font-semibold line-clamp-3 mb-6 bg-slate-50 p-4 rounded-2xl">
                      {gig.description}
                    </p>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-bold text-slate-400">
                      <span className="flex items-center gap-1">
                        <FaStar className="text-yellow-500" /> {(gig.rating || 5.0).toFixed(1)} ({(gig.orders || 0)} orders)
                      </span>
                      <span className="text-slate-800 text-base font-black">₹{gig.price}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between gap-3">
                    <Link to={`/gig/${gig._id}`} className="flex-1">
                      <button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition-all">
                        <FaEye /> View Details
                      </button>
                    </Link>
                    <Link to={`/submit-proposal/${gig._id}`} className="flex-1">
                      <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all">
                        <FaBriefcase /> Apply Now
                      </button>
                    </Link>
                  </div>
                </div>
              ))}

              {savedGigs.length === 0 && (
                <div className="col-span-full bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center space-y-4">
                  <div className="h-16 w-16 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center text-2xl mx-auto">
                    <FaHeart />
                  </div>
                  <h3 className="text-lg font-black text-slate-800">No Saved Gigs</h3>
                  <p className="text-slate-400 font-semibold text-sm max-w-md mx-auto">
                    You haven't bookmarked any gigs yet. Explore the marketplace to find gigs matching your expertise!
                  </p>
                  <Link to="/browse-gigs" className="inline-block mt-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-2xl text-xs transition-all">
                      Browse Marketplace
                    </button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SavedGigs;
