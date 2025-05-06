import express from "express";
import Vehicle from "../models/Vehicle.js";

const router = express.Router();

// Route to get the total number of vehicles
router.get('/count', async (req, res) => {
  try {
    const count = await Vehicle.countDocuments();
    res.status(200).json({ count }); // Return the count in a JSON object
  } catch (error) {
    console.error("Error counting vehicles:", error.message);
    res.status(500).json({ message: "Error counting vehicles", error: error.message });
  }
});

//ye create krta he
router.post("/", async (req, res) => { 

try { console.log("Request body received:", req.body); 
 const newVehicle = new Vehicle(req.body);
const savedVehicle = await newVehicle.save();
res.status(201).json(savedVehicle);
} catch (error) {
 console.error("Error saving vehicle:", error.message);
 res.status(500).json({ message: "Error adding vehicle", error: error.message });
 }
});

//retreive purpose
router.get("/", async (req, res) => {
 try {
 const vehicles = await Vehicle.find();
 res.status(200).json(vehicles);
 } catch (error) {
 console.error("Error fetching vehicles:", error.message);
 res.status(500).json({ message: "Error retrieving vehicles" });
}
});

//updates  by id
router.put("/:id", async (req, res) => {
 try {
 const updatedVehicle = await Vehicle.findByIdAndUpdate(
 req.params.id,
req.body,
 { new: true }
 );
 res.status(200).json(updatedVehicle);
 } catch (error) {
 console.error("Error updating vehicle:", error.message);
 res.status(500).json({ message: "Error updating vehicle" });
 }
});


router.delete("/:id", async (req, res) => {
try {
 await Vehicle.findByIdAndDelete(req.params.id);
 res.status(200).json({ message: "Vehicle deleted successfully" });
 } catch (error) {
 console.error("Error deleting vehicle:", error.message);
 res.status(500).json({ message: "Error deleting vehicle" });
}
});

export default router;
