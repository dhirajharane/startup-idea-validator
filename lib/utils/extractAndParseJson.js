function contentToText(value) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(contentToText).join("");
  if (!value || typeof value !== "object") return "";
  if (typeof value.text === "string") return value.text;
  if (typeof value.content === "string") return value.content;
  if (Array.isArray(value.content)) return contentToText(value.content);
  return "";
}

function findJsonCandidates(text) {
  const candidates = [];

  for (let start = 0; start < text.length; start += 1) {
    if (text[start] !== "{" && text[start] !== "[") continue;
    const stack = [];
    let inString = false;
    let escaped = false;

    for (let index = start; index < text.length; index += 1) {
      const character = text[index];
      if (inString) {
        if (escaped) escaped = false;
        else if (character === "\\") escaped = true;
        else if (character === '"') inString = false;
        continue;
      }
      if (character === '"') {
        inString = true;
      } else if (character === "{" || character === "[") {
        stack.push(character);
      } else if (character === "}" || character === "]") {
        const expected = character === "}" ? "{" : "[";
        if (stack.pop() !== expected) break;
        if (stack.length === 0) {
          candidates.push(text.slice(start, index + 1));
          break;
        }
      }
    }
  }

  return candidates.sort((left, right) => right.length - left.length);
}

export function extractAndParseJson(value) {
  const text = contentToText(value).trim();

  if (value && typeof value === "object" && !Array.isArray(value) && !text) return value;
  if (!text) throw new Error("AI response was empty and did not contain JSON.");

  for (const candidate of findJsonCandidates(text)) {
    try {
      return JSON.parse(candidate);
    } catch {
      // Keep searching for a valid JSON value in surrounding prose.
    }
  }

  throw new Error(`AI response contained no valid JSON: ${text.slice(0, 200)}`);
}