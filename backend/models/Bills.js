import mongoose from 'mongoose';

const BillSchema = new mongoose.Schema({
  billNumber: {
    type: String,
    required: true,
    unique: true, 
  },
  vehicleNumber: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  gst: {
    type: String, 
    default: '',
  },
  date: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Bill = mongoose.model('Bill', BillSchema);

export default Bill;