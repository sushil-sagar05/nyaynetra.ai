import mongoose from "mongoose";
 function connect(){
    try{
        mongoose.connect(process.env.MONGO_URL !)
        const connection = mongoose.connection
        connection.on('connected',()=>{
            console.log("MongoDB connected")
        })
        connection.on('error',(err)=>{
            console.log('MongoDb connection error,please make sure db is up and running '+err);
            process.exit()
           })
    }catch(error){
        console.log('Something went Wrong in connecting to db');
        console.log(error)
    }
}
module.exports=connect