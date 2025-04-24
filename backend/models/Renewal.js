import mongoose from "mongoose";

const RenewalSchema = new mongoose.Schema({
  vehiclenumber: {
    type: String,
    required: true,
  },
  renewalfor: {
    type: String,
    required: true,
  },
  Issuedate: {
    type: Date,
    required: true,
  },
  Expirydate: {
    type: Date,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
}, { timestamps: true }); // Added timestamps

export default mongoose.model("Renewal", RenewalSchema);