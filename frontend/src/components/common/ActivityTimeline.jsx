import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiPackage, FiCheckCircle, FiClock } from 'react-icons/fi';
import api from '../../apiClient';

const ActivityTimeline = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivities();
  }, []);

  const fetchRecentActivities = async () => {
    try {
      setLoading(true);
      const [lostResponse, foundResponse] = await Promise.all([
        api.get('/api/lost'),
        api.get('/api/found')
      ]);

      // Combine and sort by date
      const combined = [
        ...lostResponse.data.slice(0, 5).map(item => ({ ...item, type: 'lost' })),
        ...foundResponse.data.slice(0, 5).map(item => ({ ...item, type: 'found' }))
      ].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.date);
        const dateB = new Date(b.createdAt || b.date);
        return dateB - dateA;
      }).slice(0, 10);

      setActivities(combined);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const ActivityItem = ({ activity, index }) => {
    const isLost = activity.type === 'lost';
    const Icon = isLost ? FiAlertCircle : FiPackage;
    const colorClass = isLost ? 'text-red-500' : 'text-blue-500';
    const bgClass = isLost ? 'bg-red-50 dark:bg-red-900/20' : 'bg-blue-50 dark:bg-blue-900/20';
    const hasMatch = activity.status === 'POSSIBLE_MATCH';

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="flex items-start space-x-4 group"
      >
        {/* Timeline Line */}
        <div className="flex flex-col items-center">
          <div className={`p-2 rounded-full ${bgClass} ${colorClass} transition-transform duration-200 group-hover:scale-110`}>
            <Icon className="w-4 h-4" />
          </div>
          {index < activities.length - 1 && (
            <div className="w-0.5 h-16 bg-gray-200 dark:bg-gray-700 mt-2"></div>
          )}
        </div>

        {/* Activity Content */}
        <div className="flex-1 pb-8">
          <div className="card hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`text-sm font-semibold ${colorClass}`}>
                    {isLost ? 'Lost' : 'Found'}
                  </span>
                  {hasMatch && (
                    <span className="inline-flex items-center space-x-1 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                      <FiCheckCircle className="w-3 h-3" />
                      <span>Match Found</span>
                    </span>
                  )}
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {activity.item}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                  {activity.description}
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                  {activity.location && (
                    <span>📍 {activity.location}</span>
                  )}
                  <span className="flex items-center space-x-1">
                    <FiClock className="w-3 h-3" />
                    <span>{getTimeAgo(activity.createdAt || activity.date)}</span>
                  </span>
                </div>
              </div>
              {activity.imageUrl && (
                <img
                  src={activity.imageUrl}
                  alt={activity.item}
                  className="w-16 h-16 rounded-lg object-cover ml-4"
                />
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            <div className="flex-1 card">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <FiClock className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No recent activities</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {activities.map((activity, index) => (
        <ActivityItem key={activity.id} activity={activity} index={index} />
      ))}
    </div>
  );
};

export default ActivityTimeline;

