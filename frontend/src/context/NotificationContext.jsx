import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/notificationService";

import {
  connectSocket,
  disconnectSocket,
  joinNotificationRoom,
  leaveNotificationRoom,
  onNewNotification,
  removeNotificationListener,
} from "../services/socket";

const NotificationContext = createContext();

/* ==========================================================
   GET USER ID FROM JWT
========================================================== */

const getUserIdFromToken = () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) return null;

    const payload = JSON.parse(atob(token.split(".")[1]));

    return payload.id || payload._id || payload.userId || null;
  } catch (error) {
    console.error("Invalid Token:", error);
    return null;
  }
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const userId = getUserIdFromToken();

  /* ==========================================================
     LOAD NOTIFICATIONS
  ========================================================== */

  const loadNotifications = async () => {
    if (!userId) return;

    try {
      setLoading(true);

      const data = await getNotifications(userId);

      setNotifications(data || []);
    } catch (error) {
      console.error("Load Notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================================
     SOCKET CONNECTION
  ========================================================== */

  useEffect(() => {
    if (!userId) return;

    connectSocket();

    joinNotificationRoom(userId);

    loadNotifications();

    const handleNotification = (notification) => {
      setNotifications((prev) => {
        const exists = prev.find(
          (item) => item._id === notification._id
        );

        if (exists) return prev;

        return [notification, ...prev];
      });
    };

    onNewNotification(handleNotification);

    return () => {
      removeNotificationListener();

      leaveNotificationRoom(userId);

      disconnectSocket();
    };
  }, [userId]);

  /* ==========================================================
     MARK AS READ
  ========================================================== */

  const markAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  /* ==========================================================
     MARK ALL READ
  ========================================================== */

  const markAllRead = async () => {
    try {
      await markAllNotificationsAsRead(userId);

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  /* ==========================================================
     UNREAD COUNT
  ========================================================== */

  const unreadCount = useMemo(() => {
    return notifications.filter(
      (notification) => !notification.isRead
    ).length;
  }, [notifications]);

  /* ==========================================================
     CONTEXT VALUE
  ========================================================== */

  const value = {
    notifications,
    loading,
    unreadCount,
    loadNotifications,
    markAsRead,
    markAllRead,
    setNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

/* ==========================================================
   CUSTOM HOOK
========================================================== */

export const useNotifications = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider."
    );
  }

  return context;
};