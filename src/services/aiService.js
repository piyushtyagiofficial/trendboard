// AI Summarization service using Gemini 1.5 Flash API
export class AIService {
  constructor() {
    this.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;  // Replace with your real API key
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1';
    this.model = 'gemini-2.5-flash'; // Updated model
  }

  async summarizeArticle(headline, content) {
    // Check if API key is available
    if (!this.geminiApiKey || this.geminiApiKey === 'undefined') {
      console.log('Gemini API key not configured, using fallback summary');
      return this.generateFallbackSummary(headline);
    }

    const prompt = `Summarize this financial news article in exactly 2-3 concise lines that capture the key market impact and main points:

Headline: ${headline}
Content: ${content || headline}

Provide a clear, professional summary suitable for financial dashboard display.`;

    try {
      const response = await fetch(
        `${this.baseUrl}/models/${this.model}:generateContent?key=${this.geminiApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || this.generateFallbackSummary(headline);
    } catch (error) {
      console.error('AI summarization error:', error);
      return this.generateFallbackSummary(headline);
    }
  }

  generateFallbackSummary(headline) {
    const words = headline.toLowerCase().split(' ');
    const marketKeywords = ['market', 'stock', 'price', 'trading', 'investment'];
    const hasMarketTerms = words.some(word => marketKeywords.includes(word));
    
    if (hasMarketTerms) {
      return "Market development with potential impact on trading activity and investor sentiment. Key financial indicators may be affected by this news.";
    }
    
    return "Important financial news update with relevance to current market conditions and investment decisions.";
  }

  async enhanceNewsWithAI(articles) {
    const enhancedArticles = await Promise.all(
      articles.map(async (article) => {
        if (!article.summary || article.summary.length < 50) {
          const aiSummary = await this.summarizeArticle(article.headline, article.summary);
          return {
            ...article,
            summary: aiSummary,
            aiSummarized: true
          };
        }
        return article;
      })
    );

    return enhancedArticles;
  }
}

export const aiService = new AIService();
