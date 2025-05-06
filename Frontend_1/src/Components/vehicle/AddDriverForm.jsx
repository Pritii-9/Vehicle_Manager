import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../api';
import { FaSpinner, FaSave, FaEdit, FaListAlt } from 'react-icons/fa';

const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : null
    };
};

const AddDriverForm = ({ initialDriverInfo, onShowList, onDriverSaved }) => {
    const [driverInfoLocal, setDriverInfoLocal] = useState({
        driverName: '',
        driverAge: '',
        driverLicense: '',
        contact: '',
        _id: null,
    });

    const [formErrors, setFormErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [formMessage, setFormMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (initialDriverInfo) {
            setDriverInfoLocal({
                driverName: initialDriverInfo.DriverName || '',
                driverAge: initialDriverInfo.DriverAge || '',
                driverLicense: initialDriverInfo.DriverLicense || '',
                contact: initialDriverInfo.Contact || '',
                _id: initialDriverInfo._id || null,
            });
            setFormErrors({});
            setFormMessage({ type: '', text: '' });
        } else {
            resetForm();
        }
    }, [initialDriverInfo]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDriverInfoLocal({ ...driverInfoLocal, [name]: value });
        if (formErrors[name]) setFormErrors({ ...formErrors, [name]: "" });
        if (formMessage.text) setFormMessage({ type: '', text: '' });
    };

    const validateForm = () => {
        let errors = {};
        const phoneRegex = /^\d{10,15}$/;

        if (!driverInfoLocal.driverName.trim()) errors.driverName = "Driver Name is required";
        if (!driverInfoLocal.driverAge) errors.driverAge = "Driver Age is required";
        else if (isNaN(Number(driverInfoLocal.driverAge)) || Number(driverInfoLocal.driverAge) < 18 || Number(driverInfoLocal.driverAge) > 70) errors.driverAge = "Age must be between 18 and 70";
        if (!driverInfoLocal.driverLicense.trim()) errors.driverLicense = "Driver License is required";
        if (!driverInfoLocal.contact.trim()) errors.contact = "Contact Number is required";
        else if (!phoneRegex.test(driverInfoLocal.contact.trim())) errors.contact = "Enter a valid phone number (10-15 digits)";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormMessage({ type: '', text: '' });
        if (!validateForm()) return;
        setIsSaving(true);

        const dataToSend = {
            DriverName: driverInfoLocal.driverName,
            DriverAge: parseInt(driverInfoLocal.driverAge, 10),
            DriverLicense: driverInfoLocal.driverLicense,
            Contact: driverInfoLocal.contact,
        };

        const isEditing = !!driverInfoLocal._id;
        const url = isEditing ? `${API_BASE_URL}/drivers/${driverInfoLocal._id}` : `${API_BASE_URL}/drivers`;
        const method = isEditing ? 'put' : 'post';

        try {
            const response = await axios({
                method: method,
                url: url,
                data: dataToSend,
                headers: getAuthHeaders()
            });

            setFormMessage({ type: 'success', text: `Driver ${isEditing ? 'updated' : 'added'} successfully!` });

            if (onDriverSaved) {
                onDriverSaved(response.data);
            }

            if (!isEditing) {
                resetForm();
            } else {
                setFormErrors({});
            }

        } catch (error) {
            console.error(`Error ${isEditing ? 'updating' : 'adding'} driver:`, error);
            let errorMessage = `Failed to ${isEditing ? 'update' : 'add'} driver.`;
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
        setDriverInfoLocal({ driverName: '', driverAge: '', driverLicense: '', contact: '', _id: null });
        setFormErrors({});
    };

    return (
        <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-4 pb-3 border-b">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                    {driverInfoLocal._id ? 'Edit Driver Information' : 'Add New Driver'}
                </h2>
                {onShowList && (
                    <button
                        type="button"
                        onClick={onShowList}
                        className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-150 ease-in-out flex items-center text-sm"
                        title="Show Driver List"
                    >
                        <FaListAlt className="mr-2" /> Driver List
                    </button>
                )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                {formMessage.text && (
                    <div className={`p-3 mb-5 rounded-md text-sm ${formMessage.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
                        {formMessage.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="driverName"> Driver Name * </label>
                        <input type="text" id="driverName" name="driverName" value={driverInfoLocal.driverName} onChange={handleInputChange} required disabled={isSaving}
                            className={`shadow-sm border ${formErrors.driverName ? 'border-red-500 ring-red-500' : 'border-gray-300'} rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`} />
                        {formErrors.driverName && <p className="text-red-600 text-xs mt-1">{formErrors.driverName}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="driverAge"> Driver Age * </label>
                        <input type="number" id="driverAge" name="driverAge" value={driverInfoLocal.driverAge} onChange={handleInputChange} required disabled={isSaving} min="18" max="70"
                            className={`shadow-sm border ${formErrors.driverAge ? 'border-red-500 ring-red-500' : 'border-gray-300'} rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`} />
                        {formErrors.driverAge && <p className="text-red-600 text-xs mt-1">{formErrors.driverAge}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="driverLicense"> Driver License * </label>
                        <input type="text" id="driverLicense" name="driverLicense" value={driverInfoLocal.driverLicense} onChange={handleInputChange} required disabled={isSaving}
                            className={`shadow-sm border ${formErrors.driverLicense ? 'border-red-500 ring-red-500' : 'border-gray-300'} rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`} />
                        {formErrors.driverLicense && <p className="text-red-600 text-xs mt-1">{formErrors.driverLicense}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contact"> Contact Number * </label>
                        <input type="tel" id="contact" name="contact" value={driverInfoLocal.contact} onChange={handleInputChange} required disabled={isSaving} placeholder="e.g., 9876543210"
                            className={`shadow-sm border ${formErrors.contact ? 'border-red-500 ring-red-500' : 'border-gray-300'} rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`} />
                        {formErrors.contact && <p className="text-red-600 text-xs mt-1">{formErrors.contact}</p>}
                    </div>

                    <div className="sm:col-span-2 flex justify-end items-center mt-4 pt-4 border-t space-x-3">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isSaving ? (
                                <><FaSpinner className="animate-spin mr-2" /> Saving...</>
                            ) : (
                                driverInfoLocal._id ? <><FaEdit className="mr-2" /> Update Driver</> : <><FaSave className="mr-2" /> Add Driver</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDriverForm;
