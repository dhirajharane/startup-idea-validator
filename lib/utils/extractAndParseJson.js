export function extractAndParseJson(text, fallback = null) {
  if (typeof text !== "string") {
    return fallback;
  }

  // Attempt to find the last occurrence of a JSON object or array
  const lastBrace = text.lastIndexOf('}');
  const lastBracket = text.lastIndexOf(']');
  
  let endIndex = Math.max(lastBrace, lastBracket);
  if (endIndex === -1) {
    return fallback;
  }

  let startIndex = -1;
  if (endIndex === lastBrace) {
    startIndex = text.lastIndexOf('{', endIndex);
  } else {
    startIndex = text.lastIndexOf('[', endIndex);
  }

  if (startIndex === -1) {
    return fallback;
  }

  const jsonString = text.substring(startIndex, endIndex + 1);

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    // If the substring isn't valid JSON, try a broader regex match as a fallback
    const jsonRegex = /({[\s\S]*}|\[[\s\S]*\])/;
    const match = text.match(jsonRegex);
    if (match) {
        try {
            return JSON.parse(match[0]);
        } catch (e) {
            return fallback;
        }
    }
    return fallback;
  }
}