import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });


async function generativeModel(contents:string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents,
  });
  return response.text
}

export default generativeModel