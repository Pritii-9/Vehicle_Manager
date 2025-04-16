import React from "react";
import BillingForm from "../vehicle/BillingForm";
import Card from "../Card";

const BillingSection = ({
  showBillingForm,
  showBillingList,
  handleBillSubmit,
  handleShowBillingListClick,
  handleInputChange,
  handleAddBill,
  billInfo,
  bills,
}) => (
  <>
    {showBillingForm && (
      <BillingForm
        setShowBillingList={handleShowBillingListClick}
        onBillSubmit={handleBillSubmit}
        onShowBillingListClick={handleShowBillingListClick}
        handleInputChange={handleInputChange}
        handleAddBill={handleAddBill}
        billInfo={billInfo}
      />
    )}
    {showBillingList && (
      <div className="p-6">
        <div className="bg-white shadow rounded-md p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Billing List</h2>
          {bills.length > 0 ? <Card data={bills} type="bill" /> : <p>No bills available.</p>}
        </div>
      </div>
    )}
  </>
);

export default BillingSection;