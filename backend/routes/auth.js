import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Assuming you have a User model

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation (add more as needed)
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Signup successful!' });
    // Optionally generate and send a token upon signup
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Signup failed' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
      const { identifier, password } = req.body;
      console.log("Login request:", { identifier, password }); // *** Add this line ***
  
      const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] });
      if (!user) {
        console.log("User not found for identifier:", identifier); // *** Add this line ***
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log("Password incorrect for user:", identifier);  // *** Add this line ***
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT
      const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log("Login successful.  Token:", token); // *** Add this line ***
  
      res.status(200).json({ token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });

export default router;