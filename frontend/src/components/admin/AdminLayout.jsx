import { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaBell,
  FaSearch,
} from "react-icons/fa";

import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Mobile Overlay */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <AdminSidebar
          onNavigate={() =>
            setSidebarOpen(false)
          }
        />
      </div>

      {/* Main Area */}

      <div className="min-h-screen lg:ml-72">

        {/* Top Header */}

        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur-xl">

          <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">

            {/* Left */}

            <div className="flex items-center gap-4">

              <button
                type="button"
                onClick={() =>
                  setSidebarOpen(
                    (previous) =>
                      !previous
                  )
                }
                className="rounded-xl p-3 text-slate-600 transition hover:bg-slate-100 lg:hidden"
                aria-label="Toggle admin sidebar"
              >
                {sidebarOpen ? (
                  <FaTimes size={20} />
                ) : (
                  <FaBars size={20} />
                )}
              </button>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Administration
                </p>

                <h1 className="text-xl font-extrabold text-slate-800">
                  Admin Dashboard
                </h1>
              </div>

            </div>

            {/* Right */}

            <div className="flex items-center gap-3">

              {/* Search */}

              <button
                type="button"
                className="hidden items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 md:flex"
              >
                <FaSearch />
                Search
              </button>

              {/* Notifications */}

              <button
                type="button"
                className="relative rounded-xl p-3 text-slate-500 transition hover:bg-slate-100 hover:text-blue-600"
                aria-label="Notifications"
              >
                <FaBell size={18} />

                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              </button>

              {/* Admin Avatar */}

              <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 font-bold text-white shadow-md sm:flex">
                A
              </div>

            </div>

          </div>

        </header>

        {/* Page Content */}

        <main className="min-h-[calc(100vh-5rem)] p-4 sm:p-6 lg:p-8">

          <div className="mx-auto w-full max-w-[1800px]">

            <Outlet />

          </div>

        </main>

      </div>

    </div>
  );
};

export default AdminLayout;