import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

const CreateGig = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    deliveryTime: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const {
    title,
    description,
    category,
    price,
    deliveryTime,
  } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    if (
      !title ||
      !description ||
      !category ||
      !price ||
      !deliveryTime
    ) {
      setError(
        "Title, Description, Category, Price and Delivery Time are required."
      );
      return;
    }

    try {
      setLoading(true);

      const { data } = await API.post("/gigs", {
        title,
        description,
        category,
        price: Number(price),
        deliveryTime: Number(deliveryTime),
      });

      setSuccess(data.message || "Gig created successfully!");

      setFormData({
        title: "",
        description: "",
        category: "",
        price: "",
        deliveryTime: "",
      });

      setTimeout(() => {
        navigate("/browse-gigs");
      }, 1500);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to create gig."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10 px-4">
        <div className="bg-white shadow-xl rounded-xl w-full max-w-2xl p-8">

          <h1 className="text-4xl font-bold text-center mb-8 text-blue-700">
            Create New Gig
          </h1>

          {success && (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-5">
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={submitHandler}>

            <div className="mb-5">
              <label className="block font-semibold mb-2">
                Gig Title
              </label>

              <input
                type="text"
                name="title"
                value={title}
                onChange={handleChange}
                placeholder="I will build a MERN website"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="mb-5">
              <label className="block font-semibold mb-2">
                Description
              </label>

              <textarea
                name="description"
                rows="5"
                value={description}
                onChange={handleChange}
                placeholder="Describe your service..."
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="mb-5">
              <label className="block font-semibold mb-2">
                Category
              </label>

              <select
                name="category"
                value={category}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Category</option>

<option value="Web Development">Web Development</option>

<option value="App Development">App Development</option>

<option value="UI/UX Design">UI/UX Design</option>

<option value="Graphic Design">Graphic Design</option>

<option value="Video Editing">Video Editing</option>

<option value="Content Writing">Content Writing</option>

<option value="Digital Marketing">Digital Marketing</option>

<option value="Data Science">Data Science</option>

<option value="AI & Machine Learning">
  AI & Machine Learning
</option>

<option value="Cyber Security">
  Cyber Security
</option>

<option value="Cloud Computing">
  Cloud Computing
</option>

<option value="DevOps">DevOps</option>

<option value="Other">Other</option>
              </select>
            </div>

            <div className="mb-5">
              <label className="block font-semibold mb-2">
                Price (₹)
              </label>

              <input
                type="number"
                name="price"
                value={price}
                onChange={handleChange}
                placeholder="5000"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="mb-8">
              <label className="block font-semibold mb-2">
                Delivery Time (Days)
              </label>

              <input
                type="number"
                name="deliveryTime"
                value={deliveryTime}
                onChange={handleChange}
                placeholder="7"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
            >
              {loading ? "Creating Gig..." : "Create Gig"}
            </button>

          </form>

        </div>
      </div>
    </>
  );
};

export default CreateGig;