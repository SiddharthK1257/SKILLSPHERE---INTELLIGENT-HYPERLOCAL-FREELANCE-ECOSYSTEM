function SchedulerFilter({
  search,
  setSearch,
  filter,
  setFilter,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6">

      <div className="flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between">

        {/* Search */}

        <div className="flex-1">

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🔍 Search Slots
          </label>

          <input
            type="text"
            placeholder="Search by date or time..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

        </div>

        {/* Filter */}

        <div>

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📂 Filter
          </label>

          <div className="flex gap-3 flex-wrap">

            <button
              onClick={() => setFilter("all")}
              className={`px-5 py-3 rounded-xl font-semibold transition ${
                filter === "all"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              All
            </button>

            <button
              onClick={() => setFilter("available")}
              className={`px-5 py-3 rounded-xl font-semibold transition ${
                filter === "available"
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Available
            </button>

            <button
              onClick={() => setFilter("booked")}
              className={`px-5 py-3 rounded-xl font-semibold transition ${
                filter === "booked"
                  ? "bg-red-600 text-white shadow-lg"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Booked
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default SchedulerFilter;