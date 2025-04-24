/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

    const [showBillingForm, setShowBillingForm] = useState(false);
    const [showBillingList, setShowBillingList] = useState(false);
    const [bills, setBills] = useState([]);
    const [displayedRate, setDisplayedRate] = useState(null);

<<<<<<< HEAD
  const [showDriverForm, setShowDriverForm] = useState(false);
  const [showDriverList, setShowDriverList] = useState(false);
  const [drivers, setDrivers ]= useState([]);
  const [driverInfo, setDriverInfo] = useState({ DriverName: "", DriverAge: "", DriverLicense: "", Contact: "", _id: null });

  const [logSheetInfo, setLogSheetInfo ]= useState({ vehicleNumber: "", CustomerName: "", Location: "", OpeningReading: "", ClosingReading: "", Total: "", Driver: "", DieselQuantity: "", DieselAmount: "", Remark: "" });
  const [vehicleInfo, setVehicleInfo] = useState({ Vehiclenumber: "", OwnerName: "", VehicleName: "", VehicleType: "", capacity: "", FuelType: "", year: "", mileage: "" });
  const [vehicleRenewal, setVehicleRenewal] = useState({ vehiclenumber: "", renewalfor: "", Issuedate: "", Expirydate: "" });
  const [billInfo, setBillInfo] = useState({ billNumber: "", vehicleNumber: "", quantity: "", rate: "", gst: "", date: "" });
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken')); // Track authentication
=======
    const [showDriverForm, setShowDriverForm] = useState(false);
    const [showDriverList, setShowDriverList] = useState(false);
    const [drivers, setDrivers] = useState([]);
    const [driverInfo, setDriverInfo] = useState({ DriverName: "", DriverAge: "", DriverLicense: "", Contact: "", _id: null });

    const [logSheetInfo, setLogSheetInfo] = useState({ vehicleNumber: "", CustomerName: "", Location: "", OpeningReading: "", ClosingReading: "", Total: "", Driver: "", DieselQuantity: "", DieselAmount: "", Remark: "" });
    const [vehicleInfo, setVehicleInfo] = useState({ Vehiclenumber: "", OwnerName: "", VehicleName: "", VehicleType: "", capacity: "", FuelType: "", year: "", mileage: "" });
    const [vehicleRenewal, setVehicleRenewal] = useState({ vehiclenumber: "", renewalfor: "", Issuedate: "", Expirydate: "" });
    const [billInfo, setBillInfo] = useState({ billNumber: "", vehicleNumber: "", quantity: "", rate: "", gst: "", date: "" });
>>>>>>> 0d789f13a02e82e082e1932f973b7688403b0f9d

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

<<<<<<< HEAD
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false); // Update auth state
    window.location.href = '/login';
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true); // Update auth state on successful login
  };


  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} /> {/* Pass a callback */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
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
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
=======
    const handleDeleteDriver = async (id) => {
        console.log("Deleting driver with ID:", id);
        const updatedDrivers = await fetchDrivers();
        setDrivers(updatedDrivers);
    };

    return (
        <div className="flex h-screen bg-gray-100">
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

            <div className="flex-1 flex flex-col h-full">
                <header className="bg-gradient-to-r from-purple-700 to-purple-800 text-white shadow-md rounded-lg p-4 mb-4">
                    <h1 className="text-2xl font-semibold">Vehicle Manager</h1>
                </header>

                <main className="flex-1 overflow-y-auto p-6">
                    {showHome && <HomeSection renewalVehicles={renewalVehicles} />}

                    {showAddVehicleForm && (
                        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add/Edit Vehicle</h2>
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
                        </div>
                    )}

                    {showVehicleList && (
                        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Vehicle List</h2>
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
                        </div>
                    )}

                    {showRenewalForm && (
                        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Vehicle Renewal</h2>
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
                        </div>
                    )}

                    {showRenewalVehicleList && (
                        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Vehicle Renewals</h2>
                            <RenewalSection
                                showRenewalVehicleList={showRenewalVehicleList}
                                setShowRenewalVehicleList={setShowRenewalVehicleList}
                                renewalVehicles={renewalVehicles}
                                setRenewalVehicles={setRenewalVehicles}
                                setShowRenewalForm={setShowRenewalForm}
                            />
                        </div>
                    )}

                    {showLogSheetForm && (
                        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add/Edit Log Sheet</h2>
                            <LogSheetSection
                                showLogSheetForm={showLogSheetForm}
                                setShowLogSheetForm={setShowLogSheetForm}
                                logSheetInfo={logSheetInfo}
                                setLogSheetInfo={setLogSheetInfo}
                                handleAddLogSheet={(data) => handleAddLogSheet(data, setLogSheets, setShowLogSheetForm, setShowLogSheetList)}
                                setShowLogSheetList={setShowLogSheetList}
                            />
                        </div>
                    )}

                    {showLogSheetList && (
                        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Log Sheets</h2>
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
                        </div>
                    )}

                    {showBillingForm && (
                        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Bill</h2>
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

                    {showBillingList && (
                        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Billing List</h2>
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
                        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Driver List</h2>
                            <DriverSection
                                drivers={drivers}
                                onEdit={handleEditDriver}
                                onDelete={handleDeleteDriver}
                                onAdd={() => { setShowDriverForm(true); setShowDriverList(false); setDriverInfo({ DriverName: "", DriverAge: "", DriverLicense: "", Contact: "", _id: null }); }}
                            />
                        </div>
                    )}

                    {showDriverForm && (
                        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add/Edit Driver</h2>
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
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
>>>>>>> 0d789f13a02e82e082e1932f973b7688403b0f9d
};

export default App;

