const mongoose=require("mongoose");
const validator=require("validator");
const bcrypt=require("bcrypt");
const jsonwebtoken=require("jsonwebtoken");
const { request } = require("express");


const conn1Sechema=new mongoose.Schema({

 


 
    firstname:{
        type:String,
        required:true,
        trim:true,
        minLength:3, 
    },lastname:{
        type:String,
        required:true,
        trim:true,
        minLength:3,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        minLength:3,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("your email is not valid")
            }
        } ,
     unique:true,   
    },
    gender:{
    
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
     },
    confirmpassword:{
    type:String,
        required:true,
        trim:true,
},
tokens:[
    {
        token:{
            type:String,
            required:true
        }
    }
]

})
conn1Sechema.methods.generateToken=async function(request,response){
    try{
const token= jsonwebtoken.sign({_id:this._id},process.env.SECURITY_KEY);
this.tokens=this.tokens.concat({token:token});
await this.save();
return  token;


    }catch(error){
        response.status(404).send(error)
    }

}

conn1Sechema.pre("save",async function(next){

    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10)
        this.confirmpassword=await bcrypt.hash(this.confirmpassword,10)
    }
    
    next();

})

const Formdata=new mongoose.model("Formdata",conn1Sechema);
module.exports=Formdata;