/* eslint-disable no-undef */
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import vehicleRoutes from "./routes/vehicleRoutes.js";
import renewalRoutes from "./routes/renewalRoutes.js";
import logSheetRoutes from "./routes/logSheetRoutes.js"; 
import billsRoutes from "./routes/bills.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/vehicles", vehicleRoutes);
app.use("/api/renewals", renewalRoutes); 
app.use("/api/logsheet", logSheetRoutes); 
app.use('/api/bills', billsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

