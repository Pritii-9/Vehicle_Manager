import React from "react";

const Card = ({
  data,
  type,
  handleEditVehicle,
  handleDeleteVehicle,
  handleEditLogSheet,
  handleDeleteLogSheet,
  handleEditDriver,
  handleDeleteDriver,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-500">
        <p>No data available</p>
      </div>
    );
  }

  if (type === "vehicle") {
    return (
      <div className="bg-gray-100 shadow rounded-md p-4">
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
            {data.map((vehicle) => (
              <tr key={vehicle._id}>
                <td className="px-4 py-2 border-b border-gray-300">
                  {vehicle.Vehiclenumber}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                  {vehicle.OwnerName}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                  {vehicle.VehicleName}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                  {vehicle.VehicleType}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                  {vehicle.capacity}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                  {vehicle.FuelType}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                  {vehicle.year}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                  {vehicle.mileage}
                </td>
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
  } else if (type === "driver") {
    return (
      <div className="bg-white shadow rounded-md p-4">
        <h3 className="text-lg font-semibold mb-2">Driver List</h3>
        <table className="table-auto w-full border-collapse border border-gray-300 text-left">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b border-gray-300">Driver Name</th>
              <th className="px-4 py-2 border-b border-gray-300">Driver Age</th>
              <th className="px-4 py-2 border-b border-gray-300">
                Driver License
              </th>
              <th className="px-4 py-2 border-b border-gray-300">Contact</th>
              <th className="px-4 py-2 border-b border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((driver) => (
              <tr key={driver._id}>
                <td className="px-4 py-2 border-b border-gray-300">
                  {driver.DriverName}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                  {driver.DriverAge}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                  {driver.DriverLicense}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                  {driver.Contact}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                  <button
                    onClick={() => handleEditDriver(driver)}
                    className="text-blue-500 hover:underline mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteDriver(driver._id)}
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
  } else if (type === "logsheet") {
    return (
      <div className="bg-white shadow rounded-md p-4">
        <h3 className="text-lg font-semibold mb-2">Log Sheet List</h3>
        <table className="table-auto w-full border-collapse border border-gray-300 text-left">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b border-gray-300">
                Vehicle Number
              </th>
              <th className="px-4 py-2 border-b border-gray-300">
                Customer Name
              </th>
              <th className="px-4 py-2 border-b border-gray-300">Location</th>
              <th className="px-4 py-2 border-b border-gray-300">
                Opening Reading
              </th>
              <th className="px-4 py-2 border-b border-gray-300">
                Closing Reading
              </th>
              <th className="px-4 py-2 border-b border-gray-300">Total</th>
              <th className="px-4 py-2 border-b border-gray-300">Driver</th>
              <th className="px-4 py-2 border-b border-gray-300">
                Diesel Quantity
              </th>
              <th className="px-4 py-2 border-b border-gray-300">
                Diesel Amount
              </th>
              <th className="px-4 py-2 border-b border-gray-300">Remark</th>
              <th className="px-4 py-2 border-b border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((log) => (
              <tr key={log._id || log.VehicleNumber}>
                <td className="px-4 py-2 border-b border-gray-300">
                  {log.VehicleNumber}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                  {log.CustomerName}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                  {log.Location}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                  {log.OpeningReading}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                  {log.ClosingReading}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                  {log.Total}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                  {log.Driver}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                  {log.DieselQuantity}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                  {log.DieselAmount}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                  {log.Remark}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                  <button
                    onClick={() => handleEditLogSheet(log)}
                    className="text-blue-500 hover:underline mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteLogSheet(log._id)}
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
  } else if (type === "bill") {
    return (
      <div className="bg-white shadow rounded-md p-4">
        <h3 className="text-lg font-semibold mb-2">Billing List</h3>
        <table className="table-auto w-full border-collapse border border-gray-300 text-left">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b border-gray-300">Bill Number</th>
              <th className="px-4 py-2 border-b border-gray-300">
                Vehicle Number
              </th>
              <th className="px-4 py-2 border-b border-gray-300">Quantity</th>
              <th className="px-4 py-2 border-b border-gray-300">Rate</th>
              <th className="px-4 py-2 border-b border-gray-300">GST</th>
              <th className="px-4 py-2 border-b border-gray-300">Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((bill) => (
              <tr key={bill._id || bill.billNumber}>
                <td className="px-4 py-2 border-b border-gray-300">
                  {bill.billNumber}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                  {bill.vehicleNumber}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                  {bill.quantity}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                  {bill.rate}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                  {bill.gst}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                  {new Date(bill.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } else {
    return (
      <div className="bg-white shadow rounded-md p-4">
        <h3 className="text-lg font-semibold mb-2">Data List</h3>
        <table className="table-auto w-full border-collapse border border-gray-300 text-left">
          <thead>
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key} className="px-4 py-2 border-b border-gray-300">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {Object.values(item).map((value, vIndex) => {
                  let displayValue = value;
                  if (value instanceof Date) {
                    displayValue = value.toLocaleDateString();
                  }
                  return (
                    <td key={vIndex} className="px-4 py-2 border-b border-gray-300">
                      {displayValue}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
};

export default Card;