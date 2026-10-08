import { ChatGroq } from "@langchain/groq";

const DEFAULT_GROQ_MODEL = "openai/gpt-oss-20b";

export function getGroqModel() {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL?.trim() || DEFAULT_GROQ_MODEL;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  return new ChatGroq({
    apiKey,
    model,
    temperature: 0.2,
  });
}