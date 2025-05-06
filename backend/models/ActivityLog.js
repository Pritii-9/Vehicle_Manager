// models/ActivityLog.js
import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Make sure 'User' matches your User model name
        required: true,
        index: true // Index for faster querying by user
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true // Index for faster querying by date
    }
    // You could add more fields later if needed
});

// Create index for compound queries if needed, e.g., by userId and timestamp
// activityLogSchema.index({ userId: 1, timestamp: -1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;