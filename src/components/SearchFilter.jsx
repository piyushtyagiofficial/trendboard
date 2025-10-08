import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ListFilter as Filter, X } from 'lucide-react';

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

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 mb-8"
    >
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search news articles, companies, or topics..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Filter Toggle */}
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Filter size={20} className="mr-2" />
            Category: {selectedCategory === 'all' ? 'All' : selectedCategory?.toUpperCase()}
          </button>

          {/* Filter Dropdown */}
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border z-10"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Filter by Category</h3>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategorySelect('all')}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-primary-100 text-primary-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    All Categories
                  </button>
                  
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => handleCategorySelect(category.value)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center justify-between ${
                        selectedCategory === category.value
                          ? 'bg-primary-100 text-primary-700'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <span className="capitalize">{category.label}</span>
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>

                {(searchTerm || selectedCategory !== 'all') && (
                  <div className="mt-4 pt-4 border-t">
                    <button
                      onClick={clearFilters}
                      className="w-full text-center py-2 text-red-600 hover:text-red-700 font-medium"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchTerm || selectedCategory !== 'all') && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex flex-wrap gap-2 mt-4 pt-4 border-t"
        >
          <span className="text-sm text-gray-600">Active filters:</span>
          {searchTerm && (
            <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              Search: "{searchTerm}"
              <button
                onClick={() => onSearch('')}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <X size={14} />
              </button>
            </span>
          )}
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
              Category: {selectedCategory.toUpperCase()}
              <button
                onClick={() => onFilter('all')}
                className="ml-2 text-green-600 hover:text-green-800"
              >
                <X size={14} />
              </button>
            </span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default SearchFilter;