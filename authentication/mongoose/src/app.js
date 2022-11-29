const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/krishna",{useNewUrlParser: true, useUnifiedTopology:true})
.then(()=>(console.log("connected successfully😊")))
.catch((err)=>(err))

// create document type
const playlistSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    type: String,
    vedios: Number,
    active: Boolean,
     date :{
         type:Date,
         default:Date.now()
     }

})

// collection create
                   

const createDocument = async ()=>{
try {
                                        //collection name,document type
    const Playlist = new mongoose.model("shiwangi", playlistSchema)

// create document value
 const nodeJs =  new Playlist({
        name: "krishna",
        type: "developer",
        vedios: 11,
        active: true

       
    })
    const result = await nodeJs.save()

    console.log(result)


} catch (error) {
    
    console.log( err + "error")
}



}


createDocument()
                                  



