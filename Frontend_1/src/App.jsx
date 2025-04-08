import React, { useState, useEffect } from "react";
import axios from "axios";
import MenuItem from "./Components/MenuItem";
import Card from "./Components/Card";
import VehicleMgt from "./Components/vehicle/VehicleMgt";
import RenewalMgt from "./Components/vehicle/RenewalMgt";

const App = () => {
  const [vehicles, setVehicles] = useState([]);
  const [showVehicleList, setShowVehicleList] = useState(false);
  const [showAddVehicleForm, setShowAddVehicleForm] = useState(false);
  const [editVehicleId, setEditVehicleId] = useState(null);

  const [renewalVehicles, setRenewalVehicles] = useState([]);
  const [showRenewalForm, setShowRenewalForm] = useState(false);
  const [showRenewalVehicleList, setShowRenewalVehicleList] = useState(false);

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
  const [vehicleRenewal, setVehicleRenewal] = useState({
    vehiclenumber: "",
    renewalfor: "",
    Issuedate: "",
    Expirydate: "",
  });

  const vehicleTypes = ["Car", "Truck", "Bike"];

  const fetchVehicles = async () => {
    try {
      console.log("Fetching vehicles from http://localhost:5000/api/vehicles");
      const response = await axios.get("http://localhost:5000/api/vehicles");
      console.log("Response from /api/vehicles:", response);
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      if (error.response) {
        console.error("Vehicle API Response Data:", error.response.data);
        console.error("Vehicle API Response Status:", error.response.status);
      }
      alert("Failed to fetch vehicles. Check the console for details.");
    }
  };

  const fetchRenewals = async () => {
    try {
      console.log("Fetching renewals from http://localhost:5000/api/renewals");
      const response = await axios.get("http://localhost:5000/api/renewals");
      console.log("Response from /api/renewals:", response);

      setRenewalVehicles(response.data);
    } catch (error) {
      console.error("Error fetching renewals:", error);
      if (error.response) {
        console.error("Renewal API Response Data:", error.response.data);
        console.error("Renewal API Response Status:", error.response.status);
      }
      alert("Failed to fetch renewals. Check the console for details.");
    }
  };

  useEffect(() => {
    fetchVehicles();
    fetchRenewals();
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
      console.log("Vehicle Info to Post:", vehicleInfo);
      const response = await axios.post(
        "http://localhost:5000/api/vehicles",
        vehicleInfo
      );
      console.log("Response from add vehicle:", response);
      setVehicles([...vehicles, response.data]);
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
      setShowAddVehicleForm(false); // Hide form after successful submission
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
      setVehicles(
        vehicles.map((vehicle) =>
          vehicle._id === editVehicleId ? response.data : vehicle
        )
      );

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
      setShowAddVehicleForm(false); // Hide form
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

  const handleDeleteVehicle = async (id) => {
    try {
      console.log("Deleting vehicle with ID:", id);
      await axios.delete(`http://localhost:5000/api/vehicles/${id}`);
      setVehicles(vehicles.filter((vehicle) => vehicle._id !== id));
      alert("Vehicle deleted successfully!");
      setShowVehicleList(true);
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      if (error.response) {
        console.error("Server Response:", error.response.data);
        console.error("Status Code:", error.response.status);
      }
      alert("Failed to delete vehicle.");
    }
  };

  const handleEditVehicle = (vehicle) => {
    setEditVehicleId(vehicle._id);
    setVehicleInfo(vehicle);
    setShowAddVehicleForm(true);
    setShowVehicleList(false);
    setShowRenewalForm(false);
    setShowRenewalVehicleList(false);
  };

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
      console.log("Renewal Info to Post:", vehicleRenewal);
      const response = await axios.post(
        "http://localhost:5000/api/renewals",
        vehicleRenewal
      );
      console.log("Response from add renewal:", response);
      setRenewalVehicles([...renewalVehicles, response.data]);
      alert("Vehicle Renewal added successfully!");
      setVehicleRenewal({
        vehiclenumber: "",
        renewalfor: "",
        Issuedate: "",
        Expirydate: "",
      });
      setShowRenewalForm(false);
      setShowRenewalVehicleList(true);
    } catch (error) {
      console.error("Error adding vehicle renewal:", error);
      if (error.response) {
        console.error("Server Response:", error.response.data);
        console.error("Status Code:", error.response.status);
      }
      alert("Failed to add vehicle renewal.");
    }
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
              setShowRenewalForm(false);
              setShowRenewalVehicleList(false);
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
        
          <MenuItem
            label="Add Renewal"
            onClick={() => {
              setShowAddVehicleForm(false);
              setShowVehicleList(false);
              setShowRenewalForm(true);
              setShowRenewalVehicleList(false);
              setEditVehicleId(null);
              setVehicleRenewal({
                vehiclenumber: "",
                renewalfor: "",
                Issuedate: "",
                Expirydate: "",
              });
            }}
          />
         
        </ul>
      </aside>

      <main className="flex-1 bg-gray-100">
        <header className="bg-TealBlue text-white p-6 shadow-md flex items-center justify-between relative">
          <h1 className="text-2xl font-bold">Vehicle Manager</h1>
        </header>

        {showAddVehicleForm && (
          <VehicleMgt
            vehicleInfo={vehicleInfo}
            handleInputChange={handleInputChange}
            editVehicleId={editVehicleId}
            handleAddVehicle={handleAddVehicle}
            handleUpdateVehicle={handleUpdateVehicle}
            vehicleTypes={vehicleTypes}
            setShowAddVehicleForm={setShowAddVehicleForm}
            setShowRenewalForm={setShowRenewalForm}
            setShowRenewalVehicleList={setShowRenewalVehicleList}
            setShowVehicleList={setShowVehicleList}
            setShowVehicles={setVehicles}
            setShowRenewalVehicles={setRenewalVehicles}
          />
        )}

        {showVehicleList && (
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                All Vehicles
              </h2>
            </div>
            {vehicles.length > 0 ? ( //check for empty vehicles array
              <Card
                vehicles={vehicles}
                handleEditVehicle={handleEditVehicle}
                handleDeleteVehicle={handleDeleteVehicle}
              />
            ) : (
              <p>No vehicles available.</p>
            )}
          </div>
        )}

        {showRenewalForm && (
          <RenewalMgt
            vehicleRenewal={vehicleRenewal}
            handleRenewalInputChange={handleRenewalInputChange}
            handleRenewalVehicle={handleRenewalVehicle}
            setShowAddVehicleForm={setShowAddVehicleForm}
            setShowRenewalForm={setShowRenewalForm}
            setShowRenewalVehicleList={setShowRenewalVehicleList}
            setShowVehicleList={setShowVehicleList}
            setShowVehicles={setVehicles}
            setShowRenewalVehicles={setRenewalVehicles}
          />
        )}

        {showRenewalVehicleList && (
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                All Vehicle Renewals
              </h2>
            </div>
            {renewalVehicles.length > 0 ? ( // Check for empty array
              <Card renewalVehicles={renewalVehicles} />
            ) : (
              <p>No vehicle renewals available.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

