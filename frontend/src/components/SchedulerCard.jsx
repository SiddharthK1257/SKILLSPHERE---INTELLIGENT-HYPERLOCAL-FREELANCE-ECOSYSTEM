import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "https://skillsphere-intelligent-hyperlocal-4wq2.onrender.com/api";
const API = `${API_BASE}/scheduler`;

function SchedulerCard({ slot, reload }) {
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const bookSlot = async () => {
    try {
      await axios.put(`${API}/${slot._id}`, {}, config);
      reload();
    } catch (err) {
      console.error(err);
      alert("Failed to book slot.");
    }
  };

  const deleteSlot = async () => {
    const confirmDelete = window.confirm(
      "Delete this schedule?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/${slot._id}`, config);
      reload();
    } catch (err) {
      console.error(err);
      alert("Failed to delete slot.");
    }
  };

  const scheduleDate = new Date(slot.date);

  const formattedDate = scheduleDate.toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  const today = new Date();

  const diffDays = Math.ceil(
    (scheduleDate - today) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-slate-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">

      {/* Top Bar */}

      <div
        className={`h-2 ${
          slot.booked
            ? "bg-gradient-to-r from-red-500 to-pink-500"
            : "bg-gradient-to-r from-green-500 to-emerald-500"
        }`}
      ></div>

      <div className="p-6">

        {/* Header */}

        <div className="flex justify-between items-start">

          <div>

            <h2 className="text-xl font-bold text-slate-800">
              📅 {formattedDate}
            </h2>

            <p className="text-gray-500 mt-1">
              Time: {slot.time}
            </p>

          </div>

          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              slot.booked
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {slot.booked ? "Booked" : "Available"}
          </span>

        </div>

        {/* Details */}

        <div className="mt-6 grid grid-cols-2 gap-4">

          <div className="bg-slate-50 rounded-xl p-4">

            <p className="text-gray-500 text-sm">
              Slot ID
            </p>

            <p className="font-semibold text-slate-700 break-all">
              {slot._id}
            </p>

          </div>

          <div className="bg-slate-50 rounded-xl p-4">

            <p className="text-gray-500 text-sm">
              Remaining Days
            </p>

            <p className="font-semibold text-slate-700">
              {diffDays >= 0
                ? `${diffDays} Day${diffDays !== 1 ? "s" : ""}`
                : "Expired"}
            </p>

          </div>

        </div>

        {/* Status */}

        <div className="mt-6">

          <div className="flex justify-between mb-2">

            <span className="text-sm font-medium">
              Booking Status
            </span>

            <span className="text-sm font-semibold">
              {slot.booked ? "100%" : "0%"}
            </span>

          </div>

          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

            <div
              className={`h-3 rounded-full transition-all duration-700 ${
                slot.booked
                  ? "bg-green-500 w-full"
                  : "bg-blue-500 w-0"
              }`}
            ></div>

          </div>

        </div>

        {/* Actions */}

        <div className="grid grid-cols-2 gap-4 mt-8">

          {!slot.booked ? (
            <button
              onClick={bookSlot}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl py-3 font-semibold hover:scale-105 transition"
            >
              ✅ Book Slot
            </button>
          ) : (
            <button
              disabled
              className="bg-gray-300 text-gray-600 rounded-xl py-3 font-semibold cursor-not-allowed"
            >
              Already Booked
            </button>
          )}

          <button
            onClick={deleteSlot}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl py-3 font-semibold hover:scale-105 transition"
          >
            🗑 Delete
          </button>

        </div>

      </div>

    </div>
  );
}

export default SchedulerCard;