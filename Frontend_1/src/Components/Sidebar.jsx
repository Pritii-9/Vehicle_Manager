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
  setShowHome, // Add prop to show Home component
}) => {
  const resetAllFormsAndLists = () => {
    setShowAddVehicleForm(false);
    setShowVehicleList(false);
    setShowRenewalForm(false);
    setShowRenewalVehicleList(false);
    setShowLogSheetForm(false);
    setShowLogSheetList(false);
    setEditVehicleId(null);
    setShowHome(true); // show home when home button is clicked
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

  const handleHomeClick = () => {
    resetAllFormsAndLists();
    setShowHome(true);
  };

  return (
    <aside className="w-1/4 bg-white text-black-800 p-4 h-screen flex-shrink-0">
      <h2 className="text-lg font-bold" onClick={handleHomeClick}>Home</h2>
      <ul className="mt-4 text-font-semibold">
        <MenuItem label="Add Vehicle" onClick={handleAddVehicleClick} />
        <MenuItem label="Add Renewal" onClick={handleAddRenewalClick} />
        <MenuItem label="Log sheet" onClick={handleLogSheetClick} />
      </ul>
    </aside>
  );
};

export default Sidebar;