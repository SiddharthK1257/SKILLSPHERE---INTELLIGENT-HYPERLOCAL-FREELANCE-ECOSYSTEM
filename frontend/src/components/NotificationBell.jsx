import { useState } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import NotificationDropdown from "./NotificationDropdown";

function NotificationBell() {
  const { unreadCount } = useNotifications();

  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition"
      >
        <Bell size={24} />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <NotificationDropdown
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

export default NotificationBell;