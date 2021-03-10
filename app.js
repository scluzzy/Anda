const express = require("express");
const app = express();
const bodyParser          = require("body-parser"),
    dotenv                = require('dotenv'),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    passportLocalMongoose = require("passport-local-mongoose"),
    flash                 = require("connect-flash"),
    LocalStrategy         = require("passport-local"),
    methodOverride        = require("method-override"),
    IdeaSchema            = require("./models/ideaSchema"),
    proIdeaSchema         = require("./models/proIdeaSchema"),
    EntrepreneurSchema    = require("./models/entrepreneurSchema"),
    InvestorSchema        = require("./models/investorSchema"),
    AdminSchema           = require("./models/adminSchema"),
    faqSchema           = require("./models/faqSchema"),
    Middleware            = require("./middleware/index");
const { check, validationResult } = require('express-validator')
//requring routes
var adminRoute  = require("./routes/adminRoute"),
    ideaRoute   = require("./routes/ideaRoute");
    entrepreneurRoute   = require("./routes/entrepreneurRoute");
    investorRoute   = require("./routes/investorRoute");
    indexRoute   = require("./routes/indexRoute");
    proIdeaRoute   = require("./routes/proIdeaRoute");
var nodemailer = require('nodemailer');

require('dotenv').config();
const port = process.env.PORT||3000;
var url = process.env.DB_URL;

// database connection
const connectDB = async () => { 
    try{
        const con = await mongoose.connect(url,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log("MongoDB connected");
    } catch(err) {
        console.log(err);
        process.exit(1);
    }
}
connectDB();

app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({ limit:'50mb',extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


// ====== Nodemailer ====== ///
// create reusable transporter object using the default SMTP transport
// const transporter = nodemailer.createTransport({
// port: 465,               // true for 465, false for other ports
// host: "smtp.gmail.com",
//    auth: {
//         user: 'youremail@gmail.com',
//         pass: 'password',
//      },
// secure: true,
// });
// const mailData = {
//     from: 'youremail@gmail.com',  // sender address
//     to: 'myfriend@gmail.com',   // list of receivers
//     subject: 'Sending Email using Node.js',
//     text: 'That was easy!',
//     html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br/>',
// };
// transporter.sendMail(mailOptions, function (err, info) {
//     if(err)
//     console.log(err)
//     else
//     console.log(info);
// });
    // ====== Session management ====== ///

app.use(require("express-session")({
  secret: process.env.SECRET_CODE,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use('adminLocal',new LocalStrategy(AdminSchema.authenticate()));
passport.use('entrepreneurLocal',new LocalStrategy(EntrepreneurSchema.authenticate()));
passport.serializeUser(function(user,done){
    done(null,user);
});
passport.deserializeUser(function(user,done){
    if(user!=null) done(null,user);
});
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

//  ===== Routes ===  //
app.use(indexRoute);
app.use(ideaRoute);
app.use(adminRoute);
app.use(investorRoute);
app.use(entrepreneurRoute);
app.use(proIdeaRoute);

app.get("/form",function(req,res) {
    res.render("ideaform2")
});
app.post("/form",function(req,res) {
    console.log(req.body.idea.features);
    res.render("ideaform2");
});
app.get("/adminpage",function(req,res) {
    res.render("adminpage")
});
//hi

app.listen(port, process.env.IP, function (req, res) {
    console.log("Server starting at " + port);
});
