import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBriefcase,
  FaFileAlt,
  FaCreditCard,
  FaStar,
  FaFlag,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const menuItems = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: <FaTachometerAlt />,
  },
  {
    title: "Users",
    path: "/admin/users",
    icon: <FaUsers />,
  },
  {
    title: "Gigs",
    path: "/admin/gigs",
    icon: <FaBriefcase />,
  },
  {
    title: "Proposals",
    path: "/admin/proposals",
    icon: <FaFileAlt />,
  },
  {
    title: "Payments",
    path: "/admin/payments",
    icon: <FaCreditCard />,
  },
  {
    title: "Reviews",
    path: "/admin/reviews",
    icon: <FaStar />,
  },
  {
    title: "Reports",
    path: "/admin/reports",
    icon: <FaFlag />,
  },
  {
    title: "Settings",
    path: "/admin/settings",
    icon: <FaCog />,
  },
];

const AdminSidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="flex min-h-screen w-72 flex-col bg-slate-900 text-white shadow-2xl">

      {/* ======================================
                  LOGO
      ======================================= */}

      <div className="border-b border-slate-800 p-8">

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-2xl font-bold shadow-lg">
            S
          </div>

          <div>

            <h1 className="text-2xl font-bold">
              SkillSphere
            </h1>

            <p className="text-sm text-slate-400">
              Admin Panel
            </p>

          </div>

        </div>

      </div>

      {/* ======================================
                MENU
      ======================================= */}

      <nav className="flex-1 space-y-2 p-5">

        {menuItems.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center gap-4 rounded-2xl px-5 py-3 transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >

            <span className="text-xl">
              {item.icon}
            </span>

            <span className="font-medium">
              {item.title}
            </span>

          </NavLink>

        ))}

      </nav>

      {/* ======================================
                ADMIN INFO
      ======================================= */}

      <div className="border-t border-slate-800 p-5">

        <div className="mb-5 rounded-2xl bg-slate-800 p-4">

          <h3 className="font-semibold">
            Administrator
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Full Access Granted
          </p>

        </div>

        <button
          onClick={logout}
          className="
            flex
            w-full
            items-center
            justify-center
            gap-3
            rounded-2xl
            bg-red-500
            px-5
            py-3
            font-semibold
            text-white
            transition-all
            duration-300
            hover:bg-red-600
            hover:shadow-lg
          "
        >
          <FaSignOutAlt />

          Logout
        </button>

      </div>

    </aside>
  );
};

export default AdminSidebar;