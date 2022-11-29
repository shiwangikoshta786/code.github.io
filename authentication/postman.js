const express = require("express");
const app = express()

var mongoose = require("mongoose");

app.use(express.json())

mongoose.connect("mongodb://localhost:27017/Cyntra",{useNewUrlParser: true, useUnifiedTopology:true})
.then(()=>(console.log("connected successfully😊")))
.catch((err)=>(err  + "something err in mongodb connection"))

const port = 3000;


const cyntraSchema = new mongoose.Schema({
    
    emploc : {
      type: Number,
      required:true

    },

    empno :{
        type: Number,
        reuired:true
    },
    empnm :{
        type: String,
        required:true
    },
    empfnm :{
        type:String,
        reuired:true
    },
    empmnm:{
        type:String,
        required:true
    },
    emplnm :{
        type:String,
        required:true
    },
    empfn :{
        type:String,
        required:true
    },
    empavl :{
        type :Number,
        required:true
    },
    empbut :{
        type:String,
        required:true
    },
    position:{
        type:String,
        required:true
    },
    password:{
        type:Number,
        required:true
    }

   
  })

  const nodeJs =  new mongoose.model("cyntralab", cyntraSchema)






app.post("/user",(req,res)=>{
  const user = new nodeJs(req.body)
  
  console.log(user)
  res.send("hello !!!! welcome to cyntra tech lab")

})



app.listen(port,()=>{
console.log(`server running on the ${port}`)

  })