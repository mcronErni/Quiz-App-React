import React from 'react';
import '../App.css';
import { NavLink } from 'react-router-dom';
import Button from './Button';
import { motion } from 'framer-motion';

export default function AvailableQuizzesCard({ quiz, role, onClick }) {
  return role === "mentor" ? (
    <motion.div 
      className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 p-5 rounded-xl w-64 shadow-lg hover:shadow-xl transition-all duration-300"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-xl font-bold text-indigo-900 mb-2">{quiz.quizTitle}</h3>
      <div className="flex items-center mb-3">
        <div className="bg-indigo-200 rounded-lg px-3 py-1">
          <span className="text-sm font-medium text-indigo-800">Score: {quiz.totalScore}</span>
        </div>
      </div>
      <p className="text-xs text-indigo-600 mb-4">ID: {quiz.quizId}</p>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <Button label="View" navigateTo={`${quiz.quizId}`} variant="primary" />
        <Button label="Edit" navigateTo={`/mentor/view-quiz/edit/${quiz.quizId}`} variant="secondary" />
      </div>
      <Button label="Delete" onClick={onClick} variant="danger" icon="trash" />
    </motion.div>
  ) : (
    <motion.div 
      className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 p-5 rounded-xl w-64 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-xl font-bold text-indigo-900 mb-2">{quiz.quizTitle}</h3>
      <p className="text-xs text-indigo-600 mb-2">ID: {quiz.quizId}</p>
      <div className="mt-4 pt-2 border-t border-indigo-200">
        <span className="text-sm text-indigo-700">Click to start quiz</span>
      </div>
    </motion.div>
  );
}