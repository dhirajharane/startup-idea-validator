import { DynamicTool } from 'langchain/tools';
import { scrapeGoogleResults } from '../utils/scrapeGoogleResults.js';

/**
 * A LangChain tool that finds competitors for a startup idea by performing a targeted Google search.
 */
export const searchCompetitors = new DynamicTool({
  name: 'search_competitors',
  description:
    'Finds 4 real-world competitors for a given startup idea or industry. Returns them as a JSON object with name and a one-line description.',

  func: async (input) => {
    if (!input || typeof input !== 'string') {
      return JSON.stringify({ error: 'Invalid input. Please provide a topic like "AI-powered grammar checker".' });
    }

    // Formulate a more targeted query to find competitors.
    const query = `top competitors for ${input}`;
    const results = await scrapeGoogleResults(query);

    if (!results || results.length === 0) {
      return JSON.stringify({ error: `No competitors found for "${input}".` });
    }

    // Process the top 4 results, using the snippet for the description.
    const competitors = results.slice(0, 4).map((result) => ({
      name: result.title,
      description: result.snippet || 'No description available.',
    }));

    return JSON.stringify({ competitors });
  },
});