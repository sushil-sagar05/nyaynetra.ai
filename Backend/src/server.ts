const dotenv = require('dotenv')
dotenv.config({
    path:'.env'
})
const http = require('http')
const app= require('./app')
const server = http.createServer(app)
try {
    server.listen(process.env.PORT|| 8000,()=>{
        console.log(`Server is listening at PORT : ${process.env.PORT}`)
    })
} catch (error) {
    console.log("MongoDB connection Failed !!!",error);
}