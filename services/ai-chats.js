
import userModel from "../models/user.model.js";
import aiChatModel from "../models/ai-chat-model.js"
import dbConnect from "../lib/mongodb.js";
import mongoose from "mongoose";

export const storeChats = async ({ role, content, userId }) => {
  console.log(userId)
    await dbConnect()
    let user;
    try {
      if (!userId) throw new Error("id not found");
      user = await userModel.findById(new mongoose.Types.ObjectId(userId));
      if (!user) throw new Error("User not found");
    } catch (error) {
      console.log('Error finding user:', error.message || error);
      return;
    }
  
    const payload = { role, content };
  
    try {
      const chats = await aiChatModel.findOneAndUpdate(
        { userId: user._id },
        { $push: { chats: payload } },
        { new: true, upsert: true }
      );
      return JSON.parse(JSON.stringify(chats));
    } catch (error) {
      throw new Error(error.message || error);
    }
  };
