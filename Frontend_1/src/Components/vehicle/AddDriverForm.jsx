import React, { useState, useEffect } from 'react';

const AddDriverForm = ({ onSave, initialDriverInfo, onCancel, onShowList }) => {
  const [driverInfoLocal, setDriverInfoLocal] = useState(
    initialDriverInfo || {
      DriverName: '',
      DriverAge: '',
      DriverLicense: '',
      Contact: '',
      _id: null,
    }
  );

  useEffect(() => {
    setDriverInfoLocal(initialDriverInfo || {
      DriverName: '',
      DriverAge: '',
      DriverLicense: '',
      Contact: '',
      _id: null,
    });
  }, [initialDriverInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDriverInfoLocal({ ...driverInfoLocal, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(driverInfoLocal);
    resetForm();
  };

  const resetForm = () => {
    setDriverInfoLocal({
      DriverName: '',
      DriverAge: '',
      DriverLicense: '',
      Contact: '',
      _id: null,
    });
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {driverInfoLocal._id ? 'Edit Driver' : 'Add Driver'}
        </h2>
        {onShowList && (
          <button
            type="button"
            onClick={onShowList}
            className="bg-[#5046e4] text-white  px-3 py-1 rounded shadow-md hover:bg-gray-400 text-sm"
          >
            Driver List
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold mb-2 text-gray-600">
            Driver Name
          </label>
          <input
            type="text"
            name="DriverName"
            value={driverInfoLocal.DriverName}
            onChange={handleInputChange}
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
            onChange={handleInputChange}
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
            onChange={handleInputChange}
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
            onChange={handleInputChange}
            placeholder="Contact Number"
            required
            className="border border-gray-300 rounded w-full p-2"
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-[#5046e4] text-white px-4 py-2 rounded shadow-md hover:bg-blue text-sm"
        >
          {driverInfoLocal._id ? 'Update Driver' : 'Add Driver'}
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
  );
};

export default AddDriverForm;