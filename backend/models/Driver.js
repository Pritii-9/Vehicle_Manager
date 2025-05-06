import { Schema, model } from 'mongoose';

const driverSchema = new Schema({
  DriverName: {
    type: String,
    required: true,
  },
  DriverAge: {
    type: Number,
    required: true,
    min: 18, // Example validation: Driver must be at least 18
  },
  DriverLicense: {
    type: String,
    required: true,
    unique: true, // Ensure each license is unique
  },
  Contact: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    index: true, // For efficient querying
  },
  // You can add more fields as needed, like createdAt, updatedAt, etc.
}, { timestamps: true });

const Driver = model('Driver', driverSchema);

export default Driver;