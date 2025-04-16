/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";

const BillingForm = ({ setShowBillingList, onBillSubmit, onShowBillingListClick }) => {
  const [billInfo, setBillInfo] = useState({
    billNumber: "",
    vehicleNumber: "",
    quantity: "",
    rate: "",
    gst: "",
    date: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillInfo({ ...billInfo, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const validateForm = () => {
    let errors = {};
    if (!billInfo.billNumber.trim()) {
      errors.billNumber = "Bill Number is required";
    }
    if (!billInfo.vehicleNumber.trim()) {
      errors.vehicleNumber = "Vehicle Number is required";
    }
    if (!billInfo.quantity) {
      errors.quantity = "Quantity is required";
    } else if (isNaN(Number(billInfo.quantity)) || Number(billInfo.quantity) <= 0) {
      errors.quantity = "Quantity must be a positive number";
    }
    if (!billInfo.rate) {
      errors.rate = "Rate is required";
    } else if (isNaN(Number(billInfo.rate)) || Number(billInfo.rate) <= 0) {
      errors.rate = "Rate must be a positive number";
    }
    if (billInfo.gst && !/^\d+(\.\d+)?%?$/.test(billInfo.gst.trim())) {
      errors.gst = "Invalid GST format (e.g., 18 or 18%)";
    }
    if (!billInfo.date) {
      errors.date = "Date is required";
    }
    return errors;
  };

  const handleAddBill = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      console.log("Billing data to be sent:", billInfo);
      const response = await axios.post(
        "http://localhost:5000/api/bills",
        {
          ...billInfo,
          gst: billInfo.gst.endsWith('%') ? parseFloat(billInfo.gst.slice(0, -1)) : parseFloat(billInfo.gst) || 0,
        }
      );
      console.log("Response from server:", response);
      alert("Bill added successfully!");
      if (onBillSubmit) {
        onBillSubmit(response.data);
      }
      setBillInfo({
        billNumber: "",
        vehicleNumber: "",
        quantity: "",
        rate: "",
        gst: "",
        date: "",
      });
      setFormErrors({});
      // After successfully adding a bill, navigate to the bill list
      if (onShowBillingListClick) {
        onShowBillingListClick();
      }
    } catch (error) {
      console.error("Error adding bill:", error);
      let errorMessage = "Failed to add bill. See console for details.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message; // Use server-provided error message
      }
      alert(errorMessage);
      if (error.response) {
        console.error("Server response data:", error.response.data);
        console.error("Server response status:", error.response.status);
        console.error("Server response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Request error:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Add Bill</h2>
        <button
          onClick={onShowBillingListClick}
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
            className={`border ${formErrors.billNumber ? 'border-red-500' : 'border-gray-300'} rounded w-full p-2`}
          />
          {formErrors.billNumber && <p className="text-red-500 text-sm mt-1">{formErrors.billNumber}</p>}
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
            className={`border ${formErrors.vehicleNumber ? 'border-red-500' : 'border-gray-300'} rounded w-full p-2`}
          />
          {formErrors.vehicleNumber && <p className="text-red-500 text-sm mt-1">{formErrors.vehicleNumber}</p>}
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
            className={`border ${formErrors.quantity ? 'border-red-500' : 'border-gray-300'} rounded w-full p-2`}
          />
          {formErrors.quantity && <p className="text-red-500 text-sm mt-1">{formErrors.quantity}</p>}
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
            className={`border ${formErrors.rate ? 'border-red-500' : 'border-gray-300'} rounded w-full p-2`}
          />
          {formErrors.rate && <p className="text-red-500 text-sm mt-1">{formErrors.rate}</p>}
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
            placeholder="GST (e.g., 18 or 18%)"
            className={`border ${formErrors.gst ? 'border-red-500' : 'border-gray-300'} rounded w-full p-2`}
          />
          {formErrors.gst && <p className="text-red-500 text-sm mt-1">{formErrors.gst}</p>}
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
            className={`border ${formErrors.date ? 'border-red-500' : 'border-gray-300'} rounded w-full p-2`}
          />
          {formErrors.date && <p className="text-red-500 text-sm mt-1">{formErrors.date}</p>}
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