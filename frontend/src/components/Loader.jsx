import { motion } from "framer-motion";
import {
  FaSpinner,
  FaRocket,
  FaCheckCircle,
} from "react-icons/fa";


const Loader = ({
  text = "Loading...",
  fullScreen = true,
  size = "large",
}) => {

  const spinnerSize =
    size === "small"
      ? "text-4xl"
      : size === "medium"
      ? "text-6xl"
      : "text-7xl";


  return (

    <div
      className={`relative overflow-hidden ${
        fullScreen
          ? "fixed inset-0 z-50"
          : "min-h-[300px] w-full"
      } flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50`}
    >


      {/* ================= BACKGROUND EFFECTS ================= */}


      <motion.div
        animate={{
          x:[0,80,0],
          y:[0,-50,0],
        }}
        transition={{
          repeat:Infinity,
          duration:10,
        }}
        className="
        absolute
        -left-40
        -top-40
        h-[400px]
        w-[400px]
        rounded-full
        bg-blue-400/30
        blur-[120px]
        "
      />


      <motion.div
        animate={{
          x:[0,-70,0],
          y:[0,50,0],
        }}
        transition={{
          repeat:Infinity,
          duration:12,
        }}
        className="
        absolute
        -right-40
        bottom-0
        h-[400px]
        w-[400px]
        rounded-full
        bg-cyan-400/30
        blur-[120px]
        "
      />



      {/* ================= PARTICLES ================= */}


      {[1,2,3,4,5].map((item)=>(

        <motion.div

          key={item}

          animate={{
            y:[0,-40,0],
            opacity:[0.3,1,0.3],
          }}

          transition={{
            repeat:Infinity,
            duration:3+item,
            delay:item,
          }}

          className="
          absolute
          h-3
          w-3
          rounded-full
          bg-blue-500/40
          "

          style={{
            left:`${item*15}%`,
            bottom:`${item*10}%`,
          }}

        />

      ))}



      {/* ================= LOADER CARD ================= */}


      <motion.div

        initial={{
          opacity:0,
          scale:.8,
          y:30,
        }}

        animate={{
          opacity:1,
          scale:1,
          y:0,
        }}

        transition={{
          duration:.6,
        }}

        className="
        relative
        flex
        w-[380px]
        flex-col
        items-center
        rounded-3xl
        border
        border-white/60
        bg-white/70
        p-10
        shadow-2xl
        backdrop-blur-xl
        "

      >



        {/* ICON */}


        <motion.div

          animate={{
            rotate:360,
          }}

          transition={{
            repeat:Infinity,
            duration:8,
            ease:"linear",
          }}

          className="
          absolute
          -top-8
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-2xl
          bg-gradient-to-r
          from-blue-600
          to-cyan-500
          shadow-xl
          "

        >

          <FaRocket
            className="
            text-2xl
            text-white
            "
          />

        </motion.div>




        {/* Spinner */}


        <div className="relative mt-8">


          <motion.div

            animate={{
              rotate:360,
            }}

            transition={{
              repeat:Infinity,
              duration:1.2,
              ease:"linear",
            }}

            className="
            absolute
            inset-0
            rounded-full
            border-4
            border-blue-200
            border-t-blue-600
            "

          />


          <FaSpinner

            className={`
            ${spinnerSize}
            animate-spin
            text-blue-600
            `}
          
          />


        </div>




        {/* TEXT */}


        <motion.h2

          animate={{
            opacity:[.5,1,.5],
          }}

          transition={{
            repeat:Infinity,
            duration:2,
          }}

          className="
          mt-8
          text-2xl
          font-extrabold
          text-slate-800
          "

        >

          {text}

        </motion.h2>



        <p className="
        mt-2
        text-center
        text-sm
        text-slate-500
        ">

          Preparing your experience...

        </p>




        {/* Progress */}


        <div
          className="
          mt-8
          h-2
          w-full
          overflow-hidden
          rounded-full
          bg-slate-200
          "
        >

          <motion.div

            animate={{
              x:["-100%","100%"],
            }}

            transition={{
              repeat:Infinity,
              duration:1.8,
              ease:"easeInOut",
            }}

            className="
            h-full
            w-1/2
            rounded-full
            bg-gradient-to-r
            from-blue-600
            to-cyan-400
            "

          />

        </div>




        {/* Status */}


        <div
          className="
          mt-6
          flex
          items-center
          gap-2
          text-sm
          font-medium
          text-green-600
          "
        >

          <FaCheckCircle />

          System Ready

        </div>



      </motion.div>


    </div>

  );
};


export default Loader;