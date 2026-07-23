import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Wallet as WalletIcon,
  IndianRupee,
  RefreshCw,
  ArrowUpRight,
  History,
  TrendingUp,
  Clock3,
  Lock,
  DollarSign,
  CreditCard,
  PiggyBank,
} from "lucide-react";

import { getWallet } from "../../services/paymentService";

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      setLoading(true);

      const data = await getWallet();

      setWallet(data.wallet);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <h2 className="mt-5 text-xl font-bold text-slate-700">
            Loading Wallet...
          </h2>
        </div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
          <WalletIcon
            size={70}
            className="mx-auto text-gray-300"
          />

          <h2 className="mt-6 text-2xl font-bold text-slate-800">
            Wallet Not Found
          </h2>

          <p className="mt-3 text-gray-500">
            Unable to load your wallet information.
          </p>

          <button
            onClick={fetchWallet}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Retry
          </button>
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

              <WalletIcon className="text-blue-600" />

              My Wallet

            </h1>

            <p className="mt-2 text-slate-500">
              Manage your earnings, withdrawals and wallet balance.
            </p>

          </div>

          <button
            onClick={fetchWallet}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <RefreshCw size={18} />
            Refresh
          </button>

        </div>

        {/* Balance Cards */}

        <div className="grid gap-6 md:grid-cols-3">

          <BalanceCard
            title="Available Balance"
            amount={wallet.availableBalance}
            color="green"
            icon={<IndianRupee size={28} />}
          />

          <BalanceCard
            title="Pending Balance"
            amount={wallet.pendingBalance}
            color="yellow"
            icon={<Clock3 size={28} />}
          />

          <BalanceCard
            title="Locked Balance"
            amount={wallet.lockedBalance}
            color="red"
            icon={<Lock size={28} />}
          />

        </div>

        {/* Statistics */}

        <div className="mt-10 rounded-3xl bg-white p-8 shadow">

          <h2 className="mb-8 text-2xl font-bold text-slate-800">
            Wallet Statistics
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            <StatCard
              title="Total Earnings"
              value={`₹${wallet.totalEarnings}`}
              icon={<TrendingUp />}
              color="text-green-600"
            />

            <StatCard
              title="Withdrawn"
              value={`₹${wallet.totalWithdrawn}`}
              icon={<ArrowUpRight />}
              color="text-blue-600"
            />

            <StatCard
              title="Refunds"
              value={`₹${wallet.totalRefunds}`}
              icon={<CreditCard />}
              color="text-red-600"
            />

            <StatCard
              title="Transactions"
              value={wallet.totalTransactions}
              icon={<PiggyBank />}
              color="text-purple-600"
            />

          </div>

        </div>

        {/* Wallet Summary */}

        <div className="mt-10 grid gap-8 lg:grid-cols-2">

          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-xl"
          >

            <h3 className="text-xl font-bold">
              Current Wallet Balance
            </h3>

            <p className="mt-2 text-blue-100">
              Total funds currently available.
            </p>

            <div className="mt-8 flex items-center gap-2 text-5xl font-black">

              <IndianRupee size={40} />

              {wallet.availableBalance}

            </div>

          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-3xl bg-white p-8 shadow"
          >

            <h3 className="text-xl font-bold text-slate-800">
              Quick Actions
            </h3>

            <p className="mt-2 text-slate-500">
              Manage your wallet easily.
            </p>

            <div className="mt-8 space-y-4">

              <Link
                to="/payments/withdraw"
                className="flex items-center justify-between rounded-xl bg-blue-600 px-5 py-4 font-semibold text-white transition hover:bg-blue-700"
              >
                Withdraw Money
                <ArrowUpRight />
              </Link>

              <Link
                to="/payments/transactions"
                className="flex items-center justify-between rounded-xl border border-slate-200 px-5 py-4 font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                View Transactions
                <History />
              </Link>

            </div>

          </motion.div>

        </div>

      </div>

    </div>
  );
};

const BalanceCard = ({
  title,
  amount,
  color,
  icon,
}) => {
  const colors = {
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="rounded-3xl bg-white p-6 shadow"
    >
      <div
        className={`inline-flex rounded-2xl p-4 ${colors[color]}`}
      >
        {icon}
      </div>

      <p className="mt-6 text-sm text-slate-500">
        {title}
      </p>

      <h2 className="mt-2 text-4xl font-black text-slate-800">
        ₹{amount}
      </h2>
    </motion.div>
  );
};

const StatCard = ({
  title,
  value,
  icon,
  color,
}) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="rounded-2xl border border-slate-100 bg-slate-50 p-6"
  >
    <div className={`${color} mb-4`}>
      {icon}
    </div>

    <p className="text-sm text-slate-500">
      {title}
    </p>

    <h3 className="mt-2 text-3xl font-black text-slate-800">
      {value}
    </h3>
  </motion.div>
);

export default Wallet;