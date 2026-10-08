import { scrapeGoogleResults } from '../utils/scrapeGoogleResults';
import { runProcessMarketTrendsChain } from '../chains/processMarketTrendsChain';

export async function marketTrendScraper(startupIdea) {
  if (!process.env.SERP_API_KEY) {
    console.warn("SERP_API_KEY is not configured; generating market trends from the startup idea.");
    return runProcessMarketTrendsChain("No external search results are available.", startupIdea);
  }
  
  const query = `latest market trends in ${startupIdea} 2025`;
  const results = await scrapeGoogleResults(query);

  if (!results || results.length === 0) {
    console.warn("No external market-trend search results found; generating trends from the startup idea.");
    return runProcessMarketTrendsChain("No relevant external search results were found.", startupIdea);
  }

  // Fetch more results initially to give the processing chain better options
  const slicedResults = results.slice(0, 8);
  const processedTrends = await runProcessMarketTrendsChain(
    JSON.stringify(slicedResults, null, 2),
    startupIdea
  );

  return processedTrends;
}