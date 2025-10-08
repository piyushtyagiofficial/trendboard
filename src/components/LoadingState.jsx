import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const LoadingState = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4 rounded-full mx-auto mb-6"
        >
          <TrendingUp className="text-white" size={48} />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Trendboard</h2>
        <p className="text-gray-600 mb-6">Fetching latest financial news and market insights...</p>
        
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-3 h-3 bg-primary-500 rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingState;