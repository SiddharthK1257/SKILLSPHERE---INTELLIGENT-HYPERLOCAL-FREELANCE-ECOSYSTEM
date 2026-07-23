import axios from "axios";

/* ==========================================================
   API CONFIGURATION
========================================================== */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://skillsphere-intelligent-hyperlocal-4wq2.onrender.com/api";

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,

  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/* ==========================================================
   AUTH STORAGE HELPERS
========================================================== */

const getToken = () => {
  return localStorage.getItem("token");
};

const getStoredUser = () => {
  try {
    const user = localStorage.getItem("user");

    return user
      ? JSON.parse(user)
      : null;
  } catch (error) {
    console.error(
      "Failed to parse stored user:",
      error
    );

    return null;
  }
};

const saveUser = (user) => {
  if (!user) return;

  localStorage.setItem(
    "user",
    JSON.stringify(user)
  );
};

const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

/* ==========================================================
   REQUEST INTERCEPTOR
========================================================== */

API.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    console.error(
      "API REQUEST ERROR:",
      error
    );

    return Promise.reject(error);
  }
);

/* ==========================================================
   RESPONSE INTERCEPTOR
========================================================== */

API.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const response = error.response;

    if (!response) {
      console.error(
        "NETWORK ERROR: Server did not respond.",
        error.message
      );

      return Promise.reject(error);
    }

    const {
      status,
      data,
    } = response;

    console.error(
      "=================================="
    );

    console.error(
      "API ERROR"
    );

    console.error(
      "STATUS:",
      status
    );

    console.error(
      "URL:",
      error.config?.url
    );

    console.error(
      "METHOD:",
      error.config?.method
    );

    console.error(
      "MESSAGE:",
      data?.message
    );

    console.error(
      "=================================="
    );

    /* ======================================================
       UNAUTHORIZED
    ====================================================== */

    if (status === 401) {
      clearAuth();

      const publicRoutes = [
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
      ];

      const currentPath =
        window.location.pathname;

      const isPublicRoute =
        publicRoutes.some((route) =>
          currentPath.startsWith(route)
        );

      if (!isPublicRoute) {
        window.location.href =
          "/login";
      }
    }

    return Promise.reject(error);
  }
);

/* ==========================================================
   AUTH API
========================================================== */

export const authAPI = {
  getCurrentUser: () =>
    API.get("/users/profile"),

  updateProfile: (data) =>
    API.put(
      "/users/profile",
      data
    ),

  changeRole: (role) =>
    API.put(
      "/users/change-role",
      {
        role,
      }
    ),
};

/* ==========================================================
   PAYMENT API
========================================================== */

export const paymentAPI = {
  /* ========================================================
     CREATE RAZORPAY ORDER

     CLIENT ONLY
  ======================================================== */

  createOrder: (data) =>
    API.post(
      "/payments/create-order",
      data
    ),

  /* ========================================================
     VERIFY RAZORPAY PAYMENT

     CLIENT ONLY
  ======================================================== */

  verifyPayment: (data) =>
    API.post(
      "/payments/verify",
      data
    ),

  /* ========================================================
     USER PAYMENTS
  ======================================================== */

  getMyPayments: (params = {}) =>
    API.get(
      "/payments/my",
      {
        params,
      }
    ),

  getPaymentHistory: (params = {}) =>
    API.get(
      "/payments/history",
      {
        params,
      }
    ),

  getPaymentStatus: (paymentId) =>
    API.get(
      `/payments/status/${paymentId}`
    ),

  getPayment: (paymentId) =>
    API.get(
      `/payments/${paymentId}`
    ),

  /* ========================================================
     ESCROW
  ======================================================== */

  getEscrows: (params = {}) =>
    API.get(
      "/payments/escrow/all",
      {
        params,
      }
    ),

  getEscrow: (escrowId) =>
    API.get(
      `/payments/escrow/${escrowId}`
    ),

  releaseEscrow: (paymentId) =>
    API.put(
      `/payments/release/${paymentId}`
    ),

  refundPayment: (
    paymentId,
    data = {}
  ) =>
    API.put(
      `/payments/refund/${paymentId}`,
      data
    ),

  /* ========================================================
     FREELANCER WALLET
  ======================================================== */

  getWallet: () =>
    API.get(
      "/payments/wallet"
    ),

  getTransactions: (params = {}) =>
    API.get(
      "/payments/wallet/transactions",
      {
        params,
      }
    ),

  requestWithdrawal: (data) =>
    API.post(
      "/payments/wallet/withdraw",
      data
    ),

  /* ========================================================
     ADMIN
  ======================================================== */

  getAllPayments: (params = {}) =>
    API.get(
      "/payments/admin/all",
      {
        params,
      }
    ),
};

/* ==========================================================
   RAZORPAY CHECKOUT HELPER
========================================================== */

export const openRazorpayCheckout = ({
  order,
  user,
  onSuccess,
  onFailure,
}) => {
  if (
    !window.Razorpay
  ) {
    throw new Error(
      "Razorpay SDK is not loaded."
    );
  }

  if (!order?.id) {
    throw new Error(
      "Invalid Razorpay order."
    );
  }

  const options = {
    key:
      import.meta.env
        .VITE_RAZORPAY_KEY_ID,

    amount:
      order.amount,

    currency:
      order.currency ||
      "INR",

    name:
      "SkillSphere",

    description:
      "Secure Escrow Payment",

    order_id:
      order.id,

    prefill: {
      name:
        user?.name ||
        "",

      email:
        user?.email ||
        "",
    },

    theme: {
      color:
        "#3399cc",
    },

    handler: async (
      response
    ) => {
      try {
        const result =
          await paymentAPI.verifyPayment(
            {
              razorpay_order_id:
                response.razorpay_order_id,

              razorpay_payment_id:
                response.razorpay_payment_id,

              razorpay_signature:
                response.razorpay_signature,
            }
          );

        if (onSuccess) {
          onSuccess(
            result
          );
        }

        return result;
      } catch (error) {
        console.error(
          "PAYMENT VERIFICATION FAILED:",
          error
        );

        if (onFailure) {
          onFailure(
            error
          );
        }

        throw error;
      }
    },

    modal: {
      ondismiss: () => {
        console.log(
          "Razorpay checkout closed."
        );
      },
    },
  };

  const razorpay =
    new window.Razorpay(
      options
    );

  razorpay.on(
    "payment.failed",
    (response) => {
      console.error(
        "RAZORPAY PAYMENT FAILED:",
        response.error
      );

      if (onFailure) {
        onFailure(
          response.error
        );
      }
    }
  );

  razorpay.open();
};

/* ==========================================================
   GENERIC API METHODS
========================================================== */

export const get = async (
  url,
  config = {}
) => {
  const response =
    await API.get(
      url,
      config
    );

  return response.data;
};

export const post = async (
  url,
  data = {},
  config = {}
) => {
  const response =
    await API.post(
      url,
      data,
      config
    );

  return response.data;
};

export const put = async (
  url,
  data = {},
  config = {}
) => {
  const response =
    await API.put(
      url,
      data,
      config
    );

  return response.data;
};

export const patch = async (
  url,
  data = {},
  config = {}
) => {
  const response =
    await API.patch(
      url,
      data,
      config
    );

  return response.data;
};

export const del = async (
  url,
  config = {}
) => {
  const response =
    await API.delete(
      url,
      config
    );

  return response.data;
};

/* ==========================================================
   AUTH HELPERS
========================================================== */

export const authStorage = {
  getToken,

  getUser:
    getStoredUser,

  saveUser,

  clearAuth,

  isAuthenticated: () =>
    Boolean(
      getToken()
    ),

  getRole: () => {
    const user =
      getStoredUser();

    return user?.role ||
      null;
  },

  hasRole: (...roles) => {
    const user =
      getStoredUser();

    return roles.includes(
      user?.role
    );
  },
};

/* ==========================================================
   DEFAULT EXPORT
========================================================== */

export default API;