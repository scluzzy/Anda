var express    = require("express");
var router     = express.Router();
var proIdeaSchema = require("../models/proIdeaSchema.js");
var middleware = require("../middleware/index.js");

router.get("/products", function (req, res) {
    res.render('products')
})
router.get("/product1", function (req, res) {
    res.render('product1')
})

module.exports = router;