/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Card from "../Card";

const VehicleMgt = ({
  editVehicleId,
  vehicleTypes,
  setShowAddVehicleForm,
  setShowRenewalForm,
  setShowRenewalVehicleList,
  setShowVehicleList,
  setVehicles,
  setVehicleInfo,
}) => {
  const [vehicleInfoLocal, setVehicleInfoLocal] = useState({
    Vehiclenumber: "",
    OwnerName: "",
    VehicleName: "",
    VehicleType: "",
    capacity: "",
    FuelType: "",
    year: "",
    mileage: "",
  });

  const fetchVehicles = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/vehicles");
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      alert("Failed to fetch vehicles.");
    }
  }, [setVehicles]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  useEffect(() => {
    if (editVehicleId) {
      const fetchVehicleForEdit = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/vehicles/${editVehicleId}`
          );
          setVehicleInfoLocal(response.data);
        } catch (error) {
          console.error("Error fetching vehicle for edit:", error);
          alert("Failed to fetch vehicle data for editing.");
        }
      };
      fetchVehicleForEdit();
    } else {
      setVehicleInfoLocal({
        Vehiclenumber: "",
        OwnerName: "",
        VehicleName: "",
        VehicleType: "",
        capacity: "",
        FuelType: "",
        year: "",
        mileage: "",
      });
    }
  }, [editVehicleId]);

  const handleVehicleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleInfoLocal({ ...vehicleInfoLocal, [name]: value });
  };

  const handleAddVehicle = async () => {
    if (
      !vehicleInfoLocal.Vehiclenumber ||
      !vehicleInfoLocal.OwnerName ||
      !vehicleInfoLocal.VehicleName ||
      !vehicleInfoLocal.VehicleType ||
      !vehicleInfoLocal.capacity ||
      !vehicleInfoLocal.FuelType ||
      !vehicleInfoLocal.year ||
      !vehicleInfoLocal.mileage
    ) {
      alert("Please fill out all Vehicle fields before adding the vehicle.");
      return;
    }

    try {
      console.log("Vehicle Info to Post:", vehicleInfoLocal);
      const response = await axios.post(
        "http://localhost:5000/api/vehicles",
        vehicleInfoLocal
      );
      console.log("Response from add vehicle:", response);
      setVehicles((prevVehicles) => [...prevVehicles, response.data]);
      alert("Vehicle added successfully!");
      setVehicleInfoLocal({
        Vehiclenumber: "",
        OwnerName: "",
        VehicleName: "",
        VehicleType: "",
        capacity: "",
        FuelType: "",
        year: "",
        mileage: "",
      });
      if (setVehicleInfo) {
        setVehicleInfo({});
      }
      fetchVehicles();
      // Do NOT setShowAddVehicleForm(false) or setShowVehicleList(true) here
    } catch (error) {
      console.error("Error adding vehicle:", error);
      if (error.response) {
        console.error("Server Response:", error.response.data);
        console.error("Status Code:", error.response.status);
      }
      alert("Failed to add vehicle. Check console for details.");
    }
  };

  const handleUpdateVehicle = async () => {
    if (!editVehicleId) return;

    try {
      console.log("Vehicle Info to Update:", vehicleInfoLocal);
      const response = await axios.put(
        `http://localhost:5000/api/vehicles/${editVehicleId}`,
        vehicleInfoLocal
      );
      console.log("Response from update vehicle:", response);
      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) =>
          vehicle._id === editVehicleId ? response.data : vehicle
        )
      );

      alert("Vehicle updated successfully!");
      // Do NOT setShowAddVehicleForm(false) or setShowVehicleList(true) here
      if (setVehicleInfo) {
        setVehicleInfo({});
      }
      fetchVehicles();
    } catch (error) {
      console.error("Error updating vehicle:", error);
      if (error.response) {
        console.error("Server Response:", error.response.data);
        console.error("Status Code:", error.response.status);
      }
      alert("Failed to update vehicle.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {editVehicleId ? "Edit Vehicle Information" : "Add Vehicle Information"}
        </h2>
        <button
          onClick={() => {
            setShowAddVehicleForm(false);
            setShowRenewalForm(false);
            setShowRenewalVehicleList(false);
            setShowVehicleList(true); // Call the function to update the state in App.jsx
          }}
          className="bg-[#5046e4] text-white px-3 py-1 rounded hover:bg-blue transition text-sm"
        >
          Vehicle List
        </button>
      </div>

      {/* Vehicle Form */}
      <form className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-4 rounded-lg shadow-lg mb-8">
        {/* Form Fields - Keep them as they are */}
        <div>
          <label className="block font-semibold mb-2 text-gray-600">
            Vehicle Number
          </label>
          <input
            type="text"
            name="Vehiclenumber"
            value={vehicleInfoLocal.Vehiclenumber}
            onChange={handleVehicleInputChange}
            placeholder="Vehicle Number"
            required
            className="border border-gray-300 rounded w-full p-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2 text-gray-600">
            Owner Name
          </label>
          <input
            type="text"
            name="OwnerName"
            value={vehicleInfoLocal.OwnerName}
            onChange={handleVehicleInputChange}
            placeholder="Owner Name"
            className="border border-gray-300 rounded w-full p-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2 text-gray-600">
            Vehicle Name
          </label>
          <input
            type="text"
            name="VehicleName"
            value={vehicleInfoLocal.VehicleName}
            onChange={handleVehicleInputChange}
            placeholder="Vehicle Name"
            className="border border-gray-300 rounded w-full p-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2 text-gray-600">
            Vehicle Type
          </label>
          <select
            name="VehicleType"
            value={vehicleInfoLocal.VehicleType}
            onChange={handleVehicleInputChange}
            required
            className="border border-gray-300 rounded w-full p-2"
          >
            <option value="">Select Vehicle Type</option>
            {vehicleTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-2 text-gray-600">
            Capacity
          </label>
          <input
            type="text"
            name="capacity"
            value={vehicleInfoLocal.capacity}
            onChange={handleVehicleInputChange}
            placeholder="Enter Capacity of Vehicle"
            className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2 text-gray-600">
            Fuel-Type
          </label>
          <select
            name="FuelType"
            value={vehicleInfoLocal.FuelType}
            onChange={handleVehicleInputChange}
            className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            <option value="">Select Fuel Type</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
            <option value="CNG">CNG</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-2 text-gray-600">
            Year
          </label>
          <input
            type="number"
            name="year"
            value={vehicleInfoLocal.year}
            onChange={handleVehicleInputChange}
            placeholder="Enter Manufacturing Year"
            required
            className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2 text-gray-600">
            Mileage
          </label>
          <input
            type="number"
            name="mileage"
            value={vehicleInfoLocal.mileage}
            onChange={handleVehicleInputChange}
            placeholder="Enter Mileage in km"
            required
            className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        <button
          type="button"
          onClick={editVehicleId ? handleUpdateVehicle : handleAddVehicle}
          className="mt-4 bg-[#5046e4] text-white px-4 py-2 rounded shadow-md hover:bg-blue text-sm"
        >
          {editVehicleId ? "Update Vehicle" : "Add Vehicle"}
        </button>
      </form>
    </div>
  );
};

export default VehicleMgt;