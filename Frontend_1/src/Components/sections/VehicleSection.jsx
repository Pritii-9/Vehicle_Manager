import React from "react";
import VehicleMgt from "../vehicle/VehicleMgt";
import Card from "../Card";

const VehicleSection = ({
  showAddVehicleForm,
  showVehicleList,
  editVehicleId,
  vehicleTypes,
  setShowAddVehicleForm,
  setShowRenewalForm,
  setShowRenewalVehicleList,
  setShowVehicleList: setAppShowVehicleList,
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
    {showVehicleList && (
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 mb-4">All Vehicles</h2>
        </div>
        {vehicles.length > 0 ? (
          <Card vehicles={vehicles} />
        ) : (
          <p>No vehicles available.</p>
        )}
      </div>
    )}
  </>
);

export default VehicleSection;