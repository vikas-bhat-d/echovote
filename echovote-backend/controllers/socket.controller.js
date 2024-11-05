import { Playlist } from "../models/playlist.model.js";

const COOLDOWN_MINUTES=15;

const canVoteOnSong=(lastPlayedAt)=>{
    if(!lastPlayedAt) return true;

    const now=new Date();
    const cooldownEnd=new Date(lastPlayedAt);
    cooldownEnd.setMinutes(cooldownEnd.getMinutes()+COOLDOWN_MINUTES);

    return {
        isTrue:now>cooldownEnd,
        cooldownEndsIn:now-cooldownEnd
    }
};

const broadcastPlaylist=async (io,venueName)=>{
    try {
        const playlist=await Playlist.findOne({venueName});
        if(playlist)
            io.to(venueName).emit('playlistUpdate',playlist);
    } catch (error) {
        console.error("Error broadcasting playlist:",error);
    }
}

const broadCastUpdate=async (io,venueName,updatedSong)=>{
    if(updatedSong)
        io.to(venueName).emit('songUpdate',updatedSong)
    else 
        console.log("could not broadcast the update")
}

const handleUpvote=async(io,socket,{venueName,videoId})=>{
   try {
     const playlist=await Playlist.findOne({venueName});
     const song=playlist.songList.find((song)=>song.videoId===videoId)
 
     if(!song) return socket.emit('error','Song not found');
 
     if(!(canVoteOnSong(song.lastPlayedAt).isTrue))
         return socket.emit("error","cannot vote on this song due to cooldown");
 
     const updatedPlaylist=await Playlist.findOneAndUpdate(
         {
             venueName,"songList.videoId":videoId
         },
         {
             $inc:{'songList.$.voteCount':1}
         },
         {new:true}
     );
     const updatedSong=updatedPlaylist.songList.find((song)=>song.videoId===videoId)
 
     broadCastUpdate(io,venueName,updatedSong);
   } catch (error) {
        socket.emit("error",'Error in upvoting')
   }
}

const handleDownvote=async(io,socket,{venueName,videoId})=>{
    try {
        const playlist=await Playlist.findOne({venueName});
        const song=playlist.songList.find((song)=>song.videoId===videoId)
    
        if(!song) return socket.emit('error','Song not found');
    
        if(!(canVoteOnSong(song.lastPlayedAt).isTrue))
            return socket.emit("error","cannot vote on this song due to cooldown");
    
        const updatedPlaylist=await Playlist.findOneAndUpdate(
            {
                venueName,"songList.videoId":videoId
            },
            {
                $inc:{'songList.$.voteCount':-1}
            },
            {new:true}
        );
        const updatedSong=updatedPlaylist.songList.find((song)=>song.videoId===videoId)
    
        broadCastUpdate(io,venueName,updatedSong);
    } catch (error) {
        socket.emit("error","error in downvoting")
    }
}

const PlayNext=async (io,{venueName})=>{
   try {
     const playlist=await Playlist.findOne({venueName});
 
     if(!playlist || playlist.songList.length===0){
         io.to(venueName).emit('error',"No songs in the playlist");
         return
     }
 
     const sortedSongs=playlist.songList
                         .filter(song=>{
                             const cooldownTime=15*60*1000;
                             return !song.lastPlayedAt || new Date()-song.lastPlayedAt >cooldownTime;
                         })
                         .sort((a,b)=>b.voteCount-a.voteCount||a.lastPlayedAt-b.lastPlayedAt);
     const nextSong=sortedSongs[0];
 
     if (!nextSong) {
         io.to(venueName).emit('error', 'No song available for play.');
         return;
     }
 
     playlist.currentlyPlaying=nextSong.videoId;
     nextSong.voteCount=0;
     nextSong.lastPlayedAt=new Date();
 
     await playlist.save();
 
     broadcastPlaylist(io,venueName);
     io.to(venueName).emit('currentlyPlaying',nextSong);
   } catch (error) {
        console.log("error playing next song: ",error);
        io.to(venueName).emit("error","Failed to play next song");
   }
}

const handleSongEnd=async (io,socket)=>{
    const venueName=socket.handshake.query.venueName;
    PlayNext(io,{venueName});
}
export {
    handleDownvote,
    handleUpvote,
    broadcastPlaylist,
    handleSongEnd
}