import { motion } from 'framer-motion';
import { TrendingUp, Activity, Sparkles, BarChart3 } from 'lucide-react';

const LoadingState = () => {
  const loadingSteps = [
    { icon: Activity, text: "Connecting to markets...", delay: 0 },
    { icon: TrendingUp, text: "Analyzing financial data...", delay: 0.5 },
    { icon: Sparkles, text: "Enhancing with AI...", delay: 1 },
    { icon: BarChart3, text: "Preparing insights...", delay: 1.5 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center relative overflow-hidden px-4">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 left-10 w-3 h-3 sm:w-4 sm:h-4 bg-blue-300 rounded-full"
        />
        <motion.div
          animate={{
            x: [0, -150, 0],
            y: [0, 100, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-20 w-4 h-4 sm:w-6 sm:h-6 bg-purple-300 rounded-full"
        />
        <motion.div
          animate={{
            x: [0, 200, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-1/4 w-2 h-2 sm:w-3 sm:h-3 bg-green-300 rounded-full"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center relative z-10 max-w-sm sm:max-w-md mx-auto"
      >
        {/* Main Logo Animation */}
        <motion.div
          className="relative mb-6 sm:mb-8"
        >
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-2xl"
          >
            <TrendingUp className="text-white" size={32} />
          </motion.div>
          
          {/* Pulse Rings */}
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              animate={{
                scale: [1, 2, 1],
                opacity: [0.6, 0, 0.6]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: ring * 0.4
              }}
              className="absolute inset-0 border-2 border-blue-400 rounded-2xl"
            />
          ))}
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-3"
        >
          Trendboard
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8"
        >
          <span className="hidden sm:inline">AI-Powered Financial Intelligence</span>
          <span className="sm:hidden">AI Financial News</span>
        </motion.p>

        {/* Loading Steps */}
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          {loadingSteps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: step.delay }}
                className="flex items-center justify-center space-x-2 sm:space-x-3"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    delay: step.delay
                  }}
                  className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center"
                >
                  <StepIcon size={14} className="text-white sm:w-4 sm:h-4" />
                </motion.div>
                <span className="text-gray-700 font-medium text-sm sm:text-base">{step.text}</span>
              </motion.div>
            );
          })}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 mb-4 sm:mb-6 overflow-hidden">
          <motion.div
            animate={{ width: ["0%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          />
        </div>

        {/* Animated Dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 1, 0.4],
                backgroundColor: [
                  "rgb(59, 130, 246)", 
                  "rgb(139, 92, 246)", 
                  "rgb(59, 130, 246)"
                ]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1
              }}
              className="w-2 h-2 rounded-full"
            />
          ))}
        </div>

        {/* Loading Text Animation */}
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-4 text-sm text-gray-500"
        >
          Please wait while we prepare your dashboard...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingState;