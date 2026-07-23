import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../../components/admin/AdminSidebar";
import {
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
} from "react-icons/fa";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminReports = () => {
  const [search, setSearch] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  /* =====================================
      GET REPORTS
  ===================================== */

  const fetchReports = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/admin/reports`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReports(data.reports || []);
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          "Failed to load reports."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  /* =====================================
      RESOLVE REPORT
  ===================================== */

  const resolveReport = async (id) => {
    if (!window.confirm("Resolve this report?")) return;

    try {
      await axios.put(
        `${API_URL}/admin/reports/${id}/resolve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchReports();
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          "Unable to resolve report."
      );
    }
  };

  /* =====================================
      DELETE REPORT
  ===================================== */

  const deleteReport = async (id) => {
    if (!window.confirm("Delete this report?")) return;

    try {
      await axios.delete(
        `${API_URL}/admin/reports/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchReports();
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          "Unable to delete report."
      );
    }
  };

  const filteredReports = reports.filter((report) => {
    const reporter =
      report.reportedBy?.name?.toLowerCase() || "";

    const reportedUser =
      report.reportedUser?.name?.toLowerCase() || "";

    return (
      reporter.includes(search.toLowerCase()) ||
      reportedUser.includes(search.toLowerCase())
    );
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Reports Management
            </h1>

            <p className="mt-2 text-gray-500">
              View and resolve all user reports.
            </p>
          </div>

          <div className="relative mt-5 md:mt-0">
            <FaSearch className="absolute left-4 top-4 text-gray-400" />

            <input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-80 rounded-xl border bg-white py-3 pl-11 pr-4 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left">
                  Reporter
                </th>

                <th className="px-6 py-4 text-left">
                  Reported User
                </th>

                <th className="px-6 py-4 text-left">
                  Reason
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
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="py-8 text-center"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr
                    key={report._id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      {report.reportedBy?.name ||
                        "Unknown"}
                    </td>

                    <td className="px-6 py-4">
                      {report.reportedUser?.name ||
                        "Unknown"}
                    </td>

                    <td className="px-6 py-4">
                      {report.reason}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
                          report.status === "Resolved"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {report.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <button
                          className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
                        >
                          <FaEye />
                        </button>

                        {report.status !==
                          "Resolved" && (
                          <button
                            onClick={() =>
                              resolveReport(
                                report._id
                              )
                            }
                            className="rounded-lg bg-green-500 p-2 text-white hover:bg-green-600"
                          >
                            <FaCheckCircle />
                          </button>
                        )}

                        <button
                          onClick={() =>
                            deleteReport(report._id)
                          }
                          className="rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
                        >
                          <FaTimesCircle />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="py-10 text-center text-gray-500"
                  >
                    No reports found.
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

export default AdminReports;