var express    = require("express");
var router     = express.Router();
var proIdeaSchema = require("../models/proIdeaSchema.js");
var middleware = require("../middleware/index.js");
const fileMimeTypes = ["application/pdf"];

router.get("/products", function (req, res) {
    res.render('products')
});
router.get("/thankyou", function (req, res) {
    res.render('thankyou')
});
//NEW Route
router.post('/products', async ( req, res, next)=>{
    // console.log(req.body.proidea)
    const {owner_name,category,age,description,ideaName,problem,tagline,copyright,stage,patent,working_prototype,sold,inventor,price,problem_solving,difference} = req.body.proidea;
    const proideas = new proIdeaSchema({
      owner_name,category,age,description,ideaName,problem,tagline,copyright,stage,patent,proto:working_prototype,sold,inventor,price,problemSolution:problem_solving,difference
    });
      // SETTING IMAGE AND IMAGE TYPES
    savefile(proideas, req.body.proidea.file);
    try{
      const newproIdea = await proideas.save();
      req.flash("success",'Product is added successfully');
      res.redirect('/thankyou');
    }catch (err){
      req.flash("error",'Images are not valid');
      console.log(err);    
      res.redirect('/products/add');
    }
});
router.get("/products/add", function (req, res) {
    res.render('proIdeaForm')
});
router.get("/product1", function (req, res) {
    res.render('product1')
});

function savefile(proIdea, fileEncoded1) {
  if (fileEncoded1.length === 0) return;
  var file1="";
  if(fileEncoded1.length !== 0) {
    file1 = JSON.parse(fileEncoded1 );
  }
  if (file1.length !== 0 && fileMimeTypes.includes(file1.type)) {
    proIdea.file = new Buffer.from(file1.data, "base64");
    proIdea.fileType = file1.type;
  }
}

module.exports = router;