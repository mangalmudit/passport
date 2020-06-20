var express = require("express"),
   mongoose = require("mongoose"),
   passport = require("passport"),
   bodyParser = require("body-parser"),
   LocalStrategy = require("passport-local"),
   passportLocalMongoose = require("passport-local-Mongoose");
   User = require("./models/user");
   port = 3000;
   app = express();


mongoose.connect("mongodb://localhost/auth_demo_app",{useUnifiedTopology: true});
app.use(require("express-session")({
  secret: "Mudit mangal",
  resave: false,
  saveUninitialized: false
}));

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//routes

app.get("/",function(req,res){
  res.render("home");
});
//isLoggedIn function check user is loginn or not
app.get("/secret",isLoggedIn,function(req,res){
  res.render("secret");
});

app.get("/register", function(req,res){
  res.render("register");
});

//handling user sign up
app.post("/register", function(req,res){
  req.body.username
  req.body.password
  User.register(new User({username: req.body.username}),req.body.password, function(err, user){
    if(err){
      console.log(err);
      res.render("register");
     }

     passport.authenticate("local")(req,res, function(){
       res.redirect("/secret");
  });
});
});


//Adding login
app.get("/login", function(req,res){
  res.render("login");
})
app.post("/login",passport.authenticate("local", {
  successRedirect: "/secret",
  failureRedirect: "/login"
}), function(req,res){

});

//Adding Logout
app.get("/logout", function(req,res){
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

app.listen(port,function(){
  console.log("The server is running");
});
