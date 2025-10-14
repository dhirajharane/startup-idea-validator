import axios from 'axios';

/**
 * Scrapes top Google search results using SerpAPI.
 * @param {string} query - The search query string.
 * @returns {Promise<Array<{title: string, link: string, snippet: string}>>} A promise that resolves to an array of search result objects.
 */
export const scrapeGoogleResults = async (query) => {
  const SERP_API_KEY = process.env.SERP_API_KEY;

  if (!SERP_API_KEY) {
    console.error("SerpAPI key is missing. Please set SERP_API_KEY environment variable.");
    // Return an empty array to prevent downstream errors.
    return [];
  }

  const encodedQuery = encodeURIComponent(query);
  const endpoint = `https://serpapi.com/search.json?q=${encodedQuery}&api_key=${SERP_API_KEY}`;

  try {
    const response = await axios.get(endpoint);
    const organicResults = response.data?.organic_results || [];

    // Map results to a clean format, now including the snippet.
    return organicResults.map((result) => ({
      title: result.title,
      link: result.link,
      snippet: result.snippet,
    }));
  } catch (error) {
    console.error(`Error fetching Google results for query "${query}":`, error.message);
    return [];
  }
};