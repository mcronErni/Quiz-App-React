import React from 'react';
import { motion } from 'framer-motion';

const InputField = ({ label, type, value, onChange, disabled, placeholder }) => {
  return (
    <motion.div 
      className="mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className="block text-lg font-semibold text-indigo-900 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`mt-1 p-3 border ${disabled ? 'bg-gray-100' : 'bg-white'} border-indigo-200 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${disabled ? 'opacity-75 cursor-not-allowed' : ''}`}
      />
    </motion.div>
  );
};

export default InputField;