require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/usersDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const key = process.env.SECRET;
userSchema.plugin(encrypt,{secret: key, encryptedFields :["password"]});

const User = mongoose.model("User", userSchema);

app.get("/", function(req,res){
    res.render("home");
});

app.get("/login", function(req,res){
    res.render("login");
});

app.get("/register", function(req,res){
    res.render("register");
});

app.post("/register", function(req,res){
    const userEmail = req.body.username;
    const userpassword = req.body.password;
    const newUser = new User({
        email: userEmail,
        password: userpassword
    });
    newUser.save(function(err){
        if(err){
            console.log(err);
            
        }else{
            res.render("secrets");
        }
    });
});

app.post("/login", function(req,res){
    const userEmail = req.body.username;
    const userpassword = req.body.password;
    User.findOne({email: userEmail},function(err, foundUser){
        if(err){
            console.log(err);
            
        }else{
            if (foundUser){
                if (foundUser.password===userpassword){
                    res.render("secrets");
                }
            }
        }
    });
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to Database");
});