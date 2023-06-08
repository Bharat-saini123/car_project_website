const jsonwebtoken=require("jsonwebtoken");
 const Formdata=require("../models/carform.js")

const auth=async function(request,response,next){

    try{
const token=request.cookies.logincookie;
const checkToken=jsonwebtoken.verify(token,process.env.SECURITY_KEY)
console.log(checkToken)
const user=await Formdata.findOne({_id:checkToken._id})
console.log(user)

request.token=token;
request.user=user;
next()
    }catch(error){
        response.status(404).send("phale register karo")
    }


}
module.exports=auth;