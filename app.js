require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
//level 3 encryption///hashing///
const md5=require("md5");
//const encrypt = require('mongoose-encryption');//level 2

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://0.0.0.0:27017/userDB", { useNewUrlParser: true });

///this is documentation for mongoose encryption//////////https://www.npmjs.com/package/mongoose-encryption?activeTab=readme// for level1 encryption/////////////////
////https://www.npmjs.com/package/dotenv///////level 2 encryption///////
/////https://www.npmjs.com/package/md5////level 3//////
const userSchema=new mongoose.Schema( {
  email:String,
  password:String
});
//level 2 plugins
//userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});


const User= new mongoose.model("User",userSchema);


//TODO
app.get("/",function(req,res){
  res.render("home");
});
app.get("/login",function(req,res){
  res.render("login");
});
app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const newUser= new User({
    email:req.body.username,
    password:md5(req.body.password)
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  });
});

app.post("/login",function(req,res){
  const username=req.body.username;
  const password=md5(req.body.password);
  User.findOne({email:username},function(err,foundUser){
      if(err){
        console.log(err);
      }else{
        if(foundUser){
          if(foundUser.password===password){
          res.render("secrets");
          }
        }
      }
  });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
