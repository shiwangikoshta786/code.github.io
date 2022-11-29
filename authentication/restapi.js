const express = require("express");
const app = express()

var mongoose = require("mongoose");

app.use(express.json())

mongoose.connect("mongodb://localhost:27017/vishalmegamart",{useNewUrlParser: true, useUnifiedTopology:true})
.then(()=>(console.log("connected successfully😊")))
.catch((err)=>(err  + "something err in mongodb connection"))

const port = 3786;

const cyntraSchema = new mongoose.Schema({
    
    SAP_STORE_ID : {
      type: String
     
    },

    POS_STORE_ID :{
        type: String,
       
    },
    ADDRESS :{
        type: String,
        required:true
    },
    emp :{

        empnm:{
            type:String,
           
        },
       empid:{
          type:String
       }
    
    },
    
    
    STORE:{
        type:String

    }
    

   
  })

   const vishalMega = new mongoose.model("vishalmegamart", cyntraSchema)




app.get("/users", async(req,res)=>{

try {
  const data =  await vishalMega.find()
  console.log(data)
  res.send(data)
    
} catch (error) {
    console.log("check for error")
}

})


app.post("/login", async(req,res)=>{


  console.log(req.body.POS_STORE_ID)
 
  try {
    await vishalMega.findOne({"POS_STORE_ID": req.body.POS_STORE_ID }, (err,result)=>{

        if(result == null){
            res.status(404).send({data:"false", value:" data not found"})
        }else{
            res.status(200).send(result)
        }
        
                })
    
  } catch (error) {
    
  }     
 
    
})




app.listen(port,()=>{
console.log(`server running on the ${port}`)

  })