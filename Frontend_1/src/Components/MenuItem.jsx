import React from "react";

const MenuItem = ({ label, onClick }) => {
  return (
    <li
    className="mt-2 cursor-pointer hover:text-skyBlue py-2 px-3 bg-white font-semibold "
    onClick={onClick}
    >
      {label}
    </li>
  );
};

export default MenuItem;