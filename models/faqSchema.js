var mongoose = require("mongoose");
var faqSchema = new mongoose.Schema({
    question: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    }
});
module.exports = mongoose.model("FAQ", faqSchema);
