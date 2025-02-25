import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function UserDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bootcamperId, setBootcamperId] = useState(0);
  const [bootcamperName, setBootcamperName] = useState('');
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    highestScore: { title: '', score: 0, total: 0 },
    completedQuizzes: 0
  });

  // Get bootcamper info from cookies
  useEffect(() => {
    const bootcamperIdFromCookie = Cookies.get('bootcamperId');
    const bootcamperNameFromCookie = Cookies.get('bootcamperName');
    if (bootcamperIdFromCookie) {
      setBootcamperId(parseInt(bootcamperIdFromCookie));
      setBootcamperName(bootcamperNameFromCookie || 'Bootcamper');
    }
  }, []);

  // Fetch quizzes when bootcamperId changes
  useEffect(() => {
    const fetchData = async () => {
      if (bootcamperId === 0) return;
      
      try {
        const { data } = await axios.get(`https://localhost:7034/api/BootcamperQuiz/bootcamper/${bootcamperId}`);
        setQuizzes(data);
        calculateStats(data);
      } catch (err) {
        console.error('Error fetching quizzes:', err);
        setError('Failed to fetch quizzes');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [bootcamperId]);

  // Calculate dashboard statistics
  const calculateStats = (quizData) => {
    if (!quizData || quizData.length === 0) return;
    
    let totalScorePercentage = 0;
    let highestScoreQuiz = { title: '', score: 0, total: 0, percentage: 0 };
    
    quizData.forEach(quiz => {
      const percentage = (quiz.score / quiz.totalScore) * 100;
      totalScorePercentage += percentage;
      
      if (percentage > highestScoreQuiz.percentage) {
        highestScoreQuiz = {
          title: quiz.quizTitle,
          score: quiz.score,
          total: quiz.totalScore,
          percentage
        };
      }
    });
    
    setStats({
      totalQuizzes: quizData.length,
      averageScore: Math.round(totalScorePercentage / quizData.length),
      highestScore: highestScoreQuiz,
      completedQuizzes: quizData.length
    });
  };

  // Helper function to determine score color and grade
  const getScoreInfo = (score, totalScore) => {
    const percentage = (score / totalScore) * 100;
    let color, grade, bgColor;
    
    if (percentage >= 90) {
      color = "text-green-700";
      bgColor = "bg-green-100";
      grade = "A";
    } else if (percentage >= 80) {
      color = "text-green-600";
      bgColor = "bg-green-50";
      grade = "B";
    } else if (percentage >= 70) {
      color = "text-yellow-600";
      bgColor = "bg-yellow-50";
      grade = "C";
    } else if (percentage >= 60) {
      color = "text-orange-500";
      bgColor = "bg-orange-50";
      grade = "D";
    } else {
      color = "text-red-500";
      bgColor = "bg-red-50";
      grade = "F";
    }
    
    return { color, grade, bgColor, percentage };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Quizzes Yet</h2>
          <p className="text-gray-600 mb-4">You haven't completed any quizzes yet. Check with your mentor for available quizzes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold">{bootcamperName}'s Learning Dashboard</h1>
        <p className="opacity-80">Track your progress and quiz performance</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="text-gray-500 text-sm mb-1">Total Quizzes</div>
          <div className="text-2xl font-bold text-gray-800">{stats.totalQuizzes}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="text-gray-500 text-sm mb-1">Average Score</div>
          <div className="text-2xl font-bold text-gray-800">{stats.averageScore}%</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="text-gray-500 text-sm mb-1">Best Performance</div>
          <div className="text-2xl font-bold text-gray-800">{stats.highestScore.percentage}%</div>
          <div className="text-xs text-gray-500 truncate">{stats.highestScore.title}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="text-gray-500 text-sm mb-1">Completed</div>
          <div className="text-2xl font-bold text-gray-800">{stats.completedQuizzes}</div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quiz Results</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {quizzes.map((quiz, index) => {
                const { color, grade, bgColor, percentage } = getScoreInfo(quiz.score, quiz.totalScore);
                
                return (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {quiz.quizTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={color + " font-medium"}>{quiz.score}</span> / {quiz.totalScore}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`${bgColor} ${color} text-xs font-medium px-2.5 py-0.5 rounded`}>
                        {grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              percentage >= 90 ? 'bg-green-500' :
                              percentage >= 80 ? 'bg-green-400' :
                              percentage >= 70 ? 'bg-yellow-500' :
                              percentage >= 60 ? 'bg-orange-500' :
                              'bg-red-500'
                            }`} 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs w-8">{Math.round(percentage)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}