import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";

import App from "./App";

import { NotificationProvider } from "./context/NotificationContext";
import { ThemeProvider } from "./context/ThemeContext";

import "./index.css";
import "./App.css";

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const user = JSON.parse(
  localStorage.getItem("user") || "{}"
);

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <GoogleOAuthProvider
      clientId={GOOGLE_CLIENT_ID}
    >
      <ThemeProvider>
        <BrowserRouter>
          <NotificationProvider
            userId={user?._id}
          >
            <Toaster
  position="top-right"
  reverseOrder={false}
  gutter={10}
  toastOptions={{
    duration: 3500,
    className:
      "bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl",
    success: {
      iconTheme: {
        primary: "#2563eb",
        secondary: "#ffffff",
      },
    },
    error: {
      iconTheme: {
        primary: "#ef4444",
        secondary: "#ffffff",
      },
    },
  }}
/>

            <App />
          </NotificationProvider>
        </BrowserRouter>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);