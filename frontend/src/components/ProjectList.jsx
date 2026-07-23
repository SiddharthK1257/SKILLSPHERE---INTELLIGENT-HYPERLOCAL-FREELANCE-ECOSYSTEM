import API from "../services/api";
import ProgressBar from "./ProgressBar";

function ProjectList({ projects, reload }) {
  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    try {
      await API.delete(`/projects/${id}`);
      reload();
    } catch (err) {
      console.error(err);
      alert("Failed to delete project.");
    }
  };

  const updateProgress = async (project) => {
    const progress = prompt(
      "Enter Progress (0 - 100)",
      project.progress
    );

    if (progress === null) return;

    if (progress < 0 || progress > 100) {
      alert("Progress must be between 0 and 100.");
      return;
    }

    try {
      await API.put(`/projects/${project._id}`, {
        progress: Number(progress),
      });

      reload();
    } catch (err) {
      console.error(err);
      alert("Failed to update progress.");
    }
  };

  const addLog = async (project) => {
    const message = prompt("Enter Progress Log");

    if (!message) return;

    try {
      await API.post(`/projects/${project._id}/log`, {
        message,
      });

      reload();
    } catch (err) {
      console.error(err);
      alert("Failed to add log.");
    }
  };

  const uploadFile = async (e, project) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await API.post(
        `/projects/${project._id}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      reload();
    } catch (err) {
      console.error(err);
      alert("File upload failed.");
    }
  };

  if (!projects.length) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-14 text-center">
        <div className="text-6xl mb-5">📁</div>

        <h2 className="text-2xl font-bold text-slate-800">
          No Projects Yet
        </h2>

        <p className="text-gray-500 mt-3">
          Create your first project to start tracking progress.
        </p>
      </div>
    );
  }

  return (
    <div className="grid xl:grid-cols-2 gap-8 mt-8">
      {projects.map((project) => {
        const daysLeft = project.deadline
          ? Math.ceil(
              (new Date(project.deadline) - new Date()) /
                (1000 * 60 * 60 * 24)
            )
          : null;

        return (
          <div
            key={project._id}
            className="group bg-white/90 backdrop-blur-lg border border-slate-200 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
          >
            {/* Top Border */}
            <div className="h-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600"></div>

            <div className="p-7">

              {/* Header */}

              <div className="flex justify-between items-start gap-4">

                <div>

                  <h2 className="text-2xl font-bold text-slate-800">
                    {project.title}
                  </h2>

                  <p className="text-gray-500 mt-2 leading-relaxed">
                    {project.description || "No description"}
                  </p>

                </div>

                <div
                  className={`px-4 py-2 rounded-full font-bold text-sm ${
                    project.progress === 100
                      ? "bg-green-100 text-green-700"
                      : project.progress >= 70
                      ? "bg-blue-100 text-blue-700"
                      : project.progress >= 40
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {project.progress}%
                </div>

              </div>

              {/* Progress */}

              <div className="mt-6">

                <ProgressBar value={project.progress} />

              </div>

              {/* Deadline */}

              <div className="flex justify-between items-center mt-6 border-t pt-5">

                <div>

                  <p className="text-gray-400 text-sm">
                    Deadline
                  </p>

                  <p className="font-semibold text-slate-700">

                    {project.deadline
                      ? new Date(
                          project.deadline
                        ).toLocaleDateString()
                      : "Not Set"}

                  </p>

                </div>

                {daysLeft !== null && daysLeft >= 0 && (
                  <div
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      daysLeft <= 3
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {daysLeft} Day{daysLeft !== 1 && "s"} Left
                  </div>
                )}

              </div>

              {/* Logs */}

              <div className="mt-7">

                <h3 className="font-bold text-lg mb-3">
                  📝 Progress Logs
                </h3>

                {project.logs?.length ? (

                  <div className="space-y-3 max-h-44 overflow-y-auto">

                    {project.logs.map((log, index) => (

                      <div
                        key={index}
                        className="bg-slate-50 rounded-xl p-3 border"
                      >
                        <p className="text-slate-700">
                          {log.message}
                        </p>

                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(
                            log.date
                          ).toLocaleString()}
                        </p>

                      </div>

                    ))}

                  </div>

                ) : (

                  <p className="text-gray-400">
                    No progress logs available.
                  </p>

                )}

              </div>

              {/* Files */}

              <div className="mt-7">

                <h3 className="font-bold text-lg mb-3">
                  📂 Uploaded Files
                </h3>

                {project.files?.length ? (

                  <div className="space-y-2">

                    {project.files.map((file, index) => (

                      <div
                        key={index}
                        className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2 flex justify-between"
                      >
                        <span className="truncate">
                          📄 {file.filename}
                        </span>

                        {file.url && (
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Open
                          </a>
                        )}

                      </div>

                    ))}

                  </div>

                ) : (

                  <p className="text-gray-400">
                    No files uploaded.
                  </p>

                )}

                <label className="inline-block mt-5 cursor-pointer bg-slate-100 hover:bg-slate-200 px-5 py-3 rounded-xl font-semibold transition">

                  📤 Upload File

                  <input
                    type="file"
                    hidden
                    onChange={(e) =>
                      uploadFile(e, project)
                    }
                  />

                </label>

              </div>

              {/* Buttons */}

              <div className="grid md:grid-cols-3 gap-4 mt-8">

                <button
                  onClick={() => updateProgress(project)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition hover:scale-105"
                >
                  Update
                </button>

                <button
                  onClick={() => addLog(project)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition hover:scale-105"
                >
                  Add Log
                </button>

                <button
                  onClick={() => remove(project._id)}
                  className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition hover:scale-105"
                >
                  Delete
                </button>

              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProjectList;