"use server"
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongodb";
import userModel from "@/models/user.model";
import aiChatModel from "@/models/ai-chat-model";
import mongoose from "mongoose";
export const getAIChats = async () => {
    try {
        await dbConnect()
        const { userId } = await auth();
        if (!userId) throw new Error("id not found");
        await dbConnect();
        const user = await userModel.findOne({ clerkUserId: userId });
        if (!user) throw new Error("User not found");
        return JSON.parse(JSON.stringify(await aiChatModel.findOne({ userId: new mongoose.Types.ObjectId(user._id)}).lean()));
    } catch (error:any) {
        console.log('Error finding user:', error.message || error);
        return;
    }
}