/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaSpinner, FaListAlt, FaSave, FaEdit } from 'react-icons/fa';
import { API_BASE_URL } from "../../api"; // Assuming correct path

// Helper for API calls - Ensure this retrieves your token correctly
const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken'); // Use your actual token key
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : null
    };
};

// Refactored Props: Added onVehicleAdded, onVehicleUpdated. Removed direct setters like setVehicles.
const VehicleMgt = ({
    editVehicleId,
    vehicleTypes,
    // Visibility control props for "Vehicle List" button
    setShowAddVehicleForm,
    setShowVehicleList,
    setShowHome, // etc. - pass all needed to switch views correctly
    setShowRenewalForm, setShowRenewalVehicleList, setShowLogSheetForm, setShowLogSheetList, setShowBillingForm, setShowBillingList, setShowDriverForm, setShowDriverList,
    // Callbacks for parent to refetch data
    onVehicleAdded,
    onVehicleUpdated,
}) => {
    // --- State ---
    const [vehicleInfoLocal, setVehicleInfoLocal] = useState({
        vehicleNumber: "", ownerName: "", vehicleName: "", vehicleType: "",
        capacity: "", fuelType: "", year: "", mileage: "",
    });
    const [formErrors, setFormErrors] = useState({});
    const [isLoadingEditData, setIsLoadingEditData] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formMessage, setFormMessage] = useState({ type: '', text: '' });

    // --- Fetch data for editing ---
    useEffect(() => {
        setFormErrors({});
        setFormMessage({ type: '', text: '' });
        if (editVehicleId) {
            const fetchVehicleForEdit = async () => {
                setIsLoadingEditData(true);
                try {
                    const response = await axios.get(
                        `${API_BASE_URL}/vehicles/${editVehicleId}`,
                        { headers: getAuthHeaders() } // Auth added
                    );
                    setVehicleInfoLocal({ // Map backend keys (PascalCase) to frontend state (camelCase)
                        vehicleNumber: response.data.Vehiclenumber || "",
                        ownerName: response.data.OwnerName || "",
                        vehicleName: response.data.VehicleName || "",
                        vehicleType: response.data.VehicleType || "",
                        capacity: response.data.capacity || "",
                        fuelType: response.data.FuelType || "",
                        year: response.data.year || "",
                        mileage: response.data.mileage || "",
                    });
                } catch (error) {
                    console.error("Error fetching vehicle for edit:", error);
                    setFormMessage({ type: 'error', text: 'Failed to load vehicle data for editing.' });
                } finally {
                    setIsLoadingEditData(false);
                }
            };
            fetchVehicleForEdit();
        } else {
            resetForm(); // Reset form if not editing
        }
    }, [editVehicleId]);

    // --- Input Change Handler ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setVehicleInfoLocal({ ...vehicleInfoLocal, [name]: value });
        if (formErrors[name]) setFormErrors({ ...formErrors, [name]: "" });
        if (formMessage.text) setFormMessage({ type: '', text: '' });
    };

    // --- Validation ---
    const validateForm = () => {
        // (Validation logic remains the same as in previous response)
        let errors = {};
        if (!vehicleInfoLocal.vehicleNumber.trim()) errors.vehicleNumber = "Vehicle Number is required";
        if (!vehicleInfoLocal.ownerName.trim()) errors.ownerName = "Owner Name is required";
        if (!vehicleInfoLocal.vehicleName.trim()) errors.vehicleName = "Vehicle Name is required";
        if (!vehicleInfoLocal.vehicleType) errors.vehicleType = "Vehicle Type is required";
        if (!vehicleInfoLocal.capacity.trim()) errors.capacity = "Capacity is required";
        if (!vehicleInfoLocal.fuelType) errors.fuelType = "Fuel Type is required";
        if (!vehicleInfoLocal.year) errors.year = "Year is required";
        else if (isNaN(Number(vehicleInfoLocal.year)) || vehicleInfoLocal.year.length !== 4) errors.year = "Enter a valid 4-digit year";
        if (!vehicleInfoLocal.mileage) errors.mileage = "Mileage is required";
        else if (isNaN(Number(vehicleInfoLocal.mileage)) || Number(vehicleInfoLocal.mileage) < 0) errors.mileage = "Mileage must be >= 0";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // --- Form Submission Handler ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormMessage({ type: '', text: '' });
        if (!validateForm()) return;
        setIsSaving(true);

        // Map local state (camelCase) back to backend expected keys (PascalCase)
        const dataToSend = {
            Vehiclenumber: vehicleInfoLocal.vehicleNumber,
            OwnerName: vehicleInfoLocal.ownerName,
            VehicleName: vehicleInfoLocal.vehicleName,
            VehicleType: vehicleInfoLocal.vehicleType,
            capacity: vehicleInfoLocal.capacity,
            FuelType: vehicleInfoLocal.fuelType,
            year: parseInt(vehicleInfoLocal.year, 10),
            mileage: parseFloat(vehicleInfoLocal.mileage),
        };

        try {
            let response;
            const headers = getAuthHeaders(); // Get auth headers

            if (editVehicleId) { // --- UPDATE ---
                response = await axios.put( `${API_BASE_URL}/vehicles/${editVehicleId}`, dataToSend, { headers });
                setFormMessage({ type: 'success', text: 'Vehicle updated successfully!' });
                if (onVehicleUpdated) onVehicleUpdated(response.data); // Notify parent
                // Decide if you want to clear the form after update or keep showing data
                 // resetForm(); // Optional: Clear form after update
            } else { // --- ADD ---
                response = await axios.post( `${API_BASE_URL}/vehicles`, dataToSend, { headers });
                setFormMessage({ type: 'success', text: 'Vehicle added successfully!' });
                if (onVehicleAdded) onVehicleAdded(response.data); // Notify parent
                resetForm(); // Clear form after adding
            }
             // Form remains visible here

        } catch (error) {
             // (Error handling remains the same as in previous response)
            console.error("Error saving vehicle:", error);
            let errorMessage = `Failed to ${editVehicleId ? 'update' : 'add'} vehicle.`;
            if (error.response) {
                console.error("Server Response:", error.response.data);
                errorMessage = error.response.data?.message || errorMessage;
                 if (error.response.status === 401 || error.response.status === 403) {
                     errorMessage = "Authorization failed. Please log in again.";
                 } else if (error.response.status === 400 && error.response.data?.message?.includes('duplicate key')) {
                     errorMessage = "Vehicle Number already exists.";
                     setFormErrors(prev => ({ ...prev, vehicleNumber: "This Vehicle Number is already registered." }));
                 }
            } else if (error.request) {
                 errorMessage = "Could not reach server.";
            }
            setFormMessage({ type: 'error', text: errorMessage });
        } finally {
            setIsSaving(false);
        }
    };

    // --- Reset Form ---
     const resetForm = () => {
         setVehicleInfoLocal({
             vehicleNumber: "", ownerName: "", vehicleName: "", vehicleType: "",
             capacity: "", fuelType: "", year: "", mileage: "",
         });
         setFormErrors({});
         // If editing, parent should ideally clear editVehicleId via callback if needed
     }

    // --- Handler for "Vehicle List" button ---
    const handleShowListClick = () => {
        // Use props passed from AppContent to switch views
        if (setShowAddVehicleForm) setShowAddVehicleForm(false);
        if (setShowVehicleList) setShowVehicleList(true);
        // Hide others...
        if (setShowHome) setShowHome(false);
        if (setShowRenewalForm) setShowRenewalForm(false);
        if (setShowRenewalVehicleList) setShowRenewalVehicleList(false);
        if (setShowLogSheetForm) setShowLogSheetForm(false);
        if (setShowLogSheetList) setShowLogSheetList(false);
        if (setShowBillingForm) setShowBillingForm(false);
        if (setShowBillingList) setShowBillingList(false);
        if (setShowDriverForm) setShowDriverForm(false);
        if (setShowDriverList) setShowDriverList(false);
        // Parent should clear editVehicleId if needed when navigating away
    }

    // --- Render ---
    return (
        // Outer div structure matches previous refactored version
        <div className="p-4 md:p-6">
             {/* Header */}
             <div className="flex justify-between items-center mb-4 pb-3 border-b">
                 <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                     {editVehicleId ? "Edit Vehicle Information" : "Add Vehicle Information"}
                 </h2>
                 {/* This button now calls handleShowListClick which uses props from AppContent */}
                 <button
                     onClick={handleShowListClick}
                     className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-150 ease-in-out flex items-center text-sm"
                     title="Show Vehicle List"
                 >
                     <FaListAlt className="mr-2" /> Vehicle List
                 </button>
            </div>

            {/* Form Area */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                {isLoadingEditData && ( <div className="text-center p-6"><FaSpinner className="animate-spin inline mr-2" /> Loading data...</div> )}
                {formMessage.text && !isLoadingEditData && (
                    <div className={`p-3 mb-5 rounded-md text-sm ${formMessage.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
                        {formMessage.text}
                    </div>
                )}

                {!isLoadingEditData && (
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
                        {/* --- Form Inputs --- */}
                        {/* Vehicle Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="vehicleNumber">Vehicle Number *</label>
                            <input type="text" id="vehicleNumber" name="vehicleNumber" value={vehicleInfoLocal.vehicleNumber} onChange={handleInputChange} required disabled={isSaving || !!editVehicleId}
                                className={`shadow-sm border ${formErrors.vehicleNumber ? 'border-red-500 ring-red-500' : 'border-gray-300'} rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${editVehicleId ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
                            {formErrors.vehicleNumber && <p className="text-red-600 text-xs mt-1">{formErrors.vehicleNumber}</p>}
                            {editVehicleId && <p className="text-xs text-gray-500 mt-1">Cannot be changed.</p>}
                        </div>
                        {/* Owner Name */}
                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="ownerName"> Owner Name * </label>
                             <input type="text" id="ownerName" name="ownerName" value={vehicleInfoLocal.ownerName} onChange={handleInputChange} required disabled={isSaving}
                                 className={`shadow-sm border ${formErrors.ownerName ? 'border-red-500 ring-red-500' : 'border-gray-300'} rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`} />
                             {formErrors.ownerName && <p className="text-red-600 text-xs mt-1">{formErrors.ownerName}</p>}
                         </div>
                        {/* Vehicle Name */}
                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="vehicleName"> Vehicle Name * </label>
                             <input type="text" id="vehicleName" name="vehicleName" value={vehicleInfoLocal.vehicleName} onChange={handleInputChange} required disabled={isSaving}
                                 className={`shadow-sm border ${formErrors.vehicleName ? 'border-red-500 ring-red-500' : 'border-gray-300'} rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`} />
                             {formErrors.vehicleName && <p className="text-red-600 text-xs mt-1">{formErrors.vehicleName}</p>}
                         </div>
                        {/* Vehicle Type */}
                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="vehicleType"> Vehicle Type * </label>
                             <select id="vehicleType" name="vehicleType" value={vehicleInfoLocal.vehicleType} onChange={handleInputChange} required disabled={isSaving}
                                 className={`shadow-sm border ${formErrors.vehicleType ? 'border-red-500 ring-red-500' : 'border-gray-300'} rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`} >
                                 <option value="">Select Vehicle Type</option>
                                 {(vehicleTypes || []).map((type) => ( <option key={type} value={type}> {type} </option> ))}
                             </select>
                             {formErrors.vehicleType && <p className="text-red-600 text-xs mt-1">{formErrors.vehicleType}</p>}
                         </div>
                        {/* Capacity */}
                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="capacity"> Capacity * </label>
                             <input type="text" id="capacity" name="capacity" value={vehicleInfoLocal.capacity} onChange={handleInputChange} placeholder="e.g., 1 Ton" required disabled={isSaving}
                                 className={`shadow-sm border ${formErrors.capacity ? 'border-red-500 ring-red-500' : 'border-gray-300'} rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`} />
                             {formErrors.capacity && <p className="text-red-600 text-xs mt-1">{formErrors.capacity}</p>}
                         </div>
                        {/* Fuel Type */}
                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fuelType"> Fuel Type * </label>
                             <select id="fuelType" name="fuelType" value={vehicleInfoLocal.fuelType} onChange={handleInputChange} required disabled={isSaving}
                                 className={`shadow-sm border ${formErrors.fuelType ? 'border-red-500 ring-red-500' : 'border-gray-300'} rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`} >
                                 <option value="">Select Fuel Type</option>
                                 <option value="Petrol">Petrol</option> <option value="Diesel">Diesel</option> <option value="Electric">Electric</option> <option value="Hybrid">Hybrid</option> <option value="CNG">CNG</option>
                             </select>
                             {formErrors.fuelType && <p className="text-red-600 text-xs mt-1">{formErrors.fuelType}</p>}
                         </div>
                         {/* Year */}
                         <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="year"> Year * </label>
                             <input type="number" id="year" name="year" value={vehicleInfoLocal.year} onChange={handleInputChange} placeholder="e.g., 2020" required disabled={isSaving} min="1900" max={new Date().getFullYear() + 1}
                                 className={`shadow-sm border ${formErrors.year ? 'border-red-500 ring-red-500' : 'border-gray-300'} rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`} />
                             {formErrors.year && <p className="text-red-600 text-xs mt-1">{formErrors.year}</p>}
                         </div>
                         {/* Mileage */}
                         <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="mileage"> Mileage * </label>
                             <input type="number" step="0.1" id="mileage" name="mileage" value={vehicleInfoLocal.mileage} onChange={handleInputChange} placeholder="e.g., 15.5" required disabled={isSaving} min="0"
                                 className={`shadow-sm border ${formErrors.mileage ? 'border-red-500 ring-red-500' : 'border-gray-300'} rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`} />
                             {formErrors.mileage && <p className="text-red-600 text-xs mt-1">{formErrors.mileage}</p>}
                         </div>

                        {/* Submit Button */}
                        <div className="md:col-span-2 lg:col-span-3 flex justify-end mt-4 pt-4 border-t">
                            <button type="submit" disabled={isSaving || isLoadingEditData}
                                 className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center" >
                                 {isSaving ? ( <><FaSpinner className="animate-spin mr-2" /> Saving...</> )
                                          : ( editVehicleId ? <><FaEdit className="mr-2" /> Update Vehicle</> : <><FaSave className="mr-2" /> Add Vehicle</> )}
                             </button>
                        </div>
                    </form>
                 )}
            </div>
        </div>
    );
};

export default VehicleMgt;