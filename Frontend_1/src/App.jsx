/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Sidebar from "./Components/Sidebar";
import HomeSection from "./Components/sections/HomeSection";
import VehicleSection from "./Components/sections//VehicleSection";
import RenewalSection from "./Components/sections/RenewalSection";
import LogSheetSection from "./Components/sections/LogSheetSection";
import BillingSection from "./Components/sections/BillingSection";
import { fetchLogSheets, fetchVehicles, fetchRenewals, fetchBills } from "./api";
import {
  handleLogSheetInputChange,
  handleAddLogSheet,
  handleUpdateLogSheet,
  handleEditLogSheet,
  handleDeleteLogSheet,
} from "./Components/handlers/logSheetHandlers";
import { handleEditVehicle, handleDeleteVehicle } from "./Components/handlers/vehicleHandlers";
import { handleRenewalInputChange, handleRenewalVehicle } from "./Components/handlers/renewalHandlers";
import {
  handleBillingFormClick,
  handleShowBillingListClick,
  handleBillSubmit,
  handleInputChange,
  handleAddBill,
} from "./Components/handlers/billingHandlers";

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
  const [billInfo, setBillInfo] = useState({
    billNumber: "",
    vehicleNumber: "",
    quantity: "",
    rate: "",
    gst: "",
    date: "",
  });

  const vehicleTypes = ["Car", "Truck", "Bike"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const logSheetsData = await fetchLogSheets();
        setLogSheets(logSheetsData);
        const vehiclesData = await fetchVehicles();
        setVehicles(vehiclesData);
        const renewalsData = await fetchRenewals();
        setRenewalVehicles(renewalsData);
        const billsData = await fetchBills();
        setBills(billsData);
      } catch (error) {
        alert("Failed to load data. Please check the console for details.");
      }
    };

    fetchData();
  }, []);

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
        setShowBillingList={setShowBillingList}
      />

      <main className="flex-1 bg-gray-100">
        <header className="bg-purple-800 text-white p-6 shadow-md flex items-center justify-between relative">
          <h1 className="text-2xl font-bold">Vehicle Manager</h1>
        </header>
        <HomeSection showHome={showHome} setShowBillingForm={setShowBillingForm} displayedRate={displayedRate} />
        <VehicleSection
          {...{
            showAddVehicleForm,
            showVehicleList,
            editVehicleId,
            vehicleTypes,
            setShowAddVehicleForm,
            setShowRenewalForm,
            setShowRenewalVehicleList,
            setShowVehicleList,
            vehicles,
            setVehicles,
            vehicleInfo,
            setVehicleInfo,
            fetchVehicles,
            handleEditVehicle: handleEditVehicle(
              null, // editVehicleId will be set in the handler
              setShowAddVehicleForm,
              setShowVehicleList,
              setShowRenewalForm,
              setShowRenewalVehicleList,
              setShowLogSheetForm,
              setShowLogSheetList,
              setShowHome,
              setShowBillingForm,
              setShowBillingList,
              setVehicleInfo
            ),
            handleDeleteVehicle: handleDeleteVehicle(null, setVehicles, setShowVehicleList), // id will be passed in the UI
          }}
        />
        <RenewalSection
          {...{
            showRenewalForm,
            showRenewalVehicleList,
            vehicleRenewal,
            handleRenewalInputChange: handleRenewalInputChange(setVehicleRenewal),
            handleRenewalVehicle: handleRenewalVehicle(
              vehicleRenewal,
              setRenewalVehicles,
              setShowRenewalForm,
              setShowRenewalVehicleList
            ),
            setShowAddVehicleForm,
            setShowRenewalForm,
            setShowRenewalVehicleList,
            setShowVehicleList,
            renewalVehicles,
            setRenewalVehicles,
          }}
        />
        <LogSheetSection
          {...{
            showLogSheetForm,
            showLogSheetList,
            logSheetInfo,
            handleLogSheetInputChange: handleLogSheetInputChange(setLogSheetInfo),
            handleAddLogSheet: handleAddLogSheet(
              logSheetInfo,
              setLogSheets,
              setShowLogSheetForm,
              setShowLogSheetList
            ),
            handleUpdateLogSheet: handleUpdateLogSheet(
              editLogSheetId,
              logSheetInfo,
              setLogSheets,
              setShowLogSheetForm,
              setShowLogSheetList,
              setEditLogSheetId
            ),
            handleEditLogSheet: handleEditLogSheet(
              null, // logSheet will be passed in the UI
              setEditLogSheetId,
              setLogSheetInfo,
              setShowLogSheetForm,
              setShowLogSheetList,
              setShowHome,
              setShowBillingForm,
              setShowBillingList
            ),
            handleDeleteLogSheet: handleDeleteLogSheet(null, setLogSheets), // id will be passed in the UI
            editLogSheetId,
            setShowLogSheetForm,
            setShowLogSheetList,
            logSheets,
          }}
        />
        <BillingSection
          {...{
            showBillingForm,
            showBillingList,
            handleBillSubmit: handleBillSubmit(setBills, setDisplayedRate),
            handleShowBillingListClick: handleShowBillingListClick(
              setShowHome,
              setShowAddVehicleForm,
              setShowVehicleList,
              setShowRenewalForm,
              setShowRenewalVehicleList,
              setShowLogSheetForm,
              setShowLogSheetList,
              setShowBillingForm,
              setShowBillingList
            ),
            handleInputChange: handleInputChange(setBillInfo),
            handleAddBill: handleAddBill(billInfo, setBills, setDisplayedRate, setShowBillingForm),
            billInfo,
            bills,
          }}
        />
      </main>
    </div>
  );
};

export default App;