import axios from "axios";

const API =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ==========================================================
   GET ALL NOTIFICATIONS
========================================================== */

export const getNotifications = async (userId) => {
  try {
    const { data } = await axios.get(
      `${API}/notifications/${userId}`
    );

    return data;
  } catch (error) {
    console.error("Get Notifications Error:", error);

    throw (
      error.response?.data || {
        message: "Unable to fetch notifications.",
      }
    );
  }
};

/* ==========================================================
   CREATE NOTIFICATION
========================================================== */

export const createNotification = async (notificationData) => {
  try {
    const { data } = await axios.post(
      `${API}/notifications`,
      notificationData
    );

    return data;
  } catch (error) {
    console.error("Create Notification Error:", error);

    throw (
      error.response?.data || {
        message: "Unable to create notification.",
      }
    );
  }
};

/* ==========================================================
   MARK AS READ
========================================================== */

export const markNotificationAsRead = async (notificationId) => {
  try {
    const { data } = await axios.put(
      `${API}/notifications/${notificationId}`
    );

    return data;
  } catch (error) {
    console.error("Mark Read Error:", error);

    throw (
      error.response?.data || {
        message: "Unable to mark notification as read.",
      }
    );
  }
};

/* ==========================================================
   DELETE NOTIFICATION
========================================================== */

export const deleteNotification = async (notificationId) => {
  try {
    const { data } = await axios.delete(
      `${API}/notifications/${notificationId}`
    );

    return data;
  } catch (error) {
    console.error("Delete Notification Error:", error);

    throw (
      error.response?.data || {
        message: "Unable to delete notification.",
      }
    );
  }
};

/* ==========================================================
   MARK ALL AS READ
========================================================== */

export const markAllNotificationsAsRead = async (userId) => {
  try {
    const { data } = await axios.put(
      `${API}/notifications/read-all/${userId}`
    );

    return data;
  } catch (error) {
    console.error("Mark All Read Error:", error);

    throw (
      error.response?.data || {
        message: "Unable to mark all notifications as read.",
      }
    );
  }
};