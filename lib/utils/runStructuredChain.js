import { extractAndParseJson } from "./extractAndParseJson";
import { getGroqModel } from "../config/langchain";

const RETRY_INSTRUCTION = `
Your previous response could not be parsed or did not match the required schema. Return exactly one valid JSON object now. Do not use markdown fences, commentary, or any text before or after the JSON. Include every required field and satisfy all array lengths and value constraints in the schema instructions.`;

export async function runStructuredChain({ name, promptTemplate, outputSchema, input }) {
  const model = getGroqModel();
  const chain = promptTemplate.pipe(model);
  let lastError;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = attempt === 0
        ? await chain.invoke(input)
        : await model.invoke(`${await promptTemplate.format(input)}\n${RETRY_INSTRUCTION}`);
      const parsed = extractAndParseJson(response?.content ?? response);
      const validation = outputSchema.safeParse(parsed);
      if (!validation.success) throw new Error(validation.error.message);
      return validation.data;
    } catch (error) {
      lastError = error;
      console.error(`[report] ${name} attempt ${attempt + 1} failed:`, error.message);
    }
  }

  throw new Error(`${name} failed after retry: ${lastError?.message || "unknown AI response error"}`, {
    cause: lastError,
  });
}