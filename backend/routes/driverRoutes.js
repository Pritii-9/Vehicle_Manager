import express from 'express';
const router = express.Router();
import Driver from '../models/Driver.js'; // Assuming your model file is named driver.js

// GET all drivers
router.get('/', async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific driver by ID
router.get('/:id', async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new driver
router.post('/', async (req, res) => {
  const driver = new Driver({
    DriverName: req.body.DriverName,
    DriverAge: req.body.DriverAge,
    DriverLicense: req.body.DriverLicense,
    Contact: req.body.Contact,
  });

  try {
    const newDriver = await driver.save();
    res.status(201).json(newDriver);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (update) an existing driver by ID
router.put('/:id', async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    driver.DriverName = req.body.DriverName || driver.DriverName;
    driver.DriverAge = req.body.DriverAge || driver.DriverAge;
    driver.DriverLicense = req.body.DriverLicense || driver.DriverLicense;
    driver.Contact = req.body.Contact || driver.Contact;

    const updatedDriver = await driver.save();
    res.json(updatedDriver);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a driver by ID
router.delete('/:id', async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.json({ message: 'Driver deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;