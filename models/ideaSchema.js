var mongoose = require("mongoose");
var ideaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    features: {
        type: String,
        required: true
    },
    visitCount: {
        type: Number,
        default: 0
    },
    likeCount: {
        type: Number,
        default: 0
    },
    video: {
        type: String,
        default: ""
    },
    date: {
        type: Date,
        default: Date.now
    },
    inspImg: {
        type: Buffer,
        required: true
    },
    inspImgType: {
        type: String,
        required: true
    },
    sketchImg: {
        type: Buffer,
        required: true
    },
    sketchImgType: {
        type: String,
        required: true
    },
    owner: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Entrepreneur"
        },
        ownername: String
    },
    investors: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Investor"
        }
    ]
});

ideaSchema.virtual('inspImagePath').get(function (){
    if(this.inspImg != null && this.inspImgType != null){
        return `data:${this.inspImgType};charset=utf-8;base64,${this.inspImg.toString('base64')}`
    }
})
ideaSchema.virtual('sketchImagePath').get(function (){
    if(this.sketchImg != null && this.sketchImgType != null){
        return `data:${this.sketchImgType};charset=utf-8;base64,${this.sketchImg.toString('base64')}`
    }
})
ideaSchema.virtual('renderImagePath').get(function (){
    if(this.renderImg != null && this.renderImgType != null){
        return `data:${this.renderImgType};charset=utf-8;base64,${this.renderImg.toString('base64')}`
    }
})
module.exports = mongoose.model("Idea", ideaSchema);
