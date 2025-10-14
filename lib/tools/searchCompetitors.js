import { scrapeGoogleResults } from '../utils/scrapeGoogleResults';
import { runProcessCompetitorsChain } from '../chains/processCompetitorsChain';

export async function searchCompetitors(startupIdea) {
  if (!process.env.SERP_API_KEY) {
    return [
      { name: "Competitor A (Mock)", description: "A mock competitor description because SERP_API_KEY is not set." },
      { name: "Competitor B (Mock)", description: "Another mock competitor description." },
      { name: "Competitor C (Mock)", description: "A third mock competitor." },
      { name: "Competitor D (Mock)", description: "A fourth mock competitor." },
    ];
  }

  const query = `top competitors for ${startupIdea}`;
  const results = await scrapeGoogleResults(query);

  if (!results || results.length === 0) {
    return [];
  }
  
  // Fetch more results initially to give the processing chain better options
  const slicedResults = results.slice(0, 6);
  const processedCompetitors = await runProcessCompetitorsChain(JSON.stringify(slicedResults, null, 2));

  return processedCompetitors;
}