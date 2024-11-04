import dotenv from "dotenv"
dotenv.config({
    path:'./.env'
})

import axios from 'axios';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search";


export const fetchYoutubeVideos = async (query) => {
    try {
        const response = await axios.get(YOUTUBE_API_URL, {
            params: {
                part: 'snippet',
                q: query,         
                type: 'video',       
                maxResults: 10,       
                key: YOUTUBE_API_KEY,
            },
        });

        const videos = response.data.items.map((item) => ({
            videoId: item.id.videoId,
            title: item.snippet.title,
            thumbnailUrl: item.snippet.thumbnails.default.url,
        }));

        return videos;
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        throw new Error('Failed to fetch video suggestions.');
    }
};