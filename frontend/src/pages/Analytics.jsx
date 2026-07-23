import { useEffect, useState } from "react";
import { getAnalytics } from "../services/analyticsApi";
import AnalyticsCard from "../components/AnalyticsCard";
import RevenueChart from "../components/RevenueChart";

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] =useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const data = await getAnalytics();

      setAnalytics(data.analytics);
      setError("");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load analytics."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Loading Analytics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Heading */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Analytics Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Monitor your freelance performance.
        </p>
      </div>

      {/* Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">

        <AnalyticsCard
          title="Profile Views"
          value={analytics.profileViews}
          icon="👁️"
          color="bg-blue-500"
        />

        <AnalyticsCard
          title="Applications"
          value={analytics.gigApplications}
          icon="📄"
          color="bg-green-500"
        />

        <AnalyticsCard
          title="Earnings"
          value={`₹${analytics.totalEarnings}`}
          icon="💰"
          color="bg-yellow-500"
        />

        <AnalyticsCard
          title="Rating"
          value={analytics.averageRating}
          icon="⭐"
          color="bg-purple-500"
        />

        <AnalyticsCard
          title="Reviews"
          value={analytics.totalReviews}
          icon="📝"
          color="bg-red-500"
        />

      </div>

      {/* Revenue Chart */}

      <RevenueChart
        data={analytics.monthlyRevenue}
      />

      {/* Revenue Table */}

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mt-8">

        <h2 className="text-xl font-semibold mb-5">
          Monthly Revenue Details
        </h2>

        {analytics.monthlyRevenue.length === 0 ? (
          <p className="text-gray-500">
            No revenue available.
          </p>
        ) : (
          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-3">
                  Month
                </th>

                <th className="text-right py-3">
                  Revenue
                </th>

              </tr>

            </thead>

            <tbody>

              {analytics.monthlyRevenue.map((item, index) => (
                <tr
                  key={index}
                  className="border-b"
                >
                  <td className="py-3">
                    {item.month}
                  </td>

                  <td className="py-3 text-right font-semibold">
                    ₹{item.amount}
                  </td>
                </tr>
              ))}

            </tbody>

          </table>
        )}

      </div>

    </div>
  );
}

export default Analytics;