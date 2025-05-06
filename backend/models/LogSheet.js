import mongoose from "mongoose";

const logSheetSchema = new mongoose.Schema({
  vehicleNumber: String,
  customerName: String,
  location: String,
  openingReading: Number,
  closingReading: Number,
  total: Number,
  driver: String,
  dieselQuantity: Number,
  dieselAmount: Number,
  remark: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    index: true,
  },
}, { timestamps: true }); // Added timestamps for createdAt and updatedAt

const LogSheet = mongoose.model("LogSheet", logSheetSchema);

export default LogSheet;