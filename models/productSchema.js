var mongoose = require("mongoose");
var productSchema = new mongoose.Schema({
    name: String,
    age: Number,
    ideaName: String,
    tagline: String,
    copyright: Boolean,
    problem: String,
    patent: Boolean,
    prot: Boolean,
    sold: Number,
    category: String,
    stage: String,
    about: String,
    visitCount: Number,
    price: Number,
    problemSolution: String,
    file: mongoose.Schema.Types.Mixed,
    difference: String,
    investorsName: String,
    date: {
        type: Date,
        default: Date.now
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
module.exports = mongoose.model("Products", productSchema);
