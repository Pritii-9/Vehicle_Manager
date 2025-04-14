import React from "react";
import LogSheets from "../vehicle/logSheets";
import Card from "../Card";

const LogSheetSection = ({
  showLogSheetForm,
  showLogSheetList,
  logSheetInfo,
  handleLogSheetInputChange,
  handleAddLogSheet,
  handleUpdateLogSheet,
  editLogSheetId,
  setShowLogSheetForm,
  setShowLogSheetList,
  logSheets,
}) => (
  <>
    {showLogSheetForm && (
      <LogSheets
        {...{
          logSheetInfo,
          handleLogSheetInputChange,
          handleAddLogSheet,
          handleUpdateLogSheet,
          editLogSheetId,
          setShowLogSheetForm,
          setShowLogSheetList,
        }}
      />
    )}
    {showLogSheetList && (
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Log Sheets</h2>
        {logSheets.length > 0 ? <Card logSheets={logSheets} /> : <p>No log sheets available.</p>}
      </div>
    )}
  </>
);

export default LogSheetSection;