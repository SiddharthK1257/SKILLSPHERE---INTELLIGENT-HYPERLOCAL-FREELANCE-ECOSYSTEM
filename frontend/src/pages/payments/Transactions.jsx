import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import API from "../../services/api";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock3,
  CheckCircle2,
  XCircle,
  Search,
  Wallet,
  IndianRupee,
  RefreshCw,
} from "lucide-react";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    let data = [...transactions];

    if (statusFilter !== "All") {
      data = data.filter(
        (item) => item.status === statusFilter
      );
    }

    if (search.trim()) {
      const keyword = search.toLowerCase();

      data = data.filter(
        (item) =>
          item.title?.toLowerCase().includes(keyword) ||
          item.gateway?.toLowerCase().includes(keyword) ||
          item.type?.toLowerCase().includes(keyword)
      );
    }

    setFilteredTransactions(data);
  }, [transactions, search, statusFilter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const { data } = await API.get(
        "/payments/wallet/transactions"
      );

      setTransactions(data.transactions || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const completed = transactions.filter(
      (t) => t.status === "Completed"
    );

    const pending = transactions.filter(
      (t) => t.status === "Pending"
    );

    const total = completed.reduce(
      (sum, t) => sum + Number(t.amount),
      0
    );

    return {
      totalTransactions: transactions.length,
      completed: completed.length,
      pending: pending.length,
      totalAmount: total,
    };
  }, [transactions]);

  const badge = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Failed":
        return "bg-red-100 text-red-700";

      case "Cancelled":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const icon = (status) => {
    switch (status) {
      case "Completed":
        return (
          <CheckCircle2
            size={16}
            className="text-green-600"
          />
        );

      case "Pending":
        return (
          <Clock3
            size={16}
            className="text-yellow-600"
          />
        );

      case "Failed":
        return (
          <XCircle
            size={16}
            className="text-red-600"
          />
        );

      default:
        return (
          <Clock3
            size={16}
            className="text-gray-500"
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">

        <div className="text-center">

          <RefreshCw className="mx-auto h-12 w-12 animate-spin text-blue-600" />

          <p className="mt-4 text-lg font-semibold text-gray-600">
            Loading Transactions...
          </p>

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

              Transaction History

            </h1>

            <p className="mt-2 text-slate-500">
              Track every wallet payment and
              transaction.
            </p>

          </div>

          <button
            onClick={fetchTransactions}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <RefreshCw size={18} />
            Refresh
          </button>

        </div>

        {/* Statistics */}

        <div className="mb-8 grid gap-6 md:grid-cols-4">

          <StatCard
            title="Transactions"
            value={stats.totalTransactions}
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
            title="Total Amount"
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
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search transactions..."
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
              <option>Failed</option>
              <option>Cancelled</option>
            </select>

          </div>

        </div>

        {/* Empty */}

        {filteredTransactions.length === 0 ? (

          <div className="rounded-3xl bg-white p-20 text-center shadow">

            <Wallet
              className="mx-auto text-gray-300"
              size={70}
            />

            <h2 className="mt-6 text-2xl font-bold">
              No Transactions Found
            </h2>

            <p className="mt-3 text-gray-500">
              Your transaction history will appear
              here.
            </p>

          </div>

        ) : (

          <div className="overflow-hidden rounded-3xl bg-white shadow">

            <table className="min-w-full">

              <thead className="bg-slate-800 text-white">

                <tr>

                  <th className="px-6 py-4 text-left">#</th>
                  <th className="px-6 py-4 text-left">Type</th>
                  <th className="px-6 py-4 text-left">Amount</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Gateway</th>
                  <th className="px-6 py-4 text-left">Title</th>
                  <th className="px-6 py-4 text-left">Date</th>

                </tr>

              </thead>

              <tbody>

                {filteredTransactions.map(
                  (transaction, index) => (

                    <motion.tr
                      key={transaction._id}
                      initial={{
                        opacity: 0,
                        y: 15,
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

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2">

                          {transaction.type ===
                          "Credit" ? (
                            <ArrowDownLeft className="text-green-600" />
                          ) : (
                            <ArrowUpRight className="text-red-500" />
                          )}

                          {transaction.type}

                        </div>

                      </td>

                      <td className="px-6 py-5 font-bold">

                        <div className="flex items-center">

                          <IndianRupee
                            size={16}
                          />

                          {transaction.amount}

                        </div>

                      </td>

                      <td className="px-6 py-5">

                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${badge(
                            transaction.status
                          )}`}
                        >

                          {icon(transaction.status)}

                          {transaction.status}

                        </span>

                      </td>

                      <td className="px-6 py-5">
                        {transaction.gateway}
                      </td>

                      <td className="px-6 py-5">
                        {transaction.title}
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-500">
                        {new Date(
                          transaction.createdAt
                        ).toLocaleString()}
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

export default Transactions;