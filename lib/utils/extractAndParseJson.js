export function extractAndParseJson(value) {
  if (value && typeof value === "object" && typeof value.text === "string") {
    value = value.text;
  }

  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value;
  }

  const text = Array.isArray(value)
    ? value.map((part) => typeof part === "string" ? part : part?.text || "").join("")
    : value;

  if (typeof text !== "string") {
    throw new Error("AI response did not contain JSON text.");
  }

  const jsonStart = text.search(/[\[{]/);
  if (jsonStart === -1) {
    throw new Error(`AI response contained no JSON: ${text.slice(0, 200)}`);
  }

  for (let end = text.length; end > jsonStart; end -= 1) {
    const candidate = text.slice(jsonStart, end).trim();
    if (!candidate.endsWith("}") && !candidate.endsWith("]")) {
      continue;
    }

    try {
      return JSON.parse(candidate);
    } catch {
      // The model may have appended prose; shorten the candidate and retry.
    }
  }

  throw new Error(`AI response contained invalid JSON: ${text.slice(0, 200)}`);
}