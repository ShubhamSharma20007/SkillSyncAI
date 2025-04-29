import dotenv from 'dotenv';
dotenv.config();
import OpenAI from "openai"
export const aiModel = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPEN_API,
});

