import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });


async function generativeModel(contents:string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents,
    });
   console.log('--------------------------- GEMINI RES START --------------------------------')
    console.log(response.text)
   console.log('--------------------------- GEMINI RES END --------------------------------')
    return response.text
  } catch (error) {
    console.log('Error in generativeModel:', error);
    return null;
  }
}

export default generativeModel