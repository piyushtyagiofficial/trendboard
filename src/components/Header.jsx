import { motion } from 'framer-motion';
import { TrendingUp, RefreshCw, Activity, Clock, Sparkles, Globe, Zap } from 'lucide-react';

const Header = ({ onRefresh, isLoading, lastUpdateTime }) => {
  const formatLastUpdate = (timestamp) => {
    if (!timestamp) return 'Never';
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 overflow-hidden mb-8 rounded-2xl shadow-2xl"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
        <svg className="absolute top-0 right-0 w-64 h-64 opacity-30" viewBox="0 0 100 100">
          <circle cx="20" cy="20" r="2" fill="currentColor" className="animate-pulse" />
          <circle cx="80" cy="30" r="1.5" fill="currentColor" className="animate-ping" />
          <circle cx="40" cy="70" r="1" fill="currentColor" className="animate-pulse" />
          <circle cx="90" cy="80" r="2.5" fill="currentColor" className="animate-ping" />
        </svg>
      </div>

      <div className="relative px-6 py-8 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Brand Section */}
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
            >
              <TrendingUp size={24} className="text-white" />
            </motion.div>
            
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl lg:text-4xl font-bold text-white"
              >
                Trendboard
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-blue-100 text-sm lg:text-base flex items-center mt-1"
              >
                <Sparkles size={16} className="mr-2" />
                AI-Powered Financial Intelligence
              </motion.p>
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
            {/* Last Update Info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center text-blue-100"
            >
              <Clock size={16} className="mr-2" />
              <span className="text-sm">
                Updated {formatLastUpdate(lastUpdateTime)}
              </span>
            </motion.div>

            {/* Refresh Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-medium hover:bg-white/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
            >
              <RefreshCw 
                size={18} 
                className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} 
              />
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </motion.button>
          </div>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 pt-6 border-t border-white/20"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Activity size={20} className="text-white" />
              </div>
              <div className="text-lg font-bold text-white">Live</div>
              <div className="text-blue-200 text-sm">Market Data</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Zap size={20} className="text-white" />
              </div>
              <div className="text-lg font-bold text-white">AI</div>
              <div className="text-blue-200 text-sm">Enhanced</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-3 bg-green-400 rounded-full"
                />
              </div>
              <div className="text-lg font-bold text-white">Real-time</div>
              <div className="text-blue-200 text-sm">Updates</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Globe size={20} className="text-white" />
              </div>
              <div className="text-lg font-bold text-white">Global</div>
              <div className="text-blue-200 text-sm">Coverage</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;