import { useState } from "react";
import API from "../services/api";

function ProjectForm({ reload }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    progress: 0,
    deadline: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.name === "progress"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Project title is required.");
      return;
    }

    if (form.progress < 0 || form.progress > 100) {
      alert("Progress must be between 0 and 100.");
      return;
    }

    try {
      setLoading(true);

      await API.post("/projects", form);

      setForm({
        title: "",
        description: "",
        progress: 0,
        deadline: "",
      });

      reload();

      alert("Project added successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to add project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">
          ➕ Add New Project
        </h2>

        <p className="text-gray-500 mt-2">
          Create a project and track its progress, files, logs and deadline.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Project Title */}

        <div className="md:col-span-2">
          <label className="block mb-2 font-semibold text-gray-700">
            Project Title
          </label>

          <input
            type="text"
            name="title"
            placeholder="Enter project title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        {/* Description */}

        <div className="md:col-span-2">
          <label className="block mb-2 font-semibold text-gray-700">
            Description
          </label>

          <textarea
            name="description"
            rows="5"
            placeholder="Describe your project..."
            value={form.description}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        {/* Progress */}

        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Progress (%)
          </label>

          <input
            type="number"
            name="progress"
            min="0"
            max="100"
            value={form.progress}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
          />
        </div>

        {/* Deadline */}

        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Deadline
          </label>

          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
          />
        </div>

        {/* Preview */}

        <div className="md:col-span-2 bg-slate-50 rounded-2xl p-5 border">
          <h3 className="font-bold text-lg text-slate-700 mb-4">
            Live Preview
          </h3>

          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Title:</strong>{" "}
              {form.title || "Project Title"}
            </p>

            <p>
              <strong>Description:</strong>{" "}
              {form.description || "No description"}
            </p>

            <p>
              <strong>Progress:</strong> {form.progress}%
            </p>

            <p>
              <strong>Deadline:</strong>{" "}
              {form.deadline || "Not Selected"}
            </p>
          </div>
        </div>

        {/* Button */}

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-xl py-4 text-lg font-semibold text-white transition duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:scale-[1.02] hover:shadow-xl"
            }`}
          >
            {loading ? "Adding Project..." : "🚀 Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProjectForm;