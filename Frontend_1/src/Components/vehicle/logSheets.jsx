/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSpinner, FaEdit, FaTrash, FaListAlt, FaEye, FaEyeSlash } from 'react-icons/fa'; // Added more icons

// Helper for API calls - Ensure this retrieves your token correctly
const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken'); // Use your actual token key
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : null
        // Add other headers if needed
    };
};

const LogSheets = ({ setShowLogSheetList }) => {
    const [logSheetInfo, setLogSheetInfo] = useState({
        vehicleNumber: "", customerName: "", location: "", openingReading: "",
        closingReading: "", total: "", driver: "", dieselQuantity: "",
        dieselAmount: "", remark: "",
        // date: new Date().toISOString().split('T')[0], // Optional date field
    });
    const [logSheets, setLogSheets] = useState([]);
    const [editLogSheetId, setEditLogSheetId] = useState(null);
    const [showList, setShowList] = useState(false);
    const [drivers, setDrivers] = useState([]);
    const [vehicles, setVehicles] = useState([]);

    const [isLoadingList, setIsLoadingList] = useState(false);
    const [isLoadingDrivers, setIsLoadingDrivers] = useState(false);
    const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(null);
    const [formMessage, setFormMessage] = useState({ type: '', text: '' });
    const [listMessage, setListMessage] = useState({ type: '', text: '' });

    // Fetch Initial Data (Drivers, Vehicles)
    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoadingDrivers(true);
            setIsLoadingVehicles(true);
            setListMessage({ type: '', text: '' });
            try {
                const driversResponse = await axios.get("http://localhost:5000/api/drivers", { headers: getAuthHeaders() });
                setDrivers(driversResponse.data);
            } catch (error) {
                console.error("Error fetching drivers:", error);
                setListMessage({ type: 'error', text: 'Failed to fetch drivers.' });
            } finally {
                setIsLoadingDrivers(false);
            }

            try {
                const vehiclesResponse = await axios.get("http://localhost:5000/api/vehicles", { headers: getAuthHeaders() });
                const vehicleNumbers = Array.isArray(vehiclesResponse.data)
                     ? vehiclesResponse.data.map((vehicle) => vehicle.Vehiclenumber)
                     : [];
                setVehicles(vehicleNumbers);
            } catch (error) {
                console.error("Error fetching vehicles:", error);
                 setListMessage({ type: 'error', text: 'Failed to fetch vehicles.' });
            } finally {
                setIsLoadingVehicles(false);
            }
        };
        fetchInitialData();
    }, []);

    // Fetch Log Sheets when showList becomes true
     useEffect(() => {
         if (showList) {
             fetchLogSheets();
         }
     }, [showList]);

    const fetchLogSheets = async () => {
        setIsLoadingList(true);
        setListMessage({ type: '', text: '' });
        try {
            const response = await axios.get("http://localhost:5000/api/logsheet", { headers: getAuthHeaders() });
            setLogSheets(response.data);
        } catch (error) {
            console.error("Error fetching log sheets:", error);
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                 setListMessage({ type: 'error', text: 'Authorization failed. Please log in again.' });
            } else {
                 setListMessage({ type: 'error', text: 'Failed to fetch log sheets.' });
            }
        } finally {
            setIsLoadingList(false);
        }
    };

    const handleLogSheetInputChange = (e) => {
        const { name, value } = e.target;
        if (formMessage.text) setFormMessage({ type: '', text: '' });
        setLogSheetInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
    };

    const resetForm = () => {
         setLogSheetInfo({
             vehicleNumber: "", customerName: "", location: "", openingReading: "",
             closingReading: "", total: "", driver: "", dieselQuantity: "",
             dieselAmount: "", remark: "",
             // date: new Date().toISOString().split('T')[0],
         });
         setEditLogSheetId(null);
    }

    const handleSaveLogSheet = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setFormMessage({ type: '', text: '' });
        try {
            let response;
            const apiUrl = "http://localhost:5000/api/logsheet";
            const headers = getAuthHeaders();

            if (!logSheetInfo.vehicleNumber || !logSheetInfo.driver) {
                 setFormMessage({ type: 'error', text: 'Vehicle Number and Driver are required.' });
                 setIsSaving(false);
                 return;
            }

            if (editLogSheetId) {
                response = await axios.put(`${apiUrl}/${editLogSheetId}`, logSheetInfo, { headers });
                setLogSheets((prev) => prev.map((ls) => (ls._id === editLogSheetId ? response.data : ls)));
                setFormMessage({ type: 'success', text: 'Log sheet updated successfully!' });
            } else {
                response = await axios.post(apiUrl, logSheetInfo, { headers });
                if (showList) {
                    setLogSheets((prev) => [...prev, response.data]);
                }
                setFormMessage({ type: 'success', text: 'Log sheet saved successfully!' });
            }
            resetForm();
            // List visibility state is not changed here anymore

        } catch (error) {
            console.error("Error saving log sheet:", error.response?.data?.message || error.message);
             if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                  setFormMessage({ type: 'error', text: 'Authorization failed. Please log in again.' });
             } else {
                  setFormMessage({ type: 'error', text: `Failed to save log sheet: ${error.response?.data?.message || 'Server error'}` });
             }
        } finally {
            setIsSaving(false);
        }
    };

    const handleClearLogSheet = () => {
        resetForm();
        setFormMessage({ type: '', text: '' });
    };

    const handleShowLogSheets = () => {
        setShowList(true);
    };

     const handleHideLogSheets = () => {
         setShowList(false);
     };

    const handleEditLogSheet = (logSheet) => {
        setLogSheetInfo({ ...logSheet });
        setEditLogSheetId(logSheet._id);
        setShowList(false);
        setFormMessage({ type: '', text: '' });
        window.scrollTo(0, 0);
    };

    const handleDeleteLogSheet = async (id) => {
        if (window.confirm("Are you sure you want to delete this log sheet?")) {
            setIsDeleting(id);
            setListMessage({ type: '', text: '' });
            try {
                await axios.delete(`http://localhost:5000/api/logsheet/${id}`, { headers: getAuthHeaders() });
                setLogSheets((prev) => prev.filter((ls) => ls._id !== id));
                setListMessage({ type: 'success', text: 'Log sheet deleted successfully!' });
            } catch (error) {
                console.error("Error deleting log sheet:", error);
                 if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                      setListMessage({ type: 'error', text: 'Authorization failed. Please log in again.' });
                 } else {
                      setListMessage({ type: 'error', text: 'Failed to delete log sheet.' });
                 }
            } finally {
                setIsDeleting(null);
            }
        }
    };

    // --- JSX Structure ---
    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Form Section */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                 {/* --- MODIFIED HEADER: Title and Show/Hide Button --- */}
                 <div className="flex justify-between items-center mb-6 border-b pb-3">
                     <h2 className="text-2xl font-bold text-gray-800">
                        {editLogSheetId ? "Edit Log Sheet" : "Add New Log Sheet"}
                     </h2>
                     <button
                         onClick={showList ? handleHideLogSheets : handleShowLogSheets}
                         className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition duration-150 ease-in-out flex items-center text-sm"
                         title={showList ? "Hide Log Sheet List" : "Show Log Sheet List"}
                     >
                         {showList ? <FaEyeSlash className="mr-2" /> : <FaEye className="mr-2" />}
                         {showList ? "Hide List" : "Show List"}
                     </button>
                 </div>
                 {/* --- END MODIFIED HEADER --- */}

                {/* Form Message Area */}
                 {formMessage.text && (
                    <div className={`p-3 mb-4 rounded-md text-sm ${formMessage.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
                        {formMessage.text}
                    </div>
                )}

                {/* Form Grid */}
                <form onSubmit={handleSaveLogSheet}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {/* Vehicle Number Dropdown */}
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vehicleNumber"> Vehicle Number * </label>
                            <select name="vehicleNumber" value={logSheetInfo.vehicleNumber} onChange={handleLogSheetInputChange} required
                                className={`shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out ${isLoadingVehicles ? 'bg-gray-100' : ''}`}
                                id="vehicleNumber" disabled={isLoadingVehicles} >
                                <option value="">{isLoadingVehicles ? "Loading..." : "Select Vehicle"}</option>
                                {vehicles.map((number) => ( <option key={number} value={number}> {number} </option> ))}
                            </select>
                        </div>
                        {/* Driver Dropdown */}
                         <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="driver"> Driver * </label>
                            <select name="driver" value={logSheetInfo.driver} onChange={handleLogSheetInputChange} required
                                className={`shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out ${isLoadingDrivers ? 'bg-gray-100' : ''}`}
                                id="driver" disabled={isLoadingDrivers} >
                                <option value="">{isLoadingDrivers ? "Loading..." : "Select Driver"}</option>
                                {drivers.map((driver) => ( <option key={driver._id} value={driver.DriverName}> {driver.DriverName} </option> ))}
                            </select>
                         </div>
                        {/* Customer Name */}
                         <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerName"> Customer Name </label>
                            <input type="text" name="customerName" placeholder="Customer Name" value={logSheetInfo.customerName} onChange={handleLogSheetInputChange} id="customerName"
                                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" />
                        </div>
                        {/* Location */}
                         <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">Location</label>
                            <input type="text" name="location" placeholder="Location" value={logSheetInfo.location} onChange={handleLogSheetInputChange} id="location"
                                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" />
                        </div>
                        {/* Opening Reading */}
                         <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="openingReading">Opening Reading</label>
                            <input type="number" name="openingReading" placeholder="e.g., 15000" value={logSheetInfo.openingReading} onChange={handleLogSheetInputChange} id="openingReading"
                                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" />
                        </div>
                        {/* Closing Reading */}
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="closingReading">Closing Reading</label>
                            <input type="number" name="closingReading" placeholder="e.g., 15500" value={logSheetInfo.closingReading} onChange={handleLogSheetInputChange} id="closingReading"
                                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" />
                        </div>
                        {/* Total Reading */}
                         <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="total">Total Reading</label>
                            <input type="number" name="total" placeholder="Total KM/Miles" value={logSheetInfo.total} onChange={handleLogSheetInputChange} id="total"
                                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" />
                         </div>
                        {/* Diesel Quantity */}
                         <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dieselQuantity">Diesel Quantity (Ltr)</label>
                            <input type="number" step="0.01" name="dieselQuantity" placeholder="e.g., 50.5" value={logSheetInfo.dieselQuantity} onChange={handleLogSheetInputChange} id="dieselQuantity"
                                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" />
                        </div>
                        {/* Diesel Amount */}
                         <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dieselAmount">Diesel Amount (₹)</label>
                            <input type="number" step="0.01" name="dieselAmount" placeholder="e.g., 4500.75" value={logSheetInfo.dieselAmount} onChange={handleLogSheetInputChange}
                                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                id="dieselAmount" />
                        </div>
                        {/* Remark */}
                        <div className="md:col-span-2 lg:col-span-3">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="remark">Remark</label>
                            <textarea name="remark" placeholder="Any remarks..." value={logSheetInfo.remark} onChange={handleLogSheetInputChange} id="remark" rows="2"
                                   className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"></textarea>
                        </div>
                    </div>

                     {/* Form Actions */}
                    <div className="flex justify-end items-center mt-6 pt-4 border-t">
                         <button type="button" onClick={handleClearLogSheet} disabled={isSaving}
                             className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-5 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 mr-3 transition duration-150 ease-in-out disabled:opacity-50" >
                             Clear
                         </button>
                         <button type="submit" disabled={isSaving}
                             className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center" >
                             {isSaving ? ( <><FaSpinner className="animate-spin mr-2" /> Saving...</> ) : ( editLogSheetId ? "Update Log Sheet" : "Save Log Sheet" )}
                         </button>
                    </div>
                </form>
            </div>

            {/* --- REMOVED centered Show/Hide List Button from here --- */}

            {/* Log Sheets List Section */}
            {showList && (
                <div className="mt-6 bg-white p-4 sm:p-6 rounded-lg shadow-lg border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Log Sheets List</h3>

                     {listMessage.text && (
                         <div className={`p-3 mb-4 rounded-md text-sm ${listMessage.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
                             {listMessage.text}
                         </div>
                    )}
                    {isLoadingList && (
                        <div className="flex justify-center items-center p-6 text-gray-600">
                            <FaSpinner className="animate-spin mr-3" size={20} /> Loading Log Sheets...
                        </div>
                    )}
                    {!isLoadingList && logSheets.length === 0 && (
                         <p className="text-center text-gray-500 py-4">No log sheets found.</p>
                    )}
                    {!isLoadingList && logSheets.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-3 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Veh No</th>
                                        <th className="py-3 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                                        <th className="py-3 px-4 border-b text-right text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">Open Rd</th>
                                        <th className="py-3 px-4 border-b text-right text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">Close Rd</th>
                                        <th className="py-3 px-4 border-b text-right text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">Total</th>
                                        <th className="py-3 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Driver</th>
                                        <th className="py-3 px-4 border-b text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Dsl Amt (₹)</th>
                                        <th className="py-3 px-4 border-b text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {logSheets.map((logSheet) => (
                                        <tr key={logSheet._id} className="hover:bg-gray-50 transition duration-100 even:bg-gray-50">
                                            <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">{logSheet.vehicleNumber}</td>
                                            <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">{logSheet.customerName}</td>
                                            <td className="py-3 px-4 text-sm text-gray-700 text-right hidden md:table-cell whitespace-nowrap">{logSheet.openingReading}</td>
                                            <td className="py-3 px-4 text-sm text-gray-700 text-right hidden md:table-cell whitespace-nowrap">{logSheet.closingReading}</td>
                                            <td className="py-3 px-4 text-sm text-gray-700 text-right hidden lg:table-cell whitespace-nowrap">{logSheet.total}</td>
                                            <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">{logSheet.driver}</td>
                                            <td className="py-3 px-4 text-sm text-gray-700 text-right whitespace-nowrap">{logSheet.dieselAmount ? parseFloat(logSheet.dieselAmount).toFixed(2) : 'N/A'}</td>
                                            <td className="py-3 px-4 text-center whitespace-nowrap">
                                                <div className="flex justify-center items-center space-x-2">
                                                    <button onClick={() => handleEditLogSheet(logSheet)} disabled={isDeleting === logSheet._id}
                                                        className="text-yellow-600 hover:text-yellow-800 disabled:opacity-50 disabled:cursor-not-allowed p-1 transition duration-150" title="Edit" >
                                                         <FaEdit />
                                                    </button>
                                                    <button onClick={() => handleDeleteLogSheet(logSheet._id)} disabled={isDeleting === logSheet._id}
                                                        className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed p-1 transition duration-150" title="Delete" >
                                                         {isDeleting === logSheet._id ? <FaSpinner className="animate-spin"/> : <FaTrash />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LogSheets;