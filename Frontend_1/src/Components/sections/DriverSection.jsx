/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Card from "../Card";

const DriverSection = ({
  showDriverForm,
  showDriverList,
  setShowDriverForm,
  setShowDriverList,
  drivers,
  setDrivers,
  driverInfo,
  setDriverInfo,
  handleSaveDriver,
  handleEditDriver: handleEditDriverProp,
  handleDeleteDriver: handleDeleteDriverProp,
}) => {
  const [driverInfoLocal, setDriverInfoLocal] = useState({
    DriverName: "",
    DriverAge: "",
    DriverLicense: "",
    Contact: "",
    _id: null,
  });

  useEffect(() => {
    setDriverInfoLocal(driverInfo);
  }, [driverInfo]);

  const handleDriverInputChange = (e) => {
    const { name, value } = e.target;
    setDriverInfoLocal({ ...driverInfoLocal, [name]: value });
  };

  const handleSubmitDriver = () => {
    handleSaveDriver(driverInfoLocal);
    resetForm();
  };

  const handleEditLocalDriver = (driver) => {
    setDriverInfoLocal(driver);
    setShowDriverForm(true);
    setShowDriverList(false);
  };

  const handleDeleteLocalDriver = (id) => {
    handleDeleteDriverProp(id);
  };

  const resetForm = () => {
    setDriverInfoLocal({
      DriverName: "",
      DriverAge: "",
      DriverLicense: "",
      Contact: "",
      _id: null,
    });
    setShowDriverForm(false);
    setShowDriverList(true);
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
            {driverInfoLocal._id && (
              <button
                type="button"
                onClick={resetForm}
                className="mt-4 bg-gray-300 text-gray-700 px-4 py-2 rounded shadow-md hover:bg-gray-400 text-sm"
              >
                Cancel
              </button>
            )}
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
              handleEditDriver={handleEditLocalDriver}
              handleDeleteDriver={handleDeleteLocalDriver}
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