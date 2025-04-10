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
    date: "",
    driverName: "",
    startMileage: "",
    endMileage: "",
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
    fetchBills(); // Fetch bills on component mount
  }, []);

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

  const fetchLogSheets = async () => {
    try {
      const response = await axios.get("http://localhost:5000/logsheet");
      setLogSheets(response.data);
    } catch (error) {
      console.error("Error fetching log sheets:", error);
      //alert("Failed to fetch log sheets.");
    }
  };

  const fetchBills = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/bills"); // Replace with your actual API
      setBills(response.data);
    } catch (error) {
      console.error("Error fetching bills:", error);
      // alert("Failed to fetch bills."); // Remove alert.  Handle errors in component.
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
        date: "",
        driverName: "",
        startMileage: "",
        endMileage: "",
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
        date: "",
        driverName: "",
        startMileage: "",
        endMileage: "",
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
    setShowHome(false);
    setShowBillingForm(false);
    setShowBillingList(false); // Ensure billing list is also hidden
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

  const handleBillingFormClick = () => {
    setShowHome(false);
    setShowBillingForm(true);
    setShowBillingList(false); // Ensure billing list is hidden when showing the form
    setBillInfo({
      billNumber: "",
      vehicleNumber: "",
      quantity: "",
      rate: "",
      gst: "",
      date: "",
    });
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

  const handleBillSubmit = (rate) => {
    setDisplayedRate(rate); // Update state in App
    setShowBillingForm(false); // Hide the form after submission
    // Do NOT automatically show the billing list
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
      setBills([...bills, response.data]); // Update the bills state
      setDisplayedRate(billInfo.rate); // Update the displayed rate immediately on submit
      setBillInfo({
        billNumber: "",
        vehicleNumber: "",
        quantity: "",
        rate: "",
        gst: "",
        date: "",
      });
      setShowBillingForm(false); // Hide the form
    } catch (error) {
      console.error("Error adding bill:", error);
      if (error.response) {
        console.error("Server response data:", error.response.data);
        console.error("Server response status:", error.response.status);
        console.error("Server response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Request error:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      alert("Failed to add bill. See console for details.");
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
        {showHome && <Home setShowBillingForm={setShowBillingForm} />}
        {showAddVehicleForm && <VehicleMgt {...{ editVehicleId, vehicleTypes, setShowAddVehicleForm, setShowRenewalForm, setShowRenewalVehicleList, setShowVehicleList, setVehicles }} />}
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
        {showBillingForm && (
          <BillingForm
            setShowBillingList={setShowBillingList}
            onBillSubmit={handleBillSubmit}
            onShowBillingListClick={handleShowBillingListClick} // Pass the handler
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