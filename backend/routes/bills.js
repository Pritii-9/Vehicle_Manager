import express from 'express';
const router = express.Router();
import Bill from "../models/Bills.js"; 

// Route to get all bills
router.get('/', async (req, res) => {
  try {
    const bills = await Bill.find().sort({ date: -1 }); // Sort by date descending
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to get a specific bill by ID
router.get('/:id', async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.json(bill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/latest', async (req, res) => {
  try {
    const latestBill = await Bill.findOne().sort({ createdAt: -1 });
    res.json(latestBill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const bill = new Bill({
    billNumber: req.body.billNumber,
    vehicleNumber: req.body.vehicleNumber,
    quantity: req.body.quantity,
    rate: req.body.rate,
    gst: req.body.gst,
    date: req.body.date,
  });

  try {
    const newBill = await bill.save();
    res.status(201).json(newBill);
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.billNumber) {
      return res.status(400).json({ message: 'Bill number already exists.' });
    }
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    Object.assign(bill, req.body);
    bill.updatedAt = Date.now();
    const updatedBill = await bill.save();
    res.json(updatedBill);
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.billNumber) {
      return res.status(400).json({ message: 'Bill number already exists.' });
    }
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const bill = await Bill.findByIdAndDelete(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.json({ message: 'Bill deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;