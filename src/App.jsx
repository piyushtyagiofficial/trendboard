import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import LoadingState from './components/LoadingState';


function App() {
  const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

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

  
  const initializeApp = async () => {
    setIsLoading(true);
    try {      
      if (cachedArticles.length > 0) {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error initializing app:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Header 
        isLoading={isRefreshing}
        />
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