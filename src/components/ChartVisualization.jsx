import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TrendingUp, ChartPie as PieChartIcon, ChartBar as BarChart3 } from 'lucide-react';

const ChartVisualization = ({ articles }) => {
  // Process data for topic frequency
  const getTopicFrequency = () => {
    const topicCount = {};
    const symbolCount = {};

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
    });

    return { topicCount, symbolCount };
  };

  const { topicCount, symbolCount } = getTopicFrequency();

  // Prepare data for charts
  const categoryData = Object.entries(topicCount)
    .map(([category, count]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      count,
      percentage: ((count / articles.length) * 100).toFixed(1)
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

  const pieColors = [
    '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`${label}: ${payload[0].value}`}</p>
          <p className="text-sm text-gray-600">{`${payload[0].payload.percentage}% of total`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Market Insights</h2>
        <p className="text-gray-600">Visual analysis of trending topics and market mentions</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Category Distribution - Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center mb-4">
            <PieChartIcon className="text-primary-600 mr-2" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">News Category Distribution</h3>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percentage }) => `${category} (${percentage}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {categoryData.map((item, index) => (
              <div key={item.category} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: pieColors[index % pieColors.length] }}
                />
                <span className="text-sm text-gray-600">
                  {item.category}: {item.count}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Symbols - Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center mb-4">
            <BarChart3 className="text-secondary-600 mr-2" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Most Mentioned Symbols</h3>
          </div>
          
          {symbolData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={symbolData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="symbol" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <TrendingUp size={48} className="mx-auto mb-4 opacity-50" />
                <p>No symbol data available</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Articles</p>
              <p className="text-3xl font-bold">{articles.length}</p>
            </div>
            <TrendingUp size={32} className="text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Categories</p>
              <p className="text-3xl font-bold">{Object.keys(topicCount).length}</p>
            </div>
            <PieChartIcon size={32} className="text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Unique Symbols</p>
              <p className="text-3xl font-bold">{Object.keys(symbolCount).length}</p>
            </div>
            <BarChart3 size={32} className="text-purple-200" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChartVisualization;