import { Link } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";

const NotificationDropdown = ({ onClose }) => {
  const {
    notifications,
    loading,
    markAsRead,
    markAllRead,
  } = useNotifications();

  return (
    <div className="absolute right-0 mt-3 w-96 rounded-xl border border-gray-200 bg-white shadow-2xl z-50">

      {/* Header */}

      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-lg font-semibold">
          Notifications
        </h2>

        {notifications.length > 0 && (
          <button
            onClick={markAllRead}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Mark All Read
          </button>
        )}
      </div>

      {/* Body */}

      {loading ? (
        <div className="p-6 text-center">
          Loading...
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No Notifications
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto">

          {notifications.map((notification) => (
            <div
              key={notification._id}
              onClick={() => markAsRead(notification._id)}
              className={`cursor-pointer border-b p-4 transition hover:bg-gray-50 ${
                notification.isRead
                  ? "bg-white"
                  : "bg-blue-50"
              }`}
            >
              <div className="flex items-start justify-between">

                <h3 className="font-semibold">
                  {notification.title}
                </h3>

                {!notification.isRead && (
                  <span className="mt-2 h-2 w-2 rounded-full bg-blue-600"></span>
                )}

              </div>

              <p className="mt-1 text-sm text-gray-600">
                {notification.message}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                {new Date(notification.createdAt).toLocaleString()}
              </p>

            </div>
          ))}

        </div>
      )}

      {/* Footer */}

      <div className="border-t p-3 text-center">

        <Link
          to="/notifications"
          onClick={onClose}
          className="font-medium text-blue-600 hover:underline"
        >
          View All Notifications
        </Link>

      </div>

    </div>
  );
};

export default NotificationDropdown;