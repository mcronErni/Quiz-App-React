import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AvailableQuizzesCard from '../components/AvailableQuizzesCard';
import { NavLink } from 'react-router-dom';
import Button from '../components/Button';
import { motion } from 'framer-motion';

export default function AvailableQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.get('https://localhost:7034/api/quiz');
        setQuizzes(response);
      } catch (error) {
        setError(error.message);
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-lg">
        <h3 className="text-red-600 font-semibold">Error loading quizzes</h3>
        <p className="text-red-500">{error}</p>
        <Button label="Try Again" onClick={() => window.location.reload()} variant="primary" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-900">Available Quizzes</h2>
        <Button label="Back to Dashboard" navigateTo="/user" variant="secondary" />
      </div>
      
      {quizzes.length === 0 ? (
        <div className="text-center p-6 bg-indigo-50 rounded-lg">
          <p className="text-indigo-600">No quizzes available at the moment.</p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="show"
        >
          {quizzes.map((quiz) => (
            <NavLink
              key={quiz.quizId}
              to={`${quiz.quizId}`}
              state={{ quiz }}
              className="no-underline"
            >
              <AvailableQuizzesCard quiz={quiz} />
            </NavLink>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}