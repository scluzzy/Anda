var express    = require("express");
var router     = express.Router();
// var IdeaSchema = require("../models/ideaSchema.js");
var middleware = require("../middleware/index.js");

router.get("/", function (req, res) {
    res.render('index')
})

router.get("/invest", function (req, res) {
    res.render('invest')
})
router.get("/contact", function (req, res) {
    res.render('contact_us')
})
router.get("/about", function (req, res) {
    res.render('about_us')
})

router.get("/faq", function (req, res) {
    res.render('FAQ')
})

module.exports = router;