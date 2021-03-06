var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
var entrepreneurSchema = new mongoose.Schema({
    username: {
      index: true,
      type: String,
      unique: true,
      required: true
    },
    password: {
      index: true,
      type: String
    },
    email: {
        index: true,
        unique: true,
        type: String,
        required: true
    },
    name: {
      type: String,
      required: true
    },
    startup: {
      type: String,
      required: true
    },
    patent: {
      type: Boolean,
      required: true
    },
    mobile: {
      type: String,
      required: true
    },
    role: {
        type: String,
        default: "owner"
    },
    profilePic: {
        type: Buffer
    },
    profilePicType: {
        type: String
    },
    blocked:{
      type: Boolean,
      default: false,
    },
    messages: {
        type: Array,
        default: []
      },
    ideas: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Idea"
            }
    ]
});
entrepreneurSchema.virtual('profilePicPath').get(function (){
    if(this.profilePic != null && this.profilePicType != null){
        return `data:${this.profilePicType};charset=utf-8;base64,${this.profilePic.toString('base64')}`
    }
})
entrepreneurSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Entrepreneur", entrepreneurSchema);
