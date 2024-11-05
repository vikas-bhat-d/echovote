import apiResponse from "../utils/apiResponse.utils.js";
import apiError from "../utils/apiError.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import { Playlist } from "../models/playlist.model.js";
import { User } from "../models/user.model.js";

const fetchPlaylist=asyncHandler(async (req,res,next)=>{
    const {venueName}=req.params;

    // if(venueName?.trim()=="")
    //     throw new apiError(400,"Playlist ID is missing in the request")
    // const existedUser=await User.findOne({venueName})
    // if(!existedUser)
    //     throw new apiError(400,"Playlist not found")
    const fetchedSong=await Playlist.findOne({venueName:venueName})

    if(!fetchedSong)
        throw new apiError(400,"songs could not be fetched")
    res
    .status(200)
    .send(new apiResponse(200,fetchedSong.songList,"Songs fetched"))

})

const addSong=asyncHandler(async (req,res,next) => {
    const {videoId,title,thumbnailUrl}=req.body;
    const ownerID=req.user._id
    
    console.log(req.user._id,ownerID);

    const newSong={videoId,title,thumbnailUrl};

    const addedSong=await Playlist.findOneAndUpdate(
        {ownerID},
        {$push:{songList:newSong}},
        {new:true}
    )

    if(addedSong)
        res
        .status(200)
        .send(new apiResponse(200,addedSong,"Song added to the playlist"))
    else
        throw new apiError(400,"Song couldnot be added to the playlist")

    // videoId:String,
    // title:String,
    // thumbnailUrl:String,
    // voteCount:Number,
    // lastPlayedAt:Date
})



export {
    fetchPlaylist,
    addSong
}