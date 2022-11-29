const express = require("express")
const app = express()
const bodyparser = require("body-parser");
const ejs = require("ejs")
const path = require("path");
var mysql = require("mysql");
var cors = require("cors")
const fs = require("fs");
const { Console } = require("console");
const mongoose = require("mongoose");

const port = 7786;

app.set("view engine","ejs")

app.set("views", path.join(__dirname, "views"))
app.use(cors())
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))


// mongo db connection
mongoose.connect("mongodb://localhost:27017/Cyntra",{useNewUrlParser: true, useUnifiedTopology:true})
.then(()=>(console.log("connected successfully😊")))
.catch((err)=>(err))

const playlistSchema = new mongoose.Schema({

  name:{
      type: String,
      required: true
  },
  salary:{
  type: String,
  required:true
  },
company:{
  type: String,
  required:true
},
   date :{
       type:Date,
       default:Date.now()
   }

})




const  ReactData = new mongoose.Schema({

  fname:{
      type: String,
      required: true
  },
  lname:{
  type: String,
  required:true
  },
 country:{
  type: String,
  required:true
},
   date :{
       type:Date,
       default:Date.now()
   }

})











const nodeJs =  new mongoose.model("cyntratechlab", playlistSchema)


const ReactJs =new mongoose.model("studentdata",ReactData)



//  var con = mysql.createConnection({

//     host:'localhost',
//    user:'root',
//    password:'',
//    database:'shiwangi'


// })

// con.connect(function(error){
//     if(!!error){
//       console.log(error + "check for some problem");
//     }else{
//       console.log('Connected!😊😊😊😊....');
//     }
//   });  

app.post("/students/create-student", async(req,res)=>{

  try {
		const input = req.body

		let { fname,lname,country} = input

		if (!(fname && lname && country )) {
			return res.status(404).send({ "message": "fname && lname && country are required!!" })
		}


		// let data =  new Details({INTERFACENAME,TRANSID, TRANSID,DESTINATION,STATUS,ERRORMSG, SYSTEM,DATE})
		// const value = await data.save()
		const inputValue = await ReactJs.create({ fname,lname,country })
		console.log(inputValue._id)


		// var currentDate = moment(new Date().toISOString()).format("YYYY-MM-DD");// new Date(date + 'T00:00:00Z');
		// console.log(currentDate)

		// const saveValueLogs = await Details.findOne({ "_id": inputValue._id })
		return res.status(200).send({ "status": true, "message": "inserted sucessfully!", "data": inputValue })
	} catch (error) {
		console.log(error)

		return res.status(500).send({ "status": false, "data": [], "error": e })
	}

})



app.get("/getStudent",async(req,res)=>{

try {
  
   const getData =await ReactJs.find()
   console.log(getData)
res.status(200).send({"status":true,"data":getData})

} catch (error) {
  res.status(500).send("internal server error")
}


})





app.get("/", (req,res)=>{


  // const promiseToken = fetchData()
  //   promiseToken.then(promisedData => {
  //       console.log(promisedData);

nodeJs.find((err,docs)=>{

if(err){
  console.log(err)
}else{

  console.log(docs)

  res.render("cyntra",{records:docs})

}


  
})

  

})
// })

function fetchData() {
  const promiseToken = new Promise((resolve, reject) => {

      // let sql = "select * from shiwangi.krishna";
      // con.query(sql, function(err, res) {
      //     if (err) throw err;
      //     resolve(res)


      })
  // })
  return promiseToken;
}


app.get("/add%20user", (req,res)=>{

res.render("add")

})

app.get("/edit/:id", (req,res)=>{
  const dataId = req.params.id;

  // let sql = `select * from shiwangi.krishna where id = ${dataId}`;

// con.query(sql,(err,data)=>{

//   if (err) throw err;
//         console.log(data)

//})

  nodeJs.findOneAndUpdate({ _id: dataId} ,req.body,{new:true},(err,data)=>{
    if(err){
      console.log("can't retrive data")
    }else{
      console.log("retrive data successfully" , data)

      res.render("edit",{user:data})
    }
  })

})
 
   

 




app.post("/edit",(req,res)=>{
  const userID = req.body._id;
// let sql = "UPDATE shiwangi.krishna SET employee='" + req.body.name + "' , salary='" + req.body.salary + "', company='" + req.body.company + "' WHERE id=" + userID;

// con.query(sql,(err,data)=>{
// if(err)throw err;
// console.log(data)

nodeJs.findOneAndUpdate({ _id:userID} ,req.body,{new:true},(err,data)=>{
  if(err){
    console.log("can't retrive data")
  }else{
    console.log(" data  update successfully" , data)

  
res.redirect("/")
  }
})






})






 

// })

app.post("/user",(req,res)=>{


  let name = req.body.name;
  let salary = req.body.salary;
  let company = req.body.company;

  // let sql = "INSERT INTO shiwangi.krishna (employee,salary,company) VALUES (?,?,?)";

  // con.query(sql,[name,salary,company],(err,data)=>{
  //   if(err){
  //     console.log("here is some problem");

  //   }else{
  //     console.log(data)
  //   }

   const raw = new nodeJs({
    name,
    salary,
    company

   })

raw.save((err)=>{
if(err){
  console.log(err)
}else{
  console.log("data saved successfully on mongodb.....")
}

})

res.redirect("/")
  })


  
// })

app.get("/delete/:id", (req,res)=>{
  const dataId = req.params.id;

  nodeJs.findOneAndDelete({ _id:dataId} ,(err,data)=>{
    if(err){
      console.log("can't delete data")
    }else{
      console.log(" data deleted successfully" , data)
      
    res.redirect("/")
    }
  
  // let sql = `DELETE  from shiwangi.krishna where id = ${dataId}`;
  
  // con.query(sql,(err,data)=>{
  
  //   if (err) throw err;
  //    console.log(data)
  
  })   
  })



app.get("/search", async(req,res)=>{

//    let sql = "SELECT * from shiwangi.krishna  where employee like '%" + req.query.name + "%' AND salary like '%" + req.query.salary + "%' AND company like '%" + req.query.company+ "%'";

// console.log(sql)

// con.query(sql,(err,data)=>{
  
//   if (err) throw err;
 
try {
  

  let name = req.query.name;
let salary = req.query.salary;
let company = req.query.company;

const [response] =  await nodeJs.find({name : name})
console.log(response)

if(!response){

  res.status(400).send({"data":false, "message":"invalid credentials"})
}
else{
  res.status(200).render("res",{records:[response]})

}


} catch (error) {
  
}

 

  



 

  


     
    
   

  
  
  
      
    
    

  
     
 


  
})







   








app.listen(port,()=>{
    console.log(`the server running on ${port}!!!`)
})
