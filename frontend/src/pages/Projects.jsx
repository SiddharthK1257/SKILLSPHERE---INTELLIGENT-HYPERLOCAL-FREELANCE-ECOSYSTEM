import { useEffect, useState, useMemo, useCallback } from "react";
import {
  FolderKanban,
  CheckCircle2,
  Clock3,
  AlertCircle,
  RotateCw,
  TrendingUp,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Scheduler from "../components/Scheduler";
import ProjectForm from "../components/ProjectForm";
import ProjectList from "../components/ProjectList";
import API from "../services/api";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await API.get("/projects");

      setProjects(data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load projects."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const refreshProjects = async () => {
    setRefreshing(true);
    await loadProjects();
    setRefreshing(false);
  };

  const stats = useMemo(() => {
    const total = projects.length;

    const completed = projects.filter(
      (p) => p.progress === 100
    ).length;

    const pending = projects.filter(
      (p) => p.progress === 0
    ).length;

    const inProgress = projects.filter(
      (p) => p.progress > 0 && p.progress < 100
    ).length;

    const avgProgress = total
      ? Math.round(
          projects.reduce(
            (sum, p) => sum + p.progress,
            0
          ) / total
        )
      : 0;

    return {
      total,
      completed,
      pending,
      inProgress,
      avgProgress,
    };
  }, [projects]);

  const cards = [
    {
      title: "Total Projects",
      value: stats.total,
      color: "text-blue-600",
      bg: "bg-blue-100",
      icon: FolderKanban,
    },
    {
      title: "Completed",
      value: stats.completed,
      color: "text-green-600",
      bg: "bg-green-100",
      icon: CheckCircle2,
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
      icon: Clock3,
    },
    {
      title: "Pending",
      value: stats.pending,
      color: "text-red-600",
      bg: "bg-red-100",
      icon: AlertCircle,
    },
    {
      title: "Average Progress",
      value: `${stats.avgProgress}%`,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
      icon: TrendingUp,
    },
  ];

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">

        <div className="w-full px-8 py-8">

          {/* Header */}

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">

            <div>

              <h1 className="text-4xl font-bold text-slate-800">
                Project Dashboard
              </h1>

              <p className="text-gray-600 mt-2">
                Manage projects, deadlines, milestones,
                scheduler and monitor overall progress.
              </p>

            </div>

            <button
              onClick={refreshProjects}
              disabled={refreshing}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition disabled:opacity-50"
            >
              <RotateCw
                size={18}
                className={
                  refreshing ? "animate-spin" : ""
                }
              />
              Refresh Dashboard
            </button>

          </div>

          {/* Statistics */}

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">

            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center mb-4`}
                  >
                    <Icon
                      className={card.color}
                      size={24}
                    />
                  </div>

                  <p className="text-gray-500 text-sm">
                    {card.title}
                  </p>

                  <h2
                    className={`text-3xl font-bold mt-2 ${card.color}`}
                  >
                    {card.value}
                  </h2>
                </div>
              );
            })}

          </div>

          {/* Error */}

          {error && (
            <div className="bg-red-100 border border-red-300 rounded-xl p-4 mb-8 text-red-600">
              {error}
            </div>
          )}

          {/* Add Project */}

          <div className="bg-white rounded-3xl shadow-xl p-8 mb-10">

            <h2 className="text-2xl font-bold mb-6">
              Create New Project
            </h2>

            <ProjectForm reload={loadProjects} />

          </div>

          {/* Scheduler */}

          <div className="bg-white rounded-3xl shadow-xl p-8 mb-10">

            <h2 className="text-2xl font-bold mb-6">
              Scheduler
            </h2>

            <Scheduler />

          </div>

          {/* Projects */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <div className="flex justify-between items-center mb-8">

              <h2 className="text-2xl font-bold">
                Your Projects
              </h2>

              <button
                onClick={refreshProjects}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
              >
                Refresh
              </button>

            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 gap-6">

                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="bg-gray-100 rounded-2xl p-6 animate-pulse"
                  >
                    <div className="h-5 bg-gray-300 rounded w-48 mb-4"></div>

                    <div className="h-4 bg-gray-300 rounded mb-2"></div>

                    <div className="h-4 bg-gray-300 rounded mb-2"></div>

                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  </div>
                ))}

              </div>
            ) : projects.length === 0 ? (

              <div className="text-center py-20">

                <FolderKanban
                  size={80}
                  className="mx-auto text-blue-500"
                />

                <h2 className="text-3xl font-bold mt-6">
                  No Projects Yet
                </h2>

                <p className="text-gray-500 mt-3">
                  Create your first project to start
                  tracking progress.
                </p>

              </div>

            ) : (

              <ProjectList
                projects={projects}
                reload={loadProjects}
              />

            )}

          </div>

        </div>

      </div>
    </>
  );
};

export default Projects;