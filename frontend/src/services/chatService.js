import axios from "axios";

/* ==========================================================
   AXIOS INSTANCE
========================================================== */

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/chat`
    : "http://localhost:5000/api/chat",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ==========================================================
   REQUEST INTERCEPTOR
========================================================== */

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ==========================================================
   RESPONSE INTERCEPTOR
========================================================== */

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "Chat API Error:",
      error.response?.data || error.message
    );

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

/* ==========================================================
   CONVERSATIONS
========================================================== */

/**
 * GET /api/chat/conversations
 */

export const getConversations = async () => {
  const { data } = await API.get("/conversations");
  return data;
};

/**
 * POST /api/chat/conversation
 */

export const createConversation = async (receiverId) => {
  const { data } = await API.post("/conversation", {
    receiverId,
  });

  return data;
};

/* ==========================================================
   MESSAGES
========================================================== */

/**
 * GET /api/chat/messages/:conversationId
 */

export const getMessages = async (conversationId) => {
  const { data } = await API.get(
    `/messages/${conversationId}`
  );

  return data;
};

/**
 * POST /api/chat/message
 */

export const sendMessage = async (messageData) => {
  const { data } = await API.post(
    "/message",
    messageData
  );

  return data;
};

/**
 * PUT /api/chat/edit/:id
 */

export const editMessage = async (
  messageId,
  text
) => {
  const { data } = await API.put(
    `/edit/${messageId}`,
    {
      text,
    }
  );

  return data;
};

/**
 * DELETE /api/chat/delete/:id
 */

export const deleteMessage = async (
  messageId
) => {
  const { data } = await API.delete(
    `/delete/${messageId}`
  );

  return data;
};

/**
 * PUT /api/chat/seen/:id
 */

export const markAsSeen = async (
  messageId
) => {
  const { data } = await API.put(
    `/seen/${messageId}`
  );

  return data;
};

/* ==========================================================
   SOCKET READY (Future)
========================================================== */

/**
 * Upload file
 * (Enable after backend supports uploads)
 */

export const uploadFile = async (formData) => {
  const { data } = await API.post(
    "/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

/* ==========================================================
   DEFAULT EXPORT
========================================================== */

export default API;