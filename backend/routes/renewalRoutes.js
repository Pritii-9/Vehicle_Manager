import express from "express";
import Renewal from "../models/Renewal.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const newRenewal = new Renewal(req.body);
        const savedRenewal = await newRenewal.save();
        res.status(201).json(savedRenewal);
    } catch (error) {
        console.error("Error adding renewal:", error.message);
        res.status(500).json({ message: "Error adding renewal", error: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const renewals = await Renewal.find();
        res.status(200).json(renewals);
    } catch (error) {
        console.error("Error fetching renewals:", error.message);
        res.status(500).json({ message: "Error retrieving renewals" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const updatedRenewal = await Renewal.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedRenewal);
    } catch (error) {
        console.error("Error updating renewal:", error.message);
        res.status(500).json({ message: "Error updating renewal" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Renewal.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Renewal deleted successfully" });
    } catch (error) {
        console.error("Error deleting renewal:", error.message);
        res.status(500).json({ message: "Error deleting renewal" });
    }
});

export default router;