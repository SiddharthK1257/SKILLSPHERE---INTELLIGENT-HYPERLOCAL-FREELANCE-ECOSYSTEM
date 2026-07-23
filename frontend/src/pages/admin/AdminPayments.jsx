import { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import API from "../../services/api";

import {
  FaSearch,
  FaEye,
} from "react-icons/fa";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data } = await API.get("/admin/payments");

      if (data.success) {
        setPayments(data.payments);
      }
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to load payments."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const client =
      payment.client?.name?.toLowerCase() || "";

    const freelancer =
      payment.freelancer?.name?.toLowerCase() || "";

    return (
      client.includes(search.toLowerCase()) ||
      freelancer.includes(search.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h2 className="text-2xl font-semibold">
          Loading Payments...
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
              Payments
            </h1>

            <p className="mt-2 text-gray-500">
              Monitor all platform payments.
            </p>

          </div>

          <div className="relative mt-5 md:mt-0">

            <FaSearch className="absolute left-4 top-4 text-gray-400" />

            <input
              type="text"
              placeholder="Search payments..."
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
                  Client
                </th>

                <th className="px-6 py-4 text-left">
                  Freelancer
                </th>

                <th className="px-6 py-4 text-left">
                  Amount
                </th>

                <th className="px-6 py-4 text-left">
                  Status
                </th>

                <th className="px-6 py-4 text-left">
                  Date
                </th>

                <th className="px-6 py-4 text-center">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredPayments.length > 0 ? (

                filteredPayments.map((payment) => (

                  <tr
                    key={payment._id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="px-6 py-4">
                      {payment.client?.name || "N/A"}
                    </td>

                    <td className="px-6 py-4">
                      {payment.freelancer?.name || "N/A"}
                    </td>

                    <td className="px-6 py-4">
                      ₹{payment.amount}
                    </td>

                    <td className="px-6 py-4">

                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
                          payment.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : payment.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {payment.status}
                      </span>

                    </td>

                    <td className="px-6 py-4">
                      {new Date(
                        payment.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-center">

                      <button
                        onClick={() =>
                          alert(
                            JSON.stringify(
                              payment,
                              null,
                              2
                            )
                          )
                        }
                        className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
                      >
                        <FaEye />
                      </button>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    className="py-8 text-center text-gray-500"
                  >
                    No payments found.
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

export default AdminPayments;