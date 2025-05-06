// controllers/statsController.js

// --- Imports ---
// Make sure paths are correct relative to your 'controllers' folder
import ActivityLog from '../models/ActivityLog.js';
import Bill from '../models/Bills.js';        // Needed for Revenue Summary
import LogSheet from '../models/LogSheet.js';    // Needed for Revenue Summary (Diesel Cost)
// Import other models if needed for revenue calculation

// --- Controller Function for Daily Active Users ---
export const getDailyActiveUsers = async (req, res) => {
    try {
        // Get the start and end of the current day (in the server's timezone)
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Midnight today
        startOfDay.setHours(0, 0, 0, 0); // Ensure it's exactly midnight start
        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(startOfDay.getDate() + 1); // Midnight tomorrow

        // Find activity logs within the current day
        // Ensure 'timestamp' field exists in ActivityLog model
        const todaysLogs = await ActivityLog.find({
            timestamp: {
                $gte: startOfDay, // Greater than or equal to start of today
                $lt: endOfDay      // Less than start of tomorrow
            }
        });

        // Get the unique user IDs from today's logs
        // Ensure 'userId' field exists in ActivityLog model
        const distinctUserIds = [...new Set(todaysLogs.map(log => log.userId?.toString()))];
                                // Using Set to get unique values, converting userId to string

        // Filter out any potential null/undefined userIds if necessary
        const validUserIds = distinctUserIds.filter(id => id);

        // The count is the number of unique user IDs found
        const count = validUserIds.length;

        console.log(`Daily active users count: ${count} (from ${todaysLogs.length} logs today)`); // Optional logging

        res.status(200).json({ count });

    } catch (error) {
        console.error("Error fetching daily active users:", error);
        res.status(500).json({ message: "Failed to fetch daily active user count", error: error.message });
    }
};

// --- Controller Function for Revenue Summary (Current Month: Income - Diesel) ---
export const getRevenueSummary = async (req, res) => {
    try {
        // Define the time period (current calendar month)
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of current month
        endOfMonth.setHours(23, 59, 59, 999); // End of the last day

        console.log(`RevenueSummary: Calculating for period ${startOfMonth.toISOString()} to ${endOfMonth.toISOString()}`);

        // --- Calculate Total Income (from Bills) ---
        // *** Adjust model name 'Bill' and field names 'date', 'totalAmount' if yours are different ***
        const billsInPeriod = await Bill.find({
            date: {
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        });
        const totalIncome = billsInPeriod.reduce((sum, bill) => {
            const amount = parseFloat(bill.totalAmount || 0); // Ensure totalAmount is treated as number
            return sum + (isNaN(amount) ? 0 : amount);
        }, 0);
        console.log(`RevenueSummary: Total Income = ${totalIncome}`);

        // --- Calculate Total Diesel Expenses (from LogSheets) ---
        // *** Adjust model name 'LogSheet' and field names 'date', 'DieselAmount' if yours are different ***
        const logSheetsInPeriod = await LogSheet.find({
            date: {
                 $gte: startOfMonth,
                 $lte: endOfMonth
             }
        });
        const totalDieselCost = logSheetsInPeriod.reduce((sum, log) => {
            const amount = parseFloat(log.DieselAmount || 0); // Ensure DieselAmount is treated as number
            return sum + (isNaN(amount) ? 0 : amount);
        }, 0);
         console.log(`RevenueSummary: Total Diesel Cost = ${totalDieselCost}`);

        // --- Calculate Net Revenue ---
        const estimatedRevenue = totalIncome - totalDieselCost;
        console.log(`RevenueSummary: Net Estimated Revenue = ${estimatedRevenue}`);

        // Send result formatted to 2 decimal places
        res.status(200).json({ estimatedRevenue: estimatedRevenue.toFixed(2) });

    } catch (error) {
        console.error("Error calculating revenue summary:", error);
        res.status(500).json({ message: "Failed to calculate revenue summary", error: error.message });
    }
};

