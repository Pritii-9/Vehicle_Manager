import express from 'express';
  // Import controllers
  import { getDailyActiveUsers, getRevenueSummary } from '../controllers/statsController.js';
  // Import middleware (needed for protected routes)
  import authenticateToken from '../middleware/authenticateToken.js'; // Adjust path if needed

  const router = express.Router();

  // Public route (as per previous workaround)
  router.get('/daily-active-users', getDailyActiveUsers);

  // --- NEW PROTECTED ROUTE for Revenue ---
  router.get('/revenue-summary', authenticateToken, getRevenueSummary); // <<< Protected

  // Add other stats routes here if needed

  export default router;