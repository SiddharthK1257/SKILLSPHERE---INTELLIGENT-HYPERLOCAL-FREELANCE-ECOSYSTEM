import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const validatePassword = () => {
    if (!password) {
      toast.error("Password is required");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) return;

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/reset-password/${token}`,
        {
          password,
        }
      );

      toast.success(data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen d-flex justify-content-center align-items-center"
      style={{ background: "#f5f7fb" }}
    >
      <div
        className="card shadow p-4"
        style={{ width: "420px", borderRadius: "18px" }}
      >
        <div className="text-center mb-4">
          <FaLock
            size={45}
            className="text-primary mb-3"
          />

          <h2 className="fw-bold">
            Reset Password
          </h2>

          <p className="text-muted">
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Password */}

          <div className="mb-3">
            <label className="form-label">
              New Password
            </label>

            <div className="input-group">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                className="form-control"
                placeholder="Enter new password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}

          <div className="mb-4">
            <label className="form-label">
              Confirm Password
            </label>

            <div className="input-group">
              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                className="form-control"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
              />

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {showConfirmPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>
            </div>
          </div>

          <button
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading
              ? "Updating Password..."
              : "Reset Password"}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link
            to="/login"
            className="text-decoration-none"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;