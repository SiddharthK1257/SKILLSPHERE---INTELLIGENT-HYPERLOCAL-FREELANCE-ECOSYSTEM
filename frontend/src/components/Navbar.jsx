import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import NotificationBell from "../components/NotificationBell";

import {
  FaBars,
  FaTimes,
  FaHome,
  FaBriefcase,
  FaFolderOpen,
  FaComments,
  FaRobot,
  FaUser,
  FaFileAlt,
  FaClipboardList,
  FaCreditCard,
  FaWallet,
  FaExchangeAlt,
  FaSignOutAlt,
  FaChevronDown,
  FaSearch,
  FaCog,
  FaStar,
  FaHeart,
  FaShieldAlt,
  FaChartLine,
} from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();

  /* =====================================================
      STATE
  ===================================================== */

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState("");

  const dropdownRef = useRef(null);

  /* =====================================================
      USER
  ===================================================== */

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  })();

  /* =====================================================
      DESKTOP NAVIGATION
  ===================================================== */

  const navItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: <FaHome />,
    },

    {
      title: "Browse",
      path: "/browse-gigs",
      icon: <FaBriefcase />,
    },

    {
      title: "Search",
      path: "/search",
      icon: <FaSearch />,
    },

    ...(user?.role === "freelancer"
      ? [
          {
            title: "Create Gig",
            path: "/create-gig",
            icon: <FaFolderOpen />,
          },
          {
            title: "My Gigs",
            path: "/my-gigs",
            icon: <FaFolderOpen />,
          },
        ]
      : []),

    {
      title: "Chat",
      path: "/chat",
      icon: <FaComments />,
    },
  ];

  /* =====================================================
      PROFILE MENU
  ===================================================== */

  const profileMenu = [
    ...(user?.role === "admin"
      ? [
          {
            title: "Admin Dashboard",
            path: "/admin/dashboard",
            icon: <FaShieldAlt />,
            color: "text-red-600",
          },
        ]
      : []),

    {
      title: "My Profile",
      path: "/profile",
      icon: <FaUser />,
      color: "text-blue-600",
    },

    // Proposal Requests (Client + Freelancer)
...(user?.role === "client" || user?.role === "freelancer"
  ? [
      {
        title: "Proposal Requests",
        path: "/proposal-requests",
        icon: <FaClipboardList />,
        color: "text-orange-500",
      },
    ]
  : []),

// My Proposals (Freelancer only)
...(user?.role === "freelancer"
  ? [
      {
        title: "My Proposals",
        path: "/my-proposals",
        icon: <FaFileAlt />,
        color: "text-green-600",
      },
    ]
  : []),

    {
      title: "Payments",
      path: "/payments",
      icon: <FaCreditCard />,
      color: "text-purple-600",
    },

    {
      title: "Wallet",
      path: "/wallet",
      icon: <FaWallet />,
      color: "text-emerald-600",
    },

    {
      title: "Transactions",
      path: "/transactions",
      icon: <FaExchangeAlt />,
      color: "text-cyan-600",
    },

    {
      title: "AI Match",
      path: "/ai-recommendations",
      icon: <FaRobot />,
      color: "text-indigo-600",
    },

    {
      title: "Saved",
      path: "/saved",
      icon: <FaHeart />,
      color: "text-pink-500",
    },

    {
      title: "Reviews",
      path: "/reviews",
      icon: <FaStar />,
      color: "text-yellow-500",
    },

    {
      title: "Analytics",
      path: "/analytics",
      icon: <FaChartLine />,
      color: "text-blue-600",
    },

    {
      title: "Settings",
      path: "/settings",
      icon: <FaCog />,
      color: "text-gray-600",
    },
  ];

  /* =====================================================
      EFFECTS
  ===================================================== */

  useEffect(() => {
    const handleOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleOutside
      );
  }, []);

  /* =====================================================
      FUNCTIONS
  ===================================================== */

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  const closeMenus = () => {
    setMenuOpen(false);
    setProfileOpen(false);
  };

  const navClass = ({ isActive }) =>
    `
      group
      relative
      flex
      items-center
      gap-2
      rounded-2xl
      px-4
      py-2.5
      text-sm
      font-semibold
      transition-all
      duration-300

      ${
        isActive
          ? "bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 text-white shadow-xl"
          : "text-slate-700 hover:bg-slate-100 hover:-translate-y-0.5"
      }
    `;
      return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.45,
        ease: "easeOut",
      }}
      className="
        sticky
        top-0
        z-50
        border-b
        border-white/20
        bg-white/75
        backdrop-blur-2xl
        shadow-[0_15px_45px_rgba(0,0,0,.08)]
      "
    >
      <div
  className="
    mx-auto
    max-w-8xl
    h-20
    grid
    grid-cols-[260px_1fr_260px]
    items-center
    px-6
  "
>

        {/* ======================================================
                            LEFT : LOGO
        ======================================================= */}

        <div className="flex justify-start">

          <NavLink
            to="/dashboard"
            className="flex items-center gap-3"
          >
            <motion.div
              whileHover={{
                rotate: 12,
                scale: 1.08,
              }}
              whileTap={{
                scale: 0.95,
              }}
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-gradient-to-br
                from-blue-600
                via-cyan-500
                to-indigo-600
                text-xl
                font-bold
                text-white
                shadow-xl
              "
            >
              S
            </motion.div>

            <div>

              <h2
                className="
                  bg-gradient-to-r
                  from-blue-700
                  via-cyan-500
                  to-indigo-600
                  bg-clip-text
                  text-2xl
                  font-extrabold
                  text-transparent
                "
              >
                SkillSphere
              </h2>

              <p className="-mt-1 text-xs text-slate-500">
                AI Freelance Marketplace
              </p>

            </div>

          </NavLink>

        </div>

        {/* ======================================================
                        CENTER : NAVIGATION
        ======================================================= */}

        <div className="hidden xl:flex items-center justify-center">

          <div className="flex items-center gap-3">

            {navItems.map((item) => (

              <motion.div
                key={item.path}
                whileHover={{
                  y: -2,
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.95,
                }}
              >

                <NavLink
                  to={item.path}
                  className={navClass}
                >
                  <span className="text-base">
                    {item.icon}
                  </span>

                  <span>
                    {item.title}
                  </span>

                </NavLink>

              </motion.div>

            ))}

            {/* AI MATCH */}

            <motion.div
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.96,
              }}
            >

              <NavLink
                to="/ai-recommendations"
                className="
                  flex
                  items-center
                  gap-2
                  rounded-2xl
                  bg-gradient-to-r
                  from-purple-600
                  via-blue-600
                  to-cyan-500
                  px-5
                  py-3
                  font-semibold
                  text-white
                  shadow-xl
                  transition-all
                  duration-300
                  hover:shadow-2xl
                "
              >

                <FaRobot />

                <span>
                  AI Match
                </span>

              </NavLink>

            </motion.div>

            {/* NOTIFICATION */}

            <motion.div
              whileHover={{
                scale: 1.08,
              }}
              whileTap={{
                scale: 0.96,
              }}
            >

              <NotificationBell />

            </motion.div>

          </div>

        </div>

        {/* ======================================================
                        RIGHT : PROFILE
                (CONTINUES IN PART 3)
        ======================================================= */}

        <div
  className="
    hidden
    xl:flex
    items-center
    justify-end
    ml-auto
    pr-2
  "
>
                    <div
            ref={dropdownRef}
            className="relative"
          >
            <motion.button
              whileHover={{
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.97,
              }}
              onClick={() =>
                setProfileOpen(!profileOpen)
              }
              className="
                flex
                items-center
                gap-3
                rounded-2xl
                border
                border-slate-200
                bg-white
                px-4
                py-2
                shadow-md
                transition-all
                duration-300
                hover:border-blue-500
                hover:shadow-xl
              "
            >

              {/* Avatar */}

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  bg-gradient-to-br
                  from-blue-600
                  via-cyan-500
                  to-indigo-600
                  text-lg
                  font-bold
                  text-white
                  shadow-lg
                "
              >
                {user?.name
                  ?.charAt(0)
                  ?.toUpperCase() || "U"}
              </div>

              {/* User */}

              <div className="text-left">

                <h3 className="text-sm font-bold text-slate-800">
                  {user?.name || "User"}
                </h3>

                <p className="text-xs text-slate-500 capitalize">
                  {user?.role || "Client"}
                </p>

              </div>

              {/* Chevron */}

              <motion.div
                animate={{
                  rotate: profileOpen ? 180 : 0,
                }}
                transition={{
                  duration: 0.25,
                }}
              >
                <FaChevronDown />
              </motion.div>

            </motion.button>

            <AnimatePresence>
                            {profileOpen && (

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 15,
                    scale: 0.96,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: 15,
                    scale: 0.96,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  className="
                    absolute
                    right-0
                    mt-4
                    w-80
                    overflow-hidden
                    rounded-3xl
                    border
                    border-slate-200
                    bg-white
                    shadow-[0_25px_60px_rgba(0,0,0,.15)]
                  "
                >

                  {/* =========================
                          HEADER
                  ========================== */}

                  <div
                    className="
                      bg-gradient-to-r
                      from-blue-600
                      via-cyan-500
                      to-indigo-600
                      p-6
                      text-white
                    "
                  >

                    <div className="flex items-center gap-4">

                      <div
                        className="
                          flex
                          h-16
                          w-16
                          items-center
                          justify-center
                          rounded-full
                          bg-white/20
                          text-2xl
                          font-bold
                        "
                      >
                        {user?.name
                          ?.charAt(0)
                          ?.toUpperCase() || "U"}
                      </div>

                      <div>

                        <h2 className="text-lg font-bold">
                          {user?.name || "Guest"}
                        </h2>

                        <p className="text-sm opacity-90">
                          {user?.email || "No Email"}
                        </p>

                        <p className="mt-1 text-xs uppercase tracking-wider opacity-80">
                          {user?.role || "Client"}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* =========================
                          MENU
                  ========================== */}

                  <div className="space-y-1 p-3">
                                        {profileMenu.map((item) => (

                      <motion.div
                        key={item.path}
                        whileHover={{
                          x: 6,
                        }}
                        transition={{
                          duration: 0.2,
                        }}
                      >

                        <NavLink
                          to={item.path}
                          onClick={closeMenus}
                          className="
                            flex
                            items-center
                            gap-4
                            rounded-2xl
                            px-4
                            py-3
                            text-slate-700
                            transition-all
                            duration-300
                            hover:bg-slate-100
                          "
                        >

                          <span
                            className={`text-lg ${item.color}`}
                          >
                            {item.icon}
                          </span>

                          <span className="font-medium">
                            {item.title}
                          </span>

                        </NavLink>

                      </motion.div>

                    ))}
                                        {/* =========================
                            LOGOUT
                    ========================= */}

                    <div className="pt-3 border-t border-slate-200 mt-2">

                      <motion.button
                        whileHover={{
                          scale: 1.02,
                        }}
                        whileTap={{
                          scale: 0.97,
                        }}
                        onClick={logout}
                        className="
                          flex
                          w-full
                          items-center
                          justify-center
                          gap-3
                          rounded-2xl
                          bg-gradient-to-r
                          from-red-500
                          to-red-600
                          px-4
                          py-3.5
                          font-semibold
                          text-white
                          shadow-lg
                          transition-all
                          duration-300
                          hover:shadow-2xl
                        "
                      >
                        <FaSignOutAlt />

                        Logout
                      </motion.button>

                    </div>

                  </div>

                </motion.div>

              )}

            </AnimatePresence>

          </div>

        </div>

        {/* ============================================
                  MOBILE MENU BUTTON
        ============================================ */}

        <motion.button
          whileHover={{
            rotate: 8,
          }}
          whileTap={{
            scale: 0.92,
          }}
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-md
            transition-all
            duration-300
            hover:border-blue-500
            hover:shadow-xl
            xl:hidden
          "
        >
          {menuOpen ? (
            <FaTimes
              size={22}
              className="text-slate-700"
            />
          ) : (
            <FaBars
              size={22}
              className="text-slate-700"
            />
          )}
        </motion.button>

      </div>
            {/* ============================================
                  MOBILE MENU
      ============================================ */}

      <AnimatePresence>

        {menuOpen && (

          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration: 0.35,
            }}
            className="
              overflow-hidden
              border-t
              border-slate-200
              bg-white/95
              backdrop-blur-2xl
              xl:hidden
            "
          >

            <div className="space-y-3 p-5">

              {/* ===========================
                        SEARCH
              =========================== */}

              <div className="relative">

                <FaSearch
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search..."
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    py-3
                    pl-11
                    pr-4
                    outline-none
                    transition-all
                    duration-300
                    focus:border-blue-500
                    focus:bg-white
                    focus:ring-4
                    focus:ring-blue-100
                  "
                />

              </div>

              {/* ===========================
                    NAVIGATION LINKS
              =========================== */}
                            {/* Main Navigation */}

              {navItems.map((item) => (

                <motion.div
                  key={item.path}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >

                  <NavLink
                    to={item.path}
                    onClick={closeMenus}
                    className={({ isActive }) =>
                      `flex items-center gap-4 rounded-2xl px-4 py-4 text-base font-semibold transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
                          : "text-slate-700 hover:bg-slate-100"
                      }`
                    }
                  >
                    <span className="text-lg">
                      {item.icon}
                    </span>

                    <span>
                      {item.title}
                    </span>

                  </NavLink>

                </motion.div>

              ))}

              {/* Divider */}

              <div className="my-3 border-t border-slate-200"></div>

              {/* Profile Menu */}

              {profileMenu.map((item) => (

                <motion.div
                  key={item.path}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >

                  <NavLink
                    to={item.path}
                    onClick={closeMenus}
                    className={({ isActive }) =>
                      `flex items-center gap-4 rounded-2xl px-4 py-4 transition-all duration-300 ${
                        isActive
                          ? "bg-slate-100"
                          : "hover:bg-slate-100"
                      }`
                    }
                  >

                    <span
                      className={`text-xl ${item.color}`}
                    >
                      {item.icon}
                    </span>

                    <span className="font-medium text-slate-700">
                      {item.title}
                    </span>

                  </NavLink>

                </motion.div>

              ))}

              {/* AI Match */}

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >

                <NavLink
                  to="/ai-recommendations"
                  onClick={closeMenus}
                  className="
                    mt-4
                    flex
                    items-center
                    justify-center
                    gap-3
                    rounded-2xl
                    bg-gradient-to-r
                    from-purple-600
                    via-blue-600
                    to-cyan-500
                    px-5
                    py-4
                    text-base
                    font-semibold
                    text-white
                    shadow-xl
                  "
                >

                  <FaRobot />

                  AI Match

                </NavLink>

              </motion.div>
                            {/* ===========================
                      LOGOUT
              =========================== */}

              <motion.button
                whileHover={{
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                onClick={() => {
                  closeMenus();
                  logout();
                }}
                className="
                  mt-4
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-3
                  rounded-2xl
                  bg-gradient-to-r
                  from-red-500
                  to-red-600
                  px-5
                  py-4
                  text-base
                  font-semibold
                  text-white
                  shadow-lg
                  transition-all
                  duration-300
                  hover:shadow-2xl
                "
              >
                <FaSignOutAlt />

                Logout
              </motion.button>

            </div>

          </motion.div>

        )}

      </AnimatePresence>

    </motion.nav>

  );

};

export default Navbar;