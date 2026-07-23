import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  ShieldCheck,
  CreditCard,
  Lock,
  CheckCircle,
  Loader2,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import {
  createOrder,
  verifyPayment,
} from "../../api/paymentApi";

import razorpayLogo from "../../assets/razorpay.png";

/* ==========================================================
   RAZORPAY SCRIPT URL
========================================================== */

const RAZORPAY_SCRIPT =
  "https://checkout.razorpay.com/v1/checkout.js";

/* ==========================================================
   LOAD RAZORPAY SDK
========================================================== */

const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      `script[src="${RAZORPAY_SCRIPT}"]`
    );

    if (existingScript) {
      existingScript.addEventListener("load", () =>
        resolve(true)
      );

      existingScript.addEventListener("error", () =>
        resolve(false)
      );

      return;
    }

    const script = document.createElement("script");

    script.src = RAZORPAY_SCRIPT;
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

/* ==========================================================
   GET LOGGED-IN USER
========================================================== */

const getLoggedInUser = () => {
  try {
    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  } catch (error) {
    console.error(
      "Unable to read logged-in user:",
      error
    );

    return null;
  }
};

/* ==========================================================
   COMPONENT
========================================================== */

const Checkout = () => {
  const navigate = useNavigate();
  const { proposalId } = useParams();

  /* ========================================================
      STATES
  ======================================================== */

  const [loading, setLoading] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [error, setError] = useState("");

  const [user, setUser] = useState(null);

  const [paymentInfo, setPaymentInfo] = useState({
    amount: 0,
    currency: "INR",
    proposalId,
  });

  /* ========================================================
      PAYMENT FEATURES
  ======================================================== */

  const paymentFeatures = [
    {
      icon: <ShieldCheck size={22} />,
      title: "Escrow Protection",
      description:
        "Funds remain securely held until the freelancer completes the project.",
    },

    {
      icon: <Lock size={22} />,
      title: "Secure Encryption",
      description:
        "Every transaction is protected using secure payment technology.",
    },

    {
      icon: <CreditCard size={22} />,
      title: "Multiple Payment Methods",
      description:
        "UPI, cards, net banking, wallets and more via Razorpay.",
    },

    {
      icon: <CheckCircle size={22} />,
      title: "Instant Verification",
      description:
        "Payments are verified automatically after successful checkout.",
    },
  ];

  /* ========================================================
      LOAD USER
  ======================================================== */

  useEffect(() => {
    const loggedInUser =
      getLoggedInUser();

    if (!loggedInUser) {
      toast.error(
        "Please login before making a payment."
      );

      navigate("/login");
      return;
    }

    setUser(loggedInUser);
  }, [navigate]);

  /* ========================================================
      LOAD SDK
  ======================================================== */

  const initializeRazorpay =
    useCallback(async () => {
      const loaded =
        await loadRazorpay();

      setSdkReady(loaded);

      if (!loaded) {
        setError(
          "Unable to load Razorpay. Please check your internet connection."
        );
      }

      return loaded;
    }, []);

  useEffect(() => {
    initializeRazorpay();
  }, [initializeRazorpay]);

  /* ========================================================
      RETRY SDK
  ======================================================== */

  const handleRetry = async () => {
    setError("");

    const loaded =
      await initializeRazorpay();

    if (loaded) {
      toast.success(
        "Razorpay loaded successfully."
      );
    }
  };

  console.log("Pay button clicked");
console.log("Proposal ID:", proposalId);

  /* ========================================================
      HANDLE PAYMENT
  ======================================================== */

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError("");

      /* -----------------------------------------------
          VALIDATE USER
      ------------------------------------------------ */

      if (!user) {
        throw new Error(
          "User information not found. Please login again."
        );
      }

      /* -----------------------------------------------
          VALIDATE PROPOSAL
      ------------------------------------------------ */

      if (!proposalId) {
        throw new Error(
          "Proposal ID is missing."
        );
      }

      /* -----------------------------------------------
          VALIDATE RAZORPAY
      ------------------------------------------------ */

      let razorpayLoaded = sdkReady;

      if (!razorpayLoaded) {
        razorpayLoaded =
          await initializeRazorpay();
      }

      if (
        !razorpayLoaded ||
        !window.Razorpay
      ) {
        throw new Error(
          "Razorpay checkout is unavailable."
        );
      }

      /* -----------------------------------------------
          CREATE ORDER
      ------------------------------------------------ */

      const response = await createOrder(proposalId);

console.log("ORDER RESPONSE");
console.log(response);

      /*
        Depending on your paymentApi.js,
        response may be:

        {
          data: {
            success: true,
            order: {}
          }
        }

        OR:

        {
          success: true,
          order: {}
        }
      */

      const result =
        response?.data || response;

      const order =
        result?.order;

      if (!order) {
        throw new Error(
          result?.message ||
            "Unable to create payment order."
        );
      }

      /* -----------------------------------------------
          SAVE PAYMENT INFO
      ------------------------------------------------ */

      setPaymentInfo({
        amount: Number(order.amount) / 100,
        currency:
          order.currency || "INR",
        proposalId,
      });

      /* -----------------------------------------------
          RAZORPAY OPTIONS
      ------------------------------------------------ */

      const options = {
        key:
          import.meta.env
            .VITE_RAZORPAY_KEY_ID,

        amount: order.amount,

        currency:
          order.currency || "INR",

        order_id: order.id,

        name: "SkillSphere",

        description:
          "Secure Freelance Escrow Payment",

        image: razorpayLogo,

        /*
         * IMPORTANT
         *
         * These values belong to the
         * CURRENTLY LOGGED-IN USER.
         */

        prefill: {
          name:
            user.name ||
            "",

          email:
            user.email ||
            "",

          contact:
            user.phone ||
            user.mobile ||
            user.contact ||
            "",
        },

        notes: {
          proposalId,
          userId:
            user._id ||
            user.id ||
            "",
        },

        theme: {
          color: "#2563EB",
        },

        modal: {
          escape: true,
          backdropclose: false,
          confirm_close: true,

          ondismiss: () => {
            setLoading(false);
          },
        },

        handler: async (
          paymentResponse
        ) => {
          try {
            setLoading(true);

            const verifyResponse =
              await verifyPayment({
                razorpay_order_id:
                  paymentResponse.razorpay_order_id,

                razorpay_payment_id:
                  paymentResponse.razorpay_payment_id,

                razorpay_signature:
                  paymentResponse.razorpay_signature,
              });

            const verificationResult =
              verifyResponse?.data ||
              verifyResponse;

            if (
              !verificationResult.success
            ) {
              throw new Error(
                verificationResult.message ||
                  "Payment verification failed."
              );
            }

            toast.success(
              "Payment successful!"
            );

            navigate(
              `/payment/${paymentResponse.razorpay_payment_id}`,
              {
                replace: true,
              }
            );
          } catch (error) {
            console.error(
              "Payment Verification Error:",
              error
            );

            const message =
              error.response?.data
                ?.message ||
              error.message ||
              "Payment verification failed.";

            setError(message);

            toast.error(message);
          } finally {
            setLoading(false);
          }
        },
      };

      /* -----------------------------------------------
          OPEN RAZORPAY
      ------------------------------------------------ */

      const razorpay =
        new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        (response) => {
          console.error(
            "Payment Failed:",
            response.error
          );

          const message =
            response.error?.description ||
            "Payment failed.";

          setError(message);
          toast.error(message);

          setLoading(false);
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(
        "Payment Error:",
        error
      );

      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to initiate payment.";

      setError(message);
      toast.error(message);

      setLoading(false);
    }
  };

  /* ========================================================
      FORMAT AMOUNT
  ======================================================== */

  const formattedAmount =
    paymentInfo.amount > 0
      ? paymentInfo.amount.toLocaleString(
          "en-IN"
        )
      : "--";

  /* ========================================================
      RENDER
  ======================================================== */

  return (
    <div
      className="min-vh-100 d-flex align-items-center py-5"
      style={{
        background:
          "linear-gradient(135deg,#eef2ff,#f8fafc,#ffffff)",
      }}
    >
      <div className="container">

        {/* BACK BUTTON */}

        <button
          onClick={() => navigate(-1)}
          className="btn btn-light mb-4 d-flex align-items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="row justify-content-center">

          <div className="col-lg-8">

            <div
              className="card border-0 shadow-lg overflow-hidden"
              style={{
                borderRadius: "24px",
              }}
            >

              {/* =================================================
                  HEADER
              ================================================= */}

              <div
                className="text-center text-white p-5"
                style={{
                  background:
                    "linear-gradient(135deg,#2563eb,#4f46e5)",
                }}
              >

                <img
                  src={razorpayLogo}
                  alt="Razorpay"
                  style={{
                    height: 60,
                    objectFit: "contain",
                  }}
                />

                <h2 className="fw-bold mt-4">
                  Secure Escrow Payment
                </h2>

                <p className="mb-0 opacity-75">
                  Powered by Razorpay
                </p>

              </div>

              {/* =================================================
                  BODY
              ================================================= */}

              <div className="card-body p-5">

                {/* USER INFO */}

                {user && (
                  <div className="alert alert-info">

                    <strong>
                      Paying as:
                    </strong>{" "}

                    {user.name}

                    <br />

                    <small>
                      {user.email}

                      {(
                        user.phone ||
                        user.mobile ||
                        user.contact
                      ) && (
                        <>
                          {" • "}
                          {user.phone ||
                            user.mobile ||
                            user.contact}
                        </>
                      )}
                    </small>

                  </div>
                )}

                {/* ERROR */}

                {error && (
                  <div className="alert alert-danger d-flex justify-content-between align-items-center">

                    <div className="d-flex gap-2 align-items-center">

                      <AlertCircle size={20} />

                      <span>
                        {error}
                      </span>

                    </div>

                    {!sdkReady && (
                      <button
                        onClick={handleRetry}
                        className="btn btn-sm btn-outline-danger d-flex align-items-center gap-2"
                      >
                        <RefreshCw
                          size={15}
                        />

                        Retry
                      </button>
                    )}

                  </div>
                )}

                {/* AMOUNT */}

                <div className="text-center mb-5">

                  <small className="text-muted">
                    Total Amount
                  </small>

                  <h1 className="display-4 fw-bold text-primary mt-2">

                    ₹{formattedAmount}

                  </h1>

                </div>

                {/* FEATURES */}

                <div className="row g-4 mb-5">

                  {paymentFeatures.map(
                    (
                      feature,
                      index
                    ) => (
                      <div
                        className="col-md-6"
                        key={index}
                      >

                        <div className="border rounded-4 h-100 p-4">

                          <div className="text-primary mb-3">
                            {feature.icon}
                          </div>

                          <h5 className="fw-bold">
                            {feature.title}
                          </h5>

                          <p className="text-muted mb-0">
                            {feature.description}
                          </p>

                        </div>

                      </div>
                    )
                  )}

                </div>

                {/* PAYMENT SUMMARY */}

                <div
                  className="rounded-4 p-4 mb-4"
                  style={{
                    background:
                      "#f8fafc",
                  }}
                >

                  <h5 className="fw-bold mb-4">
                    Payment Summary
                  </h5>

                  <div className="d-flex justify-content-between mb-3">

                    <span>
                      Project Amount
                    </span>

                    <strong>
                      ₹{formattedAmount}
                    </strong>

                  </div>

                  <div className="d-flex justify-content-between mb-3">

                    <span>
                      Gateway
                    </span>

                    <span>
                      Razorpay
                    </span>

                  </div>

                  <div className="d-flex justify-content-between mb-3">

                    <span>
                      Security
                    </span>

                    <span className="text-success">
                      Protected
                    </span>

                  </div>

                  <hr />

                  <div className="d-flex justify-content-between">

                    <h5>
                      Total
                    </h5>

                    <h5 className="text-primary">
                      ₹{formattedAmount}
                    </h5>

                  </div>

                </div>

                {/* PAY BUTTON */}

                <button
                  className="btn btn-primary btn-lg w-100 rounded-4 py-3 d-flex justify-content-center align-items-center"
                  disabled={
                    loading ||
                    !proposalId ||
                    !sdkReady
                  }
                  onClick={handlePayment}
                >

                  {loading ? (
                    <>
                      <Loader2
                        size={20}
                        className="me-2 spin"
                      />

                      Processing Payment...
                    </>
                  ) : !sdkReady ? (
                    <>
                      <Loader2
                        size={20}
                        className="me-2 spin"
                      />

                      Loading Razorpay...
                    </>
                  ) : (
                    <>
                      <CreditCard
                        size={20}
                        className="me-2"
                      />

                      Pay Securely
                    </>
                  )}

                </button>

                {/* SECURITY FOOTER */}

                <div className="text-center mt-4">

                  <small className="text-muted">
                    🔒 256-bit SSL Encryption • Escrow Protected • Razorpay Secure
                  </small>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Checkout;