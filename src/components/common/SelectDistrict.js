import React from "react";

function SelectDistrict({ name, label }) {
  return (
    <div className="relative rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
      <label
        htmlFor={name}
        className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
      >
        {label}
      </label>
      
    </div>
  );
}

export default SelectDistrict;
