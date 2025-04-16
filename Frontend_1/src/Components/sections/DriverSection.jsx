import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../Card";

const DriverSection = ({
  showDriverForm,
  showDriverList,
  setShowDriverForm: setAppShowDriverForm,
  setShowDriverList: setAppShowDriverList,
  drivers,
  setDrivers,
  driverInfo,
  setDriverInfo,
  fetchDrivers,
  handleEditDriver,
  handleDeleteDriver,
}) => {
  const [driverInfoLocal, setDriverInfoLocal] = useState({
    DriverName: "",
    DriverAge: "",
    DriverLicense: "",
    Contact: "",
  });

  useEffect(() => {
    setDriverInfoLocal(driverInfo);
  }, [driverInfo]);

  const handleDriverInputChange = (e) => {
    const { name, value } = e.target;
    setDriverInfoLocal({ ...driverInfoLocal, [name]: value });
  };

  const handleAddDriver = async () => {
    try {
      console.log("Driver Info to Post:", driverInfoLocal);
      const response = await axios.post("http://localhost:5000/api/drivers", driverInfoLocal);
      console.log("Response from add driver:", response);
      setDrivers((prevDrivers) => [...prevDrivers, response.data]);
      alert("Driver added successfully!");
      setDriverInfo({
        DriverName: "",
        DriverAge: "",
        DriverLicense: "",
        Contact: "",
      });
      setAppShowDriverForm(false);
      setAppShowDriverList(true);
      fetchDrivers();
    } catch (error) {
      console.error("Error adding driver:", error);
      if (error.response) {
        console.error("Server Response:", error.response.data);
        console.error("Status Code:", error.response.status);
      }
      alert("Failed to add driver. Check console for details.");
    }
  };

  const handleUpdateDriver = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/drivers/${id}`, driverInfoLocal);
      setDrivers(drivers.map((driver) => (driver._id === id ? response.data : driver)));
      alert("Driver updated successfully!");
      setAppShowDriverForm(false);
      setAppShowDriverList(true);
      fetchDrivers();
    } catch (error) {
      console.error("Error updating driver:", error);
      alert("Failed to update driver.");
    }
  };

  const handleSubmitDriver = () => {
    if (driverInfoLocal._id) {
      handleUpdateDriver(driverInfoLocal._id);
    } else {
      handleAddDriver();
    }
  };

  return (
    <>
      {showDriverForm && (
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {driverInfoLocal._id ? "Edit Driver" : "Add Driver"}
          </h2>
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2 text-gray-600">
                Driver Name
              </label>
              <input
                type="text"
                name="DriverName"
                value={driverInfoLocal.DriverName}
                onChange={handleDriverInputChange}
                placeholder="Driver Name"
                required
                className="border border-gray-300 rounded w-full p-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-gray-600">
                Driver Age
              </label>
              <input
                type="number"
                name="DriverAge"
                value={driverInfoLocal.DriverAge}
                onChange={handleDriverInputChange}
                placeholder="Driver Age"
                required
                className="border border-gray-300 rounded w-full p-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-gray-600">
                Driver License
              </label>
              <input
                type="text"
                name="DriverLicense"
                value={driverInfoLocal.DriverLicense}
                onChange={handleDriverInputChange}
                placeholder="Driver License"
                required
                className="border border-gray-300 rounded w-full p-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-gray-600">
                Contact
              </label>
              <input
                type="text"
                name="Contact"
                value={driverInfoLocal.Contact}
                onChange={handleDriverInputChange}
                placeholder="Contact Number"
                required
                className="border border-gray-300 rounded w-full p-2"
              />
            </div>
            <button
              type="button"
              onClick={handleSubmitDriver}
              className="mt-4 bg-[#5046e4] text-white px-4 py-2 rounded shadow-md hover:bg-blue text-sm"
            >
              {driverInfoLocal._id ? "Update Driver" : "Add Driver"}
            </button>
          </form>
        </div>
      )}
      {showDriverList && (
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">All Drivers</h2>
          {drivers.length > 0 ? (
            <Card
              data={drivers}
              type="driver"
              handleEditDriver={handleEditDriver}
              handleDeleteDriver={handleDeleteDriver}
            />
          ) : (
            <p>No drivers available.</p>
          )}
        </div>
      )}
    </>
  );
};

export default DriverSection;
