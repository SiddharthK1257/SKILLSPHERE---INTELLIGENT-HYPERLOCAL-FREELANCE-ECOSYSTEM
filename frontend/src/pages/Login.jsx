import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import API from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [urlError, setUrlError] = useState("");

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "google_auth_failed") {
      setUrlError("Google Sign-In failed or was cancelled. Please try again.");
    } else if (errorParam === "google_oauth_not_configured") {
      setUrlError("Google OAuth server parameters are missing. Check server config.");
    } else if (errorParam) {
      setUrlError("Authentication error. Please try again.");
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Redirect user based on role
  const redirectByRole = (role) => {
    switch (role) {
      case "admin":
        navigate("/admin/dashboard");
        break;

      case "freelancer":
        navigate("/dashboard");
        break;

      case "client":
        navigate("/dashboard");
        break;

      default:
        navigate("/dashboard");
    }
  };

  // ==========================
  // Email & Password Login
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setUrlError("");

      const { data } = await API.post("/auth/login", form);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      redirectByRole(data.user.role);
    } catch (error) {
      setUrlError(
        error.response?.data?.message || "Login Failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Google Login
  // ==========================
  const handleGoogleSuccess = async (
    credentialResponse
  ) => {
    try {
      setGoogleLoading(true);
      setUrlError("");

      const { data } = await API.post("/auth/google", {
        credential: credentialResponse.credential,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      redirectByRole(data.user.role);
    } catch (error) {
      console.error("Google Login Error:", error);

      setUrlError(
        error.response?.data?.message ||
          "Google Login Failed."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const handlePassportGoogleLogin = () => {
    const backendUrl = (import.meta.env.VITE_API_URL || "https://skillsphere-intelligent-hyperlocal-4wq2.onrender.com/api").replace(/\/+$/, "");
    window.location.href = `${backendUrl}/auth/google/auth`;
  };

  return (
    <div className="container">
      <div className="login-box">

        <h1>SkillSphere</h1>
        <p>Welcome Back 👋</p>

        {urlError && (
          <div style={{
            backgroundColor: "#fee2e2",
            color: "#dc2626",
            padding: "10px 14px",
            borderRadius: "8px",
            marginBottom: "16px",
            fontSize: "14px",
            textAlign: "center"
          }}>
            {urlError}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

          <div
            style={{
              marginTop: "15px",
              marginBottom: "15px",
              textAlign: "center",
            }}
          >
            <Link
              to="/forgot-password"
              style={{
                color: "#0ea5e9",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Forgot Password?
            </Link>
          </div>

        </form>

        <div
          style={{
            margin: "20px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px"
          }}
        >
          {googleLoading ? (
            <p>Signing in with Google...</p>
          ) : (
            <>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() =>
                  setUrlError("Google Login Failed. You can also try Google Redirect below.")
                }
              />
              <button
                type="button"
                onClick={handlePassportGoogleLogin}
                style={{
                  background: "#f1f5f9",
                  color: "#334155",
                  border: "1px solid #cbd5e1",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "500",
                  cursor: "pointer"
                }}
              >
                Or Sign in via Google Redirect
              </button>
            </>
          )}
        </div>

        <p>
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;