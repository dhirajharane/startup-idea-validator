import { ChatGroq } from "@langchain/groq";

export function getGroqModel() {
  return new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: process.env.GROQ_MODEL_NAME || "llama-3.1-8b-instant",
    temperature: 0.2,
  });
}