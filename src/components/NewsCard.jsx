import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Calendar, Tag, Sparkles, TrendingUp, Clock, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const NewsCard = ({ article, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);

  const formatTimeAgo = (datetime) => {
    const now = new Date();
    const articleDate = new Date(datetime);
    const diffInHours = Math.floor((now - articleDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getCategoryConfig = (category) => {
    const configs = {
      market: { 
        bg: 'bg-gradient-to-r from-blue-500 to-blue-600', 
        text: 'text-white',
        icon: TrendingUp
      },
      ipo: { 
        bg: 'bg-gradient-to-r from-purple-500 to-purple-600', 
        text: 'text-white',
        icon: Sparkles
      },
      earnings: { 
        bg: 'bg-gradient-to-r from-green-500 to-green-600', 
        text: 'text-white',
        icon: TrendingUp
      },
      crypto: { 
        bg: 'bg-gradient-to-r from-yellow-500 to-orange-500', 
        text: 'text-white',
        icon: TrendingUp
      },
      commodities: { 
        bg: 'bg-gradient-to-r from-orange-500 to-red-500', 
        text: 'text-white',
        icon: TrendingUp
      },
      monetary: { 
        bg: 'bg-gradient-to-r from-red-500 to-pink-500', 
        text: 'text-white',
        icon: TrendingUp
      },
      general: { 
        bg: 'bg-gradient-to-r from-gray-500 to-gray-600', 
        text: 'text-white',
        icon: Eye
      }
    };
    return configs[category] || configs.general;
  };

  const categoryConfig = getCategoryConfig(article.category);
  const CategoryIcon = categoryConfig.icon;

  // Check if summary is long enough to need expansion
  const isLongSummary = article.summary && article.summary.length > 150;
  const truncatedSummary = article.summary?.substring(0, 150) + '...';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { 
          duration: 0.6, 
          delay: (index % 3) * 0.1,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      }}
      viewport={{ 
        once: true, 
        amount: 0.2,
        margin: "0px 0px -100px 0px"
      }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" } 
      }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100 h-full flex flex-col"
    >
      <div className="relative flex-shrink-0">
        {article.image && (
          <div className="relative overflow-hidden h-48">
            <img
              src={article.image}
              alt={article.headline}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.style.height = '0';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-4 right-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${categoryConfig.bg} ${categoryConfig.text} shadow-lg backdrop-blur-sm`}
          >
            <CategoryIcon size={12} className="mr-1.5" />
            {article.category?.toUpperCase() || 'NEWS'}
          </motion.div>
        </div>

        {/* AI Badge */}
        {article.aiSummarized && (
          <div className="absolute top-4 left-4">
            <motion.div
              animate={{ 
                boxShadow: [
                  "0 0 0 0 rgba(147, 51, 234, 0.7)",
                  "0 0 0 10px rgba(147, 51, 234, 0)",
                  "0 0 0 0 rgba(147, 51, 234, 0)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
            >
              <Sparkles size={12} className="mr-1.5" />
              AI Enhanced
            </motion.div>
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {/* Source and Time */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
              {article.source}
            </span>
          </div>
          <div className="flex items-center text-gray-500 text-sm bg-gray-50 px-3 py-1 rounded-lg">
            <Clock size={14} className="mr-1.5" />
            {formatTimeAgo(article.datetime)}
          </div>
        </div>

        {/* Headline */}
        <h3 className="font-bold text-xl mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-200 leading-tight">
          {article.headline}
        </h3>

        {/* Summary - Flexible height container */}
        <div className="mb-4 flex-grow">
          <motion.div 
            className="overflow-hidden"
            animate={{ 
              height: showFullSummary || !isLongSummary ? 'auto' : '4.5rem' 
            }}
            transition={{ 
              duration: 0.5, 
              ease: [0.4, 0, 0.2, 1],
              type: "tween"
            }}
          >
            <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">
              {article.summary}
            </p>
          </motion.div>
          
          {isLongSummary && (
            <motion.button
              whileHover={{ 
                scale: 1.02, 
                backgroundColor: '#f8fafc',
                borderColor: '#3b82f6'
              }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowFullSummary(!showFullSummary);
              }}
              className="mt-3 inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-all duration-300 px-3 py-2 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-200"
            >
              <motion.span
                animate={{ 
                  rotate: showFullSummary ? 180 : 0 
                }}
                transition={{ 
                  duration: 0.3, 
                  ease: [0.4, 0, 0.2, 1] 
                }}
                className="flex items-center"
              >
                {showFullSummary ? 'Show Less' : 'Read More'}
                <motion.div className="ml-1">
                  {showFullSummary ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </motion.div>
              </motion.span>
            </motion.button>
          )}
        </div>

        {/* Symbols/Tags */}
        {article.symbols && article.symbols.length > 0 && (
          <div className="flex items-center mb-4">
            <Tag size={14} className="mr-2 text-gray-400" />
            <div className="flex flex-wrap gap-2">
              {article.symbols.slice(0, 3).map((symbol, idx) => (
                <motion.span
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="inline-block bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-full font-medium hover:from-blue-100 hover:to-blue-200 hover:text-blue-700 transition-all duration-200"
                >
                  {symbol}
                </motion.span>
              ))}
              {article.symbols.length > 3 && (
                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full font-medium">
                  +{article.symbols.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer - Always at bottom */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">
            {article.provider}
          </span>
          {article.url && article.url !== '#' && (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Read Full Story
              <ExternalLink size={14} className="ml-2" />
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NewsCard;