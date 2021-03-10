var express    = require("express");
var router     = express.Router();
// var IdeaSchema = require("../models/ideaSchema.js");
var FAQ = require("../models/faqSchema.js");
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

router.get("/faq",async function (req, res) {
    const faq = await FAQ.find();
    res.render('FAQ',{faq});
});
router.post("/faq/add",middleware.isadminLoggedIn,async function (req, res) {
    FAQ.create(req.body.faq,function(err, newfaq){
    if (err) {
        console.log(err);
        req.flash("error",'somethong went wrong');
        res.redirect('/admin');
    } else{
        req.flash("success",'FAQ is added');
        res.redirect('/admin');
    }
  });
});

module.exports = router;