import mongoose from "mongoose";

const logSheetSchema = new mongoose.Schema({
  vehicleNumber: String,
  customerName: String,
  location: String,
  openingReading: Number,
  closingReading: Number,
  total: Number,
  driver: String,
  diselQuantity: Number,
  diselAmount: Number,
  remark: String,
});

const LogSheet = mongoose.model("LogSheet", logSheetSchema);

export default LogSheet;