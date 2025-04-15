import React from "react";
import Home from "../pages/Home";

const HomeSection = ({ showHome, setShowBillingForm, displayedRate, renewalVehicles }) =>
  showHome && <Home setShowBillingForm={setShowBillingForm} displayedRate={displayedRate} renewalVehicles={renewalVehicles} />;

export default HomeSection;