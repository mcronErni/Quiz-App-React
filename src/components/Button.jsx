import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Button({ label, navigateTo, onClick, variant = "primary", icon }) {
  const getButtonClasses = () => {
    const baseClasses = "px-4 py-2 font-medium rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 cursor-pointer w-full flex items-center justify-center";
    
    switch (variant) {
      case "primary":
        return `${baseClasses} bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-400`;
      case "secondary":
        return `${baseClasses} bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-300`;
      case "danger":
        return `${baseClasses} bg-red-500 hover:bg-red-600 text-white focus:ring-red-300`;
      case "success":
        return `${baseClasses} bg-green-500 hover:bg-green-600 text-white focus:ring-green-300`;
      default:
        return `${baseClasses} bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-400`;
    }
  };

  const renderIcon = () => {
    if (!icon) return null; 
    
    switch (icon) {
      case "trash":
        return (
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  const buttonContent = (
    <motion.button
      type="button"
      onClick={onClick}
      className={getButtonClasses()}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {renderIcon()}
      {label}
    </motion.button>
  );

  return navigateTo ? (
    <NavLink to={navigateTo} className="no-underline">
      {buttonContent}
    </NavLink>
  ) : buttonContent;
}