import dotenv from "dotenv"
dotenv.config({
    path:'./.env'
})

import axios from 'axios';
import asyncHandler from "../utils/asyncHandler.utils.js";
import apiError from "../utils/apiError.utils.js";
import apiResponse from "../utils/apiResponse.utils.js";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search";


const fetchYoutubeVideos = async (query) => {
    try {
        const response = await axios.get(YOUTUBE_API_URL, {
            params: {
                part: 'snippet',
                q: query,         
                type: 'video',       
                maxResults: 15,       
                key: YOUTUBE_API_KEY,
            },
        });

        const videos = response.data.items.map((item) => ({
            videoId: item.id.videoId,
            title: item.snippet.title,
            thumbnailUrl: item.snippet.thumbnails.default.url,
        }));

        return {videos:videos,response:response.data};
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        throw new Error('Failed to fetch video suggestions.');
    }
};

const searchMusic=asyncHandler(async(req,res,next)=>{
    const {query}=req.query

    if(!query)
        throw new apiError(400,"no search query")
    const results=await fetchYoutubeVideos(query)
    if(results)
        res.status(200)
        .send(new apiResponse(200,results,"searched the results"))
    else 
        throw new apiError(400,"results couldn't be fetched");

})

export {
    searchMusic
}