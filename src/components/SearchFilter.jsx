import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ListFilter as Filter, X, TrendingUp, Hash, Sparkles } from 'lucide-react';

const SearchFilter = ({ onSearch, onFilter, searchTerm, selectedCategory, categories }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearchChange = (e) => {
    onSearch(e.target.value);
  };

  const handleCategorySelect = (category) => {
    onFilter(category);
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    onSearch('');
    onFilter('all');
    setIsFilterOpen(false);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      market: TrendingUp,
      ipo: Sparkles,
      earnings: TrendingUp,
      crypto: Hash,
      general: TrendingUp
    };
    return icons[category] || TrendingUp;
  };

  const getCategoryColor = (category) => {
    const colors = {
      market: 'bg-blue-500',
      ipo: 'bg-purple-500',
      earnings: 'bg-green-500',
      crypto: 'bg-yellow-500',
      commodities: 'bg-orange-500',
      monetary: 'bg-red-500',
      general: 'bg-gray-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100"
    >
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Enhanced Search Input */}
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search size={20} />
          </div>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search financial news, companies, tickers..."
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500 bg-gray-50 focus:bg-white"
          />
          {searchTerm && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => onSearch('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </motion.button>
          )}
        </div>

        {/* Enhanced Filter Toggle */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center px-6 py-4 rounded-xl transition-all duration-200 font-medium min-w-[200px] ${
              selectedCategory !== 'all' 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <Filter size={20} className="mr-3" />
            <span className="flex-1 text-left">
              {selectedCategory === 'all' ? 'All Categories' : selectedCategory.toUpperCase()}
            </span>
            <motion.div
              animate={{ rotate: isFilterOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="ml-2"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 8L2 4h8l-4 4z" />
              </svg>
            </motion.div>
          </motion.button>

          {/* Enhanced Filter Dropdown */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-20 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 text-lg">Filter by Category</h3>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsFilterOpen(false)}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <X size={18} />
                    </motion.button>
                  </div>
                  
                  <div className="space-y-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleCategorySelect('all')}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center ${
                        selectedCategory === 'all'
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full mr-3 ${selectedCategory === 'all' ? 'bg-white' : 'bg-gray-300'}`} />
                      <span className="font-medium flex-1">All Categories</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {categories.reduce((sum, cat) => sum + cat.count, 0)}
                      </span>
                    </motion.button>
                    
                    {categories.map((category) => {
                      const CategoryIcon = getCategoryIcon(category.value);
                      const isSelected = selectedCategory === category.value;
                      
                      return (
                        <motion.button
                          key={category.value}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handleCategorySelect(category.value)}
                          className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center ${
                            isSelected
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <div className={`w-3 h-3 rounded-full mr-3 ${isSelected ? 'bg-white' : getCategoryColor(category.value)}`} />
                          <CategoryIcon size={16} className="mr-2" />
                          <span className="font-medium flex-1 capitalize">{category.label}</span>
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                          }`}>
                            {category.count}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>

                  {(searchTerm || selectedCategory !== 'all') && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 pt-4 border-t border-gray-200"
                    >
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={clearFilters}
                        className="w-full py-3 text-center text-red-600 hover:text-red-700 font-medium bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200"
                      >
                        Clear All Filters
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Enhanced Active Filters Display */}
      <AnimatePresence>
        {(searchTerm || selectedCategory !== 'all') && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-200"
          >
            <span className="text-sm text-gray-600 font-medium">Active filters:</span>
            {searchTerm && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-sm px-4 py-2 rounded-full font-medium"
              >
                <Search size={14} className="mr-2" />
                "{searchTerm}"
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => onSearch('')}
                  className="ml-2 text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-200 transition-colors"
                >
                  <X size={12} />
                </motion.button>
              </motion.span>
            )}
            {selectedCategory !== 'all' && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 text-sm px-4 py-2 rounded-full font-medium"
              >
                <Filter size={14} className="mr-2" />
                {selectedCategory.toUpperCase()}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => onFilter('all')}
                  className="ml-2 text-purple-600 hover:text-purple-800 p-1 rounded-full hover:bg-purple-200 transition-colors"
                >
                  <X size={12} />
                </motion.button>
              </motion.span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchFilter;