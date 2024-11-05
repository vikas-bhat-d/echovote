import server from "./src/app.js"
import connectDB from "./db/connectDB.db.js"

connectDB()
.then(()=>{
    server.listen(process.env.PORT||8000,()=>{
        console.log("listening at port ",process.env.PORT || 3000)
    })
})
.catch((err)=>{
    console.log(err)
})