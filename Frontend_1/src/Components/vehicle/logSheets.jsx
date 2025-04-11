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

  useEffect(() => {
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
    setLogSheetInfo({ ...logSheetInfo, [name]: value });
  };

  const handleSaveLogSheet = async () => {
    try {
      if (editLogSheetId) {
        await axios.put(
          `http://localhost:5000/api/logsheet/${editLogSheetId}`,
          logSheetInfo
        );
      } else {
        await axios.post("http://localhost:5000/api/logsheet", logSheetInfo);
      }
      alert("Log sheet saved successfully!");
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
      if (showList) {
        fetchLogSheets();
      }
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
    setLogSheetInfo(logSheet);
    setEditLogSheetId(logSheet._id);
  };

  const handleDeleteLogSheet = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/logsheet/${id}`);
      alert("Log sheet deleted successfully!");
      if (showList) {
        fetchLogSheets();
      }
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
        <input
          type="text"
          name="vehicleNumber"
          placeholder="Vehicle Number"
          value={logSheetInfo.vehicleNumber}
          onChange={handleLogSheetInputChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="customerName"
          placeholder="Customer Name"
          value={logSheetInfo.customerName}
          onChange={handleLogSheetInputChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={logSheetInfo.location}
          onChange={handleLogSheetInputChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="openingReading"
          placeholder="Opening Reading"
          value={logSheetInfo.openingReading}
          onChange={handleLogSheetInputChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="closingReading"
          placeholder="Closing Reading"
          value={logSheetInfo.closingReading}
          onChange={handleLogSheetInputChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="total"
          placeholder="Total"
          value={logSheetInfo.total}
          onChange={handleLogSheetInputChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="driver"
          placeholder="Driver"
          value={logSheetInfo.driver}
          onChange={handleLogSheetInputChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="dieselQuantity"
          placeholder="Diesel Quantity"
          value={logSheetInfo.dieselQuantity}
          onChange={handleLogSheetInputChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="dieselAmount"
          placeholder="Diesel Amount"
          value={logSheetInfo.dieselAmount}
          onChange={handleLogSheetInputChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="remark"
          placeholder="Remark"
          value={logSheetInfo.remark}
          onChange={handleLogSheetInputChange}
          className="border p-2 rounded"
        />
        <div className="flex justify-end col-span-2">
          <button
            type="button"
            onClick={handleClearLogSheet}
            className="bg-[#5046e4]  text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={handleSaveLogSheet}
            className="bg-[#5046e4] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
                  <th>Vehicle Number</th>
                  <th>Customer Name</th>
                  <th>Location</th>
                  <th>Opening Reading</th>
                  <th>Closing Reading</th>
                  <th>Total</th>
                  <th>Driver</th>
                  <th>Diesel Quantity</th>
                  <th>Diesel Amount</th>
                  <th>Remark</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {logSheets.map((logSheet) => (
                  <tr key={logSheet._id}>
                    <td>{logSheet.vehicleNumber}</td>
                    <td>{logSheet.customerName}</td>
                    <td>{logSheet.location}</td>
                    <td>{logSheet.openingReading}</td>
                    <td>{logSheet.closingReading}</td>
                    <td>{logSheet.total}</td>
                    <td>{logSheet.driver}</td>
                    <td>{logSheet.dieselQuantity}</td>
                    <td>{logSheet.dieselAmount}</td>
                    <td>{logSheet.remark}</td>
                    <td>
                      <button
                        onClick={() => handleEditLogSheet(logSheet)}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteLogSheet(logSheet._id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Delete
                      </button>
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