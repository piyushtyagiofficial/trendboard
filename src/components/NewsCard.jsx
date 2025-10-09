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
          <div className="relative overflow-hidden h-36 sm:h-44 md:h-48">
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
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-semibold ${categoryConfig.bg} ${categoryConfig.text} shadow-lg backdrop-blur-sm`}
          >
            <CategoryIcon size={10} className="mr-1 sm:mr-1.5 sm:w-3 sm:h-3" />
            <span className="hidden sm:inline">{article.category?.toUpperCase() || 'NEWS'}</span>
            <span className="sm:hidden">{(article.category || 'NEWS').substring(0, 3).toUpperCase()}</span>
          </motion.div>
        </div>

        {/* AI Badge */}
        {article.aiSummarized && (
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
            <motion.div
              animate={{ 
                boxShadow: [
                  "0 0 0 0 rgba(147, 51, 234, 0.7)",
                  "0 0 0 10px rgba(147, 51, 234, 0)",
                  "0 0 0 0 rgba(147, 51, 234, 0)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
            >
              <Sparkles size={10} className="mr-1 sm:mr-1.5 sm:w-3 sm:h-3" />
              <span className="hidden sm:inline">AI Enhanced</span>
              <span className="sm:hidden">AI</span>
            </motion.div>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        {/* Source and Time */}
        <div className="flex items-center justify-between mb-3 sm:mb-4 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <span className="text-xs sm:text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 sm:px-3 sm:py-1 rounded-lg truncate max-w-[80px] sm:max-w-none">
              {article.source}
            </span>
          </div>
          <div className="flex items-center text-gray-500 text-xs sm:text-sm bg-gray-50 px-2 py-1 sm:px-3 sm:py-1 rounded-lg">
            <Clock size={12} className="mr-1 sm:mr-1.5 sm:w-[14px] sm:h-[14px]" />
            <span className="whitespace-nowrap">{formatTimeAgo(article.datetime)}</span>
          </div>
        </div>

        {/* Headline */}
        <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-200 leading-tight">
          {article.headline}
        </h3>

        {/* Summary - Flexible height container */}
        <div className="mb-3 sm:mb-4 flex-grow">
          <motion.div 
            className={`overflow-hidden ${showFullSummary || !isLongSummary ? '' : 'line-clamp-3'}`}
            layout
            transition={{ 
              duration: 0.4, 
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            <p className="text-gray-600 leading-relaxed text-sm sm:text-sm whitespace-pre-wrap">
              {article.summary}
            </p>
          </motion.div>
          
          {isLongSummary && (
            <motion.button
              whileHover={{ 
                scale: 1.02,
                backgroundColor: '#eff6ff'
              }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowFullSummary(!showFullSummary);
              }}
              className="mt-2 sm:mt-3 group flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-all duration-300 rounded-lg px-2 py-1 hover:bg-blue-50"
            >
              <span className="mr-1">
                {showFullSummary ? 'Show less' : 'Read more'}
              </span>
              <motion.div
                animate={{ 
                  rotate: showFullSummary ? 180 : 0 
                }}
                transition={{ 
                  duration: 0.3, 
                  ease: [0.4, 0, 0.2, 1] 
                }}
                className="flex items-center"
              >
                <ChevronDown size={14} className="sm:w-4 sm:h-4" />
              </motion.div>
            </motion.button>
          )}
        </div>

        {/* Symbols/Tags */}
        {article.symbols && article.symbols.length > 0 && (
          <div className="flex items-center mb-3 sm:mb-4">
            <Tag size={12} className="mr-1.5 sm:mr-2 text-gray-400 sm:w-[14px] sm:h-[14px]" />
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {article.symbols.slice(0, 2).map((symbol, idx) => (
                <motion.span
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="inline-block bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-full font-medium hover:from-blue-100 hover:to-blue-200 hover:text-blue-700 transition-all duration-200"
                >
                  {symbol}
                </motion.span>
              ))}
              {article.symbols.length > 2 && (
                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-full font-medium">
                  +{article.symbols.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer - Always at bottom */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 sm:pt-4 border-t border-gray-100 mt-auto space-y-2 sm:space-y-0">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">
            {article.provider}
          </span>
          {article.url && article.url !== '#' && (
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium text-xs sm:text-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg w-full sm:w-auto justify-center sm:justify-start"
            >
              <span className="sm:hidden">Read Story</span>
              <span className="hidden sm:inline">Read Full Story</span>
              <ExternalLink size={12} className="ml-1.5 sm:ml-2 sm:w-[14px] sm:h-[14px]" />
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NewsCard;