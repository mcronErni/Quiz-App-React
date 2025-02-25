import React, { useState } from 'react';
import Button from '../components/Button';
import '../index.css';

export default function MentorDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data for dashboard
  const students = [
    { id: 1, name: "Alex Johnson", progress: 78, lastActivity: "2 hours ago" },
    { id: 2, name: "Jamie Smith", progress: 45, lastActivity: "1 day ago" },
    { id: 3, name: "Taylor Wilson", progress: 92, lastActivity: "5 hours ago" },
    { id: 4, name: "Morgan Lee", progress: 62, lastActivity: "3 days ago" }
  ];

  const upcomingSessions = [
    { id: 1, student: "Alex Johnson", date: "Feb 27, 2025", time: "3:00 PM", topic: "React Fundamentals" },
    { id: 2, student: "Jamie Smith", date: "Feb 28, 2025", time: "2:30 PM", topic: "Career Guidance" }
  ];

  const renderProgressBar = (percent) => {
    const bgColor = percent > 75 ? "bg-green-500" : percent > 50 ? "bg-blue-500" : "bg-orange-400";
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className={`${bgColor} h-2.5 rounded-full`} style={{ width: `${percent}%` }}></div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Mentor Dashboard</h1>
        <div className="flex gap-4">
          <Button 
            label="Schedule Session" 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          />
          <Button 
            label="Messages" 
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors flex items-center"
          >
            <span>Messages</span>
            <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
          </Button>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="text-gray-500 mb-2">Total Students</div>
          <div className="text-3xl font-bold">12</div>
          <div className="text-green-500 text-sm mt-2">+2 this month</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="text-gray-500 mb-2">Upcoming Sessions</div>
          <div className="text-3xl font-bold">5</div>
          <div className="text-gray-500 text-sm mt-2">Next: Tomorrow, 3:00 PM</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="text-gray-500 mb-2">Average Progress</div>
          <div className="text-3xl font-bold">72%</div>
          <div className="text-green-500 text-sm mt-2">↑ 8% from last month</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('students')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'students' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Students
          </button>
          <button 
            onClick={() => setActiveTab('sessions')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sessions' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Sessions
          </button>
          <button 
            onClick={() => setActiveTab('resources')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'resources' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Resources
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Student Progress</h2>
            <div className="space-y-6">
              {students.map(student => (
                <div key={student.id} className="flex flex-col">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{student.name}</span>
                    <span className="text-sm text-gray-500">{student.progress}%</span>
                  </div>
                  {renderProgressBar(student.progress)}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Upcoming Sessions</h2>
            <div className="space-y-4">
              {upcomingSessions.map(session => (
                <div key={session.id} className="flex items-start p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                  <div className="bg-blue-100 text-blue-800 p-3 rounded-md text-center mr-4">
                    <div className="text-sm font-semibold">{session.date.split(',')[0]}</div>
                    <div className="text-xs">{session.time}</div>
                  </div>
                  <div>
                    <h3 className="font-medium">{session.topic}</h3>
                    <p className="text-sm text-gray-500">with {session.student}</p>
                  </div>
                </div>
              ))}
              <Button 
                label="View All Sessions" 
                className="text-blue-600 text-sm hover:text-blue-800 mt-2 w-full text-center"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}