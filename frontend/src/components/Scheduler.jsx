import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import {
  CalendarDays,
  RefreshCcw,
  AlertCircle,
} from "lucide-react";

import SchedulerStats from "./SchedulerStats";
import SchedulerForm from "./SchedulerForm";
import SchedulerFilter from "./SchedulerFilter";
import SchedulerCard from "./SchedulerCard";

const API = "http://localhost:5000/api/scheduler";

const Scheduler = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const token = localStorage.getItem("token");

  const config = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    [token]
  );

  const loadSlots = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await axios.get(API, config);

      setSlots(data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load scheduler."
      );
    } finally {
      setLoading(false);
    }
  }, [config]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSlots();
    setRefreshing(false);
  };

  const filteredSlots = useMemo(() => {
    return slots.filter((slot) => {
      const query = search.toLowerCase();

      const matchesSearch =
        slot.date.toLowerCase().includes(query) ||
        slot.time.toLowerCase().includes(query);

      const matchesFilter =
        filter === "all"
          ? true
          : filter === "available"
          ? !slot.booked
          : slot.booked;

      return matchesSearch && matchesFilter;
    });
  }, [slots, search, filter]);

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Scheduler
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your available meeting slots.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition disabled:opacity-50"
        >
          <RefreshCcw
            size={18}
            className={refreshing ? "animate-spin" : ""}
          />

          Refresh
        </button>

      </div>

      <SchedulerStats slots={slots} />

      <SchedulerForm reload={loadSlots} />

      <SchedulerFilter
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
      />

      {/* Error */}

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-5">
          <AlertCircle className="text-red-500" />

          <div>
            <p className="font-semibold text-red-600">
              Something went wrong
            </p>

            <p className="text-sm text-red-500">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Loading */}

      {loading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-white rounded-2xl shadow-md p-6 animate-pulse"
            >
              <div className="h-5 bg-gray-200 rounded w-40 mb-4"></div>

              <div className="h-4 bg-gray-200 rounded mb-2"></div>

              <div className="h-4 bg-gray-200 rounded mb-2"></div>

              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : filteredSlots.length === 0 ? (

        <div className="bg-white shadow rounded-2xl py-20 text-center">

          <CalendarDays
            size={70}
            className="mx-auto text-blue-500"
          />

          <h2 className="mt-6 text-3xl font-bold text-gray-800">
            No Slots Found
          </h2>

          <p className="mt-3 text-gray-500">
            Try changing filters or create a new schedule.
          </p>

        </div>

      ) : (

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-7">

          {filteredSlots.map((slot) => (
            <SchedulerCard
              key={slot._id}
              slot={slot}
              reload={loadSlots}
            />
          ))}

        </div>

      )}
    </div>
  );
};

export default Scheduler;