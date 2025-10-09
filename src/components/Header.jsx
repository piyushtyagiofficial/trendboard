import { motion } from 'framer-motion';
import { RefreshCw, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';

const Header = ({ onRefresh, isLoading, lastUpdateTime }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second for real-time display
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatLastUpdate = (timestamp) => {
    if (!timestamp) return { text: 'Just Now', status: 'live' };
    
    const now = currentTime; // Use the live current time
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 30) return { text: 'Just Now', status: 'live' };
    if (minutes < 1) return { text: `${seconds}s ago`, status: 'live' };
    if (minutes < 5) return { text: `${minutes}m ago`, status: 'recent' };
    if (minutes < 60) return { text: `${minutes}m ago`, status: 'normal' };
    if (hours < 24) return { text: `${hours}h ago`, status: 'old' };
    return { text: timestamp.toLocaleDateString(), status: 'very-old' };
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm shadow-lg border-b border-gray-700"
    >
      <div className="relative px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4">
        <div className="flex items-center justify-between">
          {/* Brand Section - Clickable to scroll to top */}
          <motion.div 
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group"
            onClick={scrollToTop}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.img
              whileHover={{ scale: 1.1, rotate: 5 }}
              src={logo} 
              alt="Trendboard Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-contain transition-all duration-300"
            />
            
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg sm:text-xl lg:text-2xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300"
              >
                Trendboard
              </motion.h1>
            </div>
          </motion.div>

          {/* Actions Section */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
            {/* Enhanced Real-time Update Info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="hidden sm:flex items-center"
            >
              {(() => {
                const updateInfo = formatLastUpdate(lastUpdateTime);
                const statusColors = {
                  live: 'text-green-400',
                  recent: 'text-blue-400', 
                  normal: 'text-gray-300',
                  old: 'text-orange-400',
                  'very-old': 'text-red-400',
                  offline: 'text-gray-500'
                };
                return (
                  <>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      updateInfo.status === 'live' ? 'bg-green-500 animate-pulse' :
                      updateInfo.status === 'recent' ? 'bg-blue-500' :
                      updateInfo.status === 'normal' ? 'bg-gray-500' :
                      updateInfo.status === 'old' ? 'bg-orange-500' :
                      'bg-red-500'
                    }`} />
                    <span className={`text-xs lg:text-sm font-medium ${statusColors[updateInfo.status]}`}>
                      Updated {updateInfo.text}
                    </span>
                  </>
                );
              })()}
            </motion.div>

            {/* Refresh Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-xs sm:text-sm lg:text-base"
            >
              <RefreshCw 
                size={14} 
                className={`mr-1 sm:mr-1.5 lg:w-4 lg:h-4 ${isLoading ? 'animate-spin' : ''}`} 
              />
              <span className="hidden sm:inline">{isLoading ? 'Refreshing...' : 'Refresh'}</span>
              <span className="sm:hidden">{isLoading ? '...' : 'Sync'}</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;