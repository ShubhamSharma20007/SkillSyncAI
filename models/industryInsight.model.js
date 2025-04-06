import mongoose from 'mongoose';

const IndustrySchema = new mongoose.Schema({
    industry:String,
    salaryRanges:{
        type:Object
    },
    growthRate:{
        type:Number
    },
    demandLevel:String,
    topSkills: [String],
    marketOutlook:String,
    keyTrends:[String],
    recommendedSkills:[String],
    lastUpdate:Date,
    nextUpdate:Date
}, {
    timestamps: true,
    versionKey: false
})
export default mongoose.models.Industry || mongoose.model('Industry', IndustrySchema);
