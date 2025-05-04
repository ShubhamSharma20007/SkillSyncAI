import generativeModel from "@/lib/gemini"
import dbConnect from "@/lib/mongodb";
import { aiModel } from "@/lib/opne-ai";
import userModel from "@/models/user.model";
import { NextResponse } from "next/server";


export const maxDuration = 60;

export async function POST(request: Request) {
  await dbConnect();
  const body = await request.json()
  const { userId } = body;
  const user = await userModel.findOne({ clerkUserId: userId });
  if (!user) throw new Error("User not found");
  if (!user.industry) throw new Error("Industry not found");

  try {

    const prompt = `
        Generate 10 technical interview questions for a ${user.industry
      } professional${user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
      }.
        
        Each question should be multiple choice with 4 options.
        
        Return the response in this JSON format only, no additional text:
        {
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

    // const response = await generativeModel(prompt);
    // const cleanedText = response?.replace(/```(?:json)?\n?/g, "").trim(); // cleaing the /``` ```/json
    const response = await aiModel.responses.create({
      model: "gpt-4o",
      instructions: prompt,
      input: "generate the quiz questions with options and correct answer and return in pure JSON format",
    })

    let cleanedText = response.output_text?.replace(/```(?:json)?\n?/g, "").trim();
    return NextResponse.json(JSON.parse(cleanedText as string), {
      status: 200,
    })
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error generating interview questions" }, {
      status: 500,
    })
  }
}
