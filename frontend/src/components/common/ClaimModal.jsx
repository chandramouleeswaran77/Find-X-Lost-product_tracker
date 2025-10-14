import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiShield, FiUser, FiFileText } from 'react-icons/fi';
import api from '../../apiClient';
import { showToast } from '../ui/Toast';

const ClaimModal = ({ isOpen, onClose, item }) => {
  const [idProof, setIdProof] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!idProof.trim() || !description.trim()) {
      showToast.error('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const claimData = {
        userId: user.id || user.username,
        idProof: idProof.trim(),
        description: description.trim()
      };

      await api.post(`/api/found/${item.id}/claim`, claimData);
      showToast.success('Claim request sent to admin for verification!');
      onClose();
      
      // Reset form
      setIdProof('');
      setDescription('');
    } catch (error) {
      console.error('Error submitting claim:', error);
      showToast.error('Failed to submit claim. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIdProof('');
    setDescription('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FiShield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Claim Item</h3>
                    <p className="text-sm text-gray-500">Verify your identity</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Item Info */}
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-4">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.item}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900">{item.item}</h4>
                    <p className="text-sm text-gray-500">
                      Found at {item.location} on {item.date}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiUser className="inline w-4 h-4 mr-2" />
                    Identity Proof *
                  </label>
                  <input
                    type="text"
                    placeholder="Student ID, Driver's License, or any ID number"
                    value={idProof}
                    onChange={(e) => setIdProof(e.target.value)}
                    disabled={isLoading}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Provide any form of identification to verify your claim
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiFileText className="inline w-4 h-4 mr-2" />
                    Description *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe the item in detail and provide any additional information that proves it belongs to you..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isLoading}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    The more details you provide, the easier it will be to verify your claim
                  </p>
                </div>

                {/* Warning */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 text-amber-600 mt-0.5">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-amber-800">Important Notice</h4>
                      <p className="text-sm text-amber-700 mt-1">
                        False claims may result in account suspension. Please ensure you are the rightful owner of this item.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <FiShield className="w-4 h-4" />
                        <span>Submit Claim</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ClaimModal;
