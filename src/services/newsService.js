// News fetching service integrating multiple APIs
export class NewsService {
  constructor() {
    this.finnhubApiKey = import.meta.env.VITE_FINNHUB_API_KEY; 
    this.eodhdApiKey = import.meta.env.VITE_EOTHD_API_KEY;
    this.lastFetchTime = null;
    this.cache = new Map();
  }

  async fetchFinnhubNews(category = 'general') {
    const url = `https://finnhub.io/api/v1/news?category=${category}&token=${this.finnhubApiKey}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Finnhub API error: ${response.status}`);
      
      const data = await response.json();
      return data.slice(0, 10).map(article => ({
        id: article.id || Date.now() + Math.random(),
        headline: article.headline,
        summary: article.summary || '',
        source: article.source || 'Finnhub',
        url: article.url,
        image: article.image,
        category: category,
        datetime: new Date(article.datetime * 1000).toISOString(),
        symbols: article.related ? article.related.split(',') : [],
        provider: 'finnhub'
      }));
    } catch (error) {
      console.error('Finnhub fetch error:', error);
      return [];
    }
  }

  async fetchIPOAlerts() {
    // Mock IPO data - replace with actual IPOAlerts API
    const mockIPOData = [
      {
        id: 'ipo-1',
        headline: 'Tech Startup XYZ Files for $500M IPO',
        summary: 'Emerging AI company plans to go public with major institutional backing',
        source: 'IPOAlerts',
        url: '#',
        image: 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'ipo',
        datetime: new Date().toISOString(),
        symbols: ['XYZ'],
        provider: 'ipoalerts'
      },
      {
        id: 'ipo-2',
        headline: 'Renewable Energy Firm Announces IPO Plans',
        summary: 'Solar power company seeks $300M funding through public offering',
        source: 'IPOAlerts',
        url: '#',
        image: 'https://images.pexels.com/photos/9875435/pexels-photo-9875435.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'ipo',
        datetime: new Date(Date.now() - 86400000).toISOString(),
        symbols: ['GREEN'],
        provider: 'ipoalerts'
      }
    ];

    return mockIPOData;
  }

  async fetchBSENSEFilings() {
    // Mock BSE/NSE filing data - replace with actual API
    const mockFilingsData = [
      {
        id: 'filing-1',
        headline: 'Major Bank Reports Q4 Earnings Beat',
        summary: 'Leading financial institution exceeds analyst expectations',
        source: 'BSE',
        url: '#',
        image: 'https://images.pexels.com/photos/6802049/pexels-photo-6802049.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'earnings',
        datetime: new Date().toISOString(),
        symbols: ['BANK'],
        provider: 'bse'
      }
    ];

    return mockFilingsData;
  }

  async fetchAllNews() {
    try {
      const [generalNews, ipoNews, filings] = await Promise.all([
        this.fetchFinnhubNews('general'),
        this.fetchIPOAlerts(),
        this.fetchBSENSEFilings()
      ]);

      const allNews = [
        ...generalNews,
        ...ipoNews,
        ...filings
      ].sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

      this.lastFetchTime = new Date();
      return allNews;
    } catch (error) {
      console.error('Error fetching news:', error);
      return this.getMockNews();
    }
  }

  getMockNews() {
    return [
      {
        id: '1',
        headline: 'Market Rally Continues as Tech Stocks Surge',
        summary: 'Technology sector leads broader market gains amid positive earnings reports and strong investor sentiment.',
        source: 'Financial Times',
        url: '#',
        image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'market',
        datetime: new Date().toISOString(),
        symbols: ['TECH', 'NASDAQ'],
        provider: 'mock'
      },
      {
        id: '2',
        headline: 'Fed Signals Potential Rate Cut in Coming Months',
        summary: 'Federal Reserve officials hint at monetary policy adjustments as inflation shows signs of cooling.',
        source: 'Reuters',
        url: '#',
        image: 'https://images.pexels.com/photos/6802042/pexels-photo-6802042.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'monetary',
        datetime: new Date(Date.now() - 3600000).toISOString(),
        symbols: ['FED'],
        provider: 'mock'
      },
      {
        id: '3',
        headline: 'Cryptocurrency Market Sees Mixed Trading',
        summary: 'Digital assets show varied performance with Bitcoin holding steady while altcoins experience volatility.',
        source: 'CoinDesk',
        url: '#',
        image: 'https://images.pexels.com/photos/6765363/pexels-photo-6765363.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'crypto',
        datetime: new Date(Date.now() - 7200000).toISOString(),
        symbols: ['BTC', 'ETH'],
        provider: 'mock'
      },
      {
        id: '4',
        headline: 'Oil Prices Jump on Supply Concerns',
        summary: 'Crude oil futures rise significantly following geopolitical tensions and reduced production forecasts.',
        source: 'Bloomberg',
        url: '#',
        image: 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'commodities',
        datetime: new Date(Date.now() - 10800000).toISOString(),
        symbols: ['OIL', 'WTI'],
        provider: 'mock'
      }
    ];
  }
}

export const newsService = new NewsService();