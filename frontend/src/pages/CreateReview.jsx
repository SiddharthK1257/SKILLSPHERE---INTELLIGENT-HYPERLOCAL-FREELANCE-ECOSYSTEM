import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import RatingStars from "../components/reviews/RatingStars";

import "./CreateReview.css";

const API =
  import.meta.env.VITE_API_URL ||
  "https://skillsphere-intelligent-hyperlocal-4wq2.onrender.com/api";

const CreateReview = () => {
  const navigate = useNavigate();

  const [proposalId, setProposalId] =
    useState("");

  const [paymentId, setPaymentId] =
    useState("");

  const [overallRating, setOverallRating] =
    useState(5);

  const [communication, setCommunication] =
    useState(5);

  const [quality, setQuality] =
    useState(5);

  const [delivery, setDelivery] =
    useState(5);

  const [professionalism, setProfessionalism] =
    useState(5);

  const [valueForMoney, setValueForMoney] =
    useState(5);

  const [title, setTitle] =
    useState("");

  const [comment, setComment] =
    useState("");

  const [
    recommendFreelancer,
    setRecommendFreelancer,
  ] = useState(true);

  const [
    wouldHireAgain,
    setWouldHireAgain,
  ] = useState(true);

  const [loading, setLoading] =
    useState(false);

  const submitReview = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      const { data } = await axios.post(
        `${API}/reviews`,
        {
          proposalId,
          paymentId,

          overallRating,

          communication,
          quality,
          delivery,
          professionalism,
          valueForMoney,

          title,
          comment,

          recommendFreelancer,
          wouldHireAgain,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(data.message);

      navigate("/reviews");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to submit review."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-review">

      <h1>Write Review</h1>

      <form onSubmit={submitReview}>

        <label>Proposal ID</label>

        <input
          type="text"
          value={proposalId}
          onChange={(e) =>
            setProposalId(e.target.value)
          }
          required
        />

        <label>Payment ID</label>

        <input
          type="text"
          value={paymentId}
          onChange={(e) =>
            setPaymentId(e.target.value)
          }
          required
        />

        <label>Overall Rating</label>

        <RatingStars
          rating={overallRating}
          setRating={setOverallRating}
        />

        <label>Communication</label>

        <RatingStars
          rating={communication}
          setRating={setCommunication}
        />

        <label>Quality</label>

        <RatingStars
          rating={quality}
          setRating={setQuality}
        />

        <label>Delivery</label>

        <RatingStars
          rating={delivery}
          setRating={setDelivery}
        />

        <label>Professionalism</label>

        <RatingStars
          rating={professionalism}
          setRating={setProfessionalism}
        />

        <label>Value For Money</label>

        <RatingStars
          rating={valueForMoney}
          setRating={setValueForMoney}
        />

        <label>Review Title</label>

        <input
          type="text"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          required
        />

        <label>Comment</label>

        <textarea
          rows="6"
          value={comment}
          onChange={(e) =>
            setComment(e.target.value)
          }
          required
        />

        <div className="checkbox">

          <label>

            <input
              type="checkbox"
              checked={recommendFreelancer}
              onChange={() =>
                setRecommendFreelancer(
                  !recommendFreelancer
                )
              }
            />

            Recommend Freelancer

          </label>

        </div>

        <div className="checkbox">

          <label>

            <input
              type="checkbox"
              checked={wouldHireAgain}
              onChange={() =>
                setWouldHireAgain(
                  !wouldHireAgain
                )
              }
            />

            Would Hire Again

          </label>

        </div>

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Submitting..."
            : "Submit Review"}
        </button>

      </form>

    </div>
  );
};

export default CreateReview;