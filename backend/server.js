import "dotenv/config";

import express from "express";
import http from "http";
import cors from "cors";
import dns from "node:dns";

import connectDB from "./config/db.js";
import passport from "./config/passport.js";
import { initializeSocket } from "./socket/socket.js";
import path from "path";
import fs from "fs";

/* ===================== USER ROUTES ===================== */

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import gigRoutes from "./routes/gigRoutes.js";
import proposalRoutes from "./routes/proposalRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import schedulerRoutes from "./routes/schedulerRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import twoFactorRoutes from "./routes/twoFactorRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

/* ===================== DNS ===================== */

dns.setServers(["1.1.1.1", "8.8.8.8"]);

/* ===================== APP ===================== */

const app = express();
app.set("trust proxy", 1);
const server = http.createServer(app);

/* ===================== MIDDLEWARE ===================== */

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server requests or tools like Postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

app.use(passport.initialize());

/* ===================== UPLOADS DIRECTORY ===================== */

const uploadsPath = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, {
    recursive: true,
  });

  console.log("✅ Uploads directory created");
}

/* ===================== STATIC FILES ===================== */

app.use(
  "/uploads",
  express.static(uploadsPath, {
    index: false,
    redirect: false,
    fallthrough: true,
    maxAge: "1d",
  })
);

/* ===================== HEALTH CHECK ===================== */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SkillSphere API Running 🚀",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

/* ===================== USER ROUTES ===================== */

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/scheduler", schedulerRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/2fa", twoFactorRoutes);
app.use("/api/admin", adminRoutes);

/* ===================== 404 ===================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/* ===================== ERROR HANDLER ===================== */

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(err.statusCode || err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* ===================== START SERVER ===================== */

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect database before starting server
    await connectDB();
    console.log("✅ Database connected");

    // Initialize Socket.IO
    initializeSocket(server);
    console.log("✅ Socket.IO initialized");

    console.log(
  "Razorpay Configured:",
  !!process.env.RAZORPAY_KEY_ID &&
  !!process.env.RAZORPAY_KEY_SECRET
);

    server.listen(PORT, () => {
      console.log("\n======================================");
      console.log("🚀 SkillSphere Server Started");
      console.log(`🌐 Server Port : ${PORT}`);
console.log(`🌍 Frontend    : ${process.env.FRONTEND_URL}`);
console.log(`🔑 Environment : ${process.env.NODE_ENV || "development"}`);
      console.log("======================================\n");
    });
  } catch (error) {
    console.error("❌ Failed to start server:");
    console.error(error);
    process.exit(1);
  }
};

startServer();

/* ===================== GRACEFUL SHUTDOWN ===================== */

const shutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down...`);

  server.close(() => {
    console.log("Server stopped.");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));