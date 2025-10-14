import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiDownload, FiTrendingUp, FiPackage, FiCheckCircle, 
  FiUsers, FiActivity, FiAlertCircle 
} from 'react-icons/fi';
import api from '../../apiClient';
import { showToast } from '../ui/Toast';

const AdminDashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/statistics');
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      showToast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const generatePDFReport = async () => {
    try {
      setGeneratingPDF(true);
      const response = await api.get('/api/admin/reports/monthly/pdf', {
        params: { year: selectedYear, month: selectedMonth },
        responseType: 'blob'
      });

      // Create a blob from the PDF Stream
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `FindX_Report_${selectedYear}_${selectedMonth.toString().padStart(2, '0')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showToast.success('PDF report generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      showToast.error('Failed to generate PDF report');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color, bgColor }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card ${bgColor} border-l-4 ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
        </div>
        <div className={`p-4 rounded-full ${bgColor.replace('bg-', 'bg-opacity-20 bg-')}`}>
          <Icon className={`w-8 h-8 ${color.replace('border-', 'text-')}`} />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Overview of the Lost & Found system
          </p>
        </motion.div>

        {/* Statistics Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        ) : statistics ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={FiAlertCircle}
              label="Total Lost Items"
              value={statistics.totalLostItems}
              color="border-red-500"
              bgColor="bg-red-50 dark:bg-red-900/20"
            />
            <StatCard
              icon={FiPackage}
              label="Total Found Items"
              value={statistics.totalFoundItems}
              color="border-blue-500"
              bgColor="bg-blue-50 dark:bg-blue-900/20"
            />
            <StatCard
              icon={FiCheckCircle}
              label="Successful Matches"
              value={statistics.totalMatches}
              color="border-green-500"
              bgColor="bg-green-50 dark:bg-green-900/20"
            />
            <StatCard
              icon={FiUsers}
              label="Total Users"
              value={statistics.totalUsers}
              color="border-purple-500"
              bgColor="bg-purple-50 dark:bg-purple-900/20"
            />
          </div>
        ) : null}

        {/* PDF Report Generation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Generate Monthly Report
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Download a detailed PDF report for any month
              </p>
            </div>
            <FiDownload className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Month
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generatePDFReport}
              disabled={generatingPDF}
              className="btn-primary flex items-center justify-center space-x-2"
            >
              {generatingPDF ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FiDownload className="w-5 h-5" />
                  <span>Generate Report</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Additional Stats */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <div className="flex items-center space-x-3 mb-4">
                <FiTrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Open Items
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Lost Items (Open)</span>
                  <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {statistics.openLostItems}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Found Items (Open)</span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {statistics.openFoundItems}
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="card"
            >
              <div className="flex items-center space-x-3 mb-4">
                <FiActivity className="w-6 h-6 text-green-600 dark:text-green-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Resolution Rate
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Resolved Items</span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {statistics.resolvedItems}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Success Rate</span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {statistics.totalLostItems > 0
                      ? Math.round((statistics.resolvedItems / statistics.totalLostItems) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

