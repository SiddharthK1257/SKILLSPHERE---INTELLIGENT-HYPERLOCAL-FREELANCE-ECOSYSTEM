import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Wallet,
  Search,
  RefreshCw,
  Eye,
  IndianRupee,
  CheckCircle2,
  Clock3,
  XCircle,
  CreditCard,
  CalendarDays,
} from "lucide-react";

import { getMyPayments } from "../../services/paymentService";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    let data = [...payments];

    if (statusFilter !== "All") {
      data = data.filter(
        (payment) =>
          payment.paymentStatus === statusFilter
      );
    }

    if (search.trim()) {
      const keyword = search.toLowerCase();

      data = data.filter(
        (payment) =>
          payment.gig?.title
            ?.toLowerCase()
            .includes(keyword) ||
          payment.paymentMethod
            ?.toLowerCase()
            .includes(keyword)
      );
    }

    setFilteredPayments(data);
  }, [payments, search, statusFilter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);

      const response = await getMyPayments();

      if (response.success) {
        setPayments(response.payments || []);
      } else {
        setPayments([]);
      }
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Unable to fetch payments."
      );

      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const completed = payments.filter(
      (p) => p.paymentStatus === "Completed"
    );

    const pending = payments.filter(
      (p) => p.paymentStatus === "Pending"
    );

    const escrow = payments.filter(
      (p) => p.paymentStatus === "Escrow"
    );

    const total = completed.reduce(
      (sum, p) => sum + Number(p.amount),
      0
    );

    return {
      totalPayments: payments.length,
      completed: completed.length,
      pending: pending.length,
      escrow: escrow.length,
      totalAmount: total,
    };
  }, [payments]);

  const badgeStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Escrow":
        return "bg-blue-100 text-blue-700";

      case "Refunded":
        return "bg-red-100 text-red-700";

      case "Cancelled":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const badgeIcon = (status) => {
    switch (status) {
      case "Completed":
        return (
          <CheckCircle2
            size={15}
            className="text-green-600"
          />
        );

      case "Pending":
        return (
          <Clock3
            size={15}
            className="text-yellow-600"
          />
        );

      case "Escrow":
        return (
          <Wallet
            size={15}
            className="text-blue-600"
          />
        );

      default:
        return (
          <XCircle
            size={15}
            className="text-red-500"
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">

        <div className="text-center">

          <RefreshCw className="mx-auto h-12 w-12 animate-spin text-blue-600" />

          <h2 className="mt-4 text-xl font-bold text-slate-700">
            Loading Payment History...
          </h2>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="mx-auto w-full max-w-screen-2xl px-10 py-10">

        {/* Header */}

        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h1 className="flex items-center gap-3 text-4xl font-black text-slate-800">

              <Wallet className="text-blue-600" />

              Payment History

            </h1>

            <p className="mt-2 text-slate-500">
              View all your completed and pending
              payments.
            </p>

          </div>

          <button
            onClick={fetchPayments}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <RefreshCw size={18} />
            Refresh
          </button>

        </div>

        {/* Statistics */}

        <div className="mb-8 grid gap-6 md:grid-cols-5">

          <StatCard
            title="Payments"
            value={stats.totalPayments}
          />

          <StatCard
            title="Completed"
            value={stats.completed}
          />

          <StatCard
            title="Pending"
            value={stats.pending}
          />

          <StatCard
            title="Escrow"
            value={stats.escrow}
          />

          <StatCard
            title="Total Paid"
            value={`₹${stats.totalAmount}`}
          />

        </div>

        {/* Filters */}

        <div className="mb-8 rounded-3xl bg-white p-6 shadow">

          <div className="grid gap-5 md:grid-cols-2">

            <div className="relative">

              <Search
                size={18}
                className="absolute left-4 top-4 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search gig or payment method..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full rounded-xl border py-3 pl-11 pr-4 outline-none focus:border-blue-500"
              />

            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="rounded-xl border p-3"
            >
              <option>All</option>
              <option>Completed</option>
              <option>Pending</option>
              <option>Escrow</option>
              <option>Refunded</option>
              <option>Cancelled</option>
            </select>

          </div>

        </div>

        {/* Empty */}

        {filteredPayments.length === 0 ? (

          <div className="rounded-3xl bg-white p-20 text-center shadow">

            <CreditCard
              size={70}
              className="mx-auto text-gray-300"
            />

            <h2 className="mt-6 text-2xl font-bold">
              No Payments Found
            </h2>

            <p className="mt-3 text-gray-500">
              Your payment history will appear here.
            </p>

          </div>

        ) : (

          <div className="overflow-hidden rounded-3xl bg-white shadow">

            <table className="min-w-full">

              <thead className="bg-slate-800 text-white">

                <tr>

                  <th className="px-6 py-4 text-left">
                    #
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

                  <th className="px-6 py-4 text-left">
                    Method
                  </th>

                  <th className="px-6 py-4 text-left">
                    Date
                  </th>

                  <th className="px-6 py-4 text-left">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredPayments.map(
                  (payment, index) => (

                    <motion.tr
                      key={payment._id}
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="border-b hover:bg-slate-50"
                    >

                      <td className="px-6 py-5">
                        {index + 1}
                      </td>

                      <td className="px-6 py-5 font-semibold">
                        {payment.gig?.title ||
                          "N/A"}
                      </td>

                      <td className="px-6 py-5 font-bold">

                        <div className="flex items-center">

                          <IndianRupee
                            size={15}
                          />

                          {payment.amount}

                        </div>

                      </td>

                      <td className="px-6 py-5">

                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${badgeStyle(
                            payment.paymentStatus
                          )}`}
                        >

                          {badgeIcon(
                            payment.paymentStatus
                          )}

                          {
                            payment.paymentStatus
                          }

                        </span>

                      </td>

                      <td className="px-6 py-5">
                        {payment.paymentMethod ||
                          "Razorpay"}
                      </td>

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2">

                          <CalendarDays
                            size={15}
                          />

                          {payment.createdAt
                            ? new Date(
                                payment.createdAt
                              ).toLocaleDateString()
                            : "-"}

                        </div>

                      </td>

                      <td className="px-6 py-5">

                        <Link
                          to={`/payment/${payment._id}`}
                          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                          <Eye size={16} />
                          View
                        </Link>

                      </td>

                    </motion.tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="rounded-3xl bg-white p-6 shadow">

    <p className="text-sm text-slate-500">
      {title}
    </p>

    <h2 className="mt-2 text-3xl font-black text-slate-800">
      {value}
    </h2>

  </div>
);

export default PaymentHistory;