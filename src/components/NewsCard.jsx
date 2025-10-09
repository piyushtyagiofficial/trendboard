import { motion } from 'framer-motion';
import { ExternalLink, Calendar, Tag, Sparkles, TrendingUp, Clock, Eye, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const NewsCard = ({ article, index }) => {
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
        bg: 'bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400',
        text: 'text-gray-900',
        icon: TrendingUp,
        cardAccent: 'from-amber-500/15 to-orange-500/15',
        glowColor: 'shadow-amber-500/30',
        badgeBg: 'bg-gradient-to-br from-amber-50/10 to-orange-50/10',
        badgeText: 'text-amber-200'
      },
      ipo: {
        bg: 'bg-gradient-to-r from-rose-400 via-pink-400 to-fuchsia-400',
        text: 'text-gray-900',
        icon: Sparkles,
        cardAccent: 'from-rose-500/15 to-pink-500/15',
        glowColor: 'shadow-rose-500/30',
        badgeBg: 'bg-gradient-to-br from-rose-50/10 to-pink-50/10',
        badgeText: 'text-rose-200'
      },
      earnings: {
        bg: 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400',
        text: 'text-gray-900',
        icon: TrendingUp,
        cardAccent: 'from-emerald-500/15 to-teal-500/15',
        glowColor: 'shadow-emerald-500/30',
        badgeBg: 'bg-gradient-to-br from-emerald-50/10 to-teal-50/10',
        badgeText: 'text-emerald-200'
      },
      crypto: {
        bg: 'bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500',
        text: 'text-gray-900',
        icon: TrendingUp,
        cardAccent: 'from-yellow-500/15 to-orange-500/15',
        glowColor: 'shadow-yellow-500/30',
        badgeBg: 'bg-gradient-to-br from-yellow-50/10 to-amber-50/10',
        badgeText: 'text-yellow-200'
      },
      commodities: {
        bg: 'bg-gradient-to-r from-orange-400 via-red-400 to-rose-500',
        text: 'text-gray-900',
        icon: TrendingUp,
        cardAccent: 'from-orange-500/15 to-red-500/15',
        glowColor: 'shadow-orange-500/30',
        badgeBg: 'bg-gradient-to-br from-orange-50/10 to-red-50/10',
        badgeText: 'text-orange-200'
      },
      monetary: {
        bg: 'bg-gradient-to-r from-pink-400 via-rose-400 to-red-400',
        text: 'text-gray-900',
        icon: TrendingUp,
        cardAccent: 'from-pink-500/15 to-rose-500/15',
        glowColor: 'shadow-pink-500/30',
        badgeBg: 'bg-gradient-to-br from-pink-50/10 to-rose-50/10',
        badgeText: 'text-pink-200'
      },
      general: {
        bg: 'bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400',
        text: 'text-gray-900',
        icon: Eye,
        cardAccent: 'from-indigo-500/15 to-violet-500/15',
        glowColor: 'shadow-indigo-500/30',
        badgeBg: 'bg-gradient-to-br from-indigo-50/10 to-violet-50/10',
        badgeText: 'text-indigo-200'
      }
    };
    return configs[category] || configs.general;
  };

  const categoryConfig = getCategoryConfig(article.category);
  const CategoryIcon = categoryConfig.icon;

  const isLongSummary = article.summary && article.summary.length > 150;

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
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className={`relative bg-gradient-to-br from-slate-900/90 via-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl shadow-2xl ${categoryConfig.glowColor} transition-all duration-300 overflow-hidden group cursor-pointer border border-slate-700/50 h-full flex flex-col`}
    >
      <div className="relative z-10 flex-shrink-0">
        {article.image && (
          <div className="relative overflow-hidden h-44 md:h-48">
            <img
              src={article.image}
              alt={article.headline}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.style.height = '0';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-4 right-4">
          <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${categoryConfig.bg} ${categoryConfig.text} shadow-lg`}>
            <CategoryIcon size={12} className="mr-1" />
            {article.category?.toUpperCase() || 'NEWS'}
          </div>
        </div>

        {/* AI Enhanced Badge */}
        {article.aiSummarized && (
          <div className="absolute top-4 left-4">
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(251, 146, 60, 0.7)",
                  "0 0 0 10px rgba(251, 146, 60, 0)",
                  "0 0 0 0 rgba(251, 146, 60, 0)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-400 to-rose-400 text-gray-900 shadow-lg"
            >
              <Sparkles size={12} className="mr-1" />
              AI
            </motion.div>
          </div>
        )}
      </div>

      <div className="relative z-10 p-4 sm:p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <span className={`text-xs font-semibold ${categoryConfig.badgeBg} ${categoryConfig.badgeText} px-3 py-1.5 rounded-xl shadow border border-white/10`}>
            {article.source}
          </span>
          <span className="flex items-center text-amber-100 text-xs bg-gradient-to-r from-amber-950/40 to-orange-950/40 px-3 py-1.5 rounded-xl border border-amber-700/30 backdrop-blur-sm">
            <Clock size={12} className="mr-1" />
            {formatTimeAgo(article.datetime)}
          </span>
        </div>

        <h3 className="font-bold text-lg sm:text-xl mb-3 text-amber-50 leading-tight">
          {article.headline}
        </h3>

        {/* Summary */}
        <div className="flex-grow mb-4">
          <motion.div layout className={`text-gray-200 text-sm ${!showFullSummary && isLongSummary ? 'line-clamp-3' : ''}`}>
            {article.summary}
          </motion.div>

          {isLongSummary && (
            <button
              onClick={() => setShowFullSummary(!showFullSummary)}
              className="mt-2 text-amber-400 hover:text-amber-300 text-sm font-medium flex items-center transition-colors"
            >
              {showFullSummary ? 'Show less' : 'Read more'}
              <ChevronDown
                className={`ml-1 transition-transform duration-300 ${showFullSummary ? 'rotate-180' : ''}`}
                size={14}
              />
            </button>
          )}
        </div>

        {/* Symbols */}
        {article.symbols?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.symbols.slice(0, 2).map((symbol, idx) => (
              <span key={idx} className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-100 text-xs px-3 py-1.5 rounded-full font-medium border border-amber-600/40 backdrop-blur-sm">
                {symbol}
              </span>
            ))}
            {article.symbols.length > 2 && (
              <span className="bg-gradient-to-r from-rose-500/20 to-pink-500/20 text-rose-100 text-xs px-3 py-1.5 rounded-full font-medium border border-rose-600/40 backdrop-blur-sm">
                +{article.symbols.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center border-t border-amber-700/20 pt-3 mt-auto">
          <span className="text-xs text-amber-200/60">{article.provider}</span>
          {article.url && article.url !== '#' && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${categoryConfig.bg} text-gray-900 px-4 py-2 rounded-lg text-xs font-semibold flex items-center hover:shadow-lg hover:shadow-amber-500/30 transition-all`}
            >
              Read Full Story
              <ExternalLink size={12} className="ml-2" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NewsCard;