import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

import {
  FaUserCog,
  FaUser,
  FaBriefcase,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaArrowRight,
} from "react-icons/fa";

import API from "../../services/api";

/* ==========================================================
   ROLE CONFIGURATION
========================================================== */

const ROLE_DETAILS = {
  client: {
    title: "Client",
    description:
      "Post projects and hire talented freelancers.",

    icon: FaUser,

    color: "blue",

    benefits: [
      "Post unlimited projects",
      "Receive freelancer proposals",
      "Hire verified professionals",
      "Secure escrow payments",
    ],
  },

  freelancer: {
    title: "Freelancer",

    description:
      "Find work, send proposals and earn money.",

    icon: FaBriefcase,

    color: "green",

    benefits: [
      "Browse active projects",
      "Submit proposals",
      "Build your portfolio",
      "Receive payments securely",
    ],
  },
};

/* ==========================================================
   ROLE CLASS HELPERS
========================================================== */

const getRoleClasses = (role, selected) => {
  if (role === "client") {
    return selected
      ? "border-blue-500 bg-blue-50 shadow-md"
      : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/50";
  }

  return selected
    ? "border-green-500 bg-green-50 shadow-md"
    : "border-slate-200 hover:border-green-300 hover:bg-green-50/50";
};

const getIconClasses = (role) => {
  return role === "client"
    ? "bg-blue-100 text-blue-600"
    : "bg-green-100 text-green-600";
};

/* ==========================================================
   COMPONENT
========================================================== */

const AccountRolePanel = ({ user, setUser }) => {
  const [selectedRole, setSelectedRole] = useState(
    user?.role || "client"
  );

  const [saving, setSaving] = useState(false);

  /* ======================================================
     SYNC ROLE WHEN USER CHANGES
  ====================================================== */

  useEffect(() => {
    setSelectedRole(user?.role || "client");
  }, [user?.role]);

  /* ======================================================
     CHANGE DETECTION
  ====================================================== */

  const hasChanges = useMemo(() => {
    return (
      Boolean(user) &&
      user.role !== "admin" &&
      selectedRole !== user.role
    );
  }, [user, selectedRole]);

  /* ======================================================
     SAVE ROLE
  ====================================================== */

  const handleSave = async () => {
    if (!user || saving) return;

    /* Admin protection */

    if (user.role === "admin") {
      toast.error(
        "Administrator accounts cannot change roles."
      );

      return;
    }

    /* Validate */

    if (
      !["client", "freelancer"].includes(
        selectedRole
      )
    ) {
      toast.error("Invalid role selected.");

      return;
    }

    /* No changes */

    if (!hasChanges) {
      toast("No changes to save.", {
        icon: "ℹ️",
      });

      return;
    }

    try {
      setSaving(true);

      const response = await API.put(
        "/users/change-role",
        {
          role: selectedRole,
        }
      );

      const data = response.data;

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "Failed to change role"
        );
      }

      /* ==================================================
         IMPORTANT
         SAVE NEW TOKEN
      ================================================== */

      if (data.token) {
        localStorage.setItem(
          "token",
          data.token
        );
      }

      /* ==================================================
         SAVE NEW USER
      ================================================== */

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        setUser(data.user);
      }

      toast.success(
        "Role updated successfully!"
      );

      /*
        Refreshing ensures:
        - Navbar updates
        - Sidebar updates
        - Protected routes update
        - Dashboard changes
        - Role-based UI updates
      */

      setTimeout(() => {
        window.location.reload();
      }, 700);
    } catch (error) {
      console.error(
        "ROLE CHANGE ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update role."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ======================================================
     RESET
  ====================================================== */

  const handleReset = () => {
    setSelectedRole(
      user?.role || "client"
    );
  };

  /* ======================================================
     CURRENT ROLE
  ====================================================== */

  const currentRole =
    ROLE_DETAILS[user?.role] ||
    ROLE_DETAILS.client;

  const CurrentIcon = currentRole.icon;

  /* ======================================================
     LOADING STATE
  ====================================================== */

  if (!user) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg">
        <FaSpinner className="mx-auto animate-spin text-2xl text-blue-600" />

        <p className="mt-3 text-slate-600">
          Loading account information...
        </p>
      </div>
    );
  }

  /* ======================================================
     ADMIN VIEW
  ====================================================== */

  if (user.role === "admin") {
    return (
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg"
      >
        {/* Header */}

        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-white">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-white/20 p-4">
                <FaUserCog className="text-3xl" />
              </div>

              <div>
                <h2 className="text-3xl font-bold">
                  Account Role
                </h2>

                <p className="mt-2 text-blue-100">
                  Manage your SkillSphere account role.
                </p>
              </div>
            </div>

            <Badge role="admin" />
          </div>
        </div>

        {/* Admin Message */}

        <div className="p-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-4">
              <FaExclamationTriangle className="mt-1 text-2xl text-red-600" />

              <div>
                <h3 className="text-lg font-bold text-red-700">
                  Administrator Account
                </h3>

                <p className="mt-2 text-sm leading-6 text-red-600">
                  Administrator accounts cannot be
                  converted into Client or Freelancer
                  accounts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  /* ======================================================
     NORMAL ROLE PANEL
  ====================================================== */

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
      }}
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg"
    >
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-white">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-white/20 p-4 backdrop-blur-sm">
              <FaUserCog className="text-3xl" />
            </div>

            <div>
              <h2 className="text-3xl font-bold">
                Account Role
              </h2>

              <p className="mt-2 text-blue-100">
                Choose how you want to use SkillSphere.
              </p>
            </div>
          </div>

          <Badge role={user.role} />
        </div>
      </div>

      <div className="p-8">
        {/* ==================================================
            CURRENT ROLE
        ================================================== */}

        <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center gap-4">
            <div
              className={`rounded-xl p-3 ${getIconClasses(
                user.role
              )}`}
            >
              <CurrentIcon className="text-2xl" />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Current Role
              </p>

              <h3 className="text-xl font-bold text-slate-800">
                {currentRole.title}
              </h3>

              <p className="text-sm text-slate-600">
                {currentRole.description}
              </p>
            </div>
          </div>
        </div>

        {/* ==================================================
            ROLE OPTIONS
        ================================================== */}

        <div className="space-y-5">
          {Object.entries(ROLE_DETAILS).map(
            ([key, role]) => {
              const Icon = role.icon;

              const isSelected =
                selectedRole === key;

              return (
                <motion.label
                  key={key}
                  whileHover={{
                    y: -2,
                  }}
                  whileTap={{
                    scale: 0.99,
                  }}
                  className={`block cursor-pointer rounded-2xl border-2 p-6 transition-all ${getRoleClasses(
                    key,
                    isSelected
                  )}`}
                >
                  <div className="flex items-start gap-5">
                    {/* Icon */}

                    <div
                      className={`rounded-xl p-3 ${getIconClasses(
                        key
                      )}`}
                    >
                      <Icon className="text-2xl" />
                    </div>

                    {/* Content */}

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-slate-800">
                              {role.title}
                            </h3>

                            {isSelected && (
                              <FaCheckCircle className="text-green-600" />
                            )}
                          </div>

                          <p className="mt-1 text-slate-600">
                            {role.description}
                          </p>
                        </div>

                        <input
                          type="radio"
                          name="account-role"
                          value={key}
                          checked={isSelected}
                          onChange={() =>
                            setSelectedRole(key)
                          }
                          disabled={saving}
                          className="mt-1 h-5 w-5 accent-blue-600"
                        />
                      </div>

                      {/* Benefits */}

                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        {role.benefits.map(
                          (benefit) => (
                            <div
                              key={benefit}
                              className="flex items-center gap-2 text-sm text-slate-600"
                            >
                              <FaCheckCircle className="text-xs text-green-600" />

                              <span>
                                {benefit}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </motion.label>
              );
            }
          )}
        </div>

        {/* ==================================================
            UNSAVED CHANGES
        ================================================== */}

        <AnimatePresence>
          {hasChanges && (
            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 10,
              }}
              className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-4"
            >
              <div className="flex items-center gap-3">
                <FaExclamationTriangle className="text-yellow-600" />

                <div>
                  <p className="font-semibold text-yellow-800">
                    Unsaved Changes
                  </p>

                  <p className="text-sm text-yellow-700">
                    Your account role has been changed
                    locally. Save the changes to apply
                    them.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ==================================================
            SECURITY NOTE
        ================================================== */}

        <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <FaCheckCircle className="mt-1 text-blue-600" />

            <div>
              <h4 className="font-semibold text-blue-800">
                Secure Role Switching
              </h4>

              <p className="mt-1 text-sm text-blue-700">
                Switching between Client and Freelancer
                does not delete your profile, portfolio,
                projects, proposals, or payment history.
              </p>
            </div>
          </div>
        </div>

        {/* ==================================================
            ACTIONS
        ================================================== */}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleReset}
            disabled={!hasChanges || saving}
            className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className={`flex items-center justify-center gap-2 rounded-xl px-8 py-3 font-semibold text-white transition-all ${
              !hasChanges || saving
                ? "cursor-not-allowed bg-slate-400"
                : "bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg hover:shadow-xl"
            }`}
          >
            {saving ? (
              <>
                <FaSpinner className="animate-spin" />

                Saving Changes...
              </>
            ) : (
              <>
                Save Changes

                <FaArrowRight />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ==========================================================
   ROLE BADGE
========================================================== */

const Badge = ({ role }) => {
  const badgeConfig = {
    admin: {
      label: "ADMIN",
      className:
        "border border-white/20 bg-red-500/20 text-white",
    },

    freelancer: {
      label: "FREELANCER",
      className:
        "border border-white/20 bg-green-500/20 text-white",
    },

    client: {
      label: "CLIENT",
      className:
        "border border-white/20 bg-blue-500/20 text-white",
    },
  };

  const config =
    badgeConfig[role] ||
    badgeConfig.client;

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold tracking-wide ${config.className}`}
    >
      {config.label}
    </span>
  );
};

export default AccountRolePanel;