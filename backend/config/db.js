import "dotenv/config";
import mongoose from "mongoose";
import dns from "node:dns";

const connectDB = async () => {
  try {
    try {
      dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
    } catch (dnsErr) {
      console.warn("⚠️ DNS setServers warning:", dnsErr.message);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export default connectDB;