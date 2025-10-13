import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMapPin, FiClock, FiUser, FiPhone, FiMail, FiMessageCircle, FiShield } from 'react-icons/fi';
import CopyButton from './CopyButton';
import ClaimModal from './ClaimModal';
import { showToast } from '../ui/Toast';

const ItemDetailsModal = ({ isOpen, onClose, item, type }) => {
  const [showContactForm, setShowContactForm] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  if (!isOpen || !item) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      // Here you would typically send the contact request to the backend
      showToast.success('Message sent successfully!');
      setShowContactForm(false);
      setContactForm({ name: '', email: '', message: '' });
    } catch (error) {
      showToast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{item.item}</h2>
                  <p className="text-gray-600 mt-1">
                    {type === 'lost' ? 'Lost Item Details' : 'Found Item Details'}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                >
                  <FiX className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Item Details */}
                <div className="space-y-6">
                  {/* Image */}
                  <div className="w-full h-64 bg-gray-100 rounded-xl overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.item}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                            <FiUser className="w-8 h-8" />
                          </div>
                          <p>No image available</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Item Information */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <FiMapPin className="w-5 h-5 text-primary-500" />
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium text-gray-900">{item.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FiClock className="w-5 h-5 text-primary-500" />
                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="font-medium text-gray-900">{formatDate(item.date)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <div className={`w-3 h-3 rounded-full ${
                          item.status === 'POSSIBLE_MATCH' 
                            ? 'bg-yellow-500'
                            : item.status === 'CLOSED'
                            ? 'bg-green-500'
                            : 'bg-blue-500'
                        }`}></div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="font-medium text-gray-900">{item.status || 'OPEN'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Contact Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                    
                    {/* Contact Details */}
                    <div className="space-y-4">
                      {item.contactPhone && (
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <FiPhone className="w-5 h-5 text-primary-500" />
                            <div>
                              <p className="text-sm text-gray-500">Phone</p>
                              <p className="font-medium text-gray-900">{item.contactPhone}</p>
                            </div>
                          </div>
                          <CopyButton text={item.contactPhone}>
                            <FiPhone className="w-4 h-4" />
                          </CopyButton>
                        </div>
                      )}

                      {item.contactEmail && (
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <FiMail className="w-5 h-5 text-primary-500" />
                            <div>
                              <p className="text-sm text-gray-500">Email</p>
                              <p className="font-medium text-gray-900">{item.contactEmail}</p>
                            </div>
                          </div>
                          <CopyButton text={item.contactEmail}>
                            <FiMail className="w-4 h-4" />
                          </CopyButton>
                        </div>
                      )}

                      {item.reportedBy && (
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                          <FiUser className="w-5 h-5 text-primary-500" />
                          <div>
                            <p className="text-sm text-gray-500">Reported by</p>
                            <p className="font-medium text-gray-900">{item.reportedBy}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Contact Actions */}
                    <div className="space-y-3 pt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowContactForm(true)}
                        className="w-full btn-primary flex items-center justify-center space-x-2"
                      >
                        <FiMessageCircle className="w-5 h-5" />
                        <span>Send Message</span>
                      </motion.button>
                      
                      {/* Claim Button - Only for found items */}
                      {type === 'found' && item.status !== 'CLAIMED' && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowClaimModal(true)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                        >
                          <FiShield className="w-5 h-5" />
                          <span>Claim This Item</span>
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form Modal */}
          <AnimatePresence>
            {showContactForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60"
                onClick={() => setShowContactForm(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-2xl max-w-md w-full p-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Send Message</h3>
                    <button
                      onClick={() => setShowContactForm(false)}
                      className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                    >
                      <FiX className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Email
                      </label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                        placeholder="Enter your message..."
                      />
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowContactForm(false)}
                        className="flex-1 btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 btn-primary"
                      >
                        Send Message
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Claim Modal */}
          <ClaimModal
            isOpen={showClaimModal}
            onClose={() => setShowClaimModal(false)}
            item={item}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ItemDetailsModal;
