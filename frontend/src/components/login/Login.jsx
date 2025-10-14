import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff, FiUser, FiLock, FiShield } from 'react-icons/fi';
import GoogleAuthLogin from './GoogleAuthLogin';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (err) {
    console.error('Invalid user data in localStorage:', err);
  }

  if (user) {
    return <Navigate to="/home" />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (username === 'admin' && password === '123123') {
      const mockUser = { 
        username: 'admin', 
        name: 'Admin User',
        email: 'admin@findx.com',
        role: 'ADMIN',
        pictureUrl: null
      };
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', 'mock-jwt-token');
      navigate('/home');
    } else {
      setError('Invalid credentials. Please try again.');
    }
    setIsLoading(false);
  };

  const handleGoogleSuccess = (userData) => {
    const user = {
      username: userData.email,
      name: userData.name,
      email: userData.email,
      role: 'USER',
      pictureUrl: userData.picture
    };
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', userData.token || 'google-oauth-token');
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo and Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-white font-bold text-2xl">FX</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            FindX
          </h1>
          <p className="text-gray-600 text-sm">Lost. Found. Connected.</p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
        >
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Admin Login Section */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 rounded-full px-4 py-2">
                <FiShield className="w-4 h-4" />
                <span>Admin Access</span>
              </div>
            </div>

            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Username</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  className="w-full text-black pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full text-black pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Google Sign In */}
          <div className="space-y-4">
            <GoogleAuthLogin onSuccess={handleGoogleSuccess} />
            
            {/* Demo Credentials */}
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">Demo Credentials:</p>
              <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
                <p><strong>Username:</strong> admin</p>
                <p><strong>Password:</strong> 123123</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-8 text-sm text-gray-500"
        >
          <p>Bannari Amman Institute of Technology</p>
          <p>© 2024 FindX. All rights reserved.</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;