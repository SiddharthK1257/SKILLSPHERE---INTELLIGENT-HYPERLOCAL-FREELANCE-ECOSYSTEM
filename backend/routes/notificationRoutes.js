import express from "express";
import Notification from "../models/Notification.js";
import { getIO } from "../socket/socket.js";

const router = express.Router();

// Get notifications

router.get("/:userId", async (req, res) => {
  try {
    const notifications = await Notification.find({
      receiver: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// Create notification

router.post("/", async (req, res) => {
  try {
    const notification = await Notification.create(req.body);

    const io = getIO();

    io.to(notification.receiver.toString()).emit(
      "newNotification",
      notification
    );

    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// Mark Read

router.put("/:id", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        isRead: true,
      },
      { new: true }
    );

    res.json(notification);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

export default router;