var Entrepreneur = require("../models/entrepreneurSchema");
var Admin   = require("../models/adminSchema");
var Investor   = require("../models/investorSchema");
var middlewareObj = {};

middlewareObj.isadminLoggedIn = function(req, res, next){
  if (req.isAuthenticated()) {
    if(req.user.role !== "admin"){
      req.flash("error","You need an admin account");
      return res.redirect("/");
    }
    return next();
  }
  req.flash("error","You need to be logged in with admin account to do that");
  res.redirect("/adminlogin");
}
middlewareObj.isentrepreneurLoggedInAndNotBlocked = function(req, res, next){
  if (req.isAuthenticated()) {
    if(req.user.role !== "owner"){
      req.flash("error","You need an entrepreneur account");
      return res.redirect("/");
    }else if(req.user.blocked === true){
      req.flash("error","Your Account is blocked");
      return res.redirect("/entrepreneurblocked");
    }
    return next();
  }
  req.flash("error","You need to be logged in with entrepreneur account to do that");
  res.redirect("/entrepreneurlogin");
}
middlewareObj.isentrepreneurLoggedIn = function(req, res, next){
  if (req.isAuthenticated()) {
    if(req.user.role !== "owner"){
      req.flash("error","You need an entrepreneur account");
      return res.redirect("/");
    }
    return next();
  }
  req.flash("error","You need to be logged in with entrepreneur account to do that");
  res.redirect("/entrepreneurlogin");
}
middlewareObj.forwardAuthenticated = function(req,res,next){
  if(!req.isAuthenticated()){
    return next();
  }
  req.flash("error","You need to logout of current account to login or register a new account");
  res.redirect('/');
}

module.exports = middlewareObj