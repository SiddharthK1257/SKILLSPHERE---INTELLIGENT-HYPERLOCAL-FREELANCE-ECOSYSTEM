import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    progress: {
      type: Number,
      default: 0,
    },
    logs: [
      {
        message: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    files: [
      {
        filename: String,
        url: String,
      },
    ],
    deadline: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Project", projectSchema);