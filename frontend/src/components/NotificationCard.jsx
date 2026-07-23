import { motion } from "framer-motion";
import {
  Bell,
  Briefcase,
  CheckCircle,
  CreditCard,
  FolderKanban,
  MessageSquare,
  Star,
  Clock,
  ArrowRight,
} from "lucide-react";

function NotificationCard({
  notification,
  onMarkRead,
}) {
  const getTypeData = (type) => {
    switch (type) {
      case "gig":
        return {
          icon: Briefcase,
          color: "text-blue-600",
          bg: "from-blue-500 to-cyan-500",
          light: "bg-blue-100",
          label: "Gig",
        };

      case "proposal":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bg: "from-green-500 to-emerald-500",
          light: "bg-green-100",
          label: "Proposal",
        };

      case "payment":
        return {
          icon: CreditCard,
          color: "text-purple-600",
          bg: "from-purple-500 to-pink-500",
          light: "bg-purple-100",
          label: "Payment",
        };

      case "review":
        return {
          icon: Star,
          color: "text-yellow-500",
          bg: "from-yellow-400 to-orange-500",
          light: "bg-yellow-100",
          label: "Review",
        };

      case "chat":
        return {
          icon: MessageSquare,
          color: "text-cyan-600",
          bg: "from-cyan-500 to-sky-500",
          light: "bg-cyan-100",
          label: "Chat",
        };

      case "project":
        return {
          icon: FolderKanban,
          color: "text-indigo-600",
          bg: "from-indigo-500 to-blue-600",
          light: "bg-indigo-100",
          label: "Project",
        };

      default:
        return {
          icon: Bell,
          color: "text-gray-600",
          bg: "from-slate-500 to-slate-700",
          light: "bg-slate-100",
          label: "General",
        };
    }
  };

  const item = getTypeData(notification.type);
  const Icon = item.icon;

  const formatTime = (date) => {
    const now = new Date();
    const created = new Date(date);

    const diff = Math.floor((now - created) / 1000);

    if (diff < 60) return "Just now";

    const mins = Math.floor(diff / 60);

    if (mins < 60) return `${mins} min ago`;

    const hrs = Math.floor(mins / 60);

    if (hrs < 24) return `${hrs} hr ago`;

    const days = Math.floor(hrs / 24);

    if (days < 7) return `${days} day ago`;

    return created.toLocaleDateString();
  };

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -20,
      }}
      whileHover={{
        y: -6,
      }}
      transition={{
        duration: 0.3,
      }}
      className={`relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-300

      ${
        notification.isRead
          ? "border-slate-200 bg-white hover:shadow-xl"
          : "border-blue-300 bg-gradient-to-r from-blue-50 via-white to-cyan-50 shadow-xl"
      }`}
    >
      {!notification.isRead && (
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-600 to-cyan-500"></div>
      )}

      <div className="p-6">

        <div className="flex gap-5">

          {/* Icon */}

          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${item.bg} shadow-lg`}
          >
            <Icon
              size={30}
              className="text-white"
            />
          </div>

          {/* Content */}

          <div className="flex-1">

            {/* Top */}

            <div className="flex items-start justify-between gap-4">

              <div>

                <div className="flex flex-wrap items-center gap-3">

                  <h3 className="text-lg font-bold text-slate-800">
                    {notification.title}
                  </h3>

                  <span
                    className={`rounded-full ${item.light} px-3 py-1 text-xs font-semibold ${item.color}`}
                  >
                    {item.label}
                  </span>

                </div>

                {!notification.isRead && (
                  <span className="mt-3 inline-flex rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white animate-pulse">
                    NEW
                  </span>
                )}

              </div>

              {!notification.isRead && (
                <span className="mt-2 h-3 w-3 rounded-full bg-blue-600 animate-ping"></span>
              )}

            </div>

            {/* Message */}

            <p className="mt-5 text-[15px] leading-7 text-slate-600">
              {notification.message}
            </p>

            {/* Bottom */}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">

              <div className="flex items-center gap-2 text-sm text-slate-500">

                <Clock
                  size={16}
                  className="text-slate-400"
                />

                {formatTime(notification.createdAt)}

              </div>

              {!notification.isRead && (
                <motion.button
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                  onClick={() =>
                    onMarkRead(notification._id)
                  }
                  className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 px-5 py-2.5 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-2xl"
                >
                  Mark as Read

                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </motion.button>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* Decorative Blur */}

      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl"></div>

      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl"></div>

    </motion.div>
  );
}

export default NotificationCard;