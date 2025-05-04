import generativeModel from "@/lib/gemini"
import { aiModel } from "@/lib/opne-ai";
import { NextResponse } from "next/server";


export const  maxDuration = 60;


export async function POST(request: Request){
const body = await request.json()
const {customQuizData} = body
console.log("customQuizData", customQuizData)
 try {
    const industryTag = `${customQuizData.industry.toLowerCase()}-${customQuizData.subIndustry.toLowerCase().split(" ").join("-")}`;
    const skills = customQuizData.skills?.length ? ` with expertise in ${customQuizData.skills?.join(", ")}` : "";
    const hasTimer = customQuizData.isTimer === true;
    const timerValue = customQuizData.timerValue?.replace(/ minutes/g, "");
  
const prompt = `
# Instructions:

* Number of questions: ${customQuizData.questionCount}\n\n

Generate ${customQuizData.questionCount} challenging ${customQuizData.difficultyLevel}-level interview questions for ${customQuizData.experienceLevel} ${industryTag} professionals${skills ? ` with ${skills} expertise` : ''}.

Requirements:
- Each question must have **4 unique options** (labeled A, B, C, D), **1 correct answer**, and an **explanation** but Don't mentioned label.


- CRITICALLY IMPORTANT: 
- All 4 options MUST be approximately the same length (character count). The correct answer should 
  NOT be longer or more detailed than the other options.
- Make wrong options plausible and similarly detailed to the correct option.
- Each option should be concise but complete - aim for 10-20 words per option.
- "You must generate **exactly ${customQuizData.questionCount} questions**. No more, no less. Do NOT generate any extra questions."
- The content must be provided in **${customQuizData.language}**.
- The difficulty level must be **${customQuizData.difficultyLevel}** (one of: beginner, intermediate, advanced).
- The questions should match the experience level of a **${customQuizData.experienceLevel}** candidate (one of: fresher, mid-level, senior).
${hasTimer ? `- Include a quiz timer of ${timerValue} minutes.` : "- Do not include a timer."}

Return the data in **pure JSON format**, exactly as shown below. Do not include any additional text, comments, or markdown syntax:

{
  "industry":"${industryTag}",
  "timer": "${hasTimer}",
  "duration": "${customQuizData.timerValue}",
  "totalNumberOfQuestions":"${customQuizData.questionCount}",
  "language": "${customQuizData.language}",
  "difficultyLevel": "${customQuizData.difficultyLevel}",
  "experienceLevel": "${customQuizData.experienceLevel}",
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": "string", 
      "explanation": "string"
    }
  ]
}
`;

console.log({prompt})
    // const response = await generativeModel(prompt);
    // console.log(response);
    // let cleanedText = response?.replace(/```(?:json)?\n?/g, "").trim();
     const response = await aiModel.responses.create({
        model: "gpt-4o",
        instructions: prompt,
        input:"generate the quiz questions with options and correct answer and return in pure JSON format",
        })
      
        let cleanedText = response.output_text?.replace(/```(?:json)?\n?/g, "").trim();
      console.log("cleanedText", cleanedText)
try {
  return NextResponse.json(JSON.parse(cleanedText as string), {
    status: 200,
  })
} catch (e) {
  console.log("Initial JSON parsing failed, attempting to fix JSON format");
  try {
    cleanedText = cleanedText!.replace(/,\s*]/g, ']');
    cleanedText = cleanedText?.replace(/,\s*}/g, '}');
    return NextResponse.json(JSON.parse(cleanedText as string), {
        status: 200,
      })
  } catch (jsonError) {
    console.error("JSON parsing error:", jsonError);
    console.error("Problematic JSON string:", cleanedText);
    throw NextResponse.json({jsonError,cleanedText}, {
        status: 500,
      })
  }
}
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred while generating the quiz." }, {
      status: 500,
    });
  }
}