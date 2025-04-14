import React from "react";
import Home from "../pages/Home";

const HomeSection = ({ showHome, setShowBillingForm, displayedRate }) =>
  showHome && <Home setShowBillingForm={setShowBillingForm} displayedRate={displayedRate} />;

export default HomeSection;