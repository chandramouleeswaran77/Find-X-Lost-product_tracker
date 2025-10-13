import React from 'react';
import { motion } from 'framer-motion';

const SkeletonCard = ({ className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`card shimmer ${className}`}
    >
      {/* Image skeleton */}
      <div className="w-full h-48 bg-gray-200 rounded-xl mb-4 animate-pulse" />
      
      {/* Title skeleton */}
      <div className="h-6 bg-gray-200 rounded mb-3 animate-pulse" />
      
      {/* Description skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
      </div>
      
      {/* Date skeleton */}
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4 animate-pulse" />
      
      {/* Button skeleton */}
      <div className="h-10 bg-gray-200 rounded-xl animate-pulse" />
    </motion.div>
  );
};

export default SkeletonCard;