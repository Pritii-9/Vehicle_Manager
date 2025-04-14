import axios from "axios";
import { API_BASE_URL } from "../../api.js";

export const handleLogSheetInputChange = (setLogSheetInfo) => (e) => {
  const { name, value } = e.target;
  setLogSheetInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
};

export const handleAddLogSheet = (logSheetInfo, setLogSheets, setShowLogSheetForm, setShowLogSheetList) => async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/logsheet`, logSheetInfo);
    setLogSheets((prevLogSheets) => [...prevLogSheets, response.data]);
    setShowLogSheetForm(false);
    setShowLogSheetList(true);
    alert("Log sheet added successfully!");
  } catch (error) {
    console.error("Error adding log sheet:", error);
    alert("Failed to add log sheet.");
  }
};

export const handleUpdateLogSheet = (editLogSheetId, logSheetInfo, setLogSheets, setShowLogSheetForm, setShowLogSheetList, setEditLogSheetId) => async () => {
  if (!editLogSheetId) return;
  try {
    const response = await axios.put(`${API_BASE_URL}/logsheet/${editLogSheetId}`, logSheetInfo);
    setLogSheets((prevLogSheets) =>
      prevLogSheets.map((ls) => (ls._id === editLogSheetId ? response.data : ls))
    );
    setEditLogSheetId(null);
    setShowLogSheetForm(false);
    setShowLogSheetList(true);
    alert("Log sheet updated successfully!");
  } catch (error) {
    console.error("Error updating log sheet:", error);
    alert("Failed to update log sheet.");
  }
};

export const handleEditLogSheet = (logSheet, setEditLogSheetId, setLogSheetInfo, setShowLogSheetForm, setShowLogSheetList, setShowHome, setShowBillingForm, setShowBillingList) => () => {
  setEditLogSheetId(logSheet._id);
  setLogSheetInfo(logSheet);
  setShowLogSheetForm(true);
  setShowLogSheetList(false);
  setShowHome(false);
  setShowBillingForm(false);
  setShowBillingList(false);
};

export const handleDeleteLogSheet = (id, setLogSheets) => async () => {
  try {
    await axios.delete(`${API_BASE_URL}/logsheet/${id}`);
    setLogSheets((prevLogSheets) => prevLogSheets.filter((ls) => ls._id !== id));
    alert("Log sheet deleted successfully!");
  } catch (error) {
    console.error("Error deleting log sheet:", error);
    alert("Failed to delete log sheet.");
  }
};