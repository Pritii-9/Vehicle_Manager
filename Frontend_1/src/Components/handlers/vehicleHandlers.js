import axios from "axios";
import { API_BASE_URL } from "../../api";

export const handleEditVehicle = (vehicle, setEditVehicleId, setShowAddVehicleForm, setShowVehicleList, setShowRenewalForm, setShowRenewalVehicleList, setShowLogSheetForm, setShowLogSheetList, setShowHome, setShowBillingForm, setShowBillingList, setVehicleInfo) => () => {
  setEditVehicleId(vehicle._id);
  setShowAddVehicleForm(true);
  setShowVehicleList(false);
  setShowRenewalForm(false);
  setShowRenewalVehicleList(false);
  setShowLogSheetForm(false);
  setShowLogSheetList(false);
  setShowHome(false);
  setShowBillingForm(false);
  setShowBillingList(false);
  setVehicleInfo({ ...vehicle });
};

export const handleDeleteVehicle = (id, setVehicles, setShowVehicleList) => async () => {
  try {
    await axios.delete(`${API_BASE_URL}/vehicles/${id}`);
    setVehicles((prevVehicles) => prevVehicles.filter((vehicle) => vehicle._id !== id));
    alert("Vehicle deleted successfully!");
    setShowVehicleList(true);
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    alert("Failed to delete vehicle.");
  }
};