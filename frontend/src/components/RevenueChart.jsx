import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function RevenueChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">
          Monthly Revenue
        </h2>

        <div className="h-72 flex items-center justify-center text-gray-500">
          No revenue data available.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-5">
        Monthly Revenue
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 10,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="month"
            />

            <YAxis />

            <Tooltip
              formatter={(value) => [`₹${value}`, "Revenue"]}
            />

            <Line
              type="monotone"
              dataKey="amount"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RevenueChart;