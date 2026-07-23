import { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import API from "../../services/api";

import {
  FaUsers,
  FaBriefcase,
  FaFileAlt,
  FaRupeeSign,
  FaUserTie,
  FaUserShield,
  FaUserFriends,
} from "react-icons/fa";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFreelancers: 0,
    totalClients: 0,
    totalAdmins: 0,
    totalGigs: 0,
    totalProposals: 0,
    totalPayments: 0,
    totalRevenue: 0,
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        API.get("/admin/dashboard"),
        API.get("/admin/users"),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }

      if (usersRes.data.success) {
        setRecentUsers(usersRes.data.users.slice(0, 5));
      }
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h2 className="text-2xl font-semibold">
          Loading Dashboard...
        </h2>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      <AdminSidebar />

      <div className="flex-1 p-8">

        {/* Header */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            Welcome to the SkillSphere Admin Panel
          </p>
        </div>

        {/* Statistics */}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">
                  Total Users
                </p>

                <h2 className="mt-2 text-3xl font-bold text-blue-600">
                  {stats.totalUsers}
                </h2>
              </div>

              <FaUsers
                size={42}
                className="text-blue-500"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">
                  Total Gigs
                </p>

                <h2 className="mt-2 text-3xl font-bold text-green-600">
                  {stats.totalGigs}
                </h2>
              </div>

              <FaBriefcase
                size={42}
                className="text-green-500"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">
                  Total Proposals
                </p>

                <h2 className="mt-2 text-3xl font-bold text-purple-600">
                  {stats.totalProposals}
                </h2>
              </div>

              <FaFileAlt
                size={42}
                className="text-purple-500"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">
                  Revenue
                </p>

                <h2 className="mt-2 text-3xl font-bold text-orange-600">
                  ₹{stats.totalRevenue}
                </h2>
              </div>

              <FaRupeeSign
                size={42}
                className="text-orange-500"
              />
            </div>
          </div>

        </div>

        {/* Second Row */}

        <div className="mt-6 grid gap-6 md:grid-cols-3">

          <div className="rounded-xl bg-white p-6 shadow">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500">
                  Freelancers
                </p>

                <h2 className="text-3xl font-bold text-cyan-600">
                  {stats.totalFreelancers}
                </h2>

              </div>

              <FaUserTie
                className="text-cyan-500"
                size={40}
              />

            </div>

          </div>

          <div className="rounded-xl bg-white p-6 shadow">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500">
                  Clients
                </p>

                <h2 className="text-3xl font-bold text-pink-600">
                  {stats.totalClients}
                </h2>

              </div>

              <FaUserFriends
                className="text-pink-500"
                size={40}
              />

            </div>

          </div>

          <div className="rounded-xl bg-white p-6 shadow">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500">
                  Admins
                </p>

                <h2 className="text-3xl font-bold text-red-600">
                  {stats.totalAdmins}
                </h2>

              </div>

              <FaUserShield
                className="text-red-500"
                size={40}
              />

            </div>

          </div>

        </div>

        {/* Recent Users */}

        <div className="mt-10 rounded-2xl bg-white p-6 shadow-md">

          <h2 className="mb-6 text-xl font-semibold">
            Recent Users
          </h2>

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="pb-3 text-left">
                  Name
                </th>

                <th className="pb-3 text-left">
                  Email
                </th>

                <th className="pb-3 text-left">
                  Role
                </th>

              </tr>

            </thead>

            <tbody>

              {recentUsers.length > 0 ? (
                recentUsers.map((user) => (

                  <tr
                    key={user._id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="py-4">
                      {user.name}
                    </td>

                    <td className="py-4">
                      {user.email}
                    </td>

                    <td className="py-4 capitalize">
                      {user.role}
                    </td>

                  </tr>

                ))
              ) : (

                <tr>

                  <td
                    colSpan="3"
                    className="py-6 text-center text-gray-500"
                  >
                    No users found.
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

export default AdminDashboard;