var express = require("express");
var router = express.Router();
var User = require("../models/adminSchema.js");
var IdeaSchema = require("../models/ideaSchema.js");
var proIdeaSchema = require("../models/proIdeaSchema.js");
var entrepreneurSchema = require("../models/entrepreneurSchema.js");
var middleware = require("../middleware/index.js");
var mongoose              = require("mongoose"),
    passport              = require("passport"),
    passportLocalMongoose = require("passport-local-mongoose"),
    LocalStrategy         = require("passport-local");
const { check, validationResult } = require('express-validator');

router.get("/admin", middleware.isadminLoggedIn, async (req, res, next) => {
  try{
    const ideas  = await IdeaSchema.find();
    const proideas  = await proIdeaSchema.find();
    const entrepreneurs  = await entrepreneurSchema.find();
    res.render("admin", {
      ideas,user: req.user,proideas,entrepreneurs
    });
  }catch (err){
    console.log("err: "+ err); 
  }
});
router.get("/adminregister",middleware.forwardAuthenticated,function(req, res){
  res.render("adminRegister");
});
router.post("/adminregister",[check('username', 'Username must me 5+ characters long').exists().isLength({ min: 5 }), middleware.forwardAuthenticated],function(req,res,next){
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
      // return res.status(422).jsonp(errors.array())
      const alert = errors.array()
      return res.render('adminRegister', {
          alert
      })
  }
  var newUser = new User({username: req.body.username});
  User.register(newUser,req.body.psw,function(err,user){
    if (err) {
      req.flash("error",err.message);
      return res.render("adminRegister");
    }
    passport.authenticate("adminLocal", function(err, newuser, info) {
    if (err) return next(err); 
    if (!user) return res.redirect('/adminlogin'); 

    req.logIn(user, function(err) {
        if (err)  return next(err); 
        return res.redirect("admin");
    });
})(req, res, next);
  });
});
router.get("/adminlogin",middleware.forwardAuthenticated,function(req,res){
  res.render("adminLogin");
});
router.post("/adminlogin",[middleware.forwardAuthenticated,passport.authenticate("adminLocal", {
  successRedirect: "/admin",
  failureredirect: "/adminlogin"
 })],function(req,res){
});
router.get("/adminlogout", middleware.isadminLoggedIn,function(req,res){
  req.logout();
  req.flash("success","Logged you out!");
  res.redirect("/");
});

router.put('/admin/e/:id/block',middleware.isadminLoggedIn,async function(req,res){
  await entrepreneurSchema.findById(req.params.id,async function(err,updateEntrepreneur){
      if (err) {
        req.flash("error","Something went wrong");
        res.redirect("/admin");
      } else {
        updateEntrepreneur.blocked = true;
        await updateEntrepreneur.save().then((log) => {
            return Promise.resolve('Log was Created');
        })
        .catch((e) => {
            return Promise.reject('Error' + e);
        });
        req.flash("success","User is blocked");
        res.redirect('/admin');
      }
  });
});

module.exports = router;
