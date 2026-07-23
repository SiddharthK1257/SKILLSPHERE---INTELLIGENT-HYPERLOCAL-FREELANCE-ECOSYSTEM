import { useMemo, useState } from "react";
import NotificationCard from "../components/NotificationCard";
import { useNotifications } from "../context/NotificationContext";

function Notifications() {
  const {
    notifications,
    loading,
    markAsRead,
    markAllRead,
  } = useNotifications();

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const matchesSearch =
        notification.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        notification.message
          .toLowerCase()
          .includes(search.toLowerCase());

      if (filter === "unread") {
        return !notification.isRead && matchesSearch;
      }

      if (filter === "read") {
        return notification.isRead && matchesSearch;
      }

      return matchesSearch;
    });
  }, [notifications, filter, search]);

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-10 py-6">

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-3xl font-bold">
            Notifications
          </h1>

          <p className="text-gray-500">
            View and manage all your notifications.
          </p>
        </div>

        <button
          onClick={markAllRead}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Mark All Read
        </button>

      </div>

      {/* Search */}

      <input
        type="text"
        placeholder="Search notifications..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-lg p-3 mb-5"
      />

      {/* Filters */}

      <div className="flex gap-3 mb-6">

        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          All
        </button>

        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 rounded-lg ${
            filter === "unread"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Unread
        </button>

        <button
          onClick={() => setFilter("read")}
          className={`px-4 py-2 rounded-lg ${
            filter === "read"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Read
        </button>

      </div>

      {/* Notification List */}

      {loading ? (
        <div className="text-center py-20">
          Loading notifications...
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No notifications found.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification._id}
              notification={notification}
              onMarkRead={markAsRead}
            />
          ))}
        </div>
      )}

    </div>
  );
}

export default Notifications;