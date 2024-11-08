import express,{Router} from "express"
import http from "http"
import {Server} from "socket.io"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";

dotenv.config({
    path:'./.env'
})

const PORT=process.env.PORT;


const app=express();
const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin: "*",
    }
});


//http
app.use(cors({
    path:process.env.CORS_ORIGIN
}))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static("public"))
app.use(cookieParser());


app.get("/",(req,res)=>{
    res.send(`server listening on port ${PORT || 3000}`)
})

import userRouter from "../routes/user.route.js"
import playlistRouter from "../routes/playlist.route.js"

app.use("/api/v1/user",userRouter);
app.use("/api/v1/playlist",playlistRouter);


//socket
import { handleDownvote,handleUpvote,broadcastPlaylist,handleSongEnd,handleModified } from "../controllers/socket.controller.js"
io.on('connection',(socket)=>{
    console.log("A user connected");

    socket.on('joinRoom',(venueName)=>{
        console.log("user joinde ",venueName);
        socket.join(venueName);
    });

    socket.on('upvote',(data)=>{
        handleUpvote(io,socket,data)
    })

    socket.on('downvote',(data)=>{
        handleDownvote(io,socket,data)
    })

    socket.on('songEnded',()=>{
        handleSongEnd(io,socket);
    })

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on(('playlistModified'),(data)=>{
        handleModified(io,socket,data);
    })
})

export default server