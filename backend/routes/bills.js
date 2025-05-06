import express from 'express';
const router = express.Router();
import Bill from "../models/Bills.js"; // Ensure this path is correct

// Route to get all bills
router.get('/', async (req, res) => {
  try {
    const bills = await Bill.find().sort({ date: -1 }); // Sort by date descending
    res.json(bills);
  } catch (err) {
    console.error("Error fetching all bills:", err); // Log error on server
    res.status(500).json({ message: 'Failed to retrieve bills.' });
  }
});


router.get('/latest', async (req, res) => {
  try {
    // Find the single most recent bill entry by sorting by date descending and limiting to 1
    const latestBill = await Bill.findOne().sort({ date: -1 });

    if (!latestBill) {
      // If no bills exist in the database at all
      return res.status(404).json({ message: 'No bills found in the database.' });
    }
    res.json(latestBill);

  } catch (err) {
    console.error("Error fetching latest bill:", err); 

    res.status(500).json({ message: 'Error retrieving the latest bill rate.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.json(bill);
  } catch (err) {
    
    if (err.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid Bill ID format.' });
    }
    console.error(`Error fetching bill with ID ${req.params.id}:`, err);
    res.status(500).json({ message: 'Error retrieving bill.' });
  }
});


router.post('/', async (req, res) => {

  const { billNumber, vehicleNumber, quantity, rate, gst, date } = req.body;
  if (!billNumber || !vehicleNumber || quantity == null || rate == null || gst == null || !date) {
      return res.status(400).json({ message: 'Missing required bill fields.' });
  }

  const bill = new Bill({
    billNumber,
    vehicleNumber,
    quantity,
    rate,
    gst,
    date, 
  });

  try {
    const newBill = await bill.save();
    res.status(201).json(newBill);
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.billNumber) {
      return res.status(400).json({ message: 'Bill number already exists.' });
    }
    console.error("Error creating bill:", err);
    res.status(400).json({ message: err.message || 'Failed to create bill.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    
    let bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    
    const updates = req.body;
    Object.keys(updates).forEach(key => {
        if (key !== '_id') { // Don't allow changing the ID
            bill[key] = updates[key];
        }
    });

    

    const updatedBill = await bill.save();
    res.json(updatedBill);

  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.billNumber) {
      return res.status(400).json({ message: 'Bill number already exists.' });
    }
     if (err.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid Bill ID format.' });
    }
    console.error(`Error updating bill ${req.params.id}:`, err);
    res.status(400).json({ message: err.message || 'Failed to update bill.' });
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
     if (err.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid Bill ID format.' });
    }
    console.error(`Error deleting bill ${req.params.id}:`, err);
    res.status(500).json({ message: 'Failed to delete bill.' });
  }
});

export default router;