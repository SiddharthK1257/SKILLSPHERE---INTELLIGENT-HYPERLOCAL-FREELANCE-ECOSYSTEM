import axios from "axios";

/* ==========================================================
   API CONFIGURATION
========================================================== */

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const analyticsAPI = axios.create({
  baseURL: `${API_URL}/analytics`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ==========================================================
   REQUEST INTERCEPTOR
========================================================== */

analyticsAPI.interceptors.request.use(
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

analyticsAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "Analytics API Error:",
      error.response?.data || error.message
    );

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    return Promise.reject(
      error.response?.data || {
        success: false,
        message:
          "Unable to process analytics request.",
      }
    );
  }
);

/* ==========================================================
   DASHBOARD ANALYTICS
========================================================== */

export const getAnalytics = async () => {
  const { data } = await analyticsAPI.get("/");

  return data;
};

/* ==========================================================
   USER ANALYTICS
========================================================== */

export const getUserAnalytics = async (
  userId
) => {
  const { data } = await analyticsAPI.get(
    `/user/${userId}`
  );

  return data;
};

/* ==========================================================
   FREELANCER ANALYTICS
========================================================== */

export const getFreelancerAnalytics =
  async (freelancerId) => {
    const { data } =
      await analyticsAPI.get(
        `/freelancer/${freelancerId}`
      );

    return data;
  };

/* ==========================================================
   CLIENT ANALYTICS
========================================================== */

export const getClientAnalytics =
  async (clientId) => {
    const { data } =
      await analyticsAPI.get(
        `/client/${clientId}`
      );

    return data;
  };

/* ==========================================================
   GIG ANALYTICS
========================================================== */

export const getGigAnalytics = async (
  gigId
) => {
  const { data } =
    await analyticsAPI.get(
      `/gig/${gigId}`
    );

  return data;
};

/* ==========================================================
   REVENUE ANALYTICS
========================================================== */

export const getRevenueAnalytics =
  async () => {
    const { data } =
      await analyticsAPI.get(
        "/revenue"
      );

    return data;
  };

/* ==========================================================
   PAYMENT ANALYTICS
========================================================== */

export const getPaymentAnalytics =
  async () => {
    const { data } =
      await analyticsAPI.get(
        "/payments"
      );

    return data;
  };

/* ==========================================================
   MONTHLY ANALYTICS
========================================================== */

export const getMonthlyAnalytics =
  async () => {
    const { data } =
      await analyticsAPI.get(
        "/monthly"
      );

    return data;
  };

/* ==========================================================
   PROJECT ANALYTICS
========================================================== */

export const getProjectAnalytics =
  async () => {
    const { data } =
      await analyticsAPI.get(
        "/projects"
      );

    return data;
  };

/* ==========================================================
   RESET ANALYTICS
========================================================== */

export const resetAnalytics =
  async () => {
    const { data } =
      await analyticsAPI.put(
        "/reset"
      );

    return data;
  };

/* ==========================================================
   EXPORT ANALYTICS
========================================================== */

export const exportAnalytics =
  async (format = "csv") => {
    const { data } =
      await analyticsAPI.get(
        `/export?format=${format}`
      );

    return data;
  };

/* ==========================================================
   DOWNLOAD REPORT
========================================================== */

export const downloadAnalyticsReport =
  async () => {
    const response =
      await analyticsAPI.get(
        "/report",
        {
          responseType: "blob",
        }
      );

    return response.data;
  };

/* ==========================================================
   DEFAULT EXPORT
========================================================== */

export default analyticsAPI;