import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FaArrowLeft,
  FaEdit,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";

import ReviewForm from "../components/reviews/ReviewForm";

import {
  getReviewById,
  updateReview,
} from "../services/reviewService";

const EditReview = () => {

  const navigate = useNavigate();

  const { id } = useParams();

  /* =====================================
      STATES
  ===================================== */

  const [review, setReview] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /* =====================================
      LOAD REVIEW
  ===================================== */

  useEffect(() => {

    if (id) {

      fetchReview();

    }

  }, [id]);

  const fetchReview = async () => {

    try {

      setLoading(true);

      setError("");

      const response =
        await getReviewById(id);

      setReview(

        response.review ||

        response

      );

    } catch (err) {

      setError(

        err?.response?.data?.message ||

        err.message ||

        "Unable to load review."

      );

    } finally {

      setLoading(false);

    }

  };

  /* =====================================
      UPDATE REVIEW
  ===================================== */

  const handleSubmit = async (
    reviewData
  ) => {

    try {

      setSaving(true);

      setError("");

      setSuccess("");

      const response =
        await updateReview(
          id,
          reviewData
        );

      setSuccess(

        response.message ||

        "Review updated successfully."

      );

      setTimeout(() => {

        navigate("/reviews");

      }, 1500);

    } catch (err) {

      setError(

        err?.response?.data?.message ||

        err.message ||

        "Unable to update review."

      );

    } finally {

      setSaving(false);

    }

  };

  /* =====================================
      CANCEL
  ===================================== */

  const handleCancel = () => {

    navigate(-1);

  };

  /* =====================================
      LOADING SCREEN
  ===================================== */

  if (loading) {

    return (

      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-gradient-to-br
          from-slate-50
          via-blue-50
          to-indigo-100
        "
      >

        <motion.div

          animate={{
            rotate: 360,
          }}

          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}

          className="
            flex
            h-24
            w-24
            items-center
            justify-center
            rounded-full
            border-4
            border-blue-600
            border-t-transparent
          "
        >

          <FaSpinner
            className="text-3xl text-blue-600"
          />

        </motion.div>

      </div>

    );

  }

  return (

    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-slate-50
        via-blue-50
        to-indigo-100
        py-12
      "
    >

      <div
        className="
          mx-auto
          max-w-6xl
          px-6
        "
      >

        {/* =====================================
            HEADER
        ===================================== */}

        <motion.div

          initial={{
            opacity: 0,
            y: -20,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          className="
            mb-10
            flex
            flex-col
            gap-5
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >

          <div>

            <h1
              className="
                flex
                items-center
                gap-4
                text-5xl
                font-black
                text-slate-800
              "
            >

              <FaEdit />

              Edit Review

            </h1>

            <p
              className="
                mt-4
                max-w-2xl
                text-lg
                text-slate-600
              "
            >

              Update your review to reflect your
              latest experience with the freelancer.

            </p>

          </div>

          <motion.button

            whileHover={{
              scale: 1.05,
            }}

            whileTap={{
              scale: .95,
            }}

            onClick={handleCancel}

            className="
              flex
              items-center
              gap-3
              rounded-2xl
              bg-white
              px-6
              py-4
              font-semibold
              text-slate-700
              shadow-lg
            "
          >

            <FaArrowLeft />

            Back

          </motion.button>

        </motion.div>
                {/* =====================================
            MAIN CONTENT
        ===================================== */}

        <div
          className="
            grid
            gap-8
            lg:grid-cols-3
          "
        >

          {/* =====================================
              LEFT SIDEBAR
          ===================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: -30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: .2,
            }}
            className="space-y-6"
          >

            {/* Edit Information */}

            <div
              className="
                rounded-3xl
                bg-gradient-to-br
                from-indigo-600
                via-blue-600
                to-cyan-500
                p-8
                text-white
                shadow-2xl
              "
            >

              <div
                className="
                  mb-6
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-white/20
                "
              >

                <FaEdit
                  size={30}
                />

              </div>

              <h2
                className="
                  text-3xl
                  font-bold
                "
              >
                Update Review
              </h2>

              <p
                className="
                  mt-4
                  leading-8
                  text-blue-100
                "
              >
                Keep your review accurate by
                updating ratings, comments,
                recommendations and overall
                experience whenever necessary.
              </p>

            </div>

            {/* Editing Guidelines */}

            <div
              className="
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-8
                shadow-lg
              "
            >

              <h3
                className="
                  mb-6
                  text-2xl
                  font-bold
                  text-slate-800
                "
              >
                Editing Guidelines
              </h3>

              <div className="space-y-5">

                {[
                  {
                    title: "Keep it Honest",
                    text: "Update the review only if your experience has genuinely changed."
                  },
                  {
                    title: "Be Respectful",
                    text: "Avoid offensive language and keep your feedback constructive."
                  },
                  {
                    title: "Be Detailed",
                    text: "Mention communication, quality, delivery and professionalism."
                  },
                  {
                    title: "Help Others",
                    text: "Your updated review helps future clients make better decisions."
                  }
                ].map((item,index)=>(

                  <div
                    key={index}
                    className="flex gap-4"
                  >

                    <div
                      className="
                        mt-1
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        bg-green-100
                        text-green-600
                      "
                    >

                      <FaCheckCircle />

                    </div>

                    <div>

                      <h4
                        className="
                          font-semibold
                          text-slate-800
                        "
                      >
                        {item.title}
                      </h4>

                      <p
                        className="
                          mt-1
                          text-sm
                          leading-6
                          text-slate-500
                        "
                      >
                        {item.text}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            </div>

            {/* Rating Reference */}

            <div
              className="
                rounded-3xl
                border
                border-yellow-200
                bg-yellow-50
                p-8
                shadow-lg
              "
            >

              <h3
                className="
                  mb-6
                  text-2xl
                  font-bold
                  text-yellow-700
                "
              >
                Rating Reference
              </h3>

              <div className="space-y-4">

                {[
                  {
                    stars:5,
                    label:"Outstanding"
                  },
                  {
                    stars:4,
                    label:"Very Good"
                  },
                  {
                    stars:3,
                    label:"Average"
                  },
                  {
                    stars:2,
                    label:"Below Average"
                  },
                  {
                    stars:1,
                    label:"Poor"
                  },
                ].map((item)=>(

                  <div
                    key={item.stars}
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <div
                      className="
                        flex
                        gap-1
                      "
                    >

                      {Array.from({
                        length:item.stars
                      }).map((_,i)=>(

                        <span
                          key={i}
                          className="
                            text-yellow-500
                            text-lg
                          "
                        >
                          ★
                        </span>

                      ))}

                    </div>

                    <span
                      className="
                        font-medium
                        text-slate-700
                      "
                    >
                      {item.label}
                    </span>

                  </div>

                ))}

              </div>

            </div>

          </motion.div>
                    {/* =====================================
              RIGHT CONTENT
          ===================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.3,
            }}
            className="lg:col-span-2"
          >

            {/* ==========================
                SUCCESS MESSAGE
            ========================== */}

            {success && (

              <motion.div
                initial={{
                  opacity: 0,
                  y: -20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="
                  mb-6
                  flex
                  items-center
                  gap-4
                  rounded-3xl
                  border
                  border-green-200
                  bg-green-50
                  p-6
                  shadow-lg
                "
              >

                <div
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-full
                    bg-green-100
                    text-green-600
                  "
                >

                  <FaCheckCircle
                    size={26}
                  />

                </div>

                <div>

                  <h3
                    className="
                      text-xl
                      font-bold
                      text-green-700
                    "
                  >
                    Review Updated
                  </h3>

                  <p className="text-green-600">

                    {success}

                  </p>

                </div>

              </motion.div>

            )}

            {/* ==========================
                ERROR MESSAGE
            ========================== */}

            {error && (

              <motion.div
                initial={{
                  opacity: 0,
                  y: -20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="
                  mb-6
                  rounded-3xl
                  border
                  border-red-200
                  bg-red-50
                  p-6
                  shadow-lg
                "
              >

                <h3
                  className="
                    mb-2
                    text-xl
                    font-bold
                    text-red-700
                  "
                >
                  Something Went Wrong
                </h3>

                <p className="text-red-600">

                  {error}

                </p>

              </motion.div>

            )}

            {/* ==========================
                REVIEW FORM
            ========================== */}

            <motion.div
              whileHover={{
                y: -3,
              }}
              transition={{
                duration: .2,
              }}
              className="
                overflow-hidden
                rounded-3xl
                border
                border-slate-200
                bg-white
                shadow-2xl
              "
            >

              {/* Card Header */}

              <div
                className="
                  bg-gradient-to-r
                  from-indigo-600
                  via-blue-600
                  to-cyan-500
                  p-8
                  text-white
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-4
                  "
                >

                  <div
                    className="
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-2xl
                      bg-white/20
                    "
                  >

                    <FaEdit
                      size={30}
                    />

                  </div>

                  <div>

                    <h2
                      className="
                        text-3xl
                        font-black
                      "
                    >
                      Edit Your Review
                    </h2>

                    <p
                      className="
                        mt-2
                        text-blue-100
                      "
                    >
                      Modify ratings, comments,
                      recommendations and update
                      your experience.

                    </p>

                  </div>

                </div>

              </div>

              {/* Form */}

              <div className="p-8">

                <ReviewForm
                  initialData={review}
                  loading={saving}
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                />

              </div>

            </motion.div>

            {/* ==========================
                INFORMATION CARD
            ========================== */}

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: .5,
              }}
              className="
                mt-8
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-8
                shadow-lg
              "
            >

              <h3
                className="
                  text-2xl
                  font-bold
                  text-slate-800
                "
              >
                Why Keep Reviews Updated?
              </h3>

              <p
                className="
                  mt-5
                  leading-8
                  text-slate-600
                "
              >

                Updating your review keeps the
                marketplace transparent and helps
                freelancers receive fair feedback.
                Honest reviews improve trust,
                influence reputation badges,
                analytics, recommendations and
                client hiring decisions across
                the platform.

              </p>

            </motion.div>

          </motion.div>

        </div>
                {/* =====================================
            FOOTER CTA
        ===================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.6,
          }}
          className="mt-12"
        >

          <div
            className="
              relative
              overflow-hidden
              rounded-3xl
              bg-gradient-to-r
              from-indigo-700
              via-blue-700
              to-cyan-600
              p-10
              text-white
              shadow-2xl
            "
          >

            {/* Background Glow */}

            <div
              className="
                absolute
                -top-24
                -right-24
                h-72
                w-72
                rounded-full
                bg-white/10
                blur-3xl
              "
            />

            <div
              className="
                absolute
                -bottom-24
                -left-24
                h-72
                w-72
                rounded-full
                bg-cyan-300/10
                blur-3xl
              "
            />

            <div className="relative z-10">

              <div
                className="
                  grid
                  gap-8
                  lg:grid-cols-2
                "
              >

                {/* Left */}

                <div>

                  <h2
                    className="
                      text-4xl
                      font-black
                    "
                  >
                    Your Review Matters
                  </h2>

                  <p
                    className="
                      mt-5
                      max-w-xl
                      leading-8
                      text-blue-100
                    "
                  >
                    Keeping your review up to date
                    ensures transparency across the
                    platform and helps both freelancers
                    and future clients make better
                    decisions.
                  </p>

                </div>

                {/* Right */}

                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    justify-start
                    gap-4
                    lg:justify-end
                  "
                >

                  <motion.button
                    whileHover={{
                      scale: 1.05,
                    }}
                    whileTap={{
                      scale: .95,
                    }}
                    onClick={() =>
                      navigate("/reviews")
                    }
                    className="
                      rounded-2xl
                      bg-white
                      px-7
                      py-4
                      font-semibold
                      text-indigo-700
                      shadow-lg
                    "
                  >
                    View Reviews
                  </motion.button>

                  <motion.button
                    whileHover={{
                      scale: 1.05,
                    }}
                    whileTap={{
                      scale: .95,
                    }}
                    onClick={() =>
                      navigate("/dashboard")
                    }
                    className="
                      rounded-2xl
                      border
                      border-white/30
                      bg-white/10
                      px-7
                      py-4
                      font-semibold
                      text-white
                      backdrop-blur-lg
                    "
                  >
                    Dashboard
                  </motion.button>

                </div>

              </div>

            </div>

          </div>

        </motion.div>

      </div>

    </div>

  );

};

export default EditReview;