import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import {
  FaSearch,
  FaTrash,
  FaEye,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

const AdminProposals = () => {
  const [search, setSearch] = useState("");
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  // ====================================
  // Fetch Proposals
  // ====================================

  const fetchProposals = async () => {
    try {
      const { data } = await API.get("/admin/proposals");

      if (data.success) {
        setProposals(data.proposals);
      }
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to load proposals."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  // ====================================
  // Delete Proposal
  // ====================================

  const deleteProposal = async (id) => {
    if (!window.confirm("Delete this proposal?")) return;

    try {
      const { data } = await API.delete(
        `/admin/proposals/${id}`
      );

      alert(data.message);

      setProposals((prev) =>
        prev.filter((proposal) => proposal._id !== id)
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to delete proposal."
      );
    }
  };

  // ====================================
  // Search
  // ====================================

  const filteredProposals = proposals.filter((proposal) => {
    const freelancer =
      proposal.freelancer?.name || "";

    const gig =
      proposal.gig?.title || "";

    return (
      freelancer
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      gig
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading proposals...
        </h2>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">

      <AdminSidebar />

      <div className="flex-1 p-8">

        {/* Header */}

        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">

          <div>

            <h1 className="text-3xl font-bold text-slate-800">
              Proposal Management
            </h1>

            <p className="mt-2 text-slate-500">
              Manage all freelancer proposals.
            </p>

          </div>

          <div className="relative mt-5 md:mt-0">

            <FaSearch className="absolute left-4 top-4 text-slate-400" />

            <input
              type="text"
              placeholder="Search proposal..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-80 rounded-xl border bg-white py-3 pl-11 pr-4 outline-none focus:border-cyan-500"
            />

          </div>

        </div>

        {/* Table */}

        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="px-6 py-4 text-left">
                  Freelancer
                </th>

                <th className="px-6 py-4 text-left">
                  Client
                </th>

                <th className="px-6 py-4 text-left">
                  Gig
                </th>

                <th className="px-6 py-4 text-left">
                  Amount
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

              {filteredProposals.length > 0 ? (
                filteredProposals.map((proposal) => (

                  <tr
                    key={proposal._id}
                    className="border-t hover:bg-slate-50"
                  >

                    <td className="px-6 py-4">
                      {proposal.freelancer?.name}
                    </td>

                    <td className="px-6 py-4">
                      {proposal.client?.name}
                    </td>

                    <td className="px-6 py-4">
                      {proposal.gig?.title}
                    </td>

                    <td className="px-6 py-4">
                      ₹{proposal.amount}
                    </td>

                    <td className="px-6 py-4">

                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
                          proposal.status === "accepted"
                            ? "bg-green-100 text-green-700"
                            : proposal.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {proposal.status}
                      </span>

                    </td>

                    <td className="px-6 py-4">

                      <div className="flex justify-center gap-2">

                        <button
                          className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
                          title="View"
                        >
                          <FaEye />
                        </button>

                        <button
                          disabled
                          className="cursor-not-allowed rounded-lg bg-green-300 p-2 text-white"
                          title="Approve endpoint not created"
                        >
                          <FaCheck />
                        </button>

                        <button
                          disabled
                          className="cursor-not-allowed rounded-lg bg-red-300 p-2 text-white"
                          title="Reject endpoint not created"
                        >
                          <FaTimes />
                        </button>

                        <button
                          onClick={() =>
                            deleteProposal(proposal._id)
                          }
                          className="rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
                          title="Delete"
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
                    className="py-10 text-center text-slate-500"
                  >
                    No proposals found.
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

export default AdminProposals;