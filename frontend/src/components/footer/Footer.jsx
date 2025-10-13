import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-light border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">FX</span>
                </div>
                <span className="text-xl font-bold text-blue-600">FindX</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Connecting lost items with their owners through our community-driven platform.
              </p>
              <div className="flex space-x-4">
                <motion.a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-600 hover:text-primary-600 hover:border-primary-200 transition-all duration-200"
                >
                  <FiGithub className="w-5 h-5" />
                </motion.a>
                <motion.a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-600 hover:text-primary-600 hover:border-primary-200 transition-all duration-200"
                >
                  <FiLinkedin className="w-5 h-5" />
                </motion.a>
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
              <div className="space-y-3">
                <NavLink 
                  to="/lost" 
                  className="block text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                >
                  Lost Items
                </NavLink>
                <NavLink 
                  to="/found" 
                  className="block text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                >
                  Found Items
                </NavLink>
                <NavLink 
                  to="/report-lost" 
                  className="block text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                >
                  Report Lost
                </NavLink>
                <NavLink 
                  to="/report-found" 
                  className="block text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                >
                  Report Found
                </NavLink>
              </div>
            </motion.div>
          </div>

          {/* Support */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-900">Support</h3>
              <div className="space-y-3">
                <p className="text-gray-600 text-sm">Customer Support</p>
                <p className="text-gray-600 text-sm">Terms & Conditions</p>
                <p className="text-gray-600 text-sm">Privacy Policy</p>
                <p className="text-gray-600 text-sm">FAQ</p>
              </div>
            </motion.div>
          </div>

          {/* Contact */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-900">Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-600 text-sm">
                  <FiPhone className="w-4 h-4 text-primary-500" />
                  <span>+91 98652 12349</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600 text-sm">
                  <FiMail className="w-4 h-4 text-primary-500" />
                  <a 
                    href="mailto:varunesh2k5@gmail.com" 
                    className="hover:text-primary-600 transition-colors duration-200"
                  >
                    varunesh2k5@gmail.com
                  </a>
                </div>
                <div className="flex items-center space-x-3 text-gray-600 text-sm">
                  <FiMapPin className="w-4 h-4 text-primary-500" />
                  <span>University Campus</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-gray-200"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-600 text-sm">
              © {currentYear} FindX. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs">
              Made with ❤️ for the community
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;