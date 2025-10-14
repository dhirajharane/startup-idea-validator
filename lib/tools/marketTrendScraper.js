import { DynamicTool } from 'langchain/tools';
import { scrapeGoogleResults } from '../utils/scrapeGoogleResults.js';

/**
 * A LangChain tool that fetches recent market trends for a given topic using Google Search.
 */
export const marketTrendScraper = new DynamicTool({
  name: 'market_trend_scraper',
  description:
    'Fetches 4 recent market trends for an idea or industry. Returns them as a JSON object with a title and a one-line description.',

  func: async (input) => {
    if (!input || typeof input !== 'string') {
      return JSON.stringify({ error: 'Invalid input. Please provide a topic like "AI in retail".' });
    }

    // The query is well-suited for finding news and articles about trends.
    const query = `latest market trends in ${input} 2025`;
    const results = await scrapeGoogleResults(query);

    if (!results || results.length === 0) {
      return JSON.stringify({ error: `No market trends found for "${input}".` });
    }

    // Process the top 4 results, using the snippet for the description.
    const trends = results.slice(0, 4).map((result) => ({
      title: result.title,
      description: result.snippet || 'No description available.',
    }));

    return JSON.stringify({ trends });
  },
});