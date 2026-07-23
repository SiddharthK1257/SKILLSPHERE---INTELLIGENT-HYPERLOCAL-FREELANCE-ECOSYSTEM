import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import API from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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

      const { data } = await API.post("/auth/login", form);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login Successful!");

      redirectByRole(data.user.role);
    } catch (error) {
      alert(
        error.response?.data?.message || "Login Failed"
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

      const { data } = await API.post("/auth/google", {
        credential: credentialResponse.credential,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Google Login Successful!");

      redirectByRole(data.user.role);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Google Login Failed"
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="login-box">

        <h1>SkillSphere</h1>
        <p>Welcome Back 👋</p>

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
            justifyContent: "center",
          }}
        >
          {googleLoading ? (
            <p>Signing in with Google...</p>
          ) : (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() =>
                alert("Google Login Failed")
              }
            />
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