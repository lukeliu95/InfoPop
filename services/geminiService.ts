import { GoogleGenAI } from "@google/genai";
import type { CompanyInfo } from "../types";

// FIX: Initialize GoogleGenAI directly with process.env.API_KEY as per guidelines.
// The check for API_KEY is removed as guidelines state to assume it's present.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generatePrompt = (companyName: string, companyAddress: string): string => {
  const addressPart = companyAddress ? ` located at "${companyAddress}"` : "";
  // FIX: Using standard markdown backticks for JSON code block.
  return `Please find the official website and corporate information for the company named "${companyName}"${addressPart}.
After finding the information, provide the following details.
Crucially, after identifying the official URL, analyze the content of the website (especially pages like "About Us", "Company Profile", etc.) to generate a detailed company introduction.
Do not use information from any other sources besides official registries and the company's official homepage.

Return your response as a single JSON object inside a markdown code block (\`\`\`json).

The JSON object must have the following structure, using the specified keys. If a value is not available, return "-" or null.
{
  "company_name": "企業名 - Official company name",
  "furigana": "フリガナ - Phonetic reading of the company name",
  "address": "住所 - Full company address",
  "corporate_number": "法人番号 - Corporate number",
  "representative_name": "代表者名 - Name of the representative",
  "industry": "業種 - Industry or business category",
  "url": "URL - The full, official URL of the company's website.",
  "founded_date": "設立 - Date of establishment",
  "capital": "資本金 - Amount of capital",
  "employee_count": "従業員数 - Number of employees",
  "phone_number": "電話番号 - Official phone number",
  "listing_status": "上場区分 - Listing status (e.g., Unlisted)",
  "stock_code": "証券コード - Stock code, if applicable",
  "invoice_registration_number": "インボイス登録番号 - Invoice registration number",
  "introduction": "企業の詳細紹介 - A detailed introduction of the company summarized from its official website."
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