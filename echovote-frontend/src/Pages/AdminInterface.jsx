import React, { useEffect, useState } from 'react';  
import CurrentSong from '../Components/CurrentSong';  
import { assets } from '../assets/assets';
import { useParams } from 'react-router-dom';  
import './pageStyle.css';  
import AddSongs from '../Components/AddSongs';
import axios from 'axios';
import { io } from "socket.io-client";
import { server } from '../environments';

function AdminInterface() {
    const { venueName } = useParams();
    const [socket, setSocket] = useState(null);
    const [songs, setSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const COOLDOWN_MINUTES = 15;

    useEffect(() => {
        const newSocket = io(server);
        setSocket(newSocket);

        const fetchData = async () => {
            try {
                console.log("Fetched playlist again");
                const response = await axios.get(`${server}/api/v1/playlist/${venueName}`);
                if (response.data) {
                    const fetchedSongs = response.data.data.songList;
                    setSongs(fetchedSongs);
                    const sortedSongs = fetchedSongs
                        .filter(song => !song.lastPlayedAt || new Date() - song.lastPlayedAt > COOLDOWN_MINUTES * 60 * 1000)
                        .sort((a, b) => b.voteCount - a.voteCount || (a.lastPlayedAt || 0) - (b.lastPlayedAt || 0));
                    setCurrentSong(response.data.data.currentlyPlaying || sortedSongs[0]?.videoId || null);
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
            socket.emit("songEnded",{venueName:venueName});

            socket.on("playlistUpdate", (updatedPlaylist) => {
                setSongs(updatedPlaylist.songList);
                // setCurrentSong(updatedPlaylist.currentlyPlaying || updatedPlaylist.songList[0]);
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
            
            socket.on("currentlyPlaying",(nextSong)=>{
                console.log(nextSong);
                console.log("setting current song");
                setCurrentSong(nextSong.videoId)
            })

            return () => {
                socket.off("playlistUpdate");
                socket.off("songUpdate");
            };
        }
    }, [socket, venueName,currentSong,setCurrentSong]);

    // Debounced search
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.trim()) {
                try {
                    const response = await axios.get(`${server}/api/v1/playlist/search?query=${searchTerm}`);
                    setSearchResults(response.data.data.videos);
                } catch (error) {
                    console.error("Error searching for songs:", error);
                }
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const addSongToPlaylist = async (song) => {
        try {
            console.log("venueName,",venueName);
            await axios.post(`${server}/api/v1/playlist/add`, { ...song,venueName:venueName });
            socket.emit('playlistModified', { venueName, videoId: song.videoId });
            setSearchResults([]);
            setSearchTerm("");
        } catch (error) {
            console.error("Error adding song to playlist:", error);
        }
    };

    return (
        <div className='relative flex flex-col justify-center items-center w-full px-4 text-center text-white'>
            <img 
                src={assets.PlayListBackground} 
                alt="Background Image" 
                className='fixed top-0 left-0 w-full h-full object-cover z-[-1]' 
            />

            <div className='relative z-10 flex flex-col justify-center items-center w-full'>
                <h1 className='text-5xl text-center font-medium mb-10'>{venueName}</h1>

                <div className='flex flex-col items-center p-10 w-full max-w-4xl'>
                    <h1 className='text-2xl font-semibold mb-4'>Now Playing</h1>
                    <CurrentSong song={currentSong} socket={socket} venueName={venueName}/> 
                </div>

                <div className='text-center p-10 w-full max-w-4xl'>
                    <div className='relative flex flex-col items-center'>
                        <h1 className='text-2xl font-semibold'>Add Songs</h1>
                        <input
                            className='w-full max-w-xs px-4 py-2 mb-4 border rounded-lg outline-none text-blue-500 text-lg'
                            type="search"
                            placeholder="Search songs..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        {searchResults.length > 0 && (
                            <div className="absolute top-full mt-2 w-full max-w-xs bg-gray-800 text-white rounded-lg shadow-lg z-20">
                                {searchResults.map((song, index) => (
                                    <div
                                        key={index} 
                                        className="cursor-pointer p-2 hover:bg-gray-700"
                                        onClick={() => addSongToPlaylist(song)}
                                    >
                                        {song.title} - {song.artist}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <AddSongs songs={songs} socket={socket} venueName={venueName}/>
                </div>
            </div> 
        </div>
    );
}

export default AdminInterface;
