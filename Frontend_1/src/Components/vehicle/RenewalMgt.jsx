import React, { useState } from "react";
import axios from "axios";

const RenewalMgt = ({
  setShowAddVehicleForm,
  setShowRenewalForm,
  setShowRenewalVehicleList,
  setShowVehicleList
}) => {
  const [vehicleRenewal, setVehicleRenewal] = useState({
    vehiclenumber: "",
    renewalfor: "",
    Issuedate: "",
    Expirydate: "",
  });

  const handleRenewalInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleRenewal({ ...vehicleRenewal, [name]: value });
  };

  const handleRenewalVehicle = async () => {
    if (
      !vehicleRenewal.vehiclenumber ||
      !vehicleRenewal.renewalfor ||
      !vehicleRenewal.Issuedate ||
      !vehicleRenewal.Expirydate
    ) {
      alert("Please fill out all fields before adding the vehicle renewal.");
      return;
    }
    try {
      console.log("Data to be sent:", vehicleRenewal); // 1. Log data before sending
      const response = await axios.post(
        "http://localhost:5000/api/renewals", // Ensure this URL is correct
        vehicleRenewal
      );
      console.log("Response from server:", response); // 2. Log the *entire* response
      alert("Vehicle Renewal added successfully!");
      setVehicleRenewal({
        vehiclenumber: "",
        renewalfor: "",
        Issuedate: "",
        Expirydate: "",
      });
      setShowRenewalForm(true); // Hide form on success
      setShowRenewalVehicleList(false);
    } catch (error) {
      console.error("Error adding vehicle renewal:", error); // 3. Log the *entire* error
      if (error.response) {
        console.error("Server response data:", error.response.data); // 4. Log response data
        console.error("Server response status:", error.response.status); // 5. Log response status
        console.error("Server response headers:", error.response.headers); // 6. Log response headers
      } else if (error.request) {
        console.error("Request error:", error.request); // 7. Log request error
      } else {
        console.error("Error message:", error.message); // 8. Log error message
      }
      alert("Failed to add vehicle renewal.  See console for details.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Add Vehicle Renewal</h2>
        <button
          onClick={() => {
            setShowAddVehicleForm(false);
            setShowRenewalForm(false);
            setShowRenewalVehicleList(true);
            setShowVehicleList(false);
          }}
          className="bg-[#5046e4] text-white px-4 py-2 rounded hover:bg-blue transition"
        >
          Renewal List
        </button>
      </div>
      <form className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-4 rounded-lg shadow-lg">
        <div>
          <label className="block font-semibold mb-2 text-gray-600">
            Vehicle Number
          </label>
          <input
            type="text"
            name="vehiclenumber"
            value={vehicleRenewal.vehiclenumber}
            onChange={handleRenewalInputChange}
            placeholder="Vehicle Number"
            required
            className="border border-gray-300 rounded w-full p-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2 text-gray-600">
            Renewal For
          </label>
          <input
            type="text"
            name="renewalfor"
            value={vehicleRenewal.renewalfor}
            onChange={handleRenewalInputChange}
            placeholder="Renewal For"
            className="border border-gray-300 rounded w-full p-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2 text-gray-600">
            Issue Date
          </label>
          <input
            type="date"
            name="Issuedate"
            value={vehicleRenewal.Issuedate}
            onChange={handleRenewalInputChange}
            placeholder="Issue Date"
            required
            className="border border-gray-300 rounded w-full p-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2 text-gray-600">
            Expiry Date
          </label>
          <input
            type="date"
            name="Expirydate"
            value={vehicleRenewal.Expirydate}
            onChange={handleRenewalInputChange}
            placeholder="Expiry Date"
            required
            className="border border-gray-300 rounded w-full p-2"
          />
        </div>
        <button
          type="button"
          onClick={handleRenewalVehicle}
          className="mt-4 bg-[#5046e4] text-white px-6 py-2 rounded shadow-md hover:bg-blue"
        >
          Add Renewal
        </button>
      </form>
    </div>
  );
};

export default RenewalMgt;
