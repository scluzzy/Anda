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
const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"];

router.get("/entrepreneur",middleware.isentrepreneurLoggedIn, async function (req, res) {
   await User.findById(req.user._id,async function(err,alluser){
    if (err) {
      req.flash('something want wrong');
      console.log(err);
      res.redirect('/');
    } else {
      await Ideas.find({"owner.id":alluser._id,deleted:false},function (err,allidea) {
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
router.post("/entrepreneurregister",[check('entrepreneur[username]', 'Username must me 5+ characters long').exists().isLength({ min: 5 }),check('entrepreneur[email]', 'Email is not valid').isEmail().normalizeEmail(), middleware.forwardAuthenticated],async function(req,res,next){
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      // return res.status(422).jsonp(errors.array())
      const alert = errors.array()
      return res.render('entrepreneurRegister', {
          alert
      })
    }
    var getUser = req.body.entrepreneur;
    await User.findOne({email:getUser.email},function(err,existemail){
        if(existemail){
          req.flash("error",'User with this email already exist');
          console.log(err);
          return res.redirect('/entrepreneurRegister');
        }
    });
    var newUser = new User({username: getUser.username,name:getUser.name,startup: getUser.startup,patent: getUser.patent,email: getUser.email,mobile: getUser.mobile});
    User.register(newUser,req.body.entrepreneur.password,function(err,user){
      if (err) {
          console.log(err);
          req.flash("error",err.message);
          return res.redirect("/entrepreneurRegister");
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
router.get("/entrepreneur/changepassword",middleware.isentrepreneurLoggedIn,function(req,res) {
    res.render("changepwd");
});
router.post("/entrepreneur/changepassword",middleware.isentrepreneurLoggedIn,function(req,res) {
    User.findOne({ _id: req.user._id },(err, user) => {
      // Check if error connecting
      if (err) {
        req.flash("error",err.message);
        res.redirect("/entrepreneur");
      } else {
        // Check if user was found in database
        if (!user) {
          req.flash("error","User not found");
          res.redirect("/entrepreneur");
        } else {
          user.changePassword(req.body.oldpassword, req.body.newpassword, function(err) {
            if(err) {
                      if(err.name === 'IncorrectPasswordError'){
                          req.flash("error","Incorrect password");
                          res.redirect("/entrepreneur/changepassword");
                      }else {
                          req.flash("error","Something went wrong!! Please try again");
                          res.redirect("/entrepreneur/changepassword");
                      }
            } else {
              req.flash("success","Your password has been changed successfully");
              res.redirect("/entrepreneur");
            }
          })
        }
      }
});
});

//Update
router.put("/entrepreneur/:id",middleware.isentrepreneurLoggedIn,async function(req,res){
  await User.findById(req.params.id,async function(err,updateEntrepreneur){
      if (err) {
        req.flash("error","Something want wrong");
        res.redirect("/entrepreneur");
      } else {
          if(updateEntrepreneur.username !== req.body.entrepreneur.username){
            await User.findOne({username:req.body.entrepreneur.username},function(err,existuser){
                if(existuser){
                  req.flash("error",'User with this username already exist');
                  // console.log(err);
                  return res.redirect('/entrepreneur');
              }
            });
          }
          if(updateEntrepreneur.email !== req.body.entrepreneur.email){
            await User.findOne({email:req.body.entrepreneur.email},function(err,existemail){
                if(existemail){
                  req.flash("error",'User with this email already exist');
                  // console.log(err);
                  return res.redirect('/entrepreneur');
              }
            });
          }
          updateEntrepreneur.username = req.body.entrepreneur.username;
          updateEntrepreneur.email = req.body.entrepreneur.email;
          updateEntrepreneur.name = req.body.entrepreneur.name;
          updateEntrepreneur.patent = req.body.entrepreneur.patent;
          updateEntrepreneur.mobile = req.body.entrepreneur.mobile;
          updateEntrepreneur.startup = req.body.entrepreneur.startup;
        
        if(req.body.entrepreneur.profilePic)
          saveImage(updateEntrepreneur, req.body.entrepreneur.profilePic);
        updateEntrepreneur.save();
        req.flash("success","Updated your account");
        res.redirect("/entrepreneur");
      }
    });
});
router.put('/entrepreneur/:id/message',middleware.isentrepreneurLoggedIn,async function(req,res){
  await User.findById(req.params.id,async function(err,updateEntrepreneur){
      if (err) {
        req.flash("error","Something went wrong");
        res.redirect("/entrepreneur");
      } else {
        var index = req.body.messageIndex;
        updateEntrepreneur.messages.splice(index,1);
        updateEntrepreneur.save();
        await Ideas.find({"owner.id":updateEntrepreneur._id,deleted:false},function (err,allidea) {
          if (err) {
              req.flash('something went wrong');
              console.log(err);
              res.redirect('/');
          } else {
              req.flash("success","message was deleted");
              res.render('startupdashboard',{ideas: allidea,user: updateEntrepreneur});
          }
        })
      }
  });
});

// helper functions
function saveImage(entrepreneur, imgEncoded1) {
  console.log(imgEncoded1);
  console.log(typeof imgEncoded1);
  if (imgEncoded1 == null) return;
  var img1="";
  if(imgEncoded1 != null) {
    img1 = JSON.parse(imgEncoded1 );
  }
  if (img1 != null && imageMimeTypes.includes(img1.type)) {
    entrepreneur.profilePic = new Buffer.from(img1.data, "base64");
    entrepreneur.profilePicType = img1.type;
  }
}

module.exports = router;