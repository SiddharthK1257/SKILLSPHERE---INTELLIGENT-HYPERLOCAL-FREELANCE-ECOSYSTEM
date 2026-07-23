import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../gigs.css";

const MyGigs = () => {
  const navigate = useNavigate();

  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // Fetch My Gigs
  // ===============================

  const fetchMyGigs = async () => {
    try {
      const { data } = await API.get("/gigs/mygigs");

      if (data.success) {
        setGigs(data.gigs || []);
      }
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          "Failed to fetch your gigs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyGigs();
  }, []);

  // ===============================
  // Delete Gig
  // ===============================

  const deleteGig = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this gig?"
    );

    if (!confirmDelete) return;

    try {
      const { data } = await API.delete(`/gigs/${id}`);

      alert(data.message);

      setGigs((prev) =>
        prev.filter((gig) => gig._id !== id)
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to delete gig."
      );
    }
  };

  // ===============================
  // Loading
  // ===============================

  if (loading) {
    return (
      <div className="browse-page">
        <h2>Loading your gigs...</h2>
      </div>
    );
  }

  // ===============================
  // UI
  // ===============================

  return (
    <div className="my-gigs-page">

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1 className="page-title">
          My Gigs
        </h1>

        <button
          className="submit-btn"
          onClick={() => navigate("/create-gig")}
        >
          + Create Gig
        </button>
      </div>

      {gigs.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            marginTop: "60px",
          }}
        >
          <h2>No gigs created yet.</h2>

          <button
            className="submit-btn"
            style={{
              marginTop: "20px",
              width: "220px",
            }}
            onClick={() => navigate("/create-gig")}
          >
            Create First Gig
          </button>
        </div>
      ) : (
        <div className="gig-grid">

          {gigs.map((gig) => (

            <div
              key={gig._id}
              className="gig-card"
            >
              <img
                src={
                  gig.image ||
                  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800"
                }
                alt={gig.title}
                className="gig-image"
              />

              <div className="gig-content">

                <h2>{gig.title}</h2>

                <p className="gig-category">
                  {gig.category}
                </p>

                <p>
                  <strong>Price:</strong> ₹{gig.price}
                </p>

                <p>
                  <strong>Delivery:</strong>{" "}
                  {gig.deliveryTime} Days
                </p>

                <p>
                  <strong>Applications:</strong>{" "}
                  {gig.applications || 0}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {gig.isActive
                    ? "Active"
                    : "Inactive"}
                </p>

                <div
                  style={{
                    display: "grid",
                    gap: "10px",
                    marginTop: "20px",
                  }}
                >

                  <Link to={`/gigs/${gig._id}`}>
                    <button className="submit-btn">
                      View Gig
                    </button>
                  </Link>

                  <Link to={`/gig/${gig._id}/proposals`}>
                    <button
                      className="submit-btn"
                      style={{
                        background: "#2563eb",
                      }}
                    >
                      View Proposals
                    </button>
                  </Link>

                  <Link to={`/edit-gig/${gig._id}`}>
                    <button
                      className="submit-btn"
                      style={{
                        background: "#10b981",
                      }}
                    >
                      Edit Gig
                    </button>
                  </Link>

                  <button
                    className="submit-btn"
                    style={{
                      background: "#ef4444",
                    }}
                    onClick={() => deleteGig(gig._id)}
                  >
                    Delete Gig
                  </button>

                </div>

              </div>
            </div>

          ))}

        </div>
      )}
    </div>
  );
};

export default MyGigs;