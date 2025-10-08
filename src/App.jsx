import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import LoadingState from './components/LoadingState';
import SearchFilter from './components/SearchFilter';
import { ChartBar as BarChart3, Grid2x2 as Grid, List } from 'lucide-react';
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
      // Load mock data as fallback
      const mockArticles = newsService.getMockNews();
      setArticles(mockArticles);
    } finally {
      // Ensure loading state is always resolved
      setIsLoading(false);
    }
  };

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Fetch latest news
      const newsResult = await newsService.fetchAllNews();
      const latestNews = newsResult.articles;
      const isFromCache = newsResult.fromCache;
      
      if (latestNews.length > 0) {
        // Only enhance with AI and save to Firestore if data is fresh (not from cache)
        if (!isFromCache) {
          // Enhance with AI summaries
          const enhancedNews = await aiService.enhanceNewsWithAI(latestNews);
          
          // Save to Firestore
          await firestoreService.saveArticles(enhancedNews);
          
          // Update state
          setArticles(enhancedNews);
          setLastUpdateTime(new Date());
        } else {
          // Just update state with cached data, don't save to Firestore again
          setArticles(latestNews);
          // Don't update lastUpdateTime for cached data
        }
      } else {
        // If no news fetched, use mock data to ensure app isn't empty
        console.log('No news fetched from APIs, using mock data');
        const mockArticles = newsService.getMockNews();
        setArticles(mockArticles);
        setLastUpdateTime(new Date());
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      // Fallback to mock data on any error
      const mockArticles = newsService.getMockNews();
      setArticles(mockArticles);
      setLastUpdateTime(new Date());
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
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 font-medium">
              {filteredArticles.length} articles found
            </span>
            {searchTerm && (
              <span className="text-primary-600 text-sm">
                for "{searchTerm}"
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="text-secondary-600 text-sm">
                in {selectedCategory.toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowCharts(!showCharts)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                showCharts
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart3 size={18} className="mr-2" />
              Charts
            </button>

            <div className="flex bg-white rounded-lg p-1 shadow-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'grid'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'list'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List size={18} />
              </button>
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