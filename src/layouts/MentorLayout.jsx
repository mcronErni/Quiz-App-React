import React from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import Button from '../components/Button';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import Logout from '../components/Logout';
import { motion } from 'framer-motion';

export default function MentorLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-indigo-800 to-indigo-600 text-white px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.h1 
            className="text-2xl font-bold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Mentor Dashboard
          </motion.h1>
          <nav className="flex gap-3">
            <Button label="Create Quiz" navigateTo="create-quiz" variant="secondary" />
            <Button label="View Quizzes" navigateTo="view-quiz" variant="secondary" />
            <Logout />
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}