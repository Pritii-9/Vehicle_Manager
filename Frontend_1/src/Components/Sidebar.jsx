import React from "react";
import MenuItem from "./MenuItem";

const Sidebar = ({
  setShowAddVehicleForm,
  setShowVehicleList,
  setShowRenewalForm,
  setShowRenewalVehicleList,
  setEditVehicleId,
  setVehicleInfo,
  setVehicleRenewal,
  setShowLogSheetForm,
  setShowLogSheetList,
  setLogSheetInfo,
  setShowHome,
  setShowBillingForm, // Make sure this prop is being passed from App.jsx
}) => {
  const resetAllFormsAndLists = () => {
    setShowAddVehicleForm(false);
    setShowVehicleList(false);
    setShowRenewalForm(false);
    setShowRenewalVehicleList(false);
    setShowLogSheetForm(false);
    setShowLogSheetList(false);
    setShowBillingForm(false); // Ensure billing form is also hidden
    setEditVehicleId(null);
    setShowHome(true);
  };

  const handleAddVehicleClick = () => {
    resetAllFormsAndLists();
    setShowAddVehicleForm(true);
    setShowHome(false);
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
  };

  const handleAddRenewalClick = () => {
    resetAllFormsAndLists();
    setShowRenewalForm(true);
    setShowHome(false);
    setVehicleRenewal({
      vehiclenumber: "",
      renewalfor: "",
      Issuedate: "",
      Expirydate: "",
    });
  };

  const handleLogSheetClick = () => {
    resetAllFormsAndLists();
    setShowLogSheetForm(true);
    setShowLogSheetList(false);
    setShowHome(false);
    setLogSheetInfo({
      Vehiclenumber: "",
      customerName: "",
      location: "",
      openingReading: "",
      closingReading: "",
      total: "",
      driver: "",
      diselQuantity: "",
      diselAmount: "",
      remark: "",
    });
  };

  const handleBillingFormClick = () => {
    resetAllFormsAndLists();
    setShowBillingForm(true);
    setShowHome(false);
  };

  const handleHomeClick = () => {
    resetAllFormsAndLists();
    setShowHome(true);
  };

  return (
    <aside className="w-1/6 bg-white text-black-800 p-4 h-screen flex-shrink-0">
      <h2 className="text-lg font-bold cursor-pointer" onClick={handleHomeClick}>Home</h2>
      <ul className="mt-4 text-font-semibold">
        <MenuItem label="Add Details" onClick={handleAddVehicleClick} />
        <MenuItem label="Add Renewal" onClick={handleAddRenewalClick} />
        <MenuItem label="Log sheet" onClick={handleLogSheetClick} />
        <MenuItem label="Billing Log Sheet" onClick={handleBillingFormClick} /> {/* Corrected prop name */}
      </ul>
    </aside>
  );
};

export default Sidebar;