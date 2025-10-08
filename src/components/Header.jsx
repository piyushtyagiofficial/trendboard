import { motion } from 'framer-motion';
import { TrendingUp, RefreshCw, Activity } from 'lucide-react';

const Header = ({ onRefresh, isLoading, lastUpdateTime }) => {
  const formatLastUpdate = (timestamp) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-lg rounded-xl mb-8"
    >
      <div className="px-6 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center mb-4 lg:mb-0">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="bg-gradient-to-r from-primary-500 to-secondary-500 p-3 rounded-xl mr-4"
            >
              <TrendingUp className="text-white" size={32} />
            </motion.div>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Trend<span className="text-primary-600">board</span>
              </h1>
              <p className="text-gray-600 mt-1">
                AI-powered financial news dashboard with real-time insights
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Last updated</p>
              <p className="font-semibold text-gray-900">
                {formatLastUpdate(lastUpdateTime)}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw 
                className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} 
                size={18} 
              />
              {isLoading ? 'Updating...' : 'Refresh'}
            </motion.button>
          </div>
        </div>

        {/* Live Status Indicator */}
        <div className="mt-6 flex items-center text-sm">
          <div className="flex items-center mr-6">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-3 h-3 bg-green-500 rounded-full mr-2"
            />
            <span className="text-gray-600">Live updates enabled</span>
          </div>
          
          <div className="flex items-center">
            <Activity className="text-gray-400 mr-2" size={16} />
            <span className="text-gray-600">Real-time market data</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;