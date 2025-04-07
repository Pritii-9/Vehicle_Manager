import mongoose from "mongoose";

const VehicleSchema = new mongoose.Schema({
  Vehiclenumber: {
    type: String,
    required: true,
  },
  OwnerName: {
    type: String,
    required: true,
  },
  VehicleName: {
    type: String,
    required: true,
  },
  VehicleType: {
    type: String,
    required: true,
  },
  capacity: {
    type: String,
    required: true,
  },
  FuelType: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  mileage: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("Vehicle", VehicleSchema);