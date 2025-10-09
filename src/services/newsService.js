// News fetching service integrating multiple APIs
export class NewsService {
  constructor() {
    this.finnhubApiKey = import.meta.env.VITE_FINNHUB_API_KEY; 
    this.lastFetchTime = null;
    this.rateLimitDelay = 1000; // 1 second between requests
    this.lastRequestTime = 0;
  }

  // Add delay between API requests to respect rate limits
  async waitForRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.rateLimitDelay) {
      const waitTime = this.rateLimitDelay - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    this.lastRequestTime = Date.now();
  }

  async fetchFinnhubNews(category = 'general') {
    // Check if API key is available
    if (!this.finnhubApiKey || this.finnhubApiKey === 'undefined' || this.finnhubApiKey === 'placeholder') {
      console.log('Finnhub API key not configured, skipping Finnhub news fetch');
      return [];
    }

    // Wait for rate limit
    await this.waitForRateLimit();

    const url = `https://finnhub.io/api/v1/news?category=${category}&token=${this.finnhubApiKey}`;
    
    try {
      const response = await fetch(url);
      
      if (response.status === 429) {
        console.warn('Finnhub rate limit hit, returning empty array');
        return [];
      }
      
      if (!response.ok) {
        throw new Error(`Finnhub API error: ${response.status}`);
      }
      
      const data = await response.json();
      const processedData = data.slice(0, 25).map(article => ({
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

      return processedData;
    } catch (error) {
      console.error('Finnhub fetch error:', error);
      return [];
    }
  }

  async fetchAllNews() {
    try {
      const generalNews = await this.fetchFinnhubNews('general');

      const allNews = [...generalNews].sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

      this.lastFetchTime = new Date();
      return allNews;
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  }

}

export const newsService = new NewsService();