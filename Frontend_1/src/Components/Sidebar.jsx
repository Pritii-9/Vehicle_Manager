import React, { useState } from "react";
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
  setShowBillingForm,
  setShowBillingList,
  setShowDriverForm,
  setDriverInfo,
  setShowDriverList,
}) => {
  const [showAddDetailsSubMenu, setShowAddDetailsSubMenu] = useState(false);

  const resetAllFormsAndLists = () => {
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
    setEditVehicleId(null);
    setShowAddDetailsSubMenu(false);
    setShowHome(false);
  };

  const handleAddDetailsClick = () => {
    setShowAddDetailsSubMenu(!showAddDetailsSubMenu);
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

  const handleAddDriverClick = () => {
    resetAllFormsAndLists();
    setShowDriverForm(true);
    setShowHome(false);
    setDriverInfo({
      DriverName: "",
      DriverAge: "",
      DriverLicense: "",
      Contact: "",
      _id: null,
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
  };

  const handleBillingFormClick = () => {
    resetAllFormsAndLists();
    setShowBillingForm(true);
    setShowBillingList(false);
    setShowHome(false);
  };

  const handleHomeClick = () => {
    resetAllFormsAndLists();
    setShowHome(true);
  };

  return (
    <aside className="w-1/6 bg-white text-black-800 p-4 h-screen flex-shrink-0">
      <h2 className="text-lg font-bold cursor-pointer" onClick={handleHomeClick}>
        Home
      </h2>
      <ul className="mt-4 mt-2">
        <div onClick={handleAddDetailsClick} className="cursor-pointer font-semibold">
          Add Details
        </div>
        {showAddDetailsSubMenu && (
          <ul className="ml-4 mt-2">
            <MenuItem label="Add Vehicle" onClick={handleAddVehicleClick} />
            <MenuItem label="Add Driver" onClick={handleAddDriverClick} />
          </ul>
        )}
        <MenuItem label="Add Renewal" onClick={handleAddRenewalClick} />
        {/* <MenuItem label="Vehicle List" onClick={handleVehicleListClick} /> {/* Added Vehicle List */}
        {/* <MenuItem label="Renewal List" onClick={handleRenewalListClick} /> Added Renewal List */} 
        <MenuItem label="Log sheet" onClick={handleLogSheetClick} />
        <MenuItem label="Billing Log Sheet" onClick={handleBillingFormClick} />
      </ul>
    </aside>
  );
};

export default Sidebar;