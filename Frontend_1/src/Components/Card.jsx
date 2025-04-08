import React from "react";

const Card = ({ vehicles, handleEditVehicle, handleDeleteVehicle, renewalVehicles }) => {
  if (vehicles && vehicles.length > 0) {
    return (
      <div className="bg-white shadow rounded-md p-4">
        <h3 className="text-lg font-semibold mb-2">Vehicle List</h3>
        <table className="table-auto w-full border-collapse border border-gray-300 text-left">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b border-gray-300">Vehicle Number</th>
              <th className="px-4 py-2 border-b border-gray-300">Owner Name</th>
              <th className="px-4 py-2 border-b border-gray-300">Vehicle Name</th>
              <th className="px-4 py-2 border-b border-gray-300">Vehicle Type</th>
              <th className="px-4 py-2 border-b border-gray-300">Capacity</th>
              <th className="px-4 py-2 border-b border-gray-300">Fuel Type</th>
              <th className="px-4 py-2 border-b border-gray-300">Year</th>
              <th className="px-4 py-2 border-b border-gray-300">Mileage</th>
              <th className="px-4 py-2 border-b border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle._id}>
                <td className="px-4 py-2 border-b border-gray-300">{vehicle.Vehiclenumber}</td>
                <td className="px-4 py-2 border-b border-gray-300">{vehicle.OwnerName}</td>
                <td className="px-4 py-2 border-b border-gray-300"> {vehicle.VehicleName}</td>
                <td className="px-4 py-2 border-b border-gray-300">{vehicle.VehicleType}</td>
                <td className="px-4 py-2 border-b border-gray-300"> {vehicle.capacity}</td>
                <td className="px-4 py-2 border-b border-gray-300"> {vehicle.FuelType}</td>
                <td className="px-4 py-2 border-b border-gray-300">{vehicle.year}</td>
                <td className="px-4 py-2 border-b border-gray-300">{vehicle.mileage}</td>
                <td className="px-4 py-2 border-b border-gray-300">
                  <button
                    onClick={() => handleEditVehicle(vehicle)}
                    className="text-blue-500 hover:underline mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteVehicle(vehicle._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (renewalVehicles && renewalVehicles.length > 0) {
    return (
      <div className="bg-white shadow rounded-md p-4">
        <h3 className="text-lg font-semibold mb-2">Vehicle Renewal List</h3>
        <table className="table-auto w-full border-collapse border border-gray-300 text-left">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b border-gray-300">Vehicle Number</th>
              <th className="px-4 py-2 border-b border-gray-300">Renewal For</th>
              <th className="px-4 py-2 border-b border-gray-300">Issue Date</th>
              <th className="px-4 py-2 border-b border-gray-300">Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {renewalVehicles.map((renewal) => (
              <tr key={renewal._id || renewal.vehiclenumber}> {/* Assuming _id or vehiclenumber is unique */}
                <td className="px-4 py-2 border-b border-gray-300">{renewal.vehiclenumber}</td>
                <td className="px-4 py-2 border-b border-gray-300">{renewal.renewalfor}</td>
                <td className="px-4 py-2 border-b border-gray-300">{new Date(renewal.Issuedate).toLocaleDateString()}</td>
                <td className="px-4 py-2 border-b border-gray-300">{new Date(renewal.Expirydate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="text-center text-gray-500">
      <p>No vehicles or renewals available</p>
    </div>
  );
};

export default Card;