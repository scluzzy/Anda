var express    = require("express");
var router     = express.Router();
var User = require("../models/entrepreneurSchema.js");
var Ideas = require("../models/ideaSchema.js");
var middleware = require("../middleware/index.js");
var mongoose              = require("mongoose"),
    passport              = require("passport"),
    passportLocalMongoose = require("passport-local-mongoose"),
    LocalStrategy         = require("passport-local");
const { check, validationResult } = require('express-validator');

router.get("/entrepreneur",middleware.isentrepreneurLoggedIn, async function (req, res) {
   await User.findById(req.user._id,async function(err,alluser){
    if (err) {
      req.flash('something want wrong');
      console.log(err);
      res.redirect('/');
    } else {
      await Ideas.find({"owner.id":alluser._id},function (err,allidea) {
          if (err) {
            req.flash('something want wrong');
            console.log(err);
            res.redirect('/');
          } else {
            res.render('startupdashboard',{ideas: allidea,user: alluser});
          }
        })
    }
  });
})
router.get("/entrepreneurregister",middleware.forwardAuthenticated,function(req, res){
  res.render("entrepreneurRegister");
});
router.post("/entrepreneurregister",[check('entrepreneur[username]', 'Username must me 5+ characters long').exists().isLength({ min: 5 }),check('entrepreneur[email]', 'Email is not valid').isEmail().normalizeEmail(), middleware.forwardAuthenticated],function(req,res,next){
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
      // return res.status(422).jsonp(errors.array())
      const alert = errors.array()
      return res.render('entrepreneurRegister', {
          alert
      })
  }
  var getUser = req.body.entrepreneur;
  var newUser = new User({username: getUser.username,name:getUser.name,startup: getUser.startup,companyName: getUser.company,partnerName: getUser.partner,email: getUser.email,mobile: getUser.mobile});
  User.register(newUser,req.body.entrepreneur.password,function(err,user){
    if (err) {
        console.log(err);
        req.flash("error",err.message);
        return res.render("entrepreneurRegister");
    }
    passport.authenticate("entrepreneurLocal", function(err, newuser, info) {
      if (err) return next(err); 
    if (!user) return res.redirect('/entrepreneurlogin'); 

    req.logIn(user, function(err) {
        if (err)  return next(err); 
        return res.redirect("entrepreneur");
    });
})(req, res, next);
  });
});
router.get("/entrepreneurlogin",middleware.forwardAuthenticated,function(req,res){
  res.render("entrepreneurLogin");
});
router.post("/entrepreneurlogin",[middleware.forwardAuthenticated,passport.authenticate("entrepreneurLocal", {
  successRedirect: "/entrepreneur",
  failureredirect: "/entrepreneurlogin"
 })],function(req,res){
});
router.get("/entrepreneurlogout",middleware.isentrepreneurLoggedIn,function(req,res){
  req.logout();
  req.flash("success","Logged you out!");
  res.redirect("/");
});
//Update
router.put("/entrepreneur/:id",middleware.isentrepreneurLoggedIn, function(req,res){
  User.findByIdAndUpdate(req.params.id,req.body.entrepreneur,function(err,updatedEntrepreneur){
    if (err) {
      req.flash("error","Something want wrong");
      res.redirect("/entrepreneur");
    } else {
      req.flash("success","Updated your account");
      res.redirect("/entrepreneur");
    }
  });
});

module.exports = router;