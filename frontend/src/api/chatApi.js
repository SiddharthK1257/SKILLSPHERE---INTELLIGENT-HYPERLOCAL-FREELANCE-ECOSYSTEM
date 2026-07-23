import axios from "axios";

/* ==========================================================
   API INSTANCE
========================================================== */

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL
      ? `${import.meta.env.VITE_API_URL}/chat`
      : "http://localhost:5000/api/chat",
  withCredentials: true,
  timeout: 30000,
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

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

/* ==========================================================
   CONVERSATIONS
========================================================== */

export const getConversations = async () => {
  const { data } = await API.get("/conversations");
  return data;
};

export const createConversation = async ({
  receiverId,
  proposalId = null,
  gigId = null,
}) => {
  const { data } = await API.post("/conversation", {
    receiverId,
    proposalId,
    gigId,
  });

  return data;
};

/* ==========================================================
   MESSAGES
========================================================== */

export const getMessages = async (conversationId) => {
  if (!conversationId) {
    throw new Error("Conversation ID is required.");
  }

  const { data } = await API.get(
    `/messages/${conversationId}`
  );

  return data;
};

export const sendMessage = async (payload) => {
  const isFormData = payload instanceof FormData;

  const config = {
    headers: {},
  };

  if (isFormData) {
    config.headers["Content-Type"] =
      "multipart/form-data";
  } else {
    config.headers["Content-Type"] =
      "application/json";
  }

  const { data } = await API.post(
    "/message",
    payload,
    config
  );

  return data;
};

export const editMessage = async (
  messageId,
  text
) => {
  if (!messageId) {
    throw new Error("Message ID is required.");
  }

  const { data } = await API.put(
    `/message/${messageId}`,
    { text }
  );

  return data;
};

export const deleteMessage = async (
  messageId
) => {
  if (!messageId) {
    throw new Error("Message ID is required.");
  }

  const { data } = await API.delete(
    `/message/${messageId}`
  );

  return data;
};

export const markSeen = async (
  messageId
) => {
  if (!messageId) {
    throw new Error("Message ID is required.");
  }

  const { data } = await API.put(
    `/message/${messageId}/seen`
  );

  return data;
};

/* ==========================================================
   EXPORT API
========================================================== */

export default API;