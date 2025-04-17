import axios from "axios";
export const API_BASE_URL = "http://localhost:5000/api";

export const fetchLogSheets = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/logsheet`);
    return response.data;
  } catch (error) {
    console.error("Error fetching log sheets:", error);
    throw error; // Re-throw the error for the component to handle
  }
};

export const fetchVehicles = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/vehicles`);
    return response.data;
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    throw error;
  }
};

export const fetchRenewals = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/renewals`);
    return response.data;
  } catch (error) {
    console.error("Error fetching renewals:", error);
    throw error;
  }
};

export const fetchBills = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bills`);
    return response.data;
  } catch (error) {
    console.error("Error fetching bills:", error);
    throw error;
  }
};

// Define and export the fetchDrivers function
export const fetchDrivers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/drivers`); // Adjust the API endpoint if needed
    return response.data;
  } catch (error) {
    console.error("Error fetching drivers:", error);
    throw error;
  }
};