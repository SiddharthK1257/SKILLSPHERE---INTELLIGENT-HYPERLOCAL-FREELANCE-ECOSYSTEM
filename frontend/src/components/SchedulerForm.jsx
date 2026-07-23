import { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "https://skillsphere-intelligent-hyperlocal-4wq2.onrender.com/api";
const API = `${API_BASE}/scheduler`;

function SchedulerForm({ reload }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const addSlot = async (e) => {
    e.preventDefault();

    if (!date || !time) {
      alert("Please select both date and time.");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        API,
        {
          date,
          time,
        },
        config
      );

      setDate("");
      setTime("");

      reload();

      alert("Slot added successfully!");
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message || "Failed to add slot."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          📅 Create Availability Slot
        </h2>

        <p className="text-gray-500 mt-2">
          Select a date and time to make yourself available for bookings.
        </p>
      </div>

      <form
        onSubmit={addSlot}
        className="grid md:grid-cols-3 gap-6"
      >
        {/* Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        {/* Time */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Time
          </label>

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        {/* Button */}
        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-xl py-3 font-semibold text-white transition duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 hover:shadow-lg"
            }`}
          >
            {loading ? "Adding..." : "➕ Add Slot"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SchedulerForm;