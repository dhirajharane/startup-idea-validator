import axios from 'axios';

export async function scrapeGoogleResults(query) {
  const SERP_API_KEY = process.env.SERP_API_KEY;

  if (!SERP_API_KEY) {
    console.error("SerpAPI key is missing. Please set SERP_API_KEY environment variable.");
    return [];
  }

  const encodedQuery = encodeURIComponent(query);
  const endpoint = `https://serpapi.com/search.json?q=${encodedQuery}&api_key=${SERP_API_KEY}`;

  try {
    const response = await axios.get(endpoint);
    const organicResults = response.data?.organic_results || [];

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