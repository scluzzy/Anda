var mongoose = require("mongoose");
var proIdeaSchema = new mongoose.Schema({
    owner_name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    ideaName: {
        type: String,
        required: true
    },
    tagline: {
        type: String,
        required: true
    },
    copyright: {
        type: Boolean,
        required: true
    },
    problem: {
        type: String,
        required: true
    },
    patent: {
        type: Boolean,
        required: true
    },
    proto: {
        type: Boolean,
        required: true
    },
    sold: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    stage: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    visitCount: { 
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: true
    },
    problemSolution: {
        type: String,
        required: true
    },
    file: {
        type: Buffer,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    difference: {
        type: String,
        required: true
    },
    inventor: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    rejected: {
        type: Boolean,
        default: false
    },
    deleted: {
        type: Boolean,
        default: false
    },
    investors: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Investor"
        }
    ]
});
proIdeaSchema.virtual('filePath').get(function (){
    if(this.file != null && this.fileType != null){
        return `data:${this.fileType};charset=utf-8;base64,${this.file.toString('base64')}`
    }
})

module.exports = mongoose.model("ProIdea", proIdeaSchema);
