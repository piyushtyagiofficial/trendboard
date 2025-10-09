import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { TrendingUp, ChartPie as PieChartIcon, ChartBar as BarChart3, Activity, Calendar, Hash, Sparkles } from 'lucide-react';

const ChartVisualization = ({ articles }) => {
  // Process data for topic frequency
  const getTopicFrequency = () => {
    const topicCount = {};
    const symbolCount = {};
    const timelineData = {};

    articles.forEach(article => {
      // Count categories
      const category = article.category || 'general';
      topicCount[category] = (topicCount[category] || 0) + 1;

      // Count symbols/tickers
      if (article.symbols) {
        article.symbols.forEach(symbol => {
          symbolCount[symbol] = (symbolCount[symbol] || 0) + 1;
        });
      }

      // Timeline data (by day)
      const date = new Date(article.datetime).toDateString();
      timelineData[date] = (timelineData[date] || 0) + 1;
    });

    return { topicCount, symbolCount, timelineData };
  };

  const { topicCount, symbolCount, timelineData } = getTopicFrequency();

  // Prepare data for charts
  const categoryData = Object.entries(topicCount)
    .map(([category, count]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      count,
      percentage: ((count / articles.length) * 100).toFixed(1),
      fill: getCategoryColor(category)
    }))
    .sort((a, b) => b.count - a.count);

  const symbolData = Object.entries(symbolCount)
    .map(([symbol, count]) => ({
      symbol,
      count,
      percentage: ((count / articles.length) * 100).toFixed(1)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 symbols

  const timelineChartData = Object.entries(timelineData)
    .map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count,
      fullDate: date
    }))
    .sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate))
    .slice(-7); // Last 7 days

  function getCategoryColor(category) {
    const colors = {
      market: '#3b82f6',
      ipo: '#8b5cf6', 
      earnings: '#10b981',
      crypto: '#f59e0b',
      commodities: '#f97316',
      monetary: '#ef4444',
      general: '#ef4444'
    };
    return colors[category] || '#f59e0b';
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-4 border rounded-xl shadow-xl border-gray-200"
        >
          <p className="font-semibold text-gray-900">{`${label}: ${payload[0].value}`}</p>
          {payload[0].payload.percentage && (
            <p className="text-sm text-gray-600">{`${payload[0].payload.percentage}% of total`}</p>
          )}
        </motion.div>
      );
    }
    return null;
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, gradient, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`${gradient} rounded-xl sm:rounded-2xl text-white p-4 sm:p-6 shadow-lg relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white opacity-10 rounded-full -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-white/80 text-xs sm:text-sm font-medium">{title}</p>
            <p className="text-xl sm:text-3xl font-bold">{value}</p>
          </div>
          <Icon size={20} className="text-white/70 sm:w-8 sm:h-8" />
        </div>
        {subtitle && <p className="text-white/60 text-xs">{subtitle}</p>}
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6 sm:space-y-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-4"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 flex items-center justify-center">
          <Activity className="mr-2 sm:mr-3 text-blue-600" size={24} />
          <span className="hidden sm:inline">Market Intelligence Dashboard</span>
          <span className="sm:hidden">Market Analytics</span>
        </h2>
        <p className="text-gray-600 text-sm sm:text-lg">Real-time analysis of financial news trends</p>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 px-4 sm:px-0">
        <StatCard
          icon={Activity}
          title="Articles"
          value={articles.length}
          subtitle="Total news items"
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          delay={0.1}
        />
        <StatCard
          icon={PieChartIcon}
          title="Categories"
          value={Object.keys(topicCount).length}
          subtitle="News types"
          gradient="bg-gradient-to-br from-green-500 to-green-600"
          delay={0.2}
        />
        <StatCard
          icon={Hash}
          title="Symbols"
          value={Object.keys(symbolCount).length}
          subtitle="Companies"
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          delay={0.3}
        />
        <StatCard
          icon={TrendingUp}
          title="Coverage"
          value={Object.keys(timelineData).length}
          subtitle="Days tracked"
          gradient="bg-gradient-to-br from-orange-500 to-orange-600"
          delay={0.4}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 px-4 sm:px-0">
        {/* Category Distribution - Enhanced Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 border border-gray-100"
        >
          <div className="flex items-center mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
              <PieChartIcon className="text-white" size={16} />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Category Distribution</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Content breakdown</p>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percentage }) => window.innerWidth > 640 ? `${category} (${percentage}%)` : `${percentage}%`}
                outerRadius={window.innerWidth > 640 ? 100 : 80}
                innerRadius={window.innerWidth > 640 ? 40 : 30}
                paddingAngle={5}
                dataKey="count"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {categoryData.map((item, index) => (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center p-3 bg-gray-50 rounded-lg"
              >
                <div
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: item.fill }}
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    {item.category}
                  </span>
                  <p className="text-xs text-gray-600">{item.count} articles</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Symbols - Enhanced Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 border border-gray-100"
        >
          <div className="flex items-center mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
              <BarChart3 className="text-white" size={16} />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Top Symbols</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Most mentioned companies</p>
            </div>
          </div>
          
          {symbolData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={symbolData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="symbol" 
                  tick={{ fontSize: window.innerWidth > 640 ? 12 : 10 }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  angle={window.innerWidth > 640 ? 0 : -45}
                  textAnchor={window.innerWidth > 640 ? 'middle' : 'end'}
                />
                <YAxis 
                  tick={{ fontSize: window.innerWidth > 640 ? 12 : 10 }}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="count" 
                  fill="url(#barGradient)" 
                  radius={[6, 6, 0, 0]}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-80 text-gray-400">
              <div className="text-center">
                <Hash size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No symbol data available</p>
                <p className="text-sm">Symbols will appear as articles are analyzed</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Timeline Chart */}
      {timelineChartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 border border-gray-100 mx-4 sm:mx-0"
        >
          <div className="flex items-center mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
              <Calendar className="text-white" size={16} />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Activity Timeline</h3>
              <p className="text-gray-600 text-xs sm:text-sm">News volume over time</p>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={timelineChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: window.innerWidth > 640 ? 12 : 10 }}
                axisLine={{ stroke: '#e2e8f0' }}
                angle={window.innerWidth > 640 ? 0 : -45}
                textAnchor={window.innerWidth > 640 ? 'middle' : 'end'}
              />
              <YAxis 
                tick={{ fontSize: window.innerWidth > 640 ? 12 : 10 }}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#10b981"
                fill="url(#areaGradient)"
                strokeWidth={3}
              />
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ChartVisualization;