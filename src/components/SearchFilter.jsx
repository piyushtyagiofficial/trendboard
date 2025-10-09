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
      market: 'bg-emerald-400 shadow-emerald-400/50',
      ipo: 'bg-purple-400 shadow-purple-400/50',
      earnings: 'bg-amber-400 shadow-amber-400/50',
      crypto: 'bg-yellow-400 shadow-yellow-400/50',
      commodities: 'bg-orange-400 shadow-orange-400/50',
      monetary: 'bg-indigo-400 shadow-indigo-400/50',
      filings: 'bg-rose-400 shadow-rose-400/50',
      general: 'bg-teal-400 shadow-teal-400/50'
    };
    return colors[category] || 'bg-cyan-400 shadow-cyan-400/50';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-40 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-700"
    >
      <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
        {/* Enhanced Search Input */}
        <div className="relative flex-1">
          <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
            <Search size={18} className="sm:w-5 sm:h-5" />
          </div>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search news, companies..."
            className="w-full pl-10 sm:pl-12 pr-10 sm:pr-4 py-3 sm:py-4 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200 text-white placeholder-gray-400 bg-gray-700/50 focus:bg-gray-700 text-sm sm:text-base"
          />
          {searchTerm && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => onSearch('')}
              className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              <X size={18} className="sm:w-5 sm:h-5" />
            </motion.button>
          )}
        </div>

        {/* Enhanced Filter Toggle */}
        <div className="relative z-50">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center px-4 sm:px-6 py-3 sm:py-4 rounded-xl transition-all duration-200 font-medium w-full sm:min-w-[200px] text-sm sm:text-base ${
              selectedCategory !== 'all' 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                : 'bg-gray-700/50 hover:bg-gray-600 text-gray-300 border border-gray-600'
            }`}
          >
            <Filter size={18} className="mr-2 sm:mr-3 sm:w-5 sm:h-5" />
            <span className="flex-1 text-left truncate">
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
                className="absolute right-0 mt-2 w-72 sm:w-80 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 z-[9999] overflow-hidden"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="font-bold text-white text-base sm:text-lg">Filter by Category</h3>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsFilterOpen(false)}
                      className="text-gray-500 hover:text-gray-300 p-1 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <X size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </motion.button>
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      onClick={() => handleCategorySelect('all')}
                      className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 flex items-center text-sm sm:text-base ${
                        selectedCategory === 'all'
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                          : 'hover:bg-gray-700 text-gray-300'
                      }`}
                    >
                      <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full mr-2.5 sm:mr-3 ${selectedCategory === 'all' ? 'bg-white' : 'bg-gray-500'}`} />
                      <span className="font-medium flex-1">All Categories</span>
                      <span className={`text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${
                        selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-gray-700 text-gray-300'
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
                          whileHover={{ scale: 1.01 }}
                          onClick={() => handleCategorySelect(category.value)}
                          className={`group w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 flex items-center text-sm sm:text-base ${
                            isSelected
                              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                              : 'hover:bg-gray-700 text-gray-300'
                          }`}
                        >
                          <div className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full mr-2.5 sm:mr-3 shadow-lg transition-all duration-200 ${
                            isSelected 
                              ? 'bg-white shadow-white/50' 
                              : `${getCategoryColor(category.value)} group-hover:scale-110`
                          }`} />
                          <CategoryIcon size={14} className="mr-1.5 sm:mr-2 sm:w-4 sm:h-4" />
                          <span className="font-medium flex-1 capitalize">{category.label}</span>
                          <span className={`text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-semibold ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-gray-700 text-gray-300'
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
                      className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-700"
                    >
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={clearFilters}
                        className="w-full py-2.5 sm:py-3 text-center text-red-400 hover:text-red-300 font-medium bg-red-900/30 hover:bg-red-900/50 border border-red-800 rounded-xl transition-all duration-200 text-sm sm:text-base"
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
            className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-700"
          >
            <span className="text-xs sm:text-sm text-gray-400 font-medium">Active filters:</span>
            {searchTerm && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center bg-gradient-to-r from-blue-900/50 to-blue-800/50 text-blue-300 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium border border-blue-700"
              >
                <Search size={12} className="mr-1.5 sm:mr-2 sm:w-[14px] sm:h-[14px]" />
                <span className="truncate max-w-[100px] sm:max-w-none">"{searchTerm}"</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => onSearch('')}
                  className="ml-1.5 sm:ml-2 text-blue-400 hover:text-blue-200 p-0.5 sm:p-1 rounded-full hover:bg-blue-800 transition-colors"
                >
                  <X size={10} className="sm:w-3 sm:h-3" />
                </motion.button>
              </motion.span>
            )}
            {selectedCategory !== 'all' && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center bg-gradient-to-r from-purple-900/50 to-purple-800/50 text-purple-300 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium border border-purple-700"
              >
                <Filter size={12} className="mr-1.5 sm:mr-2 sm:w-[14px] sm:h-[14px]" />
                {selectedCategory.toUpperCase()}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => onFilter('all')}
                  className="ml-1.5 sm:ml-2 text-purple-400 hover:text-purple-200 p-0.5 sm:p-1 rounded-full hover:bg-purple-800 transition-colors"
                >
                  <X size={10} className="sm:w-3 sm:h-3" />
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