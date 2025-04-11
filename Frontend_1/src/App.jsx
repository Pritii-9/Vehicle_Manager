import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "./Components/Card";
import VehicleMgt from "./Components/vehicle/VehicleMgt";
import RenewalMgt from "./Components/vehicle/RenewalMgt";
import LogSheets from "./Components/vehicle/logSheets";
import Sidebar from "./Components/Sidebar";
import Home from "./Components/pages/Home";

const App = () => {
  const [vehicles, setVehicles] = useState([]);
  const [showVehicleList, setShowVehicleList] = useState(false);
  const [showAddVehicleForm, setShowAddVehicleForm] = useState(false);
  const [editVehicleId, setEditVehicleId] = useState(null);

  const [renewalVehicles, setRenewalVehicles] = useState([]);
  const [showRenewalForm, setShowRenewalForm] = useState(false);
  const [showRenewalVehicleList, setShowRenewalVehicleList] = useState(false);

  const [showLogSheetForm, setShowLogSheetForm] = useState(false);
  const [showLogSheetList, setShowLogSheetList] = useState(false);
  const [editLogSheetId, setEditLogSheetId] = useState(null);
  const [logSheets, setLogSheets] = useState([]);
  const [showHome, setShowHome] = useState(true); 

  const [logSheetInfo, setLogSheetInfo] = useState({
    // Define the fields for your log sheet form here
    vehicleNumber: "",
    date: "",
    driverName: "",
    startMileage: "",
    endMileage: "",
    // ... other log sheet fields
  });

  useEffect(() => {
    fetchVehicles();
    fetchRenewals();
    fetchLogSheets();
  }, []);

  const fetchLogSheets = async () => {
    try {
      const response = await axios.get("http://localhost:5000/logsheet");
      setLogSheets(response.data);
    } catch (error) {
      console.error("Error fetching log sheets:", error);
     // alert("Failed to fetch log sheets.");
    }
  };

  const handleLogSheetInputChange = (e) => {
    const { name, value } = e.target;
    setLogSheetInfo({ ...logSheetInfo, [name]: value });
  };

  const handleAddLogSheet = async () => {
    try {
      const response = await axios.post("http://localhost:5000/logsheet", logSheetInfo);
      setLogSheets([...logSheets, response.data]);
      setLogSheetInfo({
        vehicleNumber: "",
        CustomerName: "",
        Location: "",
        OpeningReading: "",
        ClosingReading: "",
        Total: "",
        Driver: "",
        DieselQuantity: "",
        DieselAmount: "",
        Remark: "",
      });
      setShowLogSheetForm(false);
      setShowLogSheetList(true);
      alert("Log sheet added successfully!");
    } catch (error) {
     console.error("Error adding log sheet:", error);
     alert("Failed to add log sheet.");
    }
  };

  const handleUpdateLogSheet = async () => {
    if (!editLogSheetId) return;
    try {
      const response = await axios.put(
        `http://localhost:5000/logsheet/${editLogSheetId}`,
        logSheetInfo
      );
      setLogSheets(
        logSheets.map((ls) => (ls._id === editLogSheetId ? response.data : ls))
      );
      setEditLogSheetId(null);
      setLogSheetInfo({
        vehicleNumber: "",
        
      });
      setShowLogSheetForm(false);
      setShowLogSheetList(true);
      alert("Log sheet updated successfully!");
    } catch (error) {
      console.error("Error updating log sheet:", error);
      alert("Failed to update log sheet.");
    }
  };

  const handleEditLogSheet = (logSheet) => {
    setEditLogSheetId(logSheet._id);
    setLogSheetInfo(logSheet);
    setShowLogSheetForm(true);
    setShowLogSheetList(false);
  };

  const handleDeleteLogSheet = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/logsheet/${id}`);
      setLogSheets(logSheets.filter((ls) => ls._id !== id));
      alert("Log sheet deleted successfully!");
    } catch (error) {
      console.error("Error deleting log sheet:", error);
     alert("Failed to delete log sheet.");
    }
  };

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
      <Sidebar
      setShowHome={setShowHome}
        setShowAddVehicleForm={setShowAddVehicleForm}
        setShowVehicleList={setShowVehicleList}
        setShowRenewalForm={setShowRenewalForm}
        setShowRenewalVehicleList={setShowRenewalVehicleList}
        setEditVehicleId={setEditVehicleId}
        setVehicleInfo={setVehicleInfo}
        setVehicleRenewal={setVehicleRenewal}
        setShowLogSheetForm={setShowLogSheetForm}
        setShowLogSheetList={setShowLogSheetList}
         
      />

      <main className="flex-1 bg-gray-100">
        <header className="bg-purple-800 text-white p-6 shadow-md flex items-center justify-between relative">
          <h1 className="text-2xl font-bold">Vehicle Manager</h1>
        </header>
        {showHome && <Home />}
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
            {vehicles.length > 0 ? (
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
            {renewalVehicles.length > 0 ? (
              <Card renewalVehicles={renewalVehicles} />
            ) : (
              <p>No vehicle renewals available.</p>
            )}
          </div>
        )}
        {showLogSheetForm && (
          <LogSheets
          
            logSheetInfo={logSheetInfo}
            handleLogSheetInputChange={handleLogSheetInputChange}
            handleAddLogSheet={handleAddLogSheet}
            handleUpdateLogSheet={handleUpdateLogSheet}
            editLogSheetId={editLogSheetId}
            setShowLogSheetForm={setShowLogSheetForm}
            setShowLogSheetList={setShowLogSheetList}
          />
        )}

        {showLogSheetList && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Log Sheets</h2>
            {logSheets.length > 0 ? (
              <Card
                logSheets={logSheets}
                handleEditLogSheet={handleEditLogSheet}
                handleDeleteLogSheet={handleDeleteLogSheet}
              />
            ) : (
              <p>No log sheets available.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
