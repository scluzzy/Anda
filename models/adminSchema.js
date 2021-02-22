var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
var adminSchema = new mongoose.Schema({
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
    role: {
        type: String,
        default: "admin"
    }
});
adminSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Admin", adminSchema);
