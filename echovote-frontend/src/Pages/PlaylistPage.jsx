import React, { useEffect, useState } from 'react';  
import CurrentSong from '../Components/CurrentSong';
import AllSongs from '../Components/AllSongs';
import { assets } from '../assets/assets';
import { useParams } from 'react-router-dom';
import { io } from "socket.io-client";
import { server } from '../environments';
import axios from 'axios';

function PlaylistPage() {
    const { venueName } = useParams();
    const [socket, setSocket] = useState(null);
    const [songs, setSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);

    useEffect(() => {
        const newSocket = io(server);
        setSocket(newSocket);

        const fetchData = async () => {
            try {
                console.log("Fetched playlist again")
                const response = await axios.get(`${server}/api/v1/playlist/${venueName}`);
                if (response.data) {
                    const fetchedSongs = response.data.data.songList;
                    setSongs(fetchedSongs);
                    console.log(fetchedSongs);
                    const sortedSongs = fetchedSongs
                    .filter(song => !song.lastPlayedAt || new Date() - song.lastPlayedAt > COOLDOWN_MINUTES * 60 * 1000)
                    .sort((a, b) => b.voteCount - a.voteCount || (a.lastPlayedAt || 0) - (b.lastPlayedAt || 0));
                    setCurrentSong((prev)=>response.data.data.currentlyPlaying || sortedSongs[0].videoId || null);
                    console.log("current song:",currentSong);
                }
            } catch (error) {
                console.error("Error fetching playlist:", error);
            }
        };

        fetchData();

        return () => {
            newSocket.disconnect();
        };
    }, [venueName]);

    useEffect(() => {
        if (socket) {
            socket.emit("joinRoom", venueName);

            socket.on("playlistUpdate", (updatedPlaylist) => {
                setSongs(updatedPlaylist.songList);
                setCurrentSong(updatedPlaylist.currentlyPlaying || updatedPlaylist.songList[0]);
                // console.log(updatedPlaylist)
            });

            socket.on("songUpdate", (updatedSong) => {
                setSongs((prevSongs) =>
                    prevSongs.map((song) =>
                        song.videoId === updatedSong.videoId
                            ? { ...song, voteCount: updatedSong.voteCount }
                            : song
                    )
                );
            });

            return () => {
                socket.off("playlistUpdate");
                socket.off("songUpdate");
            };
        }
    }, [socket, venueName]);

    return (
        <div className='relative flex flex-col justify-center items-center w-full px-4 text-white'>
            <img 
                src={assets.PlayListBackground} 
                alt="Background Image" 
                className='absolute top-0 left-0 w-full h-full object-cover z-[-1]' 
            />
            <div className='relative z-10 flex flex-col justify-center items-center w-full'>
                <h1 className='text-5xl text-center font-medium mb-10'>{venueName}</h1>
                <div className='flex flex-col items-center p-10 w-full max-w-4xl'>
                    <h1 className='text-2xl font-semibold mb-4'>Now Playing</h1>
                    <CurrentSong song={currentSong} /> 
                </div>
                <div className='flex flex-col items-center p-10 w-full max-w-4xl'>
                    <h1 className='text-2xl font-semibold mb-4'>You can Vote here</h1>
                    <AllSongs songs={songs} socket={socket} venueName={venueName} />
                </div>
            </div>
        </div>
    );
}

function truncateText(text, maxLength) {
  return text.length > maxLength ? text.slice(0, maxLength - 3) + '...' : text;
}

export default PlaylistPage;