import { Playlist } from "../models/playlist.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: './.env' });

const COOLDOWN_MINUTES = 15;

const verifyToken = async (socket) => {
    const cookies = socket.request.headers.cookie;
    const token = cookies && cookies.includes('accessToken') ? cookies.split('accessToken=')[1].split(';')[0] : null;

    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                reject('Authentication error: Invalid token');
            } else {
                resolve(decoded); // Return decoded user information (e.g., userId)
            }
        });
    });
};

const canVoteOnSong = (lastPlayedAt) => {
    console.log("test");
    if (!lastPlayedAt) return {isCooldownExpired:true};
    const now = new Date();
    const cooldownEnd = new Date(lastPlayedAt);
    cooldownEnd.setMinutes(cooldownEnd.getMinutes() + COOLDOWN_MINUTES);

    console.log("cooldown: ",now>cooldownEnd)
    return {
        isCooldownNotExpired: now <cooldownEnd,
        cooldownEndsIn: now - cooldownEnd,
    };
};

const broadcastPlaylist = async (io, venueName) => {
    try {
        const playlist = await Playlist.findOne({ venueName });
        if (playlist) {
            console.log("broadcasting playlist")
            io.to(venueName).emit('playlistUpdate', playlist);
        }
    } catch (error) {
        console.error("Error broadcasting playlist:", error);
    }
};

const broadcastSongUpdate = async (io, venueName, updatedSong) => {
    if (updatedSong) {
        io.to(venueName).emit('songUpdate', updatedSong);
    } else {
        console.error("Could not broadcast the update");
    }
};

const handleModified=async(io,socket,{venueName})=>{
    
    broadcastPlaylist(io,venueName);
}

const handleUpvote = async (io, socket, { venueName, videoId }) => {
    try {
        const playlist = await Playlist.findOne({ venueName });
        const song = playlist.songList.find((song) => song.videoId === videoId);


        if (!song) return socket.emit('error', 'Song not found');
        if ((canVoteOnSong(song.lastPlayedAt).isCooldownNotExpired)) {
            return socket.emit("error", "Cannot vote on this song due to cooldown");
        }

        const updatedPlaylist = await Playlist.findOneAndUpdate(
            { venueName, "songList.videoId": videoId },
            { $inc: { 'songList.$.voteCount': 1 } },
            { new: true }
        );
        const updatedSong = updatedPlaylist.songList.find((song) => song.videoId === videoId);

        broadcastPlaylist(io, venueName);
        io.to(venueName).emit('voteChange',{inc:1})
    } catch (error) {
        socket.emit("error", 'Error in upvoting');
    }
};

const handleDownvote = async (io, socket, { venueName, videoId }) => {
    try {
        const playlist = await Playlist.findOne({ venueName });
        const song = playlist.songList.find((song) => song.videoId === videoId);

        if (!song) return socket.emit('error', 'Song not found');
        if (!canVoteOnSong(song.lastPlayedAt).isCooldownExpired) {
            return socket.emit("error", "Cannot vote on this song due to cooldown");
        }

        const updatedPlaylist = await Playlist.findOneAndUpdate(
            { venueName, "songList.videoId": videoId },
            { $inc: { 'songList.$.voteCount': -1 } },
            { new: true }
        );

        broadcastPlaylist(io, venueName);
        io.to(venueName).emit('voteChange',{inc:-1})
    } catch (error) {
        socket.emit("error", "Error in downvoting");
    }
};

const playNext = async (io, venueName) => {
    try {
        console.log("Playing next:",venueName)
        const playlist = await Playlist.findOne({ venueName });
        // if(playlist.currentlyPlaying){
        //     const lastPlayedVideo=playlist.songList.filter(song=>song.videoId==playlist.currentlyPlaying)
        //     lastPlayedVideo.lastPlayedAt=new Date()
        // }
        // else
        //     playlist.songList[0].lastPlayedAt=new Date()

        console.log("playlist:",playlist);

        if (!playlist || playlist.songList.length === 0) {
            io.to(venueName).emit('error', "No songs in the playlist");
            return;
        }

        const sortedSongs = playlist.songList
            // .filter(song => !song.lastPlayedAt || new Date() - song.lastPlayedAt > COOLDOWN_MINUTES * 60 * 1000)
            .sort((a, b) => b.voteCount - a.voteCount || (a.lastPlayedAt || 0) - (b.lastPlayedAt || 0));

        const nextSong = sortedSongs[0];

        if (!nextSong) {
            io.to(venueName).emit('error', 'No song available for play.');
            return;
        }

        // playlist.currentlyPlaying = nextSong.videoId;
        nextSong.voteCount = 0;
        // nextSong.lastPlayedAt = new Date();

        await playlist.save();

        broadcastPlaylist(io, venueName);
        console.log("currentlyPlaying emmited");
        io.to(venueName).emit('currentlyPlaying', nextSong);
    } catch (error) {
        io.to(venueName).emit("error", "Failed to play next song");
    }
};

const handleSongEnd = async (io, socket,{venueName}) => {
    // verifyToken(socket)
        // .then(() => {
            // const venueName = socket.handshake.query.venueName;
            playNext(io,venueName);
        // })
        // .catch(() => socket.emit("error", "Unauthorized"));
};

export {
    handleDownvote,
    handleUpvote,
    broadcastPlaylist,
    handleSongEnd,
    handleModified
};
