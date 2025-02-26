import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Cookies from "js-cookie";
import { motion } from 'framer-motion';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch("https://localhost:7034/api/Auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameEmail: username, password }),
      });
      
      if (!response.ok) {
        throw new Error("Invalid credentials");
      }
      
      const data = await response.json();
      Cookies.set("role", data.role);
      Cookies.set("mentorId", data.mentorId || null);
      Cookies.set("bootcamperId", data.bootcamperId || null);
      Cookies.set("mentorName", data.mentorName || null);
      Cookies.set("bootcamperName", data.bootcamperName || null);
      Cookies.set("jwt", data.jwt);

      dispatch(login());
      navigate(data.role === "mentor" ? "/mentor" : "/user");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
      <motion.div 
        className="bg-white rounded-xl shadow-xl overflow-hidden max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-6 px-8">
          <h2 className="text-2xl font-bold text-white">Welcome back</h2>
          <p className="text-indigo-200">Sign in to your account</p>
        </div>
        
        <div className="p-8">
          {error && (
            <motion.div 
              className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              {error}
            </motion.div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username or Email</label>
              <input 
                type="text" 
                placeholder="Enter your username or email" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                required
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-xs text-indigo-600 hover:text-indigo-800">Forgot password?</a>
              </div>
              <input 
                type="password" 
                placeholder="Enter your password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                required
              />
            </div>
            
            <button 
              type="submit" 
              className={`w-full py-2 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex justify-center items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">Don't have an account?</p>
            <Button label="Create a New Account" navigateTo="register" variant="secondary" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;