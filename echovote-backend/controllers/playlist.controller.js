import apiResponse from "../utils/apiResponse.utils.js";
import apiError from "../utils/apiError.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import { Playlist } from "../models/playlist.model.js";

const addSong=asyncHandler(async (req,res,next) => {
    const {videoId,title,thumbnailUrl}=req.body;
    const {ownerID}=req.user._id

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
    addSong
}