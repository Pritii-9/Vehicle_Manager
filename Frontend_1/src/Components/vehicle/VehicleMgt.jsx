import React, { useState, useEffect } from "react";
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
  setShowDriverForm,
  setShowDriverList,
  setDrivers,
  setDriverInfo,
  fetchVehicles,
  fetchDrivers
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
  const [driverInfoLocal, setDriverInfoLocal] = useState({
    DriverName: "",
    DriverAge: "",
    DriverLicense: "",
    Contact: "",
  });
  const [showDriverTable, setShowDriverTable] = useState(false); // State to control driver table visibility

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

  const handleDriverInputChange = (e) => {
    const { name, value } = e.target;
    setDriverInfoLocal({ ...driverInfoLocal, [name]: value });
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
      setShowAddVehicleForm(false);
      setShowVehicleList(true);
      if (setVehicleInfo) {
        setVehicleInfo({});
      }
      fetchVehicles();
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
      setShowAddVehicleForm(false);
      setShowVehicleList(true);
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

  const handleAddDriver = async () => {
    if (
      !driverInfoLocal.DriverName ||
      !driverInfoLocal.DriverAge ||
      !driverInfoLocal.DriverLicense ||
      !driverInfoLocal.Contact
    ) {
      alert("Please fill out all Driver fields before adding.");
      return;
    }

    try {
      console.log("Driver Info to Post:", driverInfoLocal);
      const response = await axios.post("http://localhost:5000/api/drivers", driverInfoLocal);

      alert("Driver added successfully!");
      setDriverInfoLocal({
        DriverName: "",
        DriverAge: "",
        DriverLicense: "",
        Contact: "",
      });
      setShowDriverForm(false);
      setShowDriverList(true);
      setShowDriverTable(false); // Hide the driver table after adding
      if (setDriverInfo) {
        setDriverInfo({});
      }
      fetchDrivers();
    } catch (error) {
      console.error("Error adding driver:", error);
      if (error.response) {
        console.error("Server Response:", error.response.data);
        console.error("Status Code:", error.response.status);
      }
      alert("Failed to add driver. Check console for details.");
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
            setShowDriverForm(false);
            setShowDriverList(false);
            setShowDriverTable(false); // Hide driver table
          }}
          className="bg-[#5046e4] text-white px-3 py-1 rounded hover:bg-blue transition text-sm"
        >
          Vehicle List
        </button>
      </div>

      {/* Vehicle Form */}
      <form className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-4 rounded-lg shadow-lg mb-8">
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

      {/* Driver Details Form */}
      <div className="bg-white p-6 rounded-lg shadow-lg mt-8 relative">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Driver Details</h2>
        <button
          onClick={() => {
            setShowDriverList(true);
            setShowAddVehicleForm(false);
            setShowDriverTable(true); // Show driver table
          }}
          className="absolute top-4 right-4 bg-[#5046e4] text-white px-3 py-1 rounded hover:bg-blue transition text-sm"
        >
          Driver List
        </button>
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-2 text-gray-600">
              Driver Name
            </label>
            <input
              type="text"
              name="DriverName"
              value={driverInfoLocal.DriverName}
              onChange={handleDriverInputChange}
              placeholder="Driver Name"
              required
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2 text-gray-600">
              Driver Age
            </label>
            <input
              type="number"
              name="DriverAge"
              value={driverInfoLocal.DriverAge}
              onChange={handleDriverInputChange}
              placeholder="Driver Age"
              required
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2 text-gray-600">
              Driver License
            </label>
            <input
              type="text"
              name="DriverLicense"
              value={driverInfoLocal.DriverLicense}
              onChange={handleDriverInputChange}
              placeholder="Driver License"
              required
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2 text-gray-600">
              Contact
            </label>
            <input
              type="text"
              name="Contact"
              value={driverInfoLocal.Contact}
              onChange={handleDriverInputChange}
              placeholder="Contact Number"
              required
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          <button
            type="button"
            onClick={handleAddDriver}
            className="mt-4 bg-[#5046e4] text-white px-4 py-2 rounded shadow-md hover:bg-blue  text-sm"
          >
            Add Driver
          </button>
        </form>
      </div>
      {showDriverTable && (
        <Card data={[]} type="driver" />
      )}
    </div>
  );
};

export default VehicleMgt;
