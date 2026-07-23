import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import {
  FaSearch,
  FaTrash,
  FaEye,
} from "react-icons/fa";

const AdminGigs = () => {
  const [search, setSearch] = useState("");
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===========================
  // Fetch All Gigs
  // ===========================

  const fetchGigs = async () => {
    try {
      const { data } = await API.get("/gigs");

      if (data.success) {
        setGigs(data.gigs);
      }
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to load gigs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGigs();
  }, []);

  // ===========================
  // Delete Gig
  // ===========================

  const deleteGig = async (id) => {
    if (!window.confirm("Delete this gig?")) return;

    try {
      const { data } = await API.delete(
        `/gigs/${id}`
      );

      alert(data.message);

      setGigs((prev) =>
        prev.filter((gig) => gig._id !== id)
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to delete gig."
      );
    }
  };

  // ===========================
  // Search
  // ===========================

  const filteredGigs = gigs.filter((gig) => {
    const title = gig.title?.toLowerCase() || "";
    const category = gig.category?.toLowerCase() || "";
    const freelancer =
      gig.freelancer?.name?.toLowerCase() || "";

    return (
      title.includes(search.toLowerCase()) ||
      category.includes(search.toLowerCase()) ||
      freelancer.includes(search.toLowerCase())
    );
  });

  // ===========================
  // Loading
  // ===========================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-2xl font-semibold">
          Loading gigs...
        </h2>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 p-8">

        {/* Header */}

        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Gigs
            </h1>

            <p className="mt-2 text-gray-500">
              Manage all gigs on SkillSphere.
            </p>
          </div>

          <div className="relative mt-5 md:mt-0">

            <FaSearch className="absolute left-4 top-4 text-gray-400" />

            <input
              type="text"
              placeholder="Search gigs..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-80 rounded-xl border bg-white py-3 pl-11 pr-4 outline-none focus:border-blue-500"
            />

          </div>

        </div>

        {/* Table */}

        <div className="overflow-hidden rounded-2xl bg-white shadow">

          <table className="w-full">

            <thead className="bg-gray-50">

              <tr>

                <th className="px-6 py-4 text-left">
                  Title
                </th>

                <th className="px-6 py-4 text-left">
                  Category
                </th>

                <th className="px-6 py-4 text-left">
                  Price
                </th>

                <th className="px-6 py-4 text-left">
                  Freelancer
                </th>

                <th className="px-6 py-4 text-left">
                  Status
                </th>

                <th className="px-6 py-4 text-center">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredGigs.length > 0 ? (
                filteredGigs.map((gig) => (

                  <tr
                    key={gig._id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="px-6 py-4">
                      {gig.title}
                    </td>

                    <td className="px-6 py-4">
                      {gig.category}
                    </td>

                    <td className="px-6 py-4">
                      ₹{gig.price}
                    </td>

                    <td className="px-6 py-4">
                      {gig.freelancer?.name || "Unknown"}
                    </td>

                    <td className="px-6 py-4">

                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
                          gig.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {gig.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>

                    </td>

                    <td className="px-6 py-4">

                      <div className="flex justify-center gap-3">

                        <Link
                          to={`/gigs/${gig._id}`}
                          className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
                        >
                          <FaEye />
                        </Link>

                        <button
                          onClick={() =>
                            deleteGig(gig._id)
                          }
                          className="rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
                        >
                          <FaTrash />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))
              ) : (
                <tr>

                  <td
                    colSpan="6"
                    className="py-10 text-center text-gray-500"
                  >
                    No gigs found.
                  </td>

                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
};

export default AdminGigs;