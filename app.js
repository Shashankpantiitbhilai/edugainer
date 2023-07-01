//jshint esversion:6
require("dotenv").config();//put at top
const express=require("express");
const  ejs=require("ejs");
const  bodyParser=require("body-parser");
const app=express();
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption")
;
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

console.log(process.env.API_KEY);

mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected successfully to the MongoDB server')});
//creating a schema for our collection
 
const userSchema=new mongoose.Schema({
  email:String,
  password:String
})


userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields: ["password"]});//for encryption

const User=mongoose.model("user",userSchema);


app.get("/",function(req,res)
{
    res.render("home");
})
app.get("/login",function(req,res)
{
    res.render("login");
})
app.get("/register",function(req,res)
{
    res.render("register");
})
app.post("/register",function(req,res)
{
   const newUser=new User({
    email:req.body.username,
    password:req.body.password
   })
  
   newUser.save()
  .then((result) => {
       
          
        res.render("secrets");
      }
      )})
app.post("/login",function(req,res)
      { const username=req.body.username
        const password=req.body.password
          User.findOne({email:username})
          .then((foundUser) => {
            if(foundUser.password===password)// here if we log founduser.;password then we will get a normal decrypted version of password because mongoose decrypts it here to check the password 
            {
              res.render("secrets");
            }
       
          
          }
          )
      })
   
   
   
  


app.listen(3000,function()
{
    console.log("server is running on port 3000");
})