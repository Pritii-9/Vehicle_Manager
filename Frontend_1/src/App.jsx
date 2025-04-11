/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "./Components/Card";
import VehicleMgt from "./Components/vehicle/VehicleMgt";
import RenewalMgt from "./Components/vehicle/RenewalMgt";
import LogSheets from "./Components/vehicle/logSheets";
import Sidebar from "./Components/Sidebar";
import Home from "./Components/pages/Home";
import BillingForm from "./Components/vehicle/BillingForm"; // Corrected import path

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

  const [showBillingForm, setShowBillingForm] = useState(false); // State for Billing Form
  const [showBillingList, setShowBillingList] = useState(false); // State for Billing List
  const [bills, setBills] = useState([]); // State to store bills
  const [displayedRate, setDisplayedRate] = useState(null); // State to hold the displayed rate in Home

  const [logSheetInfo, setLogSheetInfo] = useState({
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

  const [billInfo, setBillInfo] = useState({ // State for bill form
    billNumber: "",
    vehicleNumber: "",
    quantity: "",
    rate: "",
    gst: "",
    date: "",
  });

  const vehicleTypes = ["Car", "Truck", "Bike"];

  useEffect(() => {
    fetchVehicles();
    fetchRenewals();
    fetchLogSheets();
    fetchBills();
  }, []);

  async function fetchLogSheets() {
    try {
      const response = await axios.get("http://localhost:5000/logsheet");
      setLogSheets(response.data);
    } catch (error) {
      console.error("Error fetching log sheets:", error);
      alert("Failed to fetch log sheets.");
    }
  }

  function handleLogSheetInputChange(e) {
    const { name, value } = e.target;
    setLogSheetInfo({ ...logSheetInfo, [name]: value });
  }

  async function handleAddLogSheet() {
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
  }

  async function handleUpdateLogSheet() {
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
      alert("Log sheet updated successfully!");
    } catch (error) {
      console.error("Error updating log sheet:", error);
      alert("Failed to update log sheet.");
    }
  }

  function handleEditLogSheet(logSheet) {
    setEditLogSheetId(logSheet._id);
    setLogSheetInfo(logSheet);
    setShowLogSheetForm(true);
    setShowLogSheetList(false);
    setShowHome(false);
    setShowBillingForm(false);
    setShowBillingList(false); // Ensure billing list is also hidden
  }

  async function handleDeleteLogSheet(id) {
    try {
      await axios.delete(`http://localhost:5000/logsheet/${id}`);
      setLogSheets(logSheets.filter((ls) => ls._id !== id));
      alert("Log sheet deleted successfully!");
    } catch (error) {
      console.error("Error deleting log sheet:", error);
      alert("Failed to delete log sheet.");
    }
  }

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

  const fetchBills = async () => {
    try {
      console.log("Fetching bills from http://localhost:5000/api/bills");
      const response = await axios.get("http://localhost:5000/api/bills");
      console.log("Response from /api/bills:", response);
      setBills(response.data);
    } catch (error) {
      console.error("Error fetching bills:", error);
      // You might want to display a user-friendly message here if the initial fetch fails
      // but avoid an alert that could be disruptive if the backend isn't running yet.
      // For debugging, it's okay to leave the console log.
    }
  };

  const handleEditVehicle = (vehicle) => {
    setEditVehicleId(vehicle._id);
    setShowAddVehicleForm(true);
    setShowVehicleList(false);
    setShowRenewalForm(false);
    setShowRenewalVehicleList(false);
    setShowLogSheetForm(false);
    setShowLogSheetList(false);
    setShowHome(false);
    setShowBillingForm(false);
    setShowBillingList(false); // Ensure billing list is also hidden
    setVehicleInfo({
      Vehiclenumber: vehicle.Vehiclenumber,
      OwnerName: vehicle.OwnerName,
      VehicleName: vehicle.VehicleName,
      VehicleType: vehicle.VehicleType,
      capacity: vehicle.capacity,
      FuelType: vehicle.FuelType,
      year: vehicle.year,
      mileage: vehicle.mileage,
    });
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

  const handleBillingFormClick = () => {
    setShowHome(false);
    setShowBillingForm(true);
    setShowBillingList(false); // Ensure billing list is hidden when showing the form
  };

  const handleShowBillingListClick = () => {
    setShowHome(false);
    setShowAddVehicleForm(false);
    setShowVehicleList(false);
    setShowRenewalForm(false);
    setShowRenewalVehicleList(false);
    setShowLogSheetForm(false);
    setShowLogSheetList(false);
    setShowBillingForm(false);
    setShowBillingList(true);
  };

  const handleBillSubmit = (newBill) => {
    // Update bills state and optionally displayedRate
    setBills(prevBills => [...prevBills, newBill]);
    setDisplayedRate(newBill.rate); // Or any other field from newBill
  };

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
      setBills(prevBills => [...prevBills, response.data]); // Update the bills state
      setDisplayedRate(billInfo.rate);
      setBillInfo({
        billNumber: "",
        vehicleNumber: "",
        quantity: "",
        rate: "",
        gst: "",
        date: "",
      });
      setShowBillingForm(false); // Hide the form
      //setShowBillingList(true); // Show the list after adding
    } catch (error) {
      console.error("Error adding bill:", error);
      let errorMessage = "Failed to add bill. See console for details.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      alert(errorMessage);
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
        setShowLogSheetForm={setShowLogSheetForm}
        setShowLogSheetList={setShowLogSheetList}
        setShowBillingForm={setShowBillingForm}
        setShowBillingList={setShowBillingList} // Pass setShowBillingList to Sidebar
      />

      <main className="flex-1 bg-gray-100">
        <header className="bg-purple-800 text-white p-6 shadow-md flex items-center justify-between relative">
          <h1 className="text-2xl font-bold">Vehicle Manager</h1>
        </header>
        {showHome && <Home setShowBillingForm={setShowBillingForm} displayedRate={displayedRate} />}
        {showAddVehicleForm && <VehicleMgt {...{ editVehicleId, vehicleTypes, setShowAddVehicleForm, setShowRenewalForm, setShowRenewalVehicleList, setShowVehicleList, setVehicles, vehicleInfo, setVehicleInfo, fetchVehicles }} />}
        {showVehicleList && (
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                All Vehicles
              </h2>
            </div>
            {vehicles.length > 0 ? (
              <Card vehicles={vehicles} />
            ) : (
              <p>No vehicles available.</p>
            )}
          </div>
        )}
        {showRenewalForm && <RenewalMgt {...{ vehicleRenewal, handleRenewalInputChange, handleRenewalVehicle, setShowAddVehicleForm, setShowRenewalForm, setShowRenewalVehicleList, setShowVehicleList, setShowVehicles: setVehicles, setShowRenewalVehicles: setRenewalVehicles }} />}
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
        {showLogSheetForm && <LogSheets {...{ logSheetInfo, handleLogSheetInputChange, handleAddLogSheet, handleUpdateLogSheet, editLogSheetId, setShowLogSheetForm, setShowLogSheetList }} />}
        {showLogSheetList && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Log Sheets</h2>
            {logSheets.length > 0 ? (
              <Card logSheets={logSheets} />
            ) : (
              <p>No log sheets available.</p>
            )}
          </div>
        )}
        {showBillingForm && (
          <BillingForm
            setShowBillingList={setShowBillingList}
            onBillSubmit={handleBillSubmit}
            onShowBillingListClick={handleShowBillingListClick} // Pass the handler
            handleInputChange={handleInputChange}
            handleAddBill={handleAddBill}
            billInfo={billInfo}
          />
        )}
        {showBillingList && (
          <div className="p-6">
            <div className="bg-white shadow rounded-md p-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Billing List</h2>
              {bills.length > 0 ? (
                <Card bills={bills} />
              ) : (
                <p>No bills available.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
