require('dotenv').config()
const bodyParser = require("body-parser"),
     express = require("express"),
     mongoose = require("mongoose"),
     encrypt = require("mongoose-encryption"),
     app = express();

console.log(process.env.API_KEY);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser:true, useUnifiedTopology:true});

//User Schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
    });
//Encryption
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password'] });
//User model
const User = mongoose.model("User", userSchema);



app.get("/", (req,res) =>{
res.render("home");
});

//Log in page
app.route("/login")

    .get((req,res) =>{
    res.render("login");
    })

    .post((req,res) => {
    const userName = req.body.username,
        password = req.body.password;
        
    User.findOne({email: userName}, (err,foundUser) => {
        if(!err) {
            if(foundUser.password === password) {
                res.render("secrets");
            } else {
                console.log("Incorrect login details");
            } 
        } else {
            res.render(err);
        }
    });
});

//Register page
app.route("/register")
    //GET method route
    .get((req,res) => {
        res.render("register");
        }) 
    // POST method route    
    .post((req,res) => {
        const newUser = new User ({
            email: req.body.username,
            password: req.body.password
        });
        //save newUser
        newUser.save(err => {
            if(!err) {
                res.render("secrets");
            } else {
                console.log(err);
            }
        });
    }); 
        


app.listen(3000, () =>
    console.log("Succesfuly logged to port 3000")
);