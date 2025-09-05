import { GoogleGenAI } from "@google/genai";
import type { CompanyInfo } from "../types";

// FIX: Initialize GoogleGenAI directly with process.env.API_KEY as per guidelines.
// The check for API_KEY is removed as guidelines state to assume it's present.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generatePrompt = (companyName: string, companyAddress: string): string => {
  const addressPart = companyAddress ? ` located at "${companyAddress}"` : "";
  // FIX: Using standard markdown backticks for JSON code block.
  return `Please find the official website for the company named "${companyName}"${addressPart}.
After finding the website, analyze its homepage content and provide the following information.
Do not use information from any other sources besides the company's official homepage.

Return your response as a single JSON object inside a markdown code block (\`\`\`json).

The JSON object must have the following structure:
{
  "company_url": "The full, official URL of the company's website.",
  "summary": "A brief, concise summary of the company (2-3 sentences max).",
  "overview": "A more detailed overview of the company, including its mission, products, or services as described on the homepage."
}
`;
};

export const fetchCompanyInfo = async (companyName: string, companyAddress: string): Promise<CompanyInfo> => {
  const prompt = generatePrompt(companyName, companyAddress);

  try {
    // FIX: Moved `tools` into a `config` object and simplified `contents` to a string.
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    let jsonString = response.text;
    if (!jsonString) {
      throw new Error("API returned an empty response. The company might not be found or the website is not accessible.");
    }

    // Extract JSON from markdown code block if present
    // FIX: Using standard markdown backticks for JSON code block.
    const match = jsonString.match(/```json\n([\s\S]*?)\n```/);
    if (match && match[1]) {
      jsonString = match[1];
    } else {
        // Fallback for cases where it might just return raw JSON
        jsonString = jsonString.trim();
    }

    const parsedJson = JSON.parse(jsonString);
    return parsedJson as CompanyInfo;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    if (error instanceof Error) {
       if (error.message.includes('API key not valid')) {
         throw new Error("Invalid API Key. Please check your configuration.");
       }
       if (error instanceof SyntaxError) {
         throw new Error("Failed to parse the response from the AI model. It may have returned an invalid format.");
       }
    }
    throw new Error("Failed to fetch company information from the AI model.");
  }
};
