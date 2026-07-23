import { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import API from "../../services/api";

import {
  FaSearch,
  FaTrash,
  FaStar,
} from "react-icons/fa";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data } = await API.get("/admin/reviews");

      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to load reviews."
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      const { data } = await API.delete(
        `/admin/reviews/${id}`
      );

      if (data.success) {
        setReviews(
          reviews.filter((review) => review._id !== id)
        );

        alert(data.message);
      }
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to delete review."
      );
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const reviewer =
      review.reviewer?.name?.toLowerCase() || "";

    const freelancer =
      review.freelancer?.name?.toLowerCase() || "";

    return (
      reviewer.includes(search.toLowerCase()) ||
      freelancer.includes(search.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h2 className="text-2xl font-semibold">
          Loading Reviews...
        </h2>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      <AdminSidebar />

      <div className="flex-1 p-8">

        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">

          <div>

            <h1 className="text-3xl font-bold text-gray-800">
              Reviews
            </h1>

            <p className="mt-2 text-gray-500">
              Manage all user reviews.
            </p>

          </div>

          <div className="relative mt-5 md:mt-0">

            <FaSearch className="absolute left-4 top-4 text-gray-400" />

            <input
              type="text"
              placeholder="Search reviews..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-80 rounded-xl border bg-white py-3 pl-11 pr-4 outline-none focus:border-blue-500"
            />

          </div>

        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow">

          <table className="w-full">

            <thead className="bg-gray-50">

              <tr>

                <th className="px-6 py-4 text-left">
                  Reviewer
                </th>

                <th className="px-6 py-4 text-left">
                  Freelancer
                </th>

                <th className="px-6 py-4 text-left">
                  Rating
                </th>

                <th className="px-6 py-4 text-left">
                  Comment
                </th>

                <th className="px-6 py-4 text-left">
                  Date
                </th>

                <th className="px-6 py-4 text-center">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredReviews.length > 0 ? (

                filteredReviews.map((review) => (

                  <tr
                    key={review._id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="px-6 py-4">
                      {review.reviewer?.name || "N/A"}
                    </td>

                    <td className="px-6 py-4">
                      {review.freelancer?.name || "N/A"}
                    </td>

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-1">

                        <FaStar className="text-yellow-500" />

                        {review.rating}/5

                      </div>

                    </td>

                    <td className="px-6 py-4">
                      {review.comment}
                    </td>

                    <td className="px-6 py-4">
                      {new Date(
                        review.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">

                      <div className="flex justify-center">

                        <button
                          onClick={() =>
                            deleteReview(review._id)
                          }
                          className="rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
                        >
                          <FaTrash />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    className="py-10 text-center text-gray-500"
                  >
                    No reviews found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default AdminReviews;