/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSpinner, FaListAlt, FaSave } from 'react-icons/fa'; // Added icons

// Helper for API calls - Ensure this retrieves your token correctly
// You should centralize this in an api.js file ideally
const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken'); // Use your actual token key
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : null
    };
};

const BillingForm = ({ setShowBillingList, onBillSubmit, onShowBillingListClick }) => {
    // State for form fields
    const [billInfo, setBillInfo] = useState({
        billNumber: "",
        vehicleNumber: "", // This will now hold the selected value from dropdown
        quantity: "",
        rate: "",
        gst: "",
        date: new Date().toISOString().split('T')[0], // Default to today's date
    });

    // State for fetched vehicles
    const [vehicles, setVehicles] = useState([]);
    const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);

    // State for validation errors
    const [formErrors, setFormErrors] = useState({});

    // State for loading and feedback during submission
    const [isSaving, setIsSaving] = useState(false);
    const [formMessage, setFormMessage] = useState({ type: '', text: '' });

    // Fetch vehicles when component mounts
    useEffect(() => {
        const fetchVehicles = async () => {
            setIsLoadingVehicles(true);
            try {
                // *** Add Auth Header ***
                const response = await axios.get("http://localhost:5000/api/vehicles", { headers: getAuthHeaders() });
                // Ensure response.data is an array before mapping
                 const vehicleNumbers = Array.isArray(response.data)
                    ? response.data.map((vehicle) => vehicle.Vehiclenumber) // Extract only numbers
                    : [];
                setVehicles(vehicleNumbers);
            } catch (error) {
                console.error("Error fetching vehicles:", error);
                 // Display error fetching vehicles (can use formMessage or a dedicated state)
                 setFormMessage({ type: 'error', text: 'Failed to fetch vehicles list.' });
            } finally {
                setIsLoadingVehicles(false);
            }
        };
        fetchVehicles();
    }, []); // Empty dependency array runs once on mount


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBillInfo({ ...billInfo, [name]: value });
        // Clear validation error for this field when user types
        if (formErrors[name]) {
             setFormErrors({ ...formErrors, [name]: "" });
        }
         // Clear general form message on input change
         if (formMessage.text) {
             setFormMessage({ type: '', text: '' });
         }
    };

    const validateForm = () => {
        let errors = {};
        if (!billInfo.billNumber.trim()) errors.billNumber = "Bill Number is required";
        if (!billInfo.vehicleNumber) errors.vehicleNumber = "Vehicle Number is required"; // Check if selected
        if (!billInfo.quantity) errors.quantity = "Quantity is required";
        else if (isNaN(Number(billInfo.quantity)) || Number(billInfo.quantity) <= 0) errors.quantity = "Quantity must be a positive number";
        if (!billInfo.rate) errors.rate = "Rate is required";
        else if (isNaN(Number(billInfo.rate)) || Number(billInfo.rate) <= 0) errors.rate = "Rate must be a positive number";
        // Allow empty GST, but validate format if provided
        if (billInfo.gst && !/^\d+(\.\d+)?%?$/.test(billInfo.gst.trim())) errors.gst = "Invalid GST format (e.g., 18 or 18%)";
        if (!billInfo.date) errors.date = "Date is required";

        setFormErrors(errors); // Update state with all errors
        return Object.keys(errors).length === 0; // Return true if no errors
    };

    const handleAddBill = async (e) => {
         e.preventDefault(); // Prevent default form submission
         setFormMessage({ type: '', text: '' }); // Clear previous message

         if (!validateForm()) {
            return; // Stop submission if validation fails
         }

         setIsSaving(true); // Set loading state

         // Prepare data - ensure numeric types, parse GST
         const dataToSend = {
             ...billInfo,
             quantity: parseFloat(billInfo.quantity),
             rate: parseFloat(billInfo.rate),
             // Send GST as number, remove '%' if present, default to 0 if empty/invalid
             gst: billInfo.gst ? (billInfo.gst.endsWith('%') ? parseFloat(billInfo.gst.slice(0, -1)) : parseFloat(billInfo.gst)) || 0 : 0,
             // Ensure date is sent in a format backend expects (e.g., ISO string)
             date: new Date(billInfo.date).toISOString()
         };

         try {
             console.log("Billing data to be sent:", dataToSend);
             // *** Add Auth Header ***
             const response = await axios.post("http://localhost:5000/api/bills", dataToSend, { headers: getAuthHeaders() });
             console.log("Response from server:", response);

             setFormMessage({ type: 'success', text: 'Bill added successfully!' });

             if (onBillSubmit) {
                 onBillSubmit(response.data); // Notify parent about the new bill
             }

             // Reset form fields
             setBillInfo({
                 billNumber: "", vehicleNumber: "", quantity: "", rate: "", gst: "",
                 date: new Date().toISOString().split('T')[0],
             });
             setFormErrors({}); // Clear validation errors

             // **DO NOT** automatically show the list anymore
             // if (onShowBillingListClick) {
             //     onShowBillingListClick(); // This line is now removed/commented out
             // }

         } catch (error) {
             console.error("Error adding bill:", error);
             let errorMessage = "Failed to add bill. Please try again.";
             if (error.response) {
                 console.error("Server response data:", error.response.data);
                 console.error("Server response status:", error.response.status);
                 // Use server message if available
                 errorMessage = error.response.data?.message || errorMessage;
                 // Handle auth errors specifically
                 if (error.response.status === 401 || error.response.status === 403) {
                     errorMessage = "Authorization failed. Please log in again.";
                     // Potentially redirect to login
                 }
             } else if (error.request) {
                 console.error("Request error:", error.request);
                 errorMessage = "Could not reach server. Please check network connection.";
             } else {
                 console.error("Error message:", error.message);
             }
             setFormMessage({ type: 'error', text: errorMessage });
         } finally {
              setIsSaving(false); // Reset loading state
         }
    };

    return (
        <div className="p-4 md:p-6">
            {/* Header with Title and Show List Button */}
            <div className="flex justify-between items-center mb-4 pb-3 border-b">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Add New Bill</h2>
                <button
                    onClick={onShowBillingListClick} // Prop to show list view
                    className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-150 ease-in-out flex items-center text-sm"
                    title="Show Billing List"
                >
                    <FaListAlt className="mr-2" /> Bill List
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

                {/* Use onSubmit on the form element */}
                <form onSubmit={handleAddBill} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                    {/* Bill Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="billNumber">
                             Bill Number *
                        </label>
                        <input
                            type="text"
                            id="billNumber"
                            name="billNumber"
                            value={billInfo.billNumber}
                            onChange={handleInputChange}
                            placeholder="Enter Bill Number"
                            required
                            className={`shadow-sm border ${formErrors.billNumber ? 'border-red-500 ring-red-500' : 'border-gray-300'} rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out`}
                         />
                         {formErrors.billNumber && <p className="text-red-600 text-xs mt-1">{formErrors.billNumber}</p>}
                    </div>

                    {/* Vehicle Number Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="vehicleNumber">
                             Vehicle Number *
                        </label>
                        <select
                            id="vehicleNumber"
                            name="vehicleNumber"
                            value={billInfo.vehicleNumber}
                            onChange={handleInputChange}
                            required
                            disabled={isLoadingVehicles}
                            className={`shadow-sm border ${formErrors.vehicleNumber ? 'border-red-500 ring-red-500' : 'border-gray-300'} ${isLoadingVehicles ? 'bg-gray-100' : ''} rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out`}
                         >
                            <option value="">{isLoadingVehicles ? 'Loading...' : 'Select Vehicle'}</option>
                            {vehicles.map((number) => (
                                <option key={number} value={number}>
                                    {number}
                                </option>
                            ))}
                         </select>
                         {formErrors.vehicleNumber && <p className="text-red-600 text-xs mt-1">{formErrors.vehicleNumber}</p>}
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="quantity">
                             Quantity *
                        </label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            step="any" // Allows decimals
                            value={billInfo.quantity}
                            onChange={handleInputChange}
                            placeholder="e.g., 100"
                            required
                            className={`shadow-sm border ${formErrors.quantity ? 'border-red-500 ring-red-500' : 'border-gray-300'} rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out`}
                         />
                         {formErrors.quantity && <p className="text-red-600 text-xs mt-1">{formErrors.quantity}</p>}
                    </div>

                    {/* Rate */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="rate">
                             Rate (per unit) *
                        </label>
                        <input
                            type="number"
                            id="rate"
                            name="rate"
                            step="any" // Allows decimals
                            value={billInfo.rate}
                            onChange={handleInputChange}
                            placeholder="e.g., 50.75"
                            required
                            className={`shadow-sm border ${formErrors.rate ? 'border-red-500 ring-red-500' : 'border-gray-300'} rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out`}
                         />
                         {formErrors.rate && <p className="text-red-600 text-xs mt-1">{formErrors.rate}</p>}
                    </div>

                    {/* GST */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="gst">
                             GST (%) (Optional)
                        </label>
                        <input
                            type="text" // Use text to allow '%' sign
                            id="gst"
                            name="gst"
                            value={billInfo.gst}
                            onChange={handleInputChange}
                            placeholder="e.g., 18 or 18%"
                            className={`shadow-sm border ${formErrors.gst ? 'border-red-500 ring-red-500' : 'border-gray-300'} rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out`}
                         />
                         {formErrors.gst && <p className="text-red-600 text-xs mt-1">{formErrors.gst}</p>}
                    </div>

                    {/* Date */}
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="date">
                             Bill Date *
                         </label>
                         <input
                             type="date"
                             id="date"
                             name="date"
                             value={billInfo.date}
                             onChange={handleInputChange}
                             required
                             className={`shadow-sm border ${formErrors.date ? 'border-red-500 ring-red-500' : 'border-gray-300'} rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out`}
                         />
                         {formErrors.date && <p className="text-red-600 text-xs mt-1">{formErrors.date}</p>}
                    </div>

                    {/* Submit Button */}
                    <div className="sm:col-span-2 flex justify-end mt-4 pt-4 border-t"> {/* Span across columns and align right */}
                         <button
                            type="submit" // Changed type to submit
                            disabled={isSaving}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                         >
                             {isSaving ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2" /> Saving...
                                </>
                             ) : (
                                <>
                                    <FaSave className="mr-2" /> Submit Bill
                                </>
                             )}
                         </button>
                    </div>
                 </form>
            </div>
        </div>
     );
};

export default BillingForm;