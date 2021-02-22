var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
var investorSchema = new mongoose.Schema({
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
    mobile: {
      type: String,
      required: true
    },
    role: {
        type: String,
        default: "investor"
    },
    fundedIdeas: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Idea"
        }
    ]
});
investorSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Investor", investorSchema);
