const express = require("express");
const auth=require("./middleware/auth.js")
const dotenv=require("dotenv")
dotenv.config({path:"../.env"})
const path = require("path");
require("./db/connection1.js");
const bcrypt=require("bcrypt")
const Formdata = require("./models/carform.js");
const port = process.env.PORT || 8000;
const hbs = require("hbs");
const cookieParser=require("cookie-parser")
const app = express();
// console.log(process.env.SECURITY_KEY)
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname, "./partials"));

app.get("/", (request, response) => {
  response.render("index.hbs");
});
app.use(express.static(path.join(__dirname, "../public")));
app.get("/", (request, response) => {
  response.send("yes ha ha bhai chal raha hai");
});
app.get("/home",auth, (request, response) => {
  response.render("home.hbs");
});
app.get("/login",(request, response) => {
  response.render("login.hbs")
});
app.get("/logout", auth,async(request, response) => {
  response.clearCookie("logincookie");
    await request.user.save()
  response.render("login.hbs")
});
app.get("/register", (request, response) => {
  response.render("register.hbs");
});

// app.post("/home",async(request,response)=>{

//   try{

//         const user=new Formdata({
//           username:request.body.username,
//           email:request.body.email,
//           phone:request.body.phone,
//           message:request.body.message
//         })

//         const saveData=await user.save();
//         console.log(saveData)
//         response.render("home.hbs")

//   }catch(error){
//     response.status(404).send(error)
//   }

//     })

app.post("/register", async (request, response) => {


  const password = request.body.password;
  const confirmpassword = request.body.confirmpassword;
  if (password === confirmpassword) {

 
    const user = new Formdata({
      firstname: request.body.firstname,
      lastname: request.body.lastname,
      email: request.body.email,
    gender:request.body.gender,
      password: request.body.password,
      confirmpassword: request.body.confirmpassword,
    });

    const token=await user.generateToken();
  
response.cookie("registercookie",token,{
  expires:new Date(Date.now()+300000),
  httpOnly:true
})

    const saveData = await user.save();
    // console.log(saveData);
    response.render("login.hbs");
  }
  else{
    response.send("your password not match confirm password")
  }
});

app.post("/login",async(request,response)=>{
  try{

const email=request.body.email;
const password=request.body.password
const emailAllData=await Formdata.findOne({email:email})

const checkPassword=bcrypt.compare(password,emailAllData.password)
const token=await emailAllData.generateToken();
response.cookie("logincookie",token,{
  expires:new Date(Date.now()+300000),
  httpOnly:true
})
// console.log(token);
if(checkPassword){
  response.render("index.hbs")
}else{
  response.send("invalid please try again")
}


  }catch(error){
    response.status(404).send("invalid user")
  }


})

app.get("*", (request, response) => {
  response.render("error.hbs");
});

app.listen(port, "127.0.0.1", () => {
  console.log(`port started at the port of ${port}`);
});
