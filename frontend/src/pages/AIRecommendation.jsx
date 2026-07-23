import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./AIRecommendation.css";

const AIRecommendation = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [user, setUser] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState("");

  const fetchRecommendations = async () => {
    try {
      setLoading(true);

      const userInfo = JSON.parse(localStorage.getItem("user"));

      if (!userInfo) {
        navigate("/login");
        return;
      }

      const { data } = await API.get(`/match/${userInfo._id}`);

      setRecommendations(data.recommendations || []);
      setUser(data.user || null);
      setStatistics(data.statistics || null);

      setError("");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load AI recommendations."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="ai-loading">
        <div className="loader"></div>
        <h2>Finding Best Jobs For You...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ai-error">
        <h2>{error}</h2>

        <button onClick={fetchRecommendations}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="ai-page">

      {/* Header */}

      <div className="ai-header">

        <h1>
          🤖 AI Job Recommendations
        </h1>

        <p>
          Personalized opportunities based on your
          skills and profile.
        </p>

      </div>

      {/* User */}

      {user && (
        <div className="user-card">

          <img
            src={
              user.profileImage ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt={user.name}
          />

          <div>

            <h2>{user.name}</h2>

            <p>{user.headline}</p>

            <span>{user.location}</span>

          </div>

        </div>
      )}

      {/* Statistics */}

      {statistics && (
        <div className="stats-grid">

          <div className="stat-card">

            <h3>Total Matches</h3>

            <h1>
              {statistics.totalRecommendations}
            </h1>

          </div>

          <div className="stat-card">

            <h3>Excellent</h3>

            <h1>{statistics.excellent}</h1>

          </div>

          <div className="stat-card">

            <h3>Good</h3>

            <h1>{statistics.good}</h1>

          </div>

          <div className="stat-card">

            <h3>Average</h3>

            <h1>{statistics.average}</h1>

          </div>

          <div className="stat-card">

            <h3>Low</h3>

            <h1>{statistics.low}</h1>

          </div>

        </div>
      )}

      {/* Recommendation List */}

      <div className="recommendation-list">

        {recommendations.length === 0 ? (
          <div className="empty">

            <h2>No Recommendations Found</h2>

            <p>
              Update your profile skills to get
              better AI matches.
            </p>

          </div>
        ) : (
          recommendations.map((gig) => (

            <div
  className="recommendation-card"
  key={gig._id}
>
  <div className="recommendation-top">

    <img
      src={gig.image}
      alt={gig.title}
      className="gig-image"
    />

    <div className="gig-info">

      <h2>{gig.title}</h2>

      <p className="category">
        {gig.category}
      </p>

      <p className="description">
        {gig.description}
      </p>

      <div className="gig-meta">

        <span>
          💰 ₹{gig.price}
        </span>

        <span>
          ⏰ {gig.deliveryTime} Days
        </span>

        <span>
          ⭐ {gig.rating}
        </span>

      </div>

    </div>

  </div>

  {/* AI Score */}

  <div className="match-section">

    <div className="match-header">

      <h3>
        AI Match Score
      </h3>

      <h2>{gig.matchScore}%</h2>

    </div>

    <div className="progress">

      <div
        className="progress-fill"
        style={{
          width: `${gig.matchScore}%`,
        }}
      ></div>

    </div>

    <p className="match-level">
      {gig.matchLevel}
    </p>

  </div>

  {/* Matched Skills */}

  <div className="skills-section">

    <h3>
      ✅ Matched Skills
    </h3>

    <div className="skills">

      {gig.matchedSkills.length === 0 ? (
        <span>No Skills Matched</span>
      ) : (
        gig.matchedSkills.map((skill, index) => (
          <span
            key={index}
            className="matched"
          >
            {skill}
          </span>
        ))
      )}

    </div>

  </div>

  {/* Missing Skills */}

  <div className="skills-section">

    <h3>
      ❌ Missing Skills
    </h3>

    <div className="skills">

      {gig.missingSkills.length === 0 ? (
        <span>None 🎉</span>
      ) : (
        gig.missingSkills.map((skill, index) => (
          <span
            key={index}
            className="missing"
          >
            {skill}
          </span>
        ))
      )}

    </div>

  </div>

  {/* AI Reasons */}

  <div className="reason-section">

    <h3>
      Why this matches you
    </h3>

    <ul>

      {gig.reasons.map((reason, index) => (
        <li key={index}>
          {reason}
        </li>
      ))}

    </ul>

  </div>

  {/* Suggestions */}

  <div className="reason-section">

    <h3>
      AI Suggestions
    </h3>

    <ul>

      {gig.suggestions.length === 0 ? (
        <li>
          Your profile already fits this gig well.
        </li>
      ) : (
        gig.suggestions.map((suggestion, index) => (
          <li key={index}>
            {suggestion}
          </li>
        ))
      )}

    </ul>

  </div>

  {/* Freelancer */}

  <div className="freelancer">

    <img
      src={
        gig.freelancer?.profileImage ||
        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
      }
      alt={gig.freelancer?.name}
    />

    <div>

      <h4>
        {gig.freelancer?.name}
      </h4>

      <p>
        {gig.freelancer?.location}
      </p>

    </div>

  </div>

  {/* Buttons */}

  <div className="button-group">

    <button
      className="view-btn"
      onClick={() =>
        navigate(`/gig/${gig._id}`)
      }
    >
      View Gig
    </button>

    <button
      className="refresh-btn"
      onClick={fetchRecommendations}
    >
      Refresh AI Match
    </button>

  </div>

</div>
          ))
        )}

      </div>

    </div>
  );
};

export default AIRecommendation;