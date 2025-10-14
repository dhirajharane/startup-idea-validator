import { scrapeGoogleResults } from '../utils/scrapeGoogleResults';
import { runProcessMarketTrendsChain } from '../chains/processMarketTrendsChain';

export async function marketTrendScraper(startupIdea) {
  if (!process.env.SERP_API_KEY) {
    return {
      trends: [
        { title: "Mock Market Trend 1", description: "A mock trend description because SERP_API_KEY is not set." },
        { title: "Mock Market Trend 2", description: "Another mock trend description." },
        { title: "Mock Market Trend 3", description: "A third mock trend." },
        { title: "Mock Market Trend 4", description: "A fourth mock trend." },
        { title: "Mock Market Trend 5", description: "A fifth mock trend." },
      ],
      trendSummary: "This is a mock summary of market trends because the SERP_API_KEY is not configured.",
    };
  }
  
  const query = `latest market trends in ${startupIdea} 2025`;
  const results = await scrapeGoogleResults(query);

  if (!results || results.length === 0) {
    return { trends: [], trendSummary: "" };
  }

  // Fetch more results initially to give the processing chain better options
  const slicedResults = results.slice(0, 8);
  const processedTrends = await runProcessMarketTrendsChain(JSON.stringify(slicedResults, null, 2));

  return processedTrends;
}