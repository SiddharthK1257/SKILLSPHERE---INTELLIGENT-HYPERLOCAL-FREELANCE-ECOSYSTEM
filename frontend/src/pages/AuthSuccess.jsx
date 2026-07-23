import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../services/api";

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setError("Authentication failed: No token received.");
      setTimeout(() => navigate("/login"), 3000);
      return;
    }

    // Save token
    localStorage.setItem("token", token);

    // Fetch profile to save user info in localStorage
    API.get("/users/profile")
      .then(({ data }) => {
        const user = data.user || data;
        localStorage.setItem("user", JSON.stringify(user));

        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user profile post-auth:", err);
        localStorage.removeItem("token");
        setError("Failed to fetch user profile. Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000);
      });
  }, [searchParams, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      {error ? (
        <div className="text-red-400 text-lg font-semibold">{error}</div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl font-medium">Completing Sign-In...</p>
        </div>
      )}
    </div>
  );
};

export default AuthSuccess;
