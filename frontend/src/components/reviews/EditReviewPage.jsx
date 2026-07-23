import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FaArrowLeft,
  FaEdit,
  FaExclamationTriangle,
  FaRedo,
  FaSave,
  FaSpinner,
} from "react-icons/fa";

import { toast } from "react-hot-toast";

import ReviewForm from "../../components/reviews/ReviewForm";

import {
  getReview,
  updateReview,
} from "../../services/reviewService";


/* ==========================================================
   EDIT REVIEW PAGE
========================================================== */

const EditReviewPage = () => {

  /* ========================================================
     ROUTER
  ======================================================== */

  const {
    reviewId,
  } = useParams();

  const navigate =
    useNavigate();


  /* ========================================================
     STATE
  ======================================================== */

  const [
    review,
    setReview,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  /* ========================================================
     LOAD REVIEW
  ======================================================== */

  const fetchReview =
    useCallback(
      async () => {

        if (!reviewId) {

          setError(
            "Invalid review ID."
          );

          setLoading(false);

          return;
        }

        try {

          setLoading(true);

          setError("");

          const response =
            await getReview(
              reviewId
            );


          /*
             Supports different
             backend response formats:

             {
               success: true,
               review: {...}
             }

             OR

             {
               data: {...}
             }

             OR

             {...review}
          */

          const reviewData =
            response?.review ||
            response?.data ||
            response;


          if (!reviewData?._id) {

            throw new Error(
              "Review not found."
            );
          }


          setReview(
            reviewData
          );

        } catch (error) {

          console.error(
            "FETCH REVIEW ERROR:",
            error
          );

          setError(
            error?.message ||
            "Unable to load review."
          );

        } finally {

          setLoading(false);

        }

      },
      [
        reviewId,
      ]
    );


  /* ========================================================
     INITIAL LOAD
  ======================================================== */

  useEffect(() => {

    let mounted = true;


    const loadReview =
      async () => {

        if (!mounted) return;

        await fetchReview();

      };


    loadReview();


    return () => {

      mounted = false;

    };

  }, [
    fetchReview,
  ]);


  /* ========================================================
     UPDATE REVIEW
  ======================================================== */

  const handleSubmit =
    async (
      formData
    ) => {

      /*
         Prevent duplicate requests
      */

      if (saving) return;


      try {

        setSaving(true);


        const response =
          await updateReview(
            reviewId,
            formData
          );


        if (
          response?.success === false
        ) {

          throw new Error(
            response?.message ||
            "Failed to update review."
          );
        }


        toast.success(
          "Review updated successfully!"
        );


        /*
           Navigate after
           successful update
        */

        setTimeout(() => {

          navigate(
            "/my-reviews",
            {
              replace: true,
            }
          );

        }, 700);


      } catch (error) {

        console.error(
          "UPDATE REVIEW ERROR:",
          error
        );


        toast.error(
          error?.message ||
          "Failed to update review."
        );

      } finally {

        setSaving(false);

      }

    };


  /* ========================================================
     CANCEL EDITING
  ======================================================== */

  const handleCancel =
    () => {

      if (saving) return;


      navigate(
        -1
      );

    };


  /* ========================================================
     LOADING STATE
  ======================================================== */

  if (loading) {

    return (

      <main
        className="
          min-h-screen
          bg-slate-50
          px-4
          py-12
        "
      >

        <div
          className="
            mx-auto
            flex
            min-h-[500px]
            max-w-4xl
            flex-col
            items-center
            justify-center
          "
        >

          <div
            className="
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              bg-white
              shadow-lg
            "
          >

            <FaSpinner
              className="
                animate-spin
                text-4xl
                text-indigo-600
              "
            />

          </div>


          <h2
            className="
              mt-6
              text-2xl
              font-bold
              text-slate-800
            "
          >

            Loading Review

          </h2>


          <p
            className="
              mt-2
              text-center
              text-slate-500
            "
          >

            Please wait while we load
            your review details.

          </p>

        </div>

      </main>

    );

  }


  /* ========================================================
     ERROR STATE
  ======================================================== */

  if (error || !review) {

    return (

      <main
        className="
          min-h-screen
          bg-slate-50
          px-4
          py-12
        "
      >

        <div
          className="
            mx-auto
            flex
            min-h-[500px]
            max-w-xl
            items-center
            justify-center
          "
        >

          <div
            className="
              w-full
              rounded-3xl
              border
              border-red-200
              bg-white
              p-8
              text-center
              shadow-xl
            "
          >

            <div
              className="
                mx-auto
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                bg-red-100
              "
            >

              <FaExclamationTriangle
                className="
                  text-4xl
                  text-red-600
                "
              />

            </div>


            <h2
              className="
                mt-6
                text-2xl
                font-bold
                text-slate-800
              "
            >

              Unable to Load Review

            </h2>


            <p
              className="
                mt-3
                leading-7
                text-slate-500
              "
            >

              {error ||
                "The requested review could not be found."}

            </p>


            <div
              className="
                mt-8
                flex
                flex-col
                justify-center
                gap-3
                sm:flex-row
              "
            >

              <button
                type="button"
                onClick={() =>
                  navigate(-1)
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-300
                  px-6
                  py-3
                  font-semibold
                  text-slate-700
                  transition
                  hover:bg-slate-100
                "
              >

                <FaArrowLeft />

                Go Back

              </button>


              <button
                type="button"
                onClick={fetchReview}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-indigo-600
                  px-6
                  py-3
                  font-semibold
                  text-white
                  transition
                  hover:bg-indigo-700
                "
              >

                <FaRedo />

                Try Again

              </button>

            </div>

          </div>

        </div>

      </main>

    );

  }


  /* ========================================================
     MAIN PAGE
  ======================================================== */

  return (

    <main
      className="
        min-h-screen
        bg-gradient-to-br
        from-slate-50
        via-white
        to-indigo-50
        px-4
        py-8
        sm:py-12
      "
    >

      <div
        className="
          mx-auto
          max-w-5xl
        "
      >


        {/* ==================================================
            PAGE HEADER
        ================================================== */}

        <div
          className="
            mb-8
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div
            className="
              flex
              items-center
              gap-4
            "
          >

            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              aria-label="Go back"
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                border
                border-slate-200
                bg-white
                text-slate-600
                shadow-sm
                transition
                hover:border-indigo-300
                hover:bg-indigo-50
                hover:text-indigo-600
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >

              <FaArrowLeft />

            </button>


            <div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-medium
                  text-slate-500
                "
              >

                <span>
                  Reviews
                </span>

                <span>
                  /
                </span>

                <span
                  className="
                    text-indigo-600
                  "
                >
                  Edit Review
                </span>

              </div>


              <h1
                className="
                  mt-1
                  flex
                  items-center
                  gap-3
                  text-3xl
                  font-black
                  text-slate-900
                  sm:text-4xl
                "
              >

                <FaEdit
                  className="
                    text-indigo-600
                  "
                />

                Edit Your Review

              </h1>


              <p
                className="
                  mt-2
                  text-slate-500
                "
              >

                Update your feedback and
                rating for this completed project.

              </p>

            </div>

          </div>


          {/* Review ID */}

          <div
            className="
              hidden
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-3
              text-right
              shadow-sm
              md:block
            "
          >

            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-slate-400
              "
            >

              Review ID

            </p>


            <p
              className="
                mt-1
                max-w-[180px]
                truncate
                font-mono
                text-sm
                text-slate-600
              "
              title={review._id}
            >

              {review._id}

            </p>

          </div>

        </div>


        {/* ==================================================
            EDIT FORM CARD
        ================================================== */}

        <div
          className="
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            bg-white
            shadow-xl
          "
        >

          {/* Form Header */}

          <div
            className="
              border-b
              border-slate-200
              bg-gradient-to-r
              from-indigo-600
              via-blue-600
              to-cyan-600
              px-6
              py-8
              text-white
              sm:px-10
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
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-white/20
                  backdrop-blur-md
                "
              >

                <FaEdit
                  size={24}
                />

              </div>


              <div>

                <h2
                  className="
                    text-2xl
                    font-bold
                  "
                >

                  Update Your Experience

                </h2>


                <p
                  className="
                    mt-1
                    text-sm
                    text-blue-100
                  "
                >

                  Make sure your review accurately
                  reflects your experience.

                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              REVIEW FORM
          ================================================= */}

          <div
            className="
              p-5
              sm:p-8
              lg:p-10
            "
          >

            <ReviewForm
              initialData={review}
              loading={saving}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />

          </div>

        </div>


        {/* ==================================================
            FOOTER INFORMATION
        ================================================== */}

        <div
          className="
            mt-6
            rounded-2xl
            border
            border-blue-100
            bg-blue-50
            p-5
            text-center
          "
        >

          <p
            className="
              text-sm
              leading-6
              text-blue-700
            "
          >

            Your updated review will be visible
            according to the platform's review
            and moderation policies.

          </p>

        </div>

      </div>

    </main>

  );

};


export default EditReviewPage;