import axios from "axios";
import { API_BASE_URL } from "../../api.js";

export const handleRenewalInputChange = (setVehicleRenewal) => (e) => {
  const { name, value } = e.target;
  setVehicleRenewal((prevRenewal) => ({ ...prevRenewal, [name]: value }));
};

export const handleRenewalVehicle = (vehicleRenewal, setRenewalVehicles, setShowRenewalForm, setShowRenewalVehicleList) => async () => {
  if (
    !vehicleRenewal.vehiclenumber ||
    !vehicleRenewal.renewalfor ||
    !vehicleRenewal.Issuedate ||
    !vehicleRenewal.Expirydate
  ) {
    alert("Please fill out all fields before adding the vehicle renewal.");
    return;
  }
  try {
    const response = await axios.post(`${API_BASE_URL}/renewals`, vehicleRenewal);
    setRenewalVehicles((prevRenewals) => [...prevRenewals, response.data]);
    alert("Vehicle Renewal added successfully!");
    setShowRenewalForm(false);
    setShowRenewalVehicleList(true);
  } catch (error) {
    console.error("Error adding vehicle renewal:", error);
    alert("Failed to add vehicle renewal.");
  }
};