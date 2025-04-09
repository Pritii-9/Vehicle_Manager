

import express from "express";
import LogSheet from "../models/LogSheet.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const newLogSheet = new LogSheet(req.body);
    const savedLogSheet = await newLogSheet.save();
    res.status(201).json(savedLogSheet);
  } catch (error) {
    console.error("Error adding log sheet:", error.message);
    res.status(500).json({ message: "Error adding log sheet", error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const logSheets = await LogSheet.find();
    res.status(200).json(logSheets);
  } catch (error) {
    console.error("Error fetching log sheets:", error.message);
    res.status(500).json({ message: "Error retrieving log sheets" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedLogSheet = await LogSheet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedLogSheet);
  } catch (error) {
    console.error("Error updating log sheet:", error.message);
    res.status(500).json({ message: "Error updating log sheet" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await LogSheet.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Log sheet deleted successfully" });
  } catch (error) {
    console.error("Error deleting log sheet:", error.message);
    res.status(500).json({ message: "Error deleting log sheet" });
  }
});
  export default router;