import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import LoadingState from './components/LoadingState';
import SearchFilter from './components/SearchFilter';
import { ChartBar as BarChart3, Grid2x2 as Grid, List } from 'lucide-react';



function App() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showCharts, setShowCharts] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);

  // Initialize app
  useEffect(() => {
    initializeApp();
    
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(() => {
      if (!isRefreshing) {
        refreshData();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isRefreshing]);

  // Filter articles based on search and category
  useEffect(() => {
    filterArticles();
  }, [articles, searchTerm, selectedCategory]);

  const initializeApp = async () => {
    setIsLoading(true);
    try {
      

      // Fetch fresh data
      await refreshData();
    } catch (error) {
      console.error('Error initializing app:', error);
      // Load mock data as fallback
      setArticles([]);
      setIsLoading(false);
    }
  };

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {

    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const filterArticles = () => {
    let filtered = [...articles];
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => 
        article.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    

  };

  const getCategories = () => {
    const categoryCount = {};
    articles.forEach(article => {
      const category = article.category || 'general';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    
    return Object.entries(categoryCount)
      .map(([value, count]) => ({
        value,
        label: value.charAt(0).toUpperCase() + value.slice(1),
        count
      }))
      .sort((a, b) => b.count - a.count);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Header 
          onRefresh={refreshData}
          isLoading={isRefreshing}
          lastUpdateTime={lastUpdateTime}
        />

        <SearchFilter
          onSearch={setSearchTerm}
          onFilter={setSelectedCategory}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          categories={getCategories()}
        />
        
                {/* News Grid/List */}
        <AnimatePresence mode="wait">
          {filteredArticles.length > 0 ? (
            <motion.div
              key="articles-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-6'
              }
            >
              {filteredArticles.map((article, index) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  index={index}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
                <div className="text-gray-400 mb-4">
                  <BarChart3 size={64} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No articles found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or category filters.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center text-gray-500 text-sm"
        >
          <p>
            © 2025 Trendboard. Powered by AI for smarter financial insights.
          </p>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;