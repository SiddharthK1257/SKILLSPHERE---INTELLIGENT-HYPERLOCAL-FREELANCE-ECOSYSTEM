import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaSave,
  FaImage,
  FaTag,
  FaClock,
  FaMoneyBillWave,
  FaAlignLeft,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

import API from "../services/api";

const CATEGORIES = [
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "Graphic Design",
  "Video Editing",
  "Content Writing",
  "Digital Marketing",
  "Data Science",
  "AI & Machine Learning",
  "Other",
];

const EditGig = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    deliveryTime: "",
    image: "",
  });

  const [errors, setErrors] = useState({});

  // =====================================================
  // FETCH GIG
  // =====================================================

  useEffect(() => {
    if (!id) {
      toast.error("Invalid gig ID.");
      navigate("/my-gigs");
      return;
    }

    fetchGig();
  }, [id]);

  const fetchGig = async () => {
    try {
      setLoading(true);

      const { data } = await API.get(`/gigs/${id}`);

      const gig = data?.gig || data?.data || data;

      if (!gig) {
        throw new Error("Gig not found.");
      }

      setForm({
        title: gig.title || "",
        category: gig.category || "",
        description: gig.description || "",

        price:
          gig.basicPackage?.price ??
          gig.price ??
          "",

        deliveryTime:
          gig.basicPackage?.deliveryTime ??
          gig.deliveryTime ??
          "",

        image:
          gig.coverImage ||
          gig.image ||
          "",
      });
    } catch (error) {
      console.error("Fetch Gig Error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to load gig."
      );

      navigate("/my-gigs");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateForm = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Gig title is required.";
    } else if (form.title.trim().length < 10) {
      newErrors.title =
        "Title should contain at least 10 characters.";
    }

    if (!form.category) {
      newErrors.category = "Please select a category.";
    }

    if (!form.description.trim()) {
      newErrors.description =
        "Gig description is required.";
    } else if (form.description.trim().length < 30) {
      newErrors.description =
        "Description should contain at least 30 characters.";
    }

    if (!form.price || Number(form.price) <= 0) {
      newErrors.price =
        "Please enter a valid price.";
    }

    if (
      !form.deliveryTime ||
      Number(form.deliveryTime) <= 0
    ) {
      newErrors.deliveryTime =
        "Please enter a valid delivery time.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =====================================================
  // UPDATE GIG
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        category: form.category,
        description: form.description.trim(),
        price: Number(form.price),
        deliveryTime: Number(form.deliveryTime),
        image: form.image.trim(),
      };

      const { data } = await API.put(
        `/gigs/${id}`,
        payload
      );

      toast.success(
        data?.message ||
          "Gig updated successfully."
      );

      navigate("/my-gigs");
    } catch (error) {
      console.error("Update Gig Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update gig."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">

          <div className="mx-auto mb-5 h-14 w-14 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <h2 className="text-xl font-bold text-slate-800">
            Loading Gig...
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Please wait while we load your gig details.
          </p>

        </div>
      </div>
    );
  }

  // =====================================================
  // INPUT COMPONENT
  // =====================================================

  const InputError = ({ message }) => {
    if (!message) return null;

    return (
      <p className="mt-2 flex items-center gap-2 text-sm text-red-500">
        <FaExclamationCircle />
        {message}
      </p>
    );
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">

          <div>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
            >
              <FaArrowLeft />
              Back
            </button>

            <h1 className="text-3xl font-black text-slate-900 md:text-4xl">
              Edit Your Gig
            </h1>

            <p className="mt-2 text-slate-500">
              Update your service details and keep your gig attractive to clients.
            </p>

          </div>

          <div className="hidden items-center gap-3 rounded-2xl bg-green-50 px-5 py-3 text-green-700 md:flex">

            <FaCheckCircle />

            <span className="font-semibold">
              Editing Mode
            </span>

          </div>

        </div>

      </header>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">

        <div className="grid gap-8 lg:grid-cols-3">

          {/* =================================================
              FORM
          ================================================= */}

          <section className="lg:col-span-2">

            <form
              onSubmit={handleSubmit}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl"
            >

              {/* Form Header */}

              <div className="border-b border-slate-200 bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-white">

                <h2 className="text-2xl font-bold">
                  Service Information
                </h2>

                <p className="mt-2 text-blue-100">
                  Make your gig clear, professional, and easy to understand.
                </p>

              </div>

              {/* Form Body */}

              <div className="space-y-8 p-8">

                {/* TITLE */}

                <div>

                  <label className="mb-3 flex items-center gap-2 font-bold text-slate-800">
                    <FaTag className="text-blue-600" />
                    Gig Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Example: I will build a modern React website"
                    className={`w-full rounded-2xl border px-5 py-4 outline-none transition focus:ring-4 focus:ring-blue-100 ${
                      errors.title
                        ? "border-red-400"
                        : "border-slate-300 focus:border-blue-500"
                    }`}
                  />

                  <div className="mt-2 flex justify-between text-xs text-slate-400">

                    <InputError message={errors.title} />

                    <span>
                      {form.title.length}/100
                    </span>

                  </div>

                </div>

                {/* CATEGORY */}

                <div>

                  <label className="mb-3 block font-bold text-slate-800">
                    Category
                  </label>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className={`w-full rounded-2xl border bg-white px-5 py-4 outline-none transition focus:ring-4 focus:ring-blue-100 ${
                      errors.category
                        ? "border-red-400"
                        : "border-slate-300 focus:border-blue-500"
                    }`}
                  >

                    <option value="">
                      Select a category
                    </option>

                    {CATEGORIES.map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}

                  </select>

                  <InputError
                    message={errors.category}
                  />

                </div>

                {/* DESCRIPTION */}

                <div>

                  <label className="mb-3 flex items-center gap-2 font-bold text-slate-800">
                    <FaAlignLeft className="text-blue-600" />
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={8}
                    placeholder="Describe what you offer, your process, and what the client will receive..."
                    className={`w-full resize-y rounded-2xl border px-5 py-4 leading-7 outline-none transition focus:ring-4 focus:ring-blue-100 ${
                      errors.description
                        ? "border-red-400"
                        : "border-slate-300 focus:border-blue-500"
                    }`}
                  />

                  <div className="mt-2 flex items-start justify-between">

                    <InputError
                      message={errors.description}
                    />

                    <span className="text-xs text-slate-400">
                      {form.description.length} characters
                    </span>

                  </div>

                </div>

                {/* PRICE + DELIVERY */}

                <div className="grid gap-6 md:grid-cols-2">

                  <div>

                    <label className="mb-3 flex items-center gap-2 font-bold text-slate-800">
                      <FaMoneyBillWave className="text-green-600" />
                      Starting Price
                    </label>

                    <div className="relative">

                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-500">
                        ₹
                      </span>

                      <input
                        type="number"
                        name="price"
                        min="1"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="999"
                        className={`w-full rounded-2xl border py-4 pl-12 pr-5 outline-none transition focus:ring-4 focus:ring-blue-100 ${
                          errors.price
                            ? "border-red-400"
                            : "border-slate-300 focus:border-blue-500"
                        }`}
                      />

                    </div>

                    <InputError
                      message={errors.price}
                    />

                  </div>

                  <div>

                    <label className="mb-3 flex items-center gap-2 font-bold text-slate-800">
                      <FaClock className="text-blue-600" />
                      Delivery Time
                    </label>

                    <div className="relative">

                      <input
                        type="number"
                        name="deliveryTime"
                        min="1"
                        value={form.deliveryTime}
                        onChange={handleChange}
                        placeholder="3"
                        className={`w-full rounded-2xl border px-5 py-4 pr-20 outline-none transition focus:ring-4 focus:ring-blue-100 ${
                          errors.deliveryTime
                            ? "border-red-400"
                            : "border-slate-300 focus:border-blue-500"
                        }`}
                      />

                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
                        Days
                      </span>

                    </div>

                    <InputError
                      message={errors.deliveryTime}
                    />

                  </div>

                </div>

                {/* IMAGE */}

                <div>

                  <label className="mb-3 flex items-center gap-2 font-bold text-slate-800">
                    <FaImage className="text-purple-600" />
                    Cover Image URL
                  </label>

                  <input
                    type="url"
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full rounded-2xl border border-slate-300 px-5 py-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                  <p className="mt-2 text-sm text-slate-500">
                    Use a high-quality image that represents your service.
                  </p>

                </div>

              </div>

              {/* FORM FOOTER */}

              <div className="flex flex-col gap-4 border-t border-slate-200 bg-slate-50 p-8 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  disabled={saving}
                  className="rounded-2xl border border-slate-300 bg-white px-8 py-4 font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-4 font-bold text-white shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {saving ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Updating Gig...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Update Gig
                    </>
                  )}

                </button>

              </div>

            </form>

          </section>

          {/* =================================================
              PREVIEW / TIPS
          ================================================= */}

          <aside className="space-y-6">

            {/* IMAGE PREVIEW */}

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

              <div className="relative h-56 bg-slate-100">

                {form.image ? (
                  <img
                    src={form.image}
                    alt="Gig Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    <div className="text-center">

                      <FaImage className="mx-auto mb-3 text-4xl" />

                      <p>
                        Image Preview
                      </p>

                    </div>
                  </div>
                )}

              </div>

              <div className="p-6">

                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Live Preview
                </p>

                <h3 className="mt-3 line-clamp-2 text-xl font-bold text-slate-900">
                  {form.title ||
                    "Your gig title will appear here"}
                </h3>

                <div className="mt-5 flex items-center justify-between">

                  <div>

                    <p className="text-xs text-slate-500">
                      Starting From
                    </p>

                    <p className="text-2xl font-black text-green-600">
                      ₹{form.price || "0"}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-xs text-slate-500">
                      Delivery
                    </p>

                    <p className="font-bold text-blue-600">
                      {form.deliveryTime || "0"} Days
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* TIPS */}

            <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">

              <h3 className="text-lg font-bold text-blue-900">
                Tips for a Better Gig
              </h3>

              <ul className="mt-5 space-y-4 text-sm text-blue-800">

                <li className="flex gap-3">
                  <FaCheckCircle className="mt-1 shrink-0" />
                  Use a clear and specific title.
                </li>

                <li className="flex gap-3">
                  <FaCheckCircle className="mt-1 shrink-0" />
                  Explain exactly what the client receives.
                </li>

                <li className="flex gap-3">
                  <FaCheckCircle className="mt-1 shrink-0" />
                  Keep your pricing competitive.
                </li>

                <li className="flex gap-3">
                  <FaCheckCircle className="mt-1 shrink-0" />
                  Use a professional cover image.
                </li>

              </ul>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
};

export default EditGig;