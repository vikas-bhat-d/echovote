import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";

dotenv.config({
    path:'./.env'
})

const PORT=process.env.PORT;


const app=express();

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static("public"))
app.use(cookieParser());


app.get("/",(req,res)=>{
    res.send(`server listening on port ${PORT || 3000}`)
})

export default app