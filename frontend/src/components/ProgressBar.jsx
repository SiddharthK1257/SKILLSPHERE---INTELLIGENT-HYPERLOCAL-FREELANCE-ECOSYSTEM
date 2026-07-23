import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock3,
  TrendingUp,
  Award,
} from "lucide-react";

const ProgressBar = ({ value = 0, showStatus = true }) => {
  const progress = Math.min(100, Math.max(0, Number(value)));

  const getGradient = () => {
    if (progress === 100)
      return "from-green-500 via-emerald-500 to-green-600";

    if (progress >= 75)
      return "from-blue-500 via-cyan-500 to-indigo-500";

    if (progress >= 50)
      return "from-yellow-400 via-orange-400 to-yellow-500";

    if (progress >= 25)
      return "from-orange-500 via-amber-500 to-yellow-400";

    return "from-red-500 via-rose-500 to-pink-500";
  };

  const getStatus = () => {
    if (progress === 100)
      return {
        text: "Completed",
        icon: <CheckCircle2 size={18} className="text-green-600" />,
      };

    if (progress >= 75)
      return {
        text: "Almost Done",
        icon: <Award size={18} className="text-blue-600" />,
      };

    if (progress >= 50)
      return {
        text: "In Progress",
        icon: <TrendingUp size={18} className="text-yellow-500" />,
      };

    return {
      text: "Getting Started",
      icon: <Clock3 size={18} className="text-red-500" />,
    };
  };

  const status = getStatus();

  return (
    <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">

      {/* Header */}

      <div className="mb-5 flex items-center justify-between">

        <div>

          <h3 className="text-lg font-bold text-slate-800">
            Profile Completion
          </h3>

          {showStatus && (
            <div className="mt-2 flex items-center gap-2">
              {status.icon}

              <span className="text-sm font-medium text-slate-600">
                {status.text}
              </span>
            </div>
          )}

        </div>

        {/* Percentage */}

        <motion.div
          initial={{
            scale: 0,
          }}
          animate={{
            scale: 1,
          }}
          transition={{
            duration: 0.4,
          }}
          className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-white shadow-lg"
        >
          <span className="text-2xl font-black">
            {progress}%
          </span>
        </motion.div>

      </div>

      {/* Progress Track */}

      <div className="relative h-5 overflow-hidden rounded-full bg-slate-200">

        {/* Background Pattern */}

        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.3)_25%,rgba(255,255,255,.3)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.3)_75%)] bg-[length:25px_25px]" />
        </div>

        {/* Progress Fill */}

        <motion.div
          initial={{
            width: 0,
          }}
          animate={{
            width: `${progress}%`,
          }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
          }}
          className={`relative h-full rounded-full bg-gradient-to-r ${getGradient()} shadow-lg`}
        >

          {/* Shine Animation */}

          <motion.div
            animate={{
              x: ["-100%", "250%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "linear",
            }}
            className="absolute inset-y-0 w-16 bg-white/30 skew-x-[-20deg]"
          />

        </motion.div>

      </div>

      {/* Bottom Labels */}

      <div className="mt-4 flex items-center justify-between text-xs font-semibold text-slate-500">

        <span>0%</span>

        <span>25%</span>

        <span>50%</span>

        <span>75%</span>

        <span>100%</span>

      </div>

      {/* Completion Message */}

      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.5,
        }}
        className="mt-6 rounded-2xl bg-slate-50 p-4"
      >

        {progress === 100 ? (
          <p className="font-semibold text-green-600">
            🎉 Congratulations! Your profile is fully completed.
          </p>
        ) : (
          <p className="text-sm text-slate-600">
            Complete your profile to increase visibility, gain client trust,
            and receive more AI-powered freelance recommendations.
          </p>
        )}

      </motion.div>

    </div>
  );
};

export default ProgressBar;