import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  FaTrash,
  FaTimes,
  FaExclamationTriangle,
  FaCheck,
} from "react-icons/fa";

import {
  deleteReview,
} from "../../services/reviewService";


/* ==========================================================
   DELETE MODAL
========================================================== */

const DeleteModal = ({
  show = false,
  onClose,
  reviewId,
  onDeleted,
}) => {


  /* ========================================================
     STATE
  ======================================================== */

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    confirmDelete,
    setConfirmDelete,
  ] = useState(false);


  /* ========================================================
     REFS
  ======================================================== */

  const modalRef =
    useRef(null);

  const cancelButtonRef =
    useRef(null);


  /* ========================================================
     RESET STATE WHEN OPENING
  ======================================================== */

  useEffect(() => {

    if (!show) return;


    setLoading(false);

    setError("");

    setConfirmDelete(false);


    /*
       Automatically focus
       the Cancel button
    */

    const timer =
      setTimeout(() => {

        cancelButtonRef.current?.focus();

      }, 100);


    return () => {

      clearTimeout(timer);

    };

  }, [
    show,
  ]);


  /* ========================================================
     ESCAPE KEY
  ======================================================== */

  useEffect(() => {

    if (!show) return;


    const handleKeyDown =
      (event) => {

        if (
          event.key === "Escape" &&
          !loading
        ) {

          onClose?.();

        }

      };


    document.addEventListener(
      "keydown",
      handleKeyDown
    );


    return () => {

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

    };

  }, [
    show,
    loading,
    onClose,
  ]);


  /* ========================================================
     BODY SCROLL LOCK
  ======================================================== */

  useEffect(() => {

    if (!show) return;


    const originalOverflow =
      document.body.style.overflow;


    document.body.style.overflow =
      "hidden";


    return () => {

      document.body.style.overflow =
        originalOverflow;

    };

  }, [
    show,
  ]);


  /* ========================================================
     DELETE REVIEW
  ======================================================== */

  const handleDelete =
    async () => {


      /*
         Prevent duplicate requests
      */

      if (loading) return;


      /*
         Validate review ID
      */

      if (!reviewId) {

        setError(
          "Invalid review ID."
        );

        return;

      }


      /*
         Require confirmation
      */

      if (!confirmDelete) {

        setError(
          "Please confirm that you understand this action."
        );

        return;

      }


      try {

        setLoading(true);

        setError("");


        const response =
          await deleteReview(
            reviewId
          );


        /*
           Handle APIs that return
           success: false
        */

        if (
          response?.success === false
        ) {

          throw new Error(
            response?.message ||
            "Unable to delete review."
          );

        }


        /*
           Notify parent first
        */

        onDeleted?.(
          reviewId
        );


        /*
           Close modal
        */

        onClose?.();


      } catch (error) {

        console.error(
          "DELETE REVIEW ERROR:",
          error
        );


        setError(
          error?.message ||
          "Unable to delete review. Please try again."
        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================================
     CLOSE MODAL
  ======================================================== */

  const handleClose =
    () => {

      if (loading) return;

      onClose?.();

    };


  /* ========================================================
     MODAL
  ======================================================== */

  return (

    <AnimatePresence>

      {show && (

        <motion.div
          key="delete-modal-backdrop"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.2,
          }}
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/60
            p-4
            backdrop-blur-md
          "
          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {

              handleClose();

            }

          }}
        >

          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-review-title"
            aria-describedby="delete-review-description"
            initial={{
              opacity: 0,
              scale: 0.92,
              y: 25,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.92,
              y: 25,
            }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
            className="
              max-h-[95vh]
              w-full
              max-w-xl
              overflow-y-auto
              rounded-3xl
              bg-white
              shadow-2xl
            "
          >


            {/* =================================================
                HEADER
            ================================================= */}

            <div
              className="
                relative
                overflow-hidden
                bg-gradient-to-r
                from-red-600
                via-rose-500
                to-pink-600
                px-6
                py-6
                text-white
                sm:px-8
              "
            >

              {/* Decorative Glow */}

              <div
                aria-hidden="true"
                className="
                  absolute
                  -right-20
                  -top-24
                  h-64
                  w-64
                  rounded-full
                  bg-white/10
                  blur-3xl
                "
              />


              <div
                className="
                  relative
                  flex
                  items-start
                  justify-between
                  gap-4
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
                      flex-shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      bg-white/20
                      backdrop-blur-md
                    "
                  >

                    <FaTrash
                      size={24}
                    />

                  </div>


                  <div>

                    <h2
                      id="delete-review-title"
                      className="
                        text-2xl
                        font-bold
                        sm:text-3xl
                      "
                    >

                      Delete Review

                    </h2>


                    <p
                      className="
                        mt-1
                        text-sm
                        text-red-100
                      "
                    >

                      This action cannot be undone.

                    </p>

                  </div>

                </div>


                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  aria-label="Close delete dialog"
                  className="
                    flex
                    h-10
                    w-10
                    flex-shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-white/20
                    transition
                    hover:bg-white/30
                    focus:outline-none
                    focus:ring-2
                    focus:ring-white
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >

                  <FaTimes />

                </button>

              </div>

            </div>


            {/* =================================================
                CONTENT
            ================================================= */}

            <div
              className="
                space-y-6
                p-6
                sm:p-8
              "
            >


              {/* =================================================
                  ERROR MESSAGE
              ================================================= */}

              <AnimatePresence>

                {error && (

                  <motion.div
                    initial={{
                      opacity: 0,
                      height: 0,
                      y: -10,
                    }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      y: -10,
                    }}
                    className="
                      flex
                      items-start
                      gap-3
                      rounded-2xl
                      border
                      border-red-200
                      bg-red-50
                      p-4
                      text-sm
                      text-red-700
                    "
                  >

                    <FaExclamationTriangle
                      className="
                        mt-0.5
                        flex-shrink-0
                      "
                    />

                    <span>
                      {error}
                    </span>

                  </motion.div>

                )}

              </AnimatePresence>


              {/* =================================================
                  MAIN WARNING
              ================================================= */}

              <div
                id="delete-review-description"
                className="
                  rounded-2xl
                  border
                  border-red-200
                  bg-red-50
                  p-5
                  sm:p-6
                "
              >

                <div
                  className="
                    flex
                    items-start
                    gap-4
                  "
                >

                  <div
                    className="
                      flex
                      h-12
                      w-12
                      flex-shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-red-100
                    "
                  >

                    <FaExclamationTriangle
                      className="
                        text-red-600
                      "
                      size={22}
                    />

                  </div>


                  <div>

                    <h3
                      className="
                        text-xl
                        font-bold
                        text-red-700
                      "
                    >

                      Are you sure?

                    </h3>


                    <p
                      className="
                        mt-3
                        text-sm
                        leading-7
                        text-slate-700
                      "
                    >

                      This review and its associated
                      information will be permanently
                      removed from the platform.

                    </p>


                    <p
                      className="
                        mt-3
                        text-sm
                        font-semibold
                        text-red-600
                      "
                    >

                      This action cannot be reversed.

                    </p>

                  </div>

                </div>

              </div>


              {/* =================================================
                  WHAT WILL BE DELETED
              ================================================= */}

              <div
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-50
                  p-5
                  sm:p-6
                "
              >

                <h3
                  className="
                    text-lg
                    font-bold
                    text-slate-800
                  "
                >

                  What happens after deletion?

                </h3>


                <ul
                  className="
                    mt-4
                    space-y-3
                    text-sm
                    leading-6
                    text-slate-600
                  "
                >

                  <li
                    className="
                      flex
                      items-start
                      gap-3
                    "
                  >

                    <FaCheck
                      className="
                        mt-1
                        flex-shrink-0
                        text-red-500
                      "
                    />

                    <span>
                      The review will be permanently removed.
                    </span>

                  </li>


                  <li
                    className="
                      flex
                      items-start
                      gap-3
                    "
                  >

                    <FaCheck
                      className="
                        mt-1
                        flex-shrink-0
                        text-red-500
                      "
                    />

                    <span>
                      Associated replies may also be removed
                      according to your backend rules.
                    </span>

                  </li>


                  <li
                    className="
                      flex
                      items-start
                      gap-3
                    "
                  >

                    <FaCheck
                      className="
                        mt-1
                        flex-shrink-0
                        text-red-500
                      "
                    />

                    <span>
                      Freelancer rating statistics will be
                      recalculated.
                    </span>

                  </li>


                  <li
                    className="
                      flex
                      items-start
                      gap-3
                    "
                  >

                    <FaCheck
                      className="
                        mt-1
                        flex-shrink-0
                        text-red-500
                      "
                    />

                    <span>
                      The review cannot be restored after deletion.
                    </span>

                  </li>

                </ul>

              </div>


              {/* =================================================
                  CONFIRMATION CHECKBOX
              ================================================= */}

              <label
                className={`
                  flex
                  cursor-pointer
                  items-start
                  gap-4
                  rounded-2xl
                  border
                  p-5
                  transition-all

                  ${
                    confirmDelete
                      ? "border-red-400 bg-red-50"
                      : "border-amber-200 bg-amber-50"
                  }
                `}
              >

                <input
                  type="checkbox"
                  checked={confirmDelete}
                  onChange={(event) => {

                    setConfirmDelete(
                      event.target.checked
                    );

                    setError("");

                  }}
                  disabled={loading}
                  className="
                    mt-1
                    h-5
                    w-5
                    flex-shrink-0
                    cursor-pointer
                    rounded
                    border-slate-300
                    text-red-600
                    focus:ring-2
                    focus:ring-red-500
                  "
                />


                <span>

                  <span
                    className="
                      block
                      font-semibold
                      text-slate-800
                    "
                  >

                    I understand the consequences

                  </span>


                  <span
                    className="
                      mt-2
                      block
                      text-sm
                      leading-6
                      text-slate-600
                    "
                  >

                    I understand that deleting this review
                    is permanent and cannot be undone.

                  </span>

                </span>

              </label>


              {/* =================================================
                  ACTIONS
              ================================================= */}

              <div
                className="
                  flex
                  flex-col-reverse
                  gap-3
                  border-t
                  border-slate-200
                  pt-6
                  sm:flex-row
                  sm:justify-end
                "
              >

                {/* Cancel */}

                <button
                  ref={cancelButtonRef}
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-slate-300
                    bg-white
                    px-6
                    py-3
                    font-semibold
                    text-slate-700
                    transition
                    hover:bg-slate-100
                    focus:outline-none
                    focus:ring-2
                    focus:ring-slate-400
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >

                  Cancel

                </button>


                {/* Delete */}

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={
                    loading ||
                    !confirmDelete
                  }
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-3
                    rounded-xl
                    bg-gradient-to-r
                    from-red-600
                    to-rose-600
                    px-6
                    py-3
                    font-semibold
                    text-white
                    shadow-lg
                    transition
                    hover:from-red-700
                    hover:to-rose-700
                    hover:shadow-red-500/30
                    focus:outline-none
                    focus:ring-2
                    focus:ring-red-500
                    focus:ring-offset-2
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >

                  {loading ? (

                    <>

                      <span
                        className="
                          h-5
                          w-5
                          animate-spin
                          rounded-full
                          border-2
                          border-white/30
                          border-t-white
                        "
                      />

                      Deleting...

                    </>

                  ) : (

                    <>

                      <FaTrash />

                      Delete Review

                    </>

                  )}

                </button>

              </div>

            </div>

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>

  );

};


export default DeleteModal;