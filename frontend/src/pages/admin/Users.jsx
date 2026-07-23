import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import {
  FaSearch,
  FaTrash,
  FaUserShield,
  FaUserCheck,
} from "react-icons/fa";

const Users = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===================================
  // Fetch Users
  // ===================================

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/admin/users");

      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to fetch users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ===================================
  // Delete User
  // ===================================

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      const { data } = await API.delete(
        `/admin/users/${id}`
      );

      alert(data.message);

      fetchUsers();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to delete user."
      );
    }
  };

  // ===================================
  // Block / Unblock
  // ===================================

  const toggleStatus = async (id) => {
    try {
      const { data } = await API.put(
        `/admin/users/${id}/status`
      );

      alert(data.message);

      fetchUsers();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to update user."
      );
    }
  };

  // ===================================
  // Change Role
  // ===================================

  const changeRole = async (id, role) => {
    try {
      const { data } = await API.put(
        `/admin/users/${id}/role`,
        { role }
      );

      alert(data.message);

      fetchUsers();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to update role."
      );
    }
  };

  // ===================================
  // Search
  // ===================================

  const filteredUsers = users.filter(
    (user) =>
      user.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      user.email
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // ===================================
  // Loading
  // ===================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h2 className="text-2xl font-semibold">
          Loading Users...
        </h2>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      <AdminSidebar />

      <div className="flex-1 p-8">

        {/* Header */}

        <div className="mb-8 flex flex-col justify-between md:flex-row md:items-center">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Users
            </h1>

            <p className="mt-2 text-gray-500">
              Manage all registered users
            </p>
          </div>

          <div className="relative mt-5 md:mt-0">

            <FaSearch className="absolute left-4 top-4 text-gray-400" />

            <input
              type="text"
              placeholder="Search..."
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
                  Name
                </th>

                <th className="px-6 py-4 text-left">
                  Email
                </th>

                <th className="px-6 py-4 text-left">
                  Role
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

              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (

                  <tr
                    key={user._id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="px-6 py-4">
                      {user.name}
                    </td>

                    <td className="px-6 py-4">
                      {user.email}
                    </td>

                    <td className="px-6 py-4">

                      <select
                        value={user.role}
                        onChange={(e) =>
                          changeRole(
                            user._id,
                            e.target.value
                          )
                        }
                        className="rounded-lg border px-3 py-2"
                      >
                        <option value="client">
                          Client
                        </option>

                        <option value="freelancer">
                          Freelancer
                        </option>

                        <option value="admin">
                          Admin
                        </option>

                      </select>

                    </td>

                    <td className="px-6 py-4">

                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
                          user.suspended
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {user.suspended
                          ? "Blocked"
                          : "Active"}
                      </span>

                    </td>

                    <td className="px-6 py-4">

                      <div className="flex justify-center gap-3">

                        <button
                          onClick={() =>
                            toggleStatus(user._id)
                          }
                          className={`rounded-lg p-2 text-white ${
                            user.suspended
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-orange-500 hover:bg-orange-600"
                          }`}
                        >
                          {user.suspended ? (
                            <FaUserCheck />
                          ) : (
                            <FaUserShield />
                          )}
                        </button>

                        <button
                          onClick={() =>
                            deleteUser(user._id)
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
                    colSpan="5"
                    className="py-10 text-center text-gray-500"
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

export default Users;