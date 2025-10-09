import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import LoadingState from './components/LoadingState';
import SearchFilter from './components/SearchFilter';
import { ChartBar as BarChart3, Grid2x2 as Grid, List, TrendingUp } from 'lucide-react';
import NewsCard from './components/NewsCard';
import { newsService } from './services/newsService';
import { firestoreService } from './services/firestoreService';
import { aiService } from './services/aiService';
import ChartVisualization from './components/ChartVisualization';

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
    
    // Set up auto-refresh every 15 minutes, but only if not recently refreshed
    const interval = setInterval(() => {
      // Only refresh if not currently refreshing and enough time has passed
      const timeSinceLastUpdate = lastUpdateTime ? Date.now() - lastUpdateTime.getTime() : Infinity;
      const minRefreshInterval = 10 * 60 * 1000; // 10 minutes minimum between refreshes
      
      if (!isRefreshing && timeSinceLastUpdate > minRefreshInterval) {
        refreshData();
      }
    }, 15 * 60 * 1000); // Check every 15 minutes

    return () => clearInterval(interval);
  }, [isRefreshing, lastUpdateTime]);

  // Filter articles based on search and category
  useEffect(() => {
    filterArticles();
  }, [articles, searchTerm, selectedCategory]);

  const initializeApp = async () => {
    setIsLoading(true);
    try {
      // Try to load cached articles first
      const cachedArticles = await firestoreService.getArticles();
      
      if (cachedArticles.length > 0) {
        setArticles(cachedArticles);
        setIsLoading(false);
        // Don't fetch fresh data immediately if we have cached articles
        return;
      }
      
      // Fetch fresh data only if no cached articles
      await refreshData();
    } catch (error) {
      console.error('Error initializing app:', error);
      // No fallback to mock data - just show empty state
      setArticles([]);
    } finally {
      // Ensure loading state is always resolved
      setIsLoading(false);
    }
  };

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Fetch latest news
      const latestNews = await newsService.fetchAllNews();
      
      if (latestNews.length > 0) {
        // Enhance with AI summaries
        const enhancedNews = await aiService.enhanceNewsWithAI(latestNews);
        
        // Save to Firestore
        await firestoreService.saveArticles(enhancedNews);
        
        // Update state
        setArticles(enhancedNews);
        setLastUpdateTime(new Date());
      } else {
        // If no news fetched and no cached data, show empty state
        console.log('No news data available');
        setArticles([]);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      // No fallback - just show empty state or keep existing articles
      console.log('Keeping existing articles due to error');
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
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(article =>
        article.headline?.toLowerCase().includes(term) ||
        article.summary?.toLowerCase().includes(term) ||
        article.source?.toLowerCase().includes(term) ||
        article.symbols?.some(symbol => symbol.toLowerCase().includes(term))
      );
    }
    
    setFilteredArticles(filtered);
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


        {/* View Controls */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-gray-700 font-semibold text-lg">
              {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'} found
            </span>
            {searchTerm && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium"
              >
                for "{searchTerm}"
              </motion.span>
            )}
            {selectedCategory !== 'all' && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full font-medium"
              >
                in {selectedCategory.toUpperCase()}
              </motion.span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCharts(!showCharts)}
              className={`flex items-center px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                showCharts
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <BarChart3 size={18} className="mr-2" />
              {showCharts ? 'Hide Charts' : 'Show Charts'}
            </motion.button>

            <div className="flex bg-white rounded-xl p-1 shadow-md border border-gray-200">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-lg transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-lg transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List size={18} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Charts Section */}
        <AnimatePresence>
          {showCharts && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <ChartVisualization articles={filteredArticles} />
            </motion.div>
          )}
        </AnimatePresence>

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
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
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
              className="text-center py-20"
            >
              <div className="bg-white rounded-2xl shadow-xl p-12 max-w-lg mx-auto border border-gray-100">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-gray-300 mb-6"
                >
                  <BarChart3 size={80} className="mx-auto" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  No articles found
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {searchTerm || selectedCategory !== 'all' 
                    ? "Try adjusting your search terms or category filters to find relevant financial news."
                    : "No financial news available at the moment. Try refreshing the page or check back later."
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {(searchTerm || selectedCategory !== 'all') && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('all');
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg"
                    >
                      Clear All Filters
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={refreshData}
                    disabled={isRefreshing}
                    className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium disabled:opacity-50"
                  >
                    {isRefreshing ? 'Refreshing...' : 'Refresh News'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-20 bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
        >
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3"
              >
                <TrendingUp size={16} className="text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900">Trendboard</h3>
            </div>
            <p className="text-gray-600 mb-4">
              AI-Powered Financial Intelligence • Real-time Market Analysis • Professional Insights
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
              <span>© 2025 Trendboard</span>
              <span>•</span>
              <span>Powered by Advanced AI</span>
              <span>•</span>
              <span>Global Financial Coverage</span>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;