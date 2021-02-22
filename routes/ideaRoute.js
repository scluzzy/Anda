var express    = require("express");
var router     = express.Router();
var IdeaSchema = require("../models/ideaSchema.js");
var middleware = require("../middleware/index.js");
const entrepreneurSchema = require("../models/entrepreneurSchema.js");
const ideaSchema = require("../models/ideaSchema.js");
const { all } = require("./entrepreneurRoute.js");

const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"];

// get Route
router.get("/idea",middleware.isentrepreneurLoggedIn, async function(req,res){
  
   await entrepreneurSchema.findById(req.user._id,async function(err,alluser){
    if (err) {
      req.flash('something want wrong');
      console.log(err);
      res.redirect('/');
    } else {
      await ideaSchema.find({"owner.id":alluser._id},function (err,allidea) {
          if (err) {
            console.log(err);
          } else {
            res.render('ideas',{ideas: allidea});
          }
        })
    }
  });
});

//NEW Route
router.post('/idea',middleware.isentrepreneurLoggedIn, async ( req, res, next)=>{
  const {name,about,features,video,category,inspImg,sketchImg} = req.body.idea;
  let errors = [];

  if (!name || !about || !features || !category || !inspImg || !sketchImg) {
    errors.push({ msg: 'Please enter all required fields' });
    req.flash("error",'Please enter all required fields');
  }

  if (errors.length > 0) {
    res.render('ideaform', {
      errors,
      name,about,features,video,category,inspImg,sketchImg
    });
  } else {
    var owner = {
      id: req.user._id,
      username: req.user.username
    }
    const ideas = new IdeaSchema({
      name,category,about,features,video,owner:owner
    });
      // SETTING IMAGE AND IMAGE TYPES
    saveImage(ideas, req.body.idea.inspImg,req.body.idea.sketchImg);
    try{
      const newIdea = await ideas.save();
      entrepreneurSchema.findById(req.user._id,function(err,entrepreneur){
        if (err) {
          console.log(err);
          res.redirect("/");
        } else {
          entrepreneur.ideas.push(ideas);
          entrepreneur.save();
        }
      })
      req.flash("success",'idea is added successfully');
      res.redirect('/entrepreneur');
    }catch (err){
      req.flash("error",'Images are not valid');
      console.log(err);    
      res.redirect('/idea/add');
    }
  }
});

//Create Route
router.get("/idea/add",middleware.isentrepreneurLoggedIn, function(req,res){
  res.render("ideaform");
});

//SHOW Route
router.get("/idea/:id",middleware.isentrepreneurLoggedIn, function(req,res){
  ideaSchema.findById(req.params.id,function(err, foundidea){
    if (err || !foundidea) {
       req.flash("error","This idea does not exit");
       return res.redirect("back");
    } else {
        res.render("product1",{idea: foundidea});
    }
  });
});

//Edit
router.get("/idea/:id/edit",middleware.isentrepreneurLoggedIn, function(req,res){
    ideaSchema.findById(req.params.id,function(err,foundidea){
      if (err || !foundidea) {
        req.flash("error","This idea does not exit");
        return res.redirect("back");
      } else {
        res.render("ideaEdit",{idea_edit:foundidea});
      }
    });
});

//Update route
router.put("/idea/:id",middleware.isentrepreneurLoggedIn,function(req,res){
  const {name,about,features,video,category,inspImg,sketchImg} = req.body.idea;
  let errors = [];

  if (!name || !about || !features || !category) {
    errors.push({ msg: 'Please enter all required fields' });
    req.flash("error",'Please enter all required fields');
  }

  if (errors.length > 0) {
    res.render('ideaform', {
      errors,
      name,about,features,video,category
    });
  } else {
    ideaSchema.findById(req.params.id,function(err,updateIdea){
      if (err) {
        req.flash("error","Something want wrong");
        res.redirect("/entrepreneur");
      } else {
        updateIdea.name = req.body.idea.name;
        updateIdea.about = req.body.idea.about;
        updateIdea.features = req.body.idea.features;
        updateIdea.category = req.body.idea.category;
        updateIdea.video = req.body.idea.video;
        if(!req.body.idea.inspImg || !req.body.idea.sketchImg){
          saveupdatedImage(updateIdea, req.body.idea.inspImg,req.body.idea.sketchImg);
        }
        updateIdea.save();
        req.flash("success","Updated your account");
        res.redirect("/idea/"+req.params.id);
      }
    });
  }
});

//Destroy route
router.delete("/idea/:id", function(req,res){
  
});

// helper functions
function saveImage(idea, imgEncoded1, imgEncoded2) {
  if (imgEncoded1 == null && imgEncoded2 == null ) return;
  var img1="",img2="";
  if(imgEncoded1 != null) {
    img1 = JSON.parse(imgEncoded1 );
  }
  if(imgEncoded2 != null) {
    img2 = JSON.parse(imgEncoded2 );
  }
  if (img1 != null && imageMimeTypes.includes(img1.type)) {
    idea.inspImg = new Buffer.from(img1.data, "base64");
    idea.inspImgType = img1.type;
  }
  if (img2 != null && imageMimeTypes.includes(img2.type)) {
    idea.sketchImg = new Buffer.from(img2.data, "base64");
    idea.sketchImgType = img2.type;
  }
}
function saveupdatedImage(idea, imgEncoded1, imgEncoded2) {
  if (imgEncoded1 == null && imgEncoded2 == null ) return;
  var img1="",img2="";
  if(imgEncoded1 != null) {
    img1 = JSON.parse(imgEncoded1 );
  }
  if(imgEncoded2 != null) {
    img2 = JSON.parse(imgEncoded2 );
  }
  if (img1 != null && imageMimeTypes.includes(img1.type)) {
    idea.inspImg = new Buffer.from(img1.data, "base64");
    idea.inspImgType = img1.type;
  }
  if (img2 != null && imageMimeTypes.includes(img2.type)) {
    idea.sketchImg = new Buffer.from(img2.data, "base64");
    idea.sketchImgType = img2.type;
  }
  console.log(inspImg);
  console.log(sketchImg);
}

module.exports = router;
