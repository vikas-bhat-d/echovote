import { Schema } from "mongoose";
import mongoose from "mongoose";

const playlistSchema=new Schema({
    ownerID:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    venueName:String,

    songList:{
        type:[{
            videoId:String,
            title:String,
            thumbnailUrl:String,
            voteCount:Number,
            lastPlayedAt:Date
        }]
    },
    currentlyPlaying:String
})

export const Playlist=mongoose.model("Playlist",playlistSchema);