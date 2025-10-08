import { motion } from 'framer-motion';
import { ExternalLink, Calendar, Tag, Sparkles } from 'lucide-react';

const NewsCard = ({ article, index }) => {
  const formatTimeAgo = (datetime) => {
    const now = new Date();
    const articleDate = new Date(datetime);
    const diffInHours = Math.floor((now - articleDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      market: 'bg-blue-100 text-blue-800',
      ipo: 'bg-purple-100 text-purple-800',
      earnings: 'bg-green-100 text-green-800',
      crypto: 'bg-yellow-100 text-yellow-800',
      commodities: 'bg-orange-100 text-orange-800',
      monetary: 'bg-red-100 text-red-800',
      general: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.general;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      <div className="relative">
        {article.image && (
          <img
            src={article.image}
            alt={article.headline}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}
        <div className="absolute top-4 right-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
            {article.category?.toUpperCase() || 'NEWS'}
          </span>
        </div>
        {article.aiSummarized && (
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              <Sparkles size={12} className="mr-1" />
              AI Summarized
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-primary-600">{article.source}</span>
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar size={14} className="mr-1" />
            {formatTimeAgo(article.datetime)}
          </div>
        </div>

        <h3 className="font-bold text-lg mb-3 text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {article.headline}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {article.summary}
        </p>

        {article.symbols && article.symbols.length > 0 && (
          <div className="flex items-center mb-4">
            <Tag size={14} className="mr-2 text-gray-400" />
            <div className="flex flex-wrap gap-1">
              {article.symbols.slice(0, 3).map((symbol, idx) => (
                <span
                  key={idx}
                  className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md"
                >
                  {symbol}
                </span>
              ))}
              {article.symbols.length > 3 && (
                <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md">
                  +{article.symbols.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 uppercase tracking-wide">
            {article.provider}
          </span>
          {article.url && article.url !== '#' && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
            >
              Read More
              <ExternalLink size={14} className="ml-1" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NewsCard;