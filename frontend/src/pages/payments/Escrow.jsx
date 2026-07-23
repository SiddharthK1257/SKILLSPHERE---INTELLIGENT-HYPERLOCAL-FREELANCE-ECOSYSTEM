import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Search,
  RefreshCw,
  Eye,
  Wallet,
  CalendarDays,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  IndianRupee,
} from "lucide-react";

import { getEscrows } from "../../api/paymentApi";

const Escrow = () => {
  const [escrows, setEscrows] = useState([]);
  const [filteredEscrows, setFilteredEscrows] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchEscrows();
  }, []);

  useEffect(() => {
    let data = [...escrows];

    if (statusFilter !== "All") {
      data = data.filter(
        (item) => item.status === statusFilter
      );
    }

    if (search.trim()) {
      const keyword = search.toLowerCase();

      data = data.filter(
        (item) =>
          item.gig?.title
            ?.toLowerCase()
            .includes(keyword) ||
          item.status
            ?.toLowerCase()
            .includes(keyword)
      );
    }

    setFilteredEscrows(data);
  }, [escrows, search, statusFilter]);

  const fetchEscrows = async () => {
    try {
      setLoading(true);

      const { data } = await getEscrows();

      setEscrows(data.escrows || []);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to fetch escrow records."
      );
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const holding = escrows.filter(
      (e) => e.status === "Holding"
    ).length;

    const released = escrows.filter(
      (e) => e.status === "Released"
    ).length;

    const disputes = escrows.filter(
      (e) => e.disputeOpened
    ).length;

    const totalAmount = escrows.reduce(
      (sum, e) => sum + Number(e.totalAmount || 0),
      0
    );

    return {
      total: escrows.length,
      holding,
      released,
      disputes,
      amount: totalAmount,
    };
  }, [escrows]);

  const badge = (status) => {
    switch (status) {
      case "Holding":
        return "bg-yellow-100 text-yellow-700";

      case "Released":
        return "bg-green-100 text-green-700";

      case "Refunded":
        return "bg-red-100 text-red-700";

      case "Cancelled":
        return "bg-gray-100 text-gray-700";

      case "Partially Released":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const icon = (status) => {
    switch (status) {
      case "Holding":
        return (
          <Clock3
            size={15}
            className="text-yellow-600"
          />
        );

      case "Released":
        return (
          <CheckCircle2
            size={15}
            className="text-green-600"
          />
        );

      default:
        return (
          <AlertTriangle
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

          <h3 className="mt-5 text-xl font-bold text-slate-700">
            Loading Escrow Records...
          </h3>

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

              <ShieldCheck className="text-blue-600" />

              Escrow Management

            </h1>

            <p className="mt-2 text-slate-500">
              Securely monitor all escrow payments.
            </p>

          </div>

          <button
            onClick={fetchEscrows}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <RefreshCw size={18} />
            Refresh
          </button>

        </div>

        {/* Stats */}

        <div className="mb-8 grid gap-6 md:grid-cols-5">

          <StatCard
            title="Total Escrows"
            value={stats.total}
          />

          <StatCard
            title="Holding"
            value={stats.holding}
          />

          <StatCard
            title="Released"
            value={stats.released}
          />

          <StatCard
            title="Disputes"
            value={stats.disputes}
          />

          <StatCard
            title="Total Amount"
            value={`₹${stats.amount}`}
          />

        </div>

        {/* Filters */}

        <div className="mb-8 rounded-3xl bg-white p-6 shadow">

          <div className="grid gap-5 md:grid-cols-2">

            <div className="relative">

              <Search
                className="absolute left-4 top-4 text-gray-400"
                size={18}
              />

              <input
                type="text"
                placeholder="Search gig..."
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
              <option>Holding</option>
              <option>Released</option>
              <option>Refunded</option>
              <option>Cancelled</option>
              <option>Partially Released</option>
            </select>

          </div>

        </div>

        {/* Empty */}

        {filteredEscrows.length === 0 ? (

          <div className="rounded-3xl bg-white p-20 text-center shadow">

            <ShieldCheck
              size={70}
              className="mx-auto text-gray-300"
            />

            <h2 className="mt-6 text-2xl font-bold">
              No Escrow Records
            </h2>

            <p className="mt-3 text-gray-500">
              Escrow payments will appear here once
              projects begin.
            </p>

          </div>

        ) : (

          <div className="overflow-hidden rounded-3xl bg-white shadow">

            <table className="min-w-full">

              <thead className="bg-slate-800 text-white">

                <tr>

                  <th className="px-5 py-4 text-left">#</th>
                  <th className="px-5 py-4 text-left">Gig</th>
                  <th className="px-5 py-4 text-left">Total</th>
                  <th className="px-5 py-4 text-left">Freelancer</th>
                  <th className="px-5 py-4 text-left">Status</th>
                  <th className="px-5 py-4 text-left">Released</th>
                  <th className="px-5 py-4 text-left">Auto Release</th>
                  <th className="px-5 py-4 text-left">Dispute</th>
                  <th className="px-5 py-4 text-left">Action</th>

                </tr>

              </thead>

              <tbody>

                {filteredEscrows.map(
                  (escrow, index) => (

                    <motion.tr
                      key={escrow._id}
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

                      <td className="px-5 py-5">
                        {index + 1}
                      </td>

                      <td className="px-5 py-5 font-semibold">
                        {escrow.gig?.title}
                      </td>

                      <td className="px-5 py-5">

                        <div className="flex items-center">

                          <IndianRupee
                            size={15}
                          />

                          {escrow.totalAmount}

                        </div>

                      </td>

                      <td className="px-5 py-5">

                        ₹
                        {escrow.freelancerAmount}

                      </td>

                      <td className="px-5 py-5">

                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${badge(
                            escrow.status
                          )}`}
                        >

                          {icon(escrow.status)}

                          {escrow.status}

                        </span>

                      </td>

                      <td className="px-5 py-5">

                        {escrow.released ? (
                          <span className="font-semibold text-green-600">
                            Yes
                          </span>
                        ) : (
                          <span className="font-semibold text-red-500">
                            No
                          </span>
                        )}

                      </td>

                      <td className="px-5 py-5">

                        <div className="flex items-center gap-2">

                          <CalendarDays size={15} />

                          {escrow.autoReleaseDate
                            ? new Date(
                                escrow.autoReleaseDate
                              ).toLocaleDateString()
                            : "-"}

                        </div>

                      </td>

                      <td className="px-5 py-5">

                        {escrow.disputeOpened ? (
                          <span className="font-semibold text-red-600">
                            Opened
                          </span>
                        ) : (
                          <span className="text-gray-500">
                            None
                          </span>
                        )}

                      </td>

                      <td className="px-5 py-5">

                        <Link
                          to={`/payment/${escrow.payment}`}
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

export default Escrow;