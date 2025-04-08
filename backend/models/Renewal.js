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
});

export default mongoose.model("Renewal", RenewalSchema);