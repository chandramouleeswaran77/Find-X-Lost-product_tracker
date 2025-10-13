import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiMapPin, FiClock, FiEye, FiPlus } from 'react-icons/fi';
import api from '../../apiClient';
import SkeletonCard from '../common/SkeletonCard';
import { showToast } from '../ui/Toast';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [recentLostItems, setRecentLostItems] = useState([]);
  const [recentFoundItems, setRecentFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (err) {
    console.error('Invalid user data in localStorage:', err);
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    fetchRecentItems();
  }, []);

  const fetchRecentItems = async () => {
    try {
      setLoading(true);
      const [lostResponse, foundResponse] = await Promise.all([
        api.get('/api/lost?limit=3'),
        api.get('/api/found?limit=3')
      ]);
      
      setRecentLostItems(lostResponse.data || []);
      setRecentFoundItems(foundResponse.data || []);
    } catch (error) {
      console.error('Error fetching recent items:', error);
      showToast.error('Failed to load recent items');
    } finally {
      setLoading(false);
    }
  };

  const handleReportLost = () => {
    navigate('/report-lost');
  };

  const handleReportFound = () => {
    navigate('/report-found');
  };

  const handleViewAll = (type) => {
    navigate(`/${type}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const ItemCard = ({ item, type }) => (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="card cursor-pointer"
      onClick={() => navigate(`/${type}/${item.id}`)}
    >
      <div className="w-full h-32 bg-gray-100 rounded-xl mb-3 overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.item}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <FiSearch className="w-8 h-8" />
          </div>
        )}
      </div>
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{item.item}</h3>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <FiMapPin className="w-3 h-3" />
          <span className="line-clamp-1">{item.location}</span>
        </div>
        <div className="flex items-center space-x-1">
          <FiClock className="w-3 h-3" />
          <span>{formatDate(item.date)}</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-light">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find & Recover With Ease
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Experience effortless recovery with our dedicated lost and found service. 
              Connect with your community to reunite lost items with their owners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReportLost}
                className="bg-white text-primary-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <FiPlus className="w-5 h-5" />
                <span>Report Lost Item</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReportFound}
                className="bg-primary-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-primary-700 transition-all duration-200 flex items-center justify-center space-x-2 border-2 border-white"
              >
                <FiPlus className="w-5 h-5" />
                <span>Report Found Item</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recent Items Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Recent Activity
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Stay updated with the latest lost and found items in your community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Recent Lost Items */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Recent Lost Items</h3>
                <button
                  onClick={() => handleViewAll('lost')}
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
                >
                  <span>View All</span>
                  <FiEye className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <SkeletonCard key={index} />
                  ))
                ) : recentLostItems.length > 0 ? (
                  recentLostItems.map((item) => (
                    <ItemCard key={item.id} item={item} type="lost" />
                  ))
                ) : (
                  <div className="card text-center py-8">
                    <FiSearch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No recent lost items found</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Recent Found Items */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Recent Found Items</h3>
                <button
                  onClick={() => handleViewAll('found')}
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
                >
                  <span>View All</span>
                  <FiEye className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <SkeletonCard key={index} />
                  ))
                ) : recentFoundItems.length > 0 ? (
                  recentFoundItems.map((item) => (
                    <ItemCard key={item.id} item={item} type="found" />
                  ))
                ) : (
                  <div className="card text-center py-8">
                    <FiSearch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No recent found items found</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          >
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary-600">
                {recentLostItems.length + recentFoundItems.length}+
              </div>
              <div className="text-gray-600">Items Tracked</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary-600">24/7</div>
              <div className="text-gray-600">Community Support</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary-600">100%</div>
              <div className="text-gray-600">Free Service</div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;