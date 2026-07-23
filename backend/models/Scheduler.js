import mongoose from "mongoose";

const schedulerSchema = new mongoose.Schema(
  {
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    booked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Scheduler = mongoose.model("Scheduler", schedulerSchema);

export default Scheduler;