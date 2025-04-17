import React from "react";
import RenewalMgt from "../vehicle/RenewalMgt";
import Card from "../Card";

const RenewalSection = ({
  setShowRenewalForm,
  setShowRenewalVehicleList,
  showRenewalForm,
  showRenewalVehicleList,
  vehicleRenewal,
  handleRenewalInputChange,
  handleRenewalVehicle,
  setShowAddVehicleForm,
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
          <button
            onClick={() => setShowRenewalForm(true)}
            className="bg-[#5046e4] text-white px-4 py-2 rounded hover:bg-blue transition"
          >
            Add Renewal
          </button>
        </div>
        {renewalVehicles.length > 0 ? (
          <Card data={renewalVehicles} type="renewal" /> 
        ) : (
          <p>No vehicle renewals available.</p>
        )}
      </div>
    )}
  </>
);

export default RenewalSection;