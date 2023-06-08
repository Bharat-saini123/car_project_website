const mongoose=require("mongoose");
const totalFunc=async()=>{
    await mongoose.connect(process.env.SECRET_SERVER)



}
totalFunc().then(()=>{

    console.log("yes bro chal raha hai")
}).catch(()=>{

    console.log("tumse na ho payega")
})