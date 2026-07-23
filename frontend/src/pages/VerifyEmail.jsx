import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";
import {
  CheckCircle,
  XCircle,
  Loader2,
  MailCheck,
  ArrowRight,
} from "lucide-react";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("Verifying your email...");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    verifyEmail();
  }, []);

  useEffect(() => {
    if (!success) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate("/login");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [success, navigate]);

  const verifyEmail = async () => {
    try {
      const { data } = await API.get(
        `/auth/verify-email/${token}`
      );

      setSuccess(true);
      setMessage(
        data.message ||
          "Your email has been verified successfully."
      );
    } catch (error) {
      setSuccess(false);

      setMessage(
        error.response?.data?.message ||
          "Verification failed. The link may be invalid or expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-100 px-6">

      {/* Background */}
      <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-300/30 blur-3xl"></div>

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.5,
        }}
        className="relative z-10 w-full max-w-md rounded-3xl bg-white p-10 shadow-2xl"
      >

        {/* Logo */}

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">

          {loading ? (
            <Loader2
              size={42}
              className="animate-spin text-blue-600"
            />
          ) : success ? (
            <CheckCircle
              size={42}
              className="text-green-600"
            />
          ) : (
            <XCircle
              size={42}
              className="text-red-600"
            />
          )}

        </div>

        <div className="mt-6 text-center">

          <h1 className="text-4xl font-extrabold text-blue-600">
            SkillSphere
          </h1>

          <p className="mt-2 text-gray-500">
            Secure Freelancing Marketplace
          </p>

        </div>

        <div className="mt-10 text-center">

          <h2 className="text-2xl font-bold text-gray-800">

            {loading
              ? "Verifying Email"
              : success
              ? "Email Verified!"
              : "Verification Failed"}

          </h2>

          <p className="mt-4 leading-7 text-gray-600">
            {message}
          </p>

        </div>

        {loading && (

          <div className="mt-8 flex justify-center">

            <Loader2
              size={34}
              className="animate-spin text-blue-600"
            />

          </div>

        )}

        {!loading && success && (

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            className="mt-8 rounded-2xl bg-green-50 p-5 text-center"
          >

            <MailCheck
              className="mx-auto mb-3 text-green-600"
              size={34}
            />

            <p className="font-semibold text-green-700">
              Redirecting to Login in
            </p>

            <h3 className="mt-2 text-5xl font-black text-green-600">
              {countdown}
            </h3>

          </motion.div>

        )}

        {!loading && (

          <div className="mt-10">

            <Link to="/login">

              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700">

                Go to Login

                <ArrowRight size={20} />

              </button>

            </Link>

          </div>

        )}

        <div className="mt-10 border-t pt-6 text-center">

          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} SkillSphere
          </p>

        </div>

      </motion.div>

    </div>
  );
};

export default VerifyEmail;