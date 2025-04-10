import React, { useState, useEffect } from "react";
import axios from "axios";

const VehicleMgt = ({
  editVehicleId,
  vehicleTypes,
  setShowAddVehicleForm,
  setShowRenewalForm,
  setShowRenewalVehicleList,
  setShowVehicleList,
  setVehicles
}) => {
  const [vehicleInfo, setVehicleInfo] = useState({
    Vehiclenumber: "",
    OwnerName: "",
    VehicleName: "",
    VehicleType: "",
    capacity: "",
    FuelType: "",
    year: "",
    mileage: "",
  });

  useEffect(() => {
    if (editVehicleId) {
      const fetchVehicleForEdit = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/vehicles/${editVehicleId}`);
          setVehicleInfo(response.data);
        } catch (error) {
          console.error("Error fetching vehicle for edit:", error);
          alert("Failed to fetch vehicle data for editing.");
        }
      };
      fetchVehicleForEdit();
    } else {
      setVehicleInfo({
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleInfo({ ...vehicleInfo, [name]: value });
  };

  const handleAddVehicle = async () => {
    if (
      !vehicleInfo.Vehiclenumber ||
      !vehicleInfo.OwnerName ||
      !vehicleInfo.VehicleName ||
      !vehicleInfo.VehicleType ||
      !vehicleInfo.capacity ||
      !vehicleInfo.FuelType ||
      !vehicleInfo.year ||
      !vehicleInfo.mileage
    ) {
      alert("Please fill out all fields before adding the vehicle.");
      return;
    }

    try {
      console.log("Vehicle Info to Post:", vehicleInfo);
      const response = await axios.post(
        "http://localhost:5000/api/vehicles",
        vehicleInfo
      );
      console.log("Response from add vehicle:", response);
      setVehicles(prevVehicles => [...prevVehicles, response.data]);
      alert("Vehicle added successfully!");
      setVehicleInfo({
        Vehiclenumber: "",
        OwnerName: "",
        VehicleName: "",
        VehicleType: "",
        capacity: "",
        FuelType: "",
        year: "",
        mileage: "",
      });
      setShowAddVehicleForm(false);
      setShowVehicleList(true);
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
      console.log("Vehicle Info to Update:", vehicleInfo);
      const response = await axios.put(
        `http://localhost:5000/api/vehicles/${editVehicleId}`,
        vehicleInfo
      );
      console.log("Response from update vehicle:", response);
      setVehicles(prevVehicles =>
        prevVehicles.map((vehicle) =>
          vehicle._id === editVehicleId ? response.data : vehicle
        )
      );

      alert("Vehicle updated successfully!");
      setShowAddVehicleForm(false);
      setShowVehicleList(true);
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
            setShowVehicleList(true);
          }}
          className="bg-[#5046e4] text-white px-4 py-2 rounded hover:bg-blue transition"
        >
          Vehicle List
        </button>
      </div>
      <form className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-4 rounded-lg shadow-lg">
        <div>
          <label className="block font-semibold mb-2 text-gray-600">
            Vehicle Number
          </label>
          <input
            type="text"
            name="Vehiclenumber"
            value={vehicleInfo.Vehiclenumber}
            onChange={handleInputChange}
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
            value={vehicleInfo.OwnerName}
            onChange={handleInputChange}
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
            value={vehicleInfo.VehicleName}
            onChange={handleInputChange}
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
            value={vehicleInfo.VehicleType}
            onChange={handleInputChange}
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
            value={vehicleInfo.capacity}
            onChange={handleInputChange}
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
            value={vehicleInfo.FuelType}
            onChange={handleInputChange}
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
            value={vehicleInfo.year}
            onChange={handleInputChange}
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
            value={vehicleInfo.mileage}
            onChange={handleInputChange}
            placeholder="Enter Mileage in km"
            required
            className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        <button
          type="button"
          onClick={editVehicleId ? handleUpdateVehicle : handleAddVehicle}
          className="mt-4 bg-[#5046e4] text-white px-6 py-2 rounded shadow-md hover:bg-blue"
        >
          {editVehicleId ? "Update Vehicle" : "Add Vehicle"}
        </button>
      </form>
    </div>
  );
};

export default VehicleMgt;