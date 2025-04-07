"use server"

import { QuestionInterface } from "@/interface/questionInterface";
import generativeModel from "@/lib/gemini";
import dbConnect from "@/lib/mongodb";
import userModel from "@/models/user.model";
import { auth } from "@clerk/nextjs/server";
import assesmentModel from "@/models/assessment.model";
export  async function generateQuiz(){
    const { userId } = await auth();  
    if (!userId) throw new Error("id not found");
    await dbConnect();
    const user = await userModel.findOne({ clerkUserId: userId });
    if (!user) throw new Error("User not found");
    if(!user.industry) throw new Error("Industry not found");

try {
        
  const prompt = `
  Generate 10 technical interview questions for a ${
    user.industry
  } professional${
  user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
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

const response = await generativeModel(prompt);
const cleanedText = response?.replace(/```(?:json)?\n?/g, "").trim(); // cleaing the /``` ```/json
return JSON.parse(cleanedText as string)?.questions;
} catch (error) {
  console.log(error);
  throw new Error("Error generating quiz");
}
}

export default async function saveQuizResult(questions:QuestionInterface[],answers:string,score:number) {
  const { userId } = await auth();  
    if (!userId) throw new Error("id not found");
    await dbConnect();
    const user = await userModel.findOne({ clerkUserId: userId });
    if (!user) throw new Error("User not found");

    const questionsResult = questions.map((question, index) => ({
      question: question.question,
      answer: question.correctAnswer ||  '',
      questionExplanation: question.explanation || "",
      userAnswer: answers[index],
      isCorrect: answers[index] === question.correctAnswer,
    
    }));
    
   
   
    let improvementTip ="";
    const wrongAnswers = questionsResult.filter((question)=>!question.isCorrect)
    if(wrongAnswers.length > 0){
      const wrongQuestionsText =wrongAnswers.map((q)=>`Question: ${q.question}\n Correct Answer: ${q.answer}\n User Answer: ${q.userAnswer}}`).join("\n\n")

      const improvementPrompt = `
      The user got the following ${user.industry} technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;


    try {
        const improvement = await generativeModel(improvementPrompt);
        if (improvement) {
            improvementTip = improvement.trim();
        }
    } catch (error) {
        console.error("Error generating improvement tip:", error);
        
    }
}

    try {
     const storeQuesiton  = await assesmentModel.create({
    quizScore:score,
    questions:questionsResult,
    category:'Technical',
    improvementTip,
    userId:user._id
     })

     return JSON.parse(JSON.stringify(storeQuesiton))
        
    } catch (error) {
        console.error("Error generating improvement tip:", error);
        return;
        
    }
}



export  async function getAssesments(){
  const { userId } = await auth();  
    if (!userId) throw new Error("id not found");
    await dbConnect();
    const user = await userModel.findOne({ clerkUserId: userId });
    if (!user) throw new Error("User not found");
    try {
      const findAssesments = await assesmentModel.find({ userId: user._id }).lean();
      return JSON.parse(JSON.stringify(findAssesments));
    } catch (error) {
      console.error("Error generating improvement tip:", error);
      return;
    }

}