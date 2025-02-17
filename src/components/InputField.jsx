// InputField.js
import React from 'react';

const InputField = ({ label, type, value, onChange, disabled }) => {
  return (
    <div className="mb-4">
      <label className="block text-lg font-semibold text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default InputField;
