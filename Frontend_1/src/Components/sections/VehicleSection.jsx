import React from "react";
import VehicleMgt from "../vehicle/VehicleMgt";
import Card from "../Card";

const VehicleSection = ({
  showAddVehicleForm,
  showVehicleList, // Use this prop to control the list visibility
  editVehicleId,
  vehicleTypes,
  setShowAddVehicleForm,
  setShowRenewalForm,
  setShowRenewalVehicleList,
  setShowVehicleList: setAppShowVehicleList, // Rename this to avoid shadowing if needed elsewhere
  vehicles,
  setVehicles,
  vehicleInfo,
  setVehicleInfo,
  fetchVehicles,
}) => (
  <>
    {showAddVehicleForm && (
      <VehicleMgt
        {...{
          editVehicleId,
          vehicleTypes,
          setShowAddVehicleForm,
          setShowRenewalForm,
          setShowRenewalVehicleList,
          setShowVehicleList: setAppShowVehicleList,
          setVehicles,
          vehicleInfo,
          setVehicleInfo,
          fetchVehicles,
        }}
      />
    )}
    {showVehicleList && ( // Render the list based on the showVehicleList prop
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 mb-4">All Vehicles</h2>
          <button
            onClick={() => {
              setShowAddVehicleForm(true);
              setAppShowVehicleList(false); // Hide the list when showing the form
            }}
            className="bg-[#5046e4] text-white px-4 py-2 rounded hover:bg-blue transition"
          >
            Add Vehicle
          </button>
        </div>
        {vehicles.length > 0 ? (
          <Card data={vehicles} type="vehicle" /> 
        ) : (
          <p>No vehicles available.</p>
        )}
      </div>
    )}
  </>
);

export default VehicleSection;