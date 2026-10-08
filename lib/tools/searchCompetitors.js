import { scrapeGoogleResults } from '../utils/scrapeGoogleResults';
import { runProcessCompetitorsChain } from '../chains/processCompetitorsChain';

function fallbackCompetitors(startupIdea) {
  return [
    { name: `${startupIdea} alternative`, description: `Established products serving customers with a similar ${startupIdea} use case.` },
    { name: `${startupIdea} specialist`, description: `Focused providers competing through a narrower solution for the ${startupIdea} market.` },
    { name: `${startupIdea} platform`, description: `Broader platforms that can overlap with the target customers and workflow.` },
    { name: `${startupIdea} in-house solution`, description: `The internal or manual approach customers may use instead of this startup.` },
  ];
}

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
    return fallbackCompetitors(startupIdea);
  }
  
  // Fetch more results initially to give the processing chain better options
  const slicedResults = results.slice(0, 6);
  const processedCompetitors = await runProcessCompetitorsChain(JSON.stringify(slicedResults, null, 2));

  return processedCompetitors;
}