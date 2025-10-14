import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function extractAndParseJson(text, fallback = null) {
  if (!text || typeof text !== "string") return fallback;

  // Remove code block markers and trim
  const cleaned = text.replace(/```json|```/gi, '').trim();

  // Match all JSON objects or arrays in the string
  const jsonRegex = /({[\s\S]*?})|(\[[\s\S]*?\])/g;
  let match;
  let lastValid = fallback;

  while ((match = jsonRegex.exec(cleaned)) !== null) {
    try {
      lastValid = JSON.parse(match[0]);
    } catch (err) {
      continue; // ignore invalid JSON blocks
    }
  }

  return lastValid;
}

