import Scheduler from "../models/Scheduler.js";

export const getSlots = async (req, res) => {
  try {
    const slots = await Scheduler.find().populate(
      "freelancer",
      "name email"
    );

    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createSlot = async (req, res) => {
  try {
    const slot = await Scheduler.create({
      freelancer: req.user._id,
      date: req.body.date,
      time: req.body.time,
    });

    res.status(201).json(slot);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const bookSlot = async (req, res) => {
  try {
    const slot = await Scheduler.findByIdAndUpdate(
      req.params.id,
      { booked: true },
      { new: true }
    );

    res.json(slot);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteSlot = async (req, res) => {
  try {
    await Scheduler.findByIdAndDelete(req.params.id);

    res.json({
      message: "Slot deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};