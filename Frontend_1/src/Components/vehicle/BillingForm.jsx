import React, { useState } from "react";
import axios from "axios";

const BillingForm = ({ setShowBillingList, onBillSubmit, onShowBillingListClick }) => { // Added onShowBillingListClick prop
  const [billInfo, setBillInfo] = useState({
    billNumber: "",
    vehicleNumber: "",
    quantity: "",
    rate: "",
    gst: "",
    date: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillInfo({ ...billInfo, [name]: value });
  };

  const handleAddBill = async () => {
    try {
      console.log("Billing data to be sent:", billInfo);
      const response = await axios.post(
        "http://localhost:5000/api/bills", // Replace with your actual API endpoint
        billInfo
      );
      console.log("Response from server:", response);
      alert("Bill added successfully!");
      // Call the callback function to send the rate to the parent
      if (onBillSubmit) {
        onBillSubmit(billInfo.rate);
      }
      setBillInfo({
        billNumber: "",
        vehicleNumber: "",
        quantity: "",
        rate: "",
        gst: "",
        date: "",
      });
      // Do NOT directly show the billing list here.
    } catch (error) {
      console.error("Error adding bill:", error);
      if (error.response) {
        console.error("Server response data:", error.response.data);
        console.error("Server response status:", error.response.status);
        console.error("Server response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Request error:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      alert("Failed to add bill. See console for details.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Add Bill</h2>
        <button
          onClick={onShowBillingListClick} // Call the new handler passed from App.jsx
          className="bg-[#5046e4] text-white px-4 py-2 rounded hover:bg-blue transition"
        >
          Bill List
        </button>
      </div>
      <form className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-4 rounded-lg shadow-lg">
        <div>
          <label className="block font-semibold mb-2 text-gray-600">
            Bill Number
          </label>
          <input
            type="text"
            name="billNumber"
            value={billInfo.billNumber}
            onChange={handleInputChange}
            placeholder="Bill Number"
            required
            className="border border-gray-300 rounded w-full p-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2 text-gray-600">
            Vehicle Number
          </label>
          <input
            type="text"
            name="vehicleNumber"
            value={billInfo.vehicleNumber}
            onChange={handleInputChange}
            placeholder="Vehicle Number"
            required
            className="border border-gray-300 rounded w-full p-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2 text-gray-600">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            value={billInfo.quantity}
            onChange={handleInputChange}
            placeholder="Quantity"
            required
            className="border border-gray-300 rounded w-full p-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2 text-gray-600">
            Rate
          </label>
          <input
            type="number"
            name="rate"
            value={billInfo.rate}
            onChange={handleInputChange}
            placeholder="Rate"
            required
            className="border border-gray-300 rounded w-full p-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2 text-gray-600">
            GST (Optional)
          </label>
          <input
            type="text"
            name="gst"
            value={billInfo.gst}
            onChange={handleInputChange}
            placeholder="GST (e.g., 18%)"
            className="border border-gray-300 rounded w-full p-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2 text-gray-600">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={billInfo.date}
            onChange={handleInputChange}
            placeholder="Date"
            required
            className="border border-gray-300 rounded w-full p-2"
          />
        </div>
        <button
          type="button"
          onClick={handleAddBill}
          className="mt-4 bg-[#5046e4] text-white px-6 py-2 rounded shadow-md hover:bg-blue"
        >
          Submit Bill
        </button>
      </form>
    </div>
  );
};

export default BillingForm;