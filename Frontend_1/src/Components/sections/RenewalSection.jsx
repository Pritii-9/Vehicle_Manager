import React from "react";
import RenewalMgt from "../vehicle/RenewalMgt";
import Card from "../Card";

const RenewalSection = ({
  showRenewalForm,
  showRenewalVehicleList,
  vehicleRenewal,
  handleRenewalInputChange,
  handleRenewalVehicle,
  setShowAddVehicleForm,
  setShowRenewalForm,
  setShowRenewalVehicleList,
  setShowVehicleList,
  renewalVehicles,
  setRenewalVehicles,
}) => (
  <>
    {showRenewalForm && (
      <RenewalMgt
        {...{
          vehicleRenewal,
          handleRenewalInputChange,
          handleRenewalVehicle,
          setShowAddVehicleForm,
          setShowRenewalForm,
          setShowRenewalVehicleList,
          setShowVehicleList,
          setShowVehicles: setRenewalVehicles,
          setShowRenewalVehicles: setRenewalVehicles,
        }}
      />
    )}
    {showRenewalVehicleList && (
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 mb-4">All Vehicle Renewals</h2>
        </div>
        {renewalVehicles.length > 0 ? <Card renewalVehicles={renewalVehicles} /> : <p>No vehicle renewals available.</p>}
      </div>
    )}
  </>
);

export default RenewalSection;