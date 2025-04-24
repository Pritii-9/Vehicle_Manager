/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from "./Components/Sidebar";
import HomeSection from "./Components/sections/HomeSection";
import VehicleSection from "./Components/sections/VehicleSection";
import RenewalSection from "./Components/sections/RenewalSection";
import LogSheetSection from "./Components/sections/LogSheetSection";
import BillingSection from "./Components/sections/BillingSection";
import DriverSection from "./Components/sections/DriverSection";
import AddDriverForm from "./Components/vehicle/AddDriverForm";
import { fetchLogSheets, fetchVehicles, fetchRenewals, fetchBills, fetchDrivers } from "./api";
import { handleLogSheetInputChange, handleAddLogSheet, handleUpdateLogSheet, handleEditLogSheet, handleDeleteLogSheet } from "./Components/handlers/logSheetHandlers";
import { handleEditVehicle, handleDeleteVehicle } from "./Components/handlers/vehicleHandlers";
import { handleRenewalInputChange, handleRenewalVehicle } from "./Components/handlers/renewalHandlers";
import { handleBillSubmit, handleInputChange, handleAddBill } from "./Components/handlers/billingHandlers";
import Signup from "./Components/pages/Signup";
import Login from "./Components/pages/Login";

const AppContent = () => {
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

    const [showBillingForm, setShowBillingForm] = useState(false);
    const [showBillingList, setShowBillingList] = useState(false);
    const [bills, setBills] = useState([]);
    const [displayedRate, setDisplayedRate] = useState(null);

  const [showDriverForm, setShowDriverForm] = useState(false);
  const [showDriverList, setShowDriverList] = useState(false);
  const [drivers, setDrivers ]= useState([]);
  const [driverInfo, setDriverInfo] = useState({ DriverName: "", DriverAge: "", DriverLicense: "", Contact: "", _id: null });

  const [logSheetInfo, setLogSheetInfo ]= useState({ vehicleNumber: "", CustomerName: "", Location: "", OpeningReading: "", ClosingReading: "", Total: "", Driver: "", DieselQuantity: "", DieselAmount: "", Remark: "" });
  const [vehicleInfo, setVehicleInfo] = useState({ Vehiclenumber: "", OwnerName: "", VehicleName: "", VehicleType: "", capacity: "", FuelType: "", year: "", mileage: "" });
  const [vehicleRenewal, setVehicleRenewal] = useState({ vehiclenumber: "", renewalfor: "", Issuedate: "", Expirydate: "" });
  const [billInfo, setBillInfo] = useState({ billNumber: "", vehicleNumber: "", quantity: "", rate: "", gst: "", date: "" });
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken')); // Track authentication
  const location = useLocation();

    const vehicleTypes = ["Car", "Truck", "Bike"];

    const handleShowBillingListClick = () => {
        setShowBillingList(true);
        setShowBillingForm(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const logSheetsData = await fetchLogSheets();
                setLogSheets(logSheetsData);
                const vehiclesData = await fetchVehicles();
                setVehicles(vehiclesData);
                const renewalsData = await fetchRenewals();
                setRenewalVehicles(renewalsData);
                console.log("Fetched renewals data:", renewalsData);
                const billsData = await fetchBills();
                setBills(billsData);
                const driversData = await fetchDrivers();
                setDrivers(driversData);
            } catch (error) {
                alert("Failed to load data. Please check the console for details.");
            }
        };

        fetchData();
    }, []);

    const handleEditDriver = (driver) => {
        setDriverInfo(driver);
        setShowDriverForm(true);
        setShowDriverList(false);
    };

    const handleSaveDriver = async (driverData) => {
        console.log("Saving driver:", driverData);
        setShowDriverForm(false);
        setShowDriverList(true);
        setDriverInfo({ DriverName: "", DriverAge: "", DriverLicense: "", Contact: "", _id: null });
        const updatedDrivers = await fetchDrivers();
        setDrivers(updatedDrivers);
    };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false); // Update auth state
    window.location.href = '/login';
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true); // Update auth state on successful login
  };

  useEffect(() => {
    if (isAuthenticated && location.pathname === "/") {
      setShowHome(true);
      setShowAddVehicleForm(false);
      setShowVehicleList(false);
      setShowRenewalForm(false);
      setShowRenewalVehicleList(false);
      setShowLogSheetForm(false);
      setShowLogSheetList(false);
      setShowBillingForm(false);
      setShowBillingList(false);
      setShowDriverForm(false);
      setShowDriverList(false);
    }
  }, [isAuthenticated, location.pathname]);

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
                setLogSheetInfo={setLogSheetInfo}
                setShowBillingForm={setShowBillingForm}
                setShowBillingList={setShowBillingList}
                setShowDriverForm={setShowDriverForm}
                setDriverInfo={setDriverInfo}
                setShowDriverList={setShowDriverList}
            />
            <main className="flex-1 h-full bg-gradient-to-br from-gray-100 to-gray-200 p-6">
                <header className="bg-gradient-to-r from-purple-800 to-purple-900 text-white p-6 shadow-lg flex items-center justify-between relative transition-all duration-300 hover:shadow-lg hover:scale-[1.01] rounded-b-lg mb-6">
                    <h1 className="text-2xl font-bold">Vehicle Manager</h1>
                    <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Logout
                    </button>
                </header>
                {showHome && <HomeSection renewalVehicles={renewalVehicles} />}
                {showAddVehicleForm && (
                    <VehicleSection
                        showAddVehicleForm={showAddVehicleForm}
                        setShowAddVehicleForm={setShowAddVehicleForm}
                        vehicleInfo={vehicleInfo}
                        setVehicleInfo={setVehicleInfo}
                        vehicleTypes={vehicleTypes}
                        vehicles={vehicles}
                        setVehicles={setVehicles}
                        handleEditVehicle={(vehicle) => {
                            setEditVehicleId(vehicle._id);
                            setVehicleInfo(vehicle);
                            setShowAddVehicleForm(true);
                            setShowVehicleList(false);
                        }}
                        handleDeleteVehicle={(id) => handleDeleteVehicle(id, setVehicles, setShowVehicleList)}
                        setShowVehicleList={setShowVehicleList}
                        setShowRenewalForm={setShowRenewalForm}
                        setShowRenewalVehicleList={setShowRenewalVehicleList}
                        setShowLogSheetForm={setShowLogSheetForm}
                        setShowLogSheetList={setShowLogSheetList}
                        setShowHome={setShowHome}
                        setShowBillingForm={setShowBillingForm}
                        setShowBillingList={setShowBillingList}
                    />
                )}
                {showVehicleList && (
                    <VehicleSection
                        showVehicleList={showVehicleList}
                        setShowVehicleList={setShowVehicleList}
                        vehicles={vehicles}
                        setVehicles={setVehicles}
                        handleEditVehicle={(vehicle) => {
                            setEditVehicleId(vehicle._id);
                            setVehicleInfo(vehicle);
                            setShowAddVehicleForm(true);
                            setShowVehicleList(false);
                        }}
                        handleDeleteVehicle={(id) => handleDeleteVehicle(id, setVehicles, setShowVehicleList)}
                        setShowAddVehicleForm={setShowAddVehicleForm}
                        setShowRenewalForm={setShowRenewalForm}
                        setShowRenewalVehicleList={setShowRenewalVehicleList}
                        setShowLogSheetForm={setShowLogSheetForm}
                        setShowLogSheetList={setShowLogSheetList}
                        setShowHome={setShowHome}
                        setShowBillingForm={setShowBillingForm}
                        setShowBillingList={setShowBillingList}
                    />
                )}
                {showRenewalForm && (
                    <RenewalSection
                        showRenewalForm={showRenewalForm}
                        setShowRenewalForm={setShowRenewalForm}
                        vehicleRenewal={vehicleRenewal}
                        setVehicleRenewal={setVehicleRenewal}
                        handleRenewalInputChange={handleRenewalInputChange(setVehicleRenewal)}
                        handleRenewalVehicle={(renewalData) => handleRenewalVehicle(renewalData, setRenewalVehicles, setShowRenewalForm, setShowRenewalVehicleList)}
                        renewalVehicles={renewalVehicles}
                        setRenewalVehicles={setRenewalVehicles}
                        setShowRenewalVehicleList={setShowRenewalVehicleList}
                    />
                )}
                {showRenewalVehicleList && (
                    <RenewalSection
                        showRenewalVehicleList={showRenewalVehicleList}
                        setShowRenewalVehicleList={setShowRenewalVehicleList}
                        renewalVehicles={renewalVehicles}
                        setRenewalVehicles={setRenewalVehicles}
                        setShowRenewalForm={setShowRenewalForm}
                    />
                )}
                {showLogSheetForm && (
                    <LogSheetSection
                        showLogSheetForm={showLogSheetForm}
                        setShowLogSheetForm={setShowLogSheetForm}
                        logSheetInfo={logSheetInfo}
                        setLogSheetInfo={setLogSheetInfo}
                        handleAddLogSheet={(data) => handleAddLogSheet(data, setLogSheets, setShowLogSheetForm, setShowLogSheetList)}
                        setShowLogSheetList={setShowLogSheetList}
                    />
                )}
                {showLogSheetList && (
                    <LogSheetSection
                        showLogSheetList={showLogSheetList}
                        setShowLogSheetList={setShowLogSheetList}
                        logSheets={logSheets}
                        handleEditLogSheet={(log) => {
                            setEditLogSheetId(log._id);
                            setLogSheetInfo(log);
                            setShowLogSheetForm(true);
                            setShowLogSheetList(false);
                        }}
                        handleDeleteLogSheet={(id) => handleDeleteLogSheet(id, setLogSheets)}
                        setShowLogSheetForm={setShowLogSheetForm}
                        setShowHome={setShowHome}
                        setShowBillingForm={setShowBillingForm}
                        setShowBillingList={setShowBillingList}
                    />
                )}
                {showBillingForm && (
                    <BillingSection
                        showBillingForm={showBillingForm}
                        showBillingList={showBillingList}
                        handleBillSubmit={handleBillSubmit}
                        handleShowBillingListClick={handleShowBillingListClick}
                        handleInputChange={(e) => setBillInfo({ ...billInfo, [e.target.name]: e.target.value })}
                        handleAddBill={(newBill) => {
                            setBills((prevBills) => [...prevBills, newBill]);
                            setShowBillingForm(false);
                            setShowBillingList(true);
                        }}
                        billInfo={billInfo}
                        bills={bills}
                    />
                )}
                {showBillingList && (
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Billing List</h2>
                        <BillingSection
                            showBillingForm={showBillingForm}
                            showBillingList={showBillingList}
                            handleBillSubmit={handleBillSubmit}
                            handleShowBillingListClick={handleShowBillingListClick}
                            handleInputChange={(e) => setBillInfo({ ...billInfo, [e.target.name]: e.target.value })}
                            handleAddBill={(newBill) => {
                                setBills((prevBills) => [...prevBills, newBill]);
                                setShowBillingForm(false);
                                setShowBillingList(true);
                            }}
                            billInfo={billInfo}
                            bills={bills}
                        />
                    </div>
                )}

                {showDriverList && (
                    <DriverSection
                        drivers={drivers}
                        onEdit={handleEditDriver}
                        onDelete={handleDeleteDriver}
                        onAdd={() => { setShowDriverForm(true); setShowDriverList(false); setDriverInfo({ DriverName: "", DriverAge: "", DriverLicense: "", Contact: "", _id: null }); }}
                    />
                )}

                {showDriverForm && (
                    <AddDriverForm
                        onSave={handleSaveDriver}
                        initialDriverInfo={driverInfo}
                        onCancel={() => {
                            setShowDriverForm(false);
                            setShowDriverList(true);
                            setDriverInfo({ DriverName: "", DriverAge: "", DriverLicense: "", Contact: "", _id: null });
                        }}
                        onShowList={() => {
                            setShowDriverForm(false);
                            setShowDriverList(true);
                            setDriverInfo({ DriverName: "", DriverAge: "", DriverLicense: "", Contact: "", _id: null });
                        }}
                    />
                )}
            </main>
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} /> {/* Removed onLoginSuccess here */}
                <Route path="*" element={<AppContent />} /> {/* Render AppContent for all other routes */}
            </Routes>
        </Router>
    );
};

export default App;