import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    clerkUserId: String,
    email: String,
    name: String,
    imageUrl: String,
    industry: String,
    bio: String,
    experience: String,
    skills:[String]
}, {
    timestamps: true,
    versionKey: false
})
UserSchema.index({ clerkUserId: 1 }, { unique: true }); // Ensure clerkUserId is unique
//index for searching by email
export default mongoose.models.User || mongoose.model('User', UserSchema);
