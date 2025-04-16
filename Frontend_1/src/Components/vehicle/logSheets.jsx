/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";

const LogSheets = ({ setShowLogSheetList }) => {
  const [logSheetInfo, setLogSheetInfo] = useState({
    vehicleNumber: "",
    customerName: "",
    location: "",
    openingReading: "",
    closingReading: "",
    total: "",
    driver: "",
    dieselQuantity: "",
    dieselAmount: "",
    remark: "",
  });
  const [logSheets, setLogSheets] = useState([]);
  const [editLogSheetId, setEditLogSheetId] = useState(null);
  const [showList, setShowList] = useState(false);
  const [drivers, setDrivers] = useState([]); // State to store drivers
  const [vehicles, setVehicles] = useState([]); // State to store vehicle numbers

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/drivers");
        setDrivers(response.data);
      } catch (error) {
        console.error("Error fetching drivers:", error);
        alert("Failed to fetch drivers list.");
      }
    };

    const fetchVehicles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/vehicles");
        // Extract vehicle numbers from the response
        const vehicleNumbers = response.data.map((vehicle) => vehicle.Vehiclenumber);
        setVehicles(vehicleNumbers);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        alert("Failed to fetch vehicles list.");
      }
    };

    fetchDrivers(); // Fetch drivers when the component loads
    fetchVehicles(); // Fetch vehicles
    if (showList) {
      fetchLogSheets();
    }
  }, [showList]);

  const fetchLogSheets = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/logsheet");
      setLogSheets(response.data);
    } catch (error) {
      console.error("Error fetching log sheets:", error);
    }
  };

  const handleLogSheetInputChange = (e) => {
    const { name, value } = e.target;
    setLogSheetInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleSaveLogSheet = async () => {
    try {
      let response;
      if (editLogSheetId) {
        response = await axios.put(
          `http://localhost:5000/api/logsheet/${editLogSheetId}`,
          logSheetInfo
        );
        alert("Log sheet updated successfully!");
        setLogSheets((prevLogSheets) =>
          prevLogSheets.map((ls) => (ls._id === editLogSheetId ? { ...response.data } : ls))
        );
      } else {
        response = await axios.post("http://localhost:5000/api/logsheet", logSheetInfo);
        alert("Log sheet saved successfully!");
        setLogSheets((prevLogSheets) => [...prevLogSheets, { ...response.data }]);
      }
      setLogSheetInfo({
        vehicleNumber: "",
        customerName: "",
        location: "",
        openingReading: "",
        closingReading: "",
        total: "",
        driver: "",
        dieselQuantity: "",
        dieselAmount: "",
        remark: "",
      });
      setEditLogSheetId(null);
      setShowList(true);
    } catch (error) {
      console.error(error);
      alert("Failed to save log sheet.");
    }
  };

  const handleClearLogSheet = () => {
    setLogSheetInfo({
      vehicleNumber: "",
      customerName: "",
      location: "",
      openingReading: "",
      closingReading: "",
      total: "",
      driver: "",
      dieselQuantity: "",
      dieselAmount: "",
      remark: "",
    });
    setEditLogSheetId(null);
  };

  const handleShowLogSheets = () => {
    setShowList(true);
  };

  const handleEditLogSheet = (logSheet) => {
    setLogSheetInfo({ ...logSheet }); // Ensure all fields are populated
    setEditLogSheetId(logSheet._id);
  };

  const handleDeleteLogSheet = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/logsheet/${id}`);
      alert("Log sheet deleted successfully!");
      setLogSheets((prevLogSheets) => prevLogSheets.filter((ls) => ls._id !== id));
    } catch (error) {
      console.error("Error deleting log sheet:", error);
      alert("Failed to delete log sheet.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Log Sheet</h2>
        <button
          onClick={handleShowLogSheets}
          className="bg-[#5046e4] text-white font-bold py-2 px-4 rounded"
        >
          Show Log Sheets
        </button>
      </div>
      <form className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-4 rounded-lg shadow-lg">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vehicleNumber">
            Vehicle Number
          </label>
          <select
            name="vehicleNumber"
            value={logSheetInfo.vehicleNumber}
            onChange={handleLogSheetInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="vehicleNumber"
          >
            <option value="">Select Vehicle Number</option>
            {vehicles.map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerName">
            Customer Name
          </label>
          <input
            type="text"
            name="customerName"
            placeholder="Customer Name"
            value={logSheetInfo.customerName}
            onChange={handleLogSheetInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="customerName"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
            Location
          </label>
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={logSheetInfo.location}
            onChange={handleLogSheetInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="location"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="openingReading">
            Opening Reading
          </label>
          <input
            type="number"
            name="openingReading"
            placeholder="Opening Reading"
            value={logSheetInfo.openingReading}
            onChange={handleLogSheetInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="openingReading"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="closingReading">
            Closing Reading
          </label>
          <input
            type="number"
            name="closingReading"
            placeholder="Closing Reading"
            value={logSheetInfo.closingReading}
            onChange={handleLogSheetInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="closingReading"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="total">
            Total
          </label>
          <input
            type="number"
            name="total"
            placeholder="Total"
            value={logSheetInfo.total}
            onChange={handleLogSheetInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="total"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="driver">
            Driver
          </label>
          <select
            name="driver"
            value={logSheetInfo.driver}
            onChange={handleLogSheetInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="driver"
          >
            <option value="">Select Driver</option>
            {drivers.map((driver) => (
              <option key={driver._id} value={driver.DriverName}>
                {driver.DriverName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dieselQuantity">
            Diesel Quantity
          </label>
          <input
            type="number"
            name="dieselQuantity"
            placeholder="Diesel Quantity"
            value={logSheetInfo.dieselQuantity}
            onChange={handleLogSheetInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="diselQuantity"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dieselAmount">
            Diesel Amount
          </label>
          <input
            type="number"
            name="diselAmount"
            placeholder="Diesel Amount"
            value={logSheetInfo.dieselAmount}
            onChange={handleLogSheetInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="diselAmount"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="remark">
            Remark
          </label>
          <input
            type="text"
            name="remark"
            placeholder="Remark"
            value={logSheetInfo.remark}
            onChange={handleLogSheetInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="remark"
          />
        </div>
        <div className="flex justify-end col-span-2">
          <button
            type="button"
            onClick={handleClearLogSheet}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={handleSaveLogSheet}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {editLogSheetId ? "Update" : "Save"}
          </button>
        </div>
      </form>

      {showList && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Log Sheets List</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-center">Vehicle Number</th>
                  <th className="py-2 px-4 border-b text-center">Customer Name</th>
                  <th className="py-2 px-4 border-b text-center">Location</th>
                  <th className="py-2 px-4 border-b text-center">Opening Reading</th>
                  <th className="py-2 px-4 border-b text-center">Closing Reading</th>
                  <th className="py-2 px-4 border-b text-center">Total</th>
                  <th className="py-2 px-4 border-b text-center">Driver</th>
                  <th className="py-2 px-4 border-b text-center">Diesel Quantity</th>
                  <th className="py-2 px-4 border-b text-center">Diesel Amount</th>
                  <th className="py-2 px-4 border-b text-center">Remark</th>
                  <th className="py-2 px-4 border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {logSheets.map((logSheet) => (
                  <tr key={logSheet._id}>
                    <td className="py-2 px-4 border-b text-center">{logSheet.vehicleNumber}</td>
                    <td className="py-2 px-4 border-b text-center">{logSheet.customerName}</td>
                    <td className="py-2 px-4 border-b text-center">{logSheet.location}</td>
                    <td className="py-2 px-4 border-b text-center">{logSheet.openingReading}</td>
                    <td className="py-2 px-4 border-b text-center">{logSheet.closingReading}</td>
                    <td className="py-2 px-4 border-b text-center">{logSheet.total}</td>
                    <td className="py-2 px-4 border-b text-center">{logSheet.driver}</td>
                    <td className="py-2 px-4 border-b text-center">{logSheet.dieselQuantity}</td>
                    <td className="py-2 px-4 border-b text-center">{logSheet.dieselAmount}</td>
                    <td className="py-2 px-4 border-b text-center">{logSheet.remark}</td>
                    <td className="py-2 px-4 border-b text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEditLogSheet(logSheet)}
                          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteLogSheet(logSheet._id)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogSheets;
