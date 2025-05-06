/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSpinner, FaListAlt, FaSave } from 'react-icons/fa';

// Helper for API calls - Ensure this retrieves your token correctly
const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken'); // Use your actual token key
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : null
    };
};

// Added onRenewalAdded prop
const RenewalMgt = ({
    setShowRenewalForm,
    setShowRenewalVehicleList,
    onRenewalAdded // Prop function to notify parent of new data
}) => {
    const [vehicleRenewal, setVehicleRenewal] = useState({
        vehicleNumber: "",
        renewalFor: "",
        issueDate: "",
        expiryDate: "",
    });
    const [vehicles, setVehicles] = useState([]);
    const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [formMessage, setFormMessage] = useState({ type: '', text: '' });

    // Fetch vehicles on mount
    useEffect(() => {
        const fetchVehicles = async () => {
            setIsLoadingVehicles(true);
            setFormMessage({ type: '', text: '' });
            try {
                const response = await axios.get("http://localhost:5000/api/vehicles", { headers: getAuthHeaders() });
                const vehicleNumbers = Array.isArray(response.data)
                   ? response.data.map((vehicle) => vehicle.Vehiclenumber)
                   : [];
                setVehicles(vehicleNumbers);
            } catch (error) {
                console.error("Error fetching vehicles:", error);
                setFormMessage({ type: 'error', text: 'Failed to fetch vehicles list.' });
            } finally {
                setIsLoadingVehicles(false);
            }
        };
        fetchVehicles();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setVehicleRenewal({ ...vehicleRenewal, [name]: value });
        if (formErrors[name]) {
            setFormErrors({ ...formErrors, [name]: "" });
        }
        if (formMessage.text) {
            setFormMessage({ type: '', text: '' });
        }
    };

    const validateForm = () => {
        let errors = {};
        if (!vehicleRenewal.vehicleNumber) errors.vehicleNumber = "Vehicle Number is required";
        if (!vehicleRenewal.renewalFor.trim()) errors.renewalFor = "Renewal For is required";
        if (!vehicleRenewal.issueDate) errors.issueDate = "Issue Date is required";
        if (!vehicleRenewal.expiryDate) errors.expiryDate = "Expiry Date is required";
        if (vehicleRenewal.issueDate && vehicleRenewal.expiryDate && new Date(vehicleRenewal.expiryDate) <= new Date(vehicleRenewal.issueDate)) {
             errors.expiryDate = "Expiry Date must be after Issue Date";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddRenewal = async (e) => {
        e.preventDefault();
        setFormMessage({ type: '', text: '' });
        if (!validateForm()) {
            return;
        }
        setIsSaving(true);

        const dataToSend = {
            vehiclenumber: vehicleRenewal.vehicleNumber, // Ensure keys match backend expectation
            renewalfor: vehicleRenewal.renewalFor,
            Issuedate: new Date(vehicleRenewal.issueDate).toISOString(),
            Expirydate: new Date(vehicleRenewal.expiryDate).toISOString(),
        };

        try {
            const response = await axios.post(
                "http://localhost:5000/api/renewals",
                dataToSend,
                { headers: getAuthHeaders() }
            );

            setFormMessage({ type: 'success', text: 'Vehicle Renewal added successfully!' });

            // Notify parent component that a new renewal was added
            if (onRenewalAdded) {
                onRenewalAdded(response.data); // Pass the new renewal data back
            }

            resetForm(); // Clear the form fields
            setFormErrors({});

            // **DO NOT hide the form or show the list automatically**
            // if (setShowRenewalForm) {
            //      setShowRenewalForm(false); // Removed this line
            // }
            // Removed: setShowRenewalVehicleList(true);

        } catch (error) {
            console.error("Error adding vehicle renewal:", error);
            let errorMessage = "Failed to add renewal. Please try again.";
            if (error.response) {
                 errorMessage = error.response.data?.message || errorMessage;
                 if (error.response.status === 401 || error.response.status === 403) {
                     errorMessage = "Authorization failed. Please log in again.";
                 }
            } else if (error.request) {
                 errorMessage = "Could not reach server.";
            }
            setFormMessage({ type: 'error', text: errorMessage });
        } finally {
            setIsSaving(false);
        }
    };

     const resetForm = () => {
          setVehicleRenewal({
             vehicleNumber: "", renewalFor: "", issueDate: "", expiryDate: "",
          });
     }

    const handleShowListClick = () => {
        // These props control visibility in the PARENT component
        if (setShowRenewalForm) setShowRenewalForm(false);
        if (setShowRenewalVehicleList) setShowRenewalVehicleList(true);
    }

    return (
        <div className="p-4 md:p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 pb-3 border-b">
                 <h2 className="text-xl md:text-2xl font-bold text-gray-800">Add Vehicle Renewal</h2>
                 <button
                     onClick={handleShowListClick}
                     className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-150 ease-in-out flex items-center text-sm"
                     title="Show Renewal List"
                 >
                     <FaListAlt className="mr-2" /> Renewal List
                 </button>
            </div>

            {/* Form Area */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                 {/* Form Message Area */}
                 {formMessage.text && (
                    <div className={`p-3 mb-5 rounded-md text-sm ${formMessage.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
                        {formMessage.text}
                    </div>
                 )}

                {/* Form */}
                <form onSubmit={handleAddRenewal} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                    {/* Vehicle Number Dropdown */}
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="vehicleNumber"> Vehicle Number * </label>
                         <select id="vehicleNumber" name="vehicleNumber" value={vehicleRenewal.vehicleNumber} onChange={handleInputChange} required disabled={isLoadingVehicles}
                            className={`shadow-sm border ${formErrors.vehicleNumber ? 'border-red-500 ring-red-500' : 'border-gray-300'} ${isLoadingVehicles ? 'bg-gray-100' : ''} rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out`} >
                            <option value="">{isLoadingVehicles ? 'Loading...' : 'Select Vehicle'}</option>
                            {vehicles.map((number) => ( <option key={number} value={number}> {number} </option> ))}
                         </select>
                         {formErrors.vehicleNumber && <p className="text-red-600 text-xs mt-1">{formErrors.vehicleNumber}</p>}
                    </div>
                    {/* Renewal For */}
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="renewalFor"> Renewal For * </label>
                         <input type="text" id="renewalFor" name="renewalFor" value={vehicleRenewal.renewalFor} onChange={handleInputChange} placeholder="e.g., Insurance, Permit, Tax" required
                            className={`shadow-sm border ${formErrors.renewalFor ? 'border-red-500 ring-red-500' : 'border-gray-300'} rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out`} />
                         {formErrors.renewalFor && <p className="text-red-600 text-xs mt-1">{formErrors.renewalFor}</p>}
                    </div>
                    {/* Issue Date */}
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="issueDate"> Issue Date * </label>
                         <input type="date" id="issueDate" name="issueDate" value={vehicleRenewal.issueDate} onChange={handleInputChange} required
                            className={`shadow-sm border ${formErrors.issueDate ? 'border-red-500 ring-red-500' : 'border-gray-300'} rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out`} />
                         {formErrors.issueDate && <p className="text-red-600 text-xs mt-1">{formErrors.issueDate}</p>}
                    </div>
                    {/* Expiry Date */}
                    <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="expiryDate"> Expiry Date * </label>
                          <input type="date" id="expiryDate" name="expiryDate" value={vehicleRenewal.expiryDate} onChange={handleInputChange} required
                              className={`shadow-sm border ${formErrors.expiryDate ? 'border-red-500 ring-red-500' : 'border-gray-300'} rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out`} />
                          {formErrors.expiryDate && <p className="text-red-600 text-xs mt-1">{formErrors.expiryDate}</p>}
                    </div>
                    {/* Submit Button */}
                    <div className="sm:col-span-2 flex justify-end mt-4 pt-4 border-t">
                          <button type="submit" disabled={isSaving}
                             className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center" >
                              {isSaving ? ( <> <FaSpinner className="animate-spin mr-2" /> Saving... </> ) : ( <> <FaSave className="mr-2" /> Add Renewal </> )}
                          </button>
                    </div>
                 </form>
             </div>
        </div>
     );
};

export default RenewalMgt;