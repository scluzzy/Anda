var express    = require("express");
var router     = express.Router();
var investorSchema = require("../models/investorSchema.js");
var middleware = require("../middleware/index.js");

router.get("/investor", function (req, res) {
    res.render('investordashboard')
})

module.exports = router;