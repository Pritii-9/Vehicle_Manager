/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Card from "../Card";
import DriverSection from "../sections/DriverSection"; // Assuming DriverSection is in the same directory

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
  setShowDriverList: setAppShowDriverListFromProps, // Renamed to avoid confusion
  setDrivers,
  setDriverInfo,
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
  const [showLocalDriverForm, setShowLocalDriverForm] = useState(false);
  const [showLocalDriverList, setShowLocalDriverList] = useState(false);
  const [localDrivers, setLocalDrivers] = useState([]);
  const [localDriverInfo, setLocalDriverInfo] = useState({
    DriverName: "",
    DriverAge: "",
    DriverLicense: "",
    Contact: "",
    _id: null,
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

  const fetchDrivers = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/drivers");
      setLocalDrivers(response.data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      alert("Failed to fetch drivers.");
    }
  }, [setLocalDrivers]);

  useEffect(() => {
    fetchVehicles();
    fetchDrivers();
  }, [fetchVehicles, fetchDrivers]);

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

  const handleShowDriverForm = () => {
    setShowLocalDriverForm(true);
    setShowLocalDriverList(false);
    setLocalDriverInfo({
      DriverName: "",
      DriverAge: "",
      DriverLicense: "",
      Contact: "",
      _id: null,
    });
  };

  const handleShowEditDriverForm = (driver) => {
    setShowLocalDriverForm(true);
    setLocalDrivers(false);
    setLocalDriverInfo(driver);
  };

  const handleShowDriverList = () => {
    setShowLocalDriverList(true);
    setShowLocalDriverForm(false);
  };

  const handleAddDriver = async (driverData) => {
    try {
      const response = await axios.post("http://localhost:5000/api/drivers", driverData);
      setLocalDrivers((prevDrivers) => [...prevDrivers, response.data]);
      alert("Driver added successfully!");
      setShowLocalDriverForm(false);
      fetchDrivers();
    } catch (error) {
      console.error("Error adding driver:", error);
      alert("Failed to add driver.");
    }
  };

  const handleUpdateDriver = async (id, driverData) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/drivers/${id}`, driverData);
      setLocalDrivers((prevDrivers) =>
        prevDrivers.map((driver) => (driver._id === id ? response.data : driver))
      );
      alert("Driver updated successfully!");
      setShowLocalDriverForm(false);
      fetchDrivers();
    } catch (error) {
      console.error("Error updating driver:", error);
      alert("Failed to update driver.");
    }
  };

  const handleSaveDriver = (driverData) => {
    if (driverData._id) {
      handleUpdateDriver(driverData._id, driverData);
    } else {
      handleAddDriver(driverData);
    }
  };

  const handleDeleteDriver = async (id) => {
    if (window.confirm("Are you sure you want to delete this driver?")) {
      try {
        await axios.delete(`http://localhost:5000/api/drivers/${id}`);
        setLocalDrivers((prevDrivers) => prevDrivers.filter((driver) => driver._id !== id));
        alert("Driver deleted successfully!");
        fetchDrivers();
      } catch (error) {
        console.error("Error deleting driver:", error);
        alert("Failed to delete driver.");
      }
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
            setShowLocalDriverForm(false);
            setShowLocalDriverList(false);
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

      {/* Driver Section */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Manage Drivers</h2>
        <div className="flex gap-4 mb-4">
          <button
            onClick={handleShowDriverForm}
            className="bg-[#5046e4] text-white px-4 py-2 rounded shadow-md hover:bg-blue text-sm"
          >
            Add Driver
          </button>
          <button
            onClick={handleShowDriverList}
            className="bg-[#5046e4] text-white px-4 py-2 rounded shadow-md hover:bg-blue text-sm"
          >
            Driver List
          </button>
        </div>

        <DriverSection
          showDriverForm={showLocalDriverForm}
          showDriverList={showLocalDriverList}
          setShowDriverForm={setShowLocalDriverForm}
          setShowDriverList={setShowLocalDriverList}
          drivers={localDrivers}
          setDrivers={setLocalDrivers}
          driverInfo={localDriverInfo}
          setDriverInfo={setLocalDriverInfo}
          handleSaveDriver={handleSaveDriver}
          handleEditDriver={handleShowEditDriverForm}
          handleDeleteDriver={handleDeleteDriver}
        />
      </div>
    </div>
  );
};

export default VehicleMgt;