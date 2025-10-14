import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiMapPin, FiClock, FiPlus, FiEye, FiFilter } from 'react-icons/fi';
import { useDebounce } from '../../hooks/useDebounce';
import api from '../../apiClient';
import SkeletonCard from '../common/SkeletonCard';
import ItemDetailsModal from '../common/ItemDetailsModal';
import { showToast } from '../ui/Toast';
import './LostPage.css';

const LostPage = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [lostItems, setLostItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
    fetchLostItems();
  }, []);

  useEffect(() => {
    const openId = location.state && location.state.openId;
    if (openId && lostItems.length > 0) {
      const target = lostItems.find(i => i.id === openId);
      if (target) {
        setSelectedItem(target);
        setIsModalOpen(true);
      }
    }
  }, [location.state, lostItems]);

  useEffect(() => {
    if (debouncedSearch.trim()) {
      handleSearch(debouncedSearch);
    } else {
      applyFilters(lostItems);
      setSearchLoading(false);
    }
  }, [debouncedSearch, lostItems, statusFilter]);

  useEffect(() => {
    // Set search loading when user starts typing
    if (search.trim()) {
      setSearchLoading(true);
    }
  }, [search]);

  const fetchLostItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/lost');
      if (Array.isArray(response.data)) {
        setLostItems(response.data);
        setFilteredItems(response.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Fetch lost items error:', err.message);
      showToast.error('Failed to load lost items');
      setError('Failed to fetch lost items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (items) => {
    let filtered = [...items];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => {
        if (statusFilter === 'open') return !item.resolved && item.status !== 'POSSIBLE_MATCH';
        if (statusFilter === 'matched') return item.status === 'POSSIBLE_MATCH';
        if (statusFilter === 'resolved') return item.resolved;
        return true;
      });
    }

    setFilteredItems(filtered);
  };

  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      applyFilters(lostItems);
      setSearchLoading(false);
      return;
    }

    try {
      setSearchLoading(true);
      const response = await api.get(`/api/lost/search?q=${encodeURIComponent(searchTerm)}`);
      applyFilters(response.data || []);
    } catch (err) {
      console.error('Search error:', err);
      // Fallback to client-side filtering with partial matching
      const searchLower = searchTerm.toLowerCase();
      const filtered = lostItems.filter((item) => {
        const itemName = item.item?.toLowerCase() || '';
        const itemDesc = item.description?.toLowerCase() || '';
        const itemLoc = item.location?.toLowerCase() || '';
        
        // Check if any word in the search term partially matches
        const searchWords = searchLower.split(/\s+/);
        return searchWords.some(word => 
          itemName.includes(word) ||
          itemDesc.includes(word) ||
          itemLoc.includes(word)
        );
      });
      applyFilters(filtered);
    } finally {
      setSearchLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const ItemCard = ({ item }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="card cursor-pointer"
      onClick={() => handleItemClick(item)}
    >
      <div className="w-full h-48 bg-gray-100 rounded-xl mb-4 overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.item}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <FiSearch className="w-12 h-12" />
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1 line-clamp-1">
            {item.item}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
            {item.description}
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <FiMapPin className="w-4 h-4" />
            <span className="line-clamp-1">{item.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <FiClock className="w-4 h-4" />
            <span>{formatDate(item.date)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.status === 'POSSIBLE_MATCH' 
              ? 'bg-yellow-100 text-yellow-800'
              : item.status === 'CLOSED'
              ? 'bg-green-100 text-green-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
            {item.status || 'OPEN'}
          </span>
          <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium flex items-center space-x-1">
            <span>View Details</span>
            <FiEye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-light">
      {/* Header Section */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Lost Items
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto mb-8">
              Browse through lost items reported by our community members. 
              Help reunite lost belongings with their owners.
            </p>
            
            {/* Search and Actions */}
            <div className="flex flex-col gap-4 max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search lost items..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  />
                  {searchLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                    </div>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className="btn-secondary flex items-center justify-center space-x-2 whitespace-nowrap"
                >
                  <FiFilter className="w-5 h-5" />
                  <span>Filters</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/report-lost')}
                  className="btn-primary flex items-center justify-center space-x-2 whitespace-nowrap"
                >
                  <FiPlus className="w-5 h-5" />
                  <span>Report Lost</span>
                </motion.button>
              </div>
              
              {/* Filters */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4"
                >
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setStatusFilter('all')}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        statusFilter === 'all'
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      All Items
                    </button>
                    <button
                      onClick={() => setStatusFilter('open')}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        statusFilter === 'open'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      Open
                    </button>
                    <button
                      onClick={() => setStatusFilter('matched')}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        statusFilter === 'matched'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      Matched
                    </button>
                    <button
                      onClick={() => setStatusFilter('resolved')}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        statusFilter === 'resolved'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      Resolved
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Items Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8"
            >
              <p className="text-red-600 text-center">{error}</p>
            </motion.div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : filteredItems.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiSearch className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {search ? 'No items found' : 'No lost items yet'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {search 
                  ? 'Try adjusting your search terms or browse all items.'
                  : 'Be the first to report a lost item in your community.'
                }
              </p>
              {!search && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/report-lost')}
                  className="btn-primary"
                >
                  Report Lost Item
                </motion.button>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Item Details Modal */}
      <ItemDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedItem}
        type="lost"
      />
    </div>
  );
};

export default LostPage;