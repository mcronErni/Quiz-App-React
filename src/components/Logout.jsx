import React from 'react';
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      const response = await fetch("https://localhost:7034/api/Auth/logout", {
        method: "POST",
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      
      dispatch(logout());
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err.message);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <button
        type="button"
        onClick={handleLogout}
        className="px-4 py-2 font-medium rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer bg-red-500 text-white hover:bg-red-600 flex items-center"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>
        Logout
      </button>
    </motion.div>
  );
};

export default Logout;