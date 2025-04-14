import axios from "axios";
import { API_BASE_URL } from "../../api.js";

export const handleBillingFormClick = (setShowHome, setShowBillingForm, setShowBillingList) => () => {
  setShowHome(false);
  setShowBillingForm(true);
  setShowBillingList(false);
};

export const handleShowBillingListClick = (setShowHome, setShowAddVehicleForm, setShowVehicleList, setShowRenewalForm, setShowRenewalVehicleList, setShowLogSheetForm, setShowLogSheetList, setShowBillingForm, setShowBillingList) => () => {
  setShowHome(false);
  setShowAddVehicleForm(false);
  setShowVehicleList(false);
  setShowRenewalForm(false);
  setShowRenewalVehicleList(false);
  setShowLogSheetForm(false);
  setShowLogSheetList(false);
  setShowBillingForm(false);
  setShowBillingList(true);
};

export const handleBillSubmit = (setBills, setDisplayedRate) => (newBill) => {
  setBills((prevBills) => [...prevBills, newBill]);
  setDisplayedRate(newBill.rate);
};

export const handleInputChange = (setBillInfo) => (e) => {
  const { name, value } = e.target;
  setBillInfo((prevBillInfo) => ({ ...prevBillInfo, [name]: value }));
};

export const handleAddBill = (billInfo, setBills, setDisplayedRate, setShowBillingForm) => async () => {
  try {
    console.log("Billing data to be sent:", billInfo);
    const response = await axios.post(`${API_BASE_URL}/bills`, billInfo);
    console.log("Response from server:", response);
    alert("Bill added successfully!");
    setBills((prevBills) => [...prevBills, response.data]);
    setDisplayedRate(billInfo.rate);
    setShowBillingForm(false);
  } catch (error) {
    console.error("Error adding bill:", error);
    let errorMessage = "Failed to add bill. See console for details.";
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
    alert(errorMessage);
  }
};