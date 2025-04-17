/* eslint-disable no-unused-vars */
import React from "react";
import Card from "../Card";

const DriverSection = ({ drivers, onEdit, onDelete, onAdd }) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">All Drivers</h2>
      {drivers.length > 0 ? (
        <Card
          data={drivers}
          type="driver"
          handleEditDriver={onEdit}
          handleDeleteDriver={onDelete}
          onShowDriverForm={onAdd} // Pass the onAdd function here
        />
      ) : (
        <p>No drivers available.</p>
      )}
    </div>
  );
};

export default DriverSection;