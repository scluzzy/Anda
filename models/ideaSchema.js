var mongoose = require("mongoose");
var ideaSchema = new mongoose.Schema({
    uniqueid: {
        type: String,
        default: ("ID" + (new Date().toISOString()).slice(0,10).split("-").join("") + (new Date().toISOString()).slice(10,19).split(":").join("") + makeid(5))
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subcategory: {
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
    status:{
        type: String,
        default: "Pending"
    },
    reject_count:{
        type: Number,
        default: 0
    },
    deleted:{
        type: Boolean,
        default: "false"
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
ideaSchema.virtual('getinspImgPath').get(function (){
    if(this.inspImg != null && this.inspImgType != null){
        return `data:${this.inspImgType};base64,${this.inspImg.toString('base64')}`
    }
})
ideaSchema.virtual('getsketchImgPath').get(function (){
    if(this.sketchImg != null && this.sketchImgType != null){
        return `data:${this.sketchImgType};base64,${this.sketchImg.toString('base64')}`
    }
});

function makeid(length) { 
    var result = ''; 
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; 
    var charactersLength = characters.length; 
    for ( var i = 0; i < length; i++ ) { 
        result += characters.charAt(Math.floor(Math.random() * charactersLength)); 
    } 
    return result; 
}

module.exports = mongoose.model("Idea", ideaSchema);
