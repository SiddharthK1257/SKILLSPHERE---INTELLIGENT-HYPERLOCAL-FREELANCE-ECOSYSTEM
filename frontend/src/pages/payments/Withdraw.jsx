import { useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";

const Withdraw = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const quickAmounts = [500, 1000, 2500, 5000];

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      return toast.error("Please enter a valid amount.");
    }

    try {
      setLoading(true);

      const { data } = await API.post("/payments/withdraw", {
        amount: Number(amount),
        method: "Bank",
      });

      toast.success(data.message || "Withdrawal request submitted.");

      setAmount("");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Withdrawal failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-10">

      <div className="mx-auto max-w-3xl px-6">

        {/* Header */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-slate-900">
            Withdraw Money
          </h1>

          <p className="mt-2 text-slate-600">
            Transfer your available wallet balance directly to your bank account.
          </p>

        </div>

        {/* Main Card */}

        <div className="rounded-3xl bg-white shadow-xl border border-slate-200">

          {/* Top Banner */}

          <div className="rounded-t-3xl bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-white">

            <h2 className="text-2xl font-bold">
              Bank Withdrawal
            </h2>

            <p className="mt-2 text-blue-100">
              Withdraw your earnings safely and securely.
            </p>

          </div>

          {/* Form */}

          <div className="p-8">

            <form onSubmit={submitHandler}>

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Withdrawal Amount
                </label>

                <input
                  type="number"
                  min="1"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-5 py-4 text-lg outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  required
                />

              </div>

              {/* Quick Amount */}

              <div className="mt-6">

                <p className="mb-3 text-sm font-semibold text-slate-600">
                  Quick Select
                </p>

                <div className="flex flex-wrap gap-3">

                  {quickAmounts.map((item) => (

                    <button
                      type="button"
                      key={item}
                      onClick={() => setAmount(item)}
                      className="rounded-xl border border-slate-300 bg-slate-50 px-5 py-2 font-medium transition hover:bg-blue-600 hover:text-white"
                    >
                      ₹{item}
                    </button>

                  ))}

                </div>

              </div>

              {/* Information */}

              <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">

                <h3 className="text-lg font-semibold text-blue-700">
                  Withdrawal Information
                </h3>

                <ul className="mt-4 space-y-2 text-sm text-slate-600">

                  <li>
                    • Withdrawals are transferred to your registered bank account.
                  </li>

                  <li>
                    • Processing time: 1–3 business days.
                  </li>

                  <li>
                    • Ensure sufficient available wallet balance.
                  </li>

                  <li>
                    • You will receive an email confirmation after submission.
                  </li>

                </ul>

              </div>

              {/* Button */}

              <button
                type="submit"
                disabled={loading}
                className={`mt-8 w-full rounded-2xl py-4 text-lg font-semibold text-white transition ${
                  loading
                    ? "cursor-not-allowed bg-slate-400"
                    : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-xl"
                }`}
              >
                {loading
                  ? "Processing Withdrawal..."
                  : "Withdraw Money"}
              </button>

            </form>

          </div>

        </div>

        {/* Bottom Card */}

        <div className="mt-8 rounded-3xl bg-white p-8 shadow-lg border border-slate-200">

          <h3 className="text-xl font-bold text-slate-800">
            Secure Withdrawals
          </h3>

          <p className="mt-3 leading-7 text-slate-600">
            SkillSphere uses secure payment processing to ensure every
            withdrawal is protected. Your banking details remain encrypted,
            and all transactions are verified before processing.
          </p>

        </div>

      </div>

    </div>
  );
};

export default Withdraw;