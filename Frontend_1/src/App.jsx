import React, { useState, useEffect } from "react";
import axios from "axios";
import MenuItem from "./Components/MenuItem";
import Card from "./Components/Card";

const App = () => {
  const [vehicles, setVehicles] = useState([]); // this Fun store all vehicles from the backend
  const [showVehicleList, setShowVehicleList] = useState(false); // shows the data of vehciles
  const [showAddVehicleForm, setShowAddVehicleForm] = useState(false); // Add Vehicle form

  const [editVehicleId, setEditVehicleId] = useState(null); // Stores the ID of the vehicle being edited

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

  const vehicleTypes = ["Car", "Truck", "Bike"];

  const fetchVehicles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/vehicles");
      setVehicles(response.data); // Fetch and store vehicles
    } catch (error) {
      console.error("Error fetching vehicles:", error.message);
    }
  };

  useEffect(() => {
    fetchVehicles(); // Fetch vehicles on component mount
  }, []);

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
      const response = await axios.post(
        "http://localhost:5000/api/vehicles",
        vehicleInfo
      );
      setVehicles([...vehicles, response.data]); // Update the vehicles list
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
    } catch (error) {
      console.error("Error adding vehicle:", error.message);
      alert("Failed to add vehicle.");
    }
  };

  const handleUpdateVehicle = async () => {
    if (!editVehicleId) return;

    try {
      const response = await axios.put(
        `http://localhost:5000/api/vehicles/${editVehicleId}`,
        vehicleInfo
      );
      setVehicles(
        vehicles.map((vehicle) =>
          vehicle._id === editVehicleId ? response.data : vehicle
        )
      );

      // this is for Updated the vehicle in the list
      alert("Vehicle updated successfully!");
      setEditVehicleId(null);
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
    } catch (error) {
      console.error("Error updating vehicle:", error.message);
      alert("Failed to update vehicle.");
    }
  };

  const handleDeleteVehicle = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/vehicles/${id}`);
      setVehicles(vehicles.filter((vehicle) => vehicle._id !== id)); // Remove the deleted vehicle from the list
      alert("Vehicle deleted successfully!");
    } catch (error) {
      console.error("Error deleting vehicle:", error.message);
      alert("Failed to delete vehicle.");
    }
  };

  const handleEditVehicle = (vehicle) => {
    setEditVehicleId(vehicle._id);
    setVehicleInfo(vehicle); // existing data
    setShowAddVehicleForm(true);
    setShowVehicleList(false);
  };

  return (
    <div className="flex h-screen">
      <aside className="w-1/4 bg-white text-black-800 p-4 h-screen flex-shrink-0">
        <h2 className="text-lg font-bold">Home</h2>
        <ul className="mt-4 text-font-semibold">
          <MenuItem
           
            label="Add Vehicle"
            onClick={() => {
              setShowAddVehicleForm(true);
              setShowVehicleList(false);
              setEditVehicleId(null);
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
            }}
          />
        </ul>
      </aside>

      <main className="flex-1 bg-">
        <header className="bg-skyBlue text-white p-6 shadow-md flex items-center justify-between relative">
          <h1 className="text-2xl font-bold">Vehicle Manager</h1>
        </header>

        {showAddVehicleForm && (
          <div className="p-6">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {editVehicleId
                  ? "Edit Vehicle Information"
                  : "Add Vehicle Information"}
              </h2>
              <button
                onClick={() => {
                  setShowAddVehicleForm(false);
                  setShowVehicleList(true);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue transition"
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
                className="mt-4 bg-blue text-white px-6 py-2 rounded shadow-md hover:bg-blue"
              >
                {editVehicleId ? "Update Vehicle" : "Add Vehicle"}
              </button>
            </form>
          </div>
        )}

        {showVehicleList && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              All Vehicles
            </h2>
            <Card
              vehicles={vehicles}
              handleEditVehicle={handleEditVehicle}
              handleDeleteVehicle={handleDeleteVehicle}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
