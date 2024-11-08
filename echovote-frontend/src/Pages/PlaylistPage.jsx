import React, { useState } from 'react';  
import CurrentSong from '../Components/CurrentSong';
import AllSongs from '../Components/AllSongs';
import { assets } from '../assets/assets';

function PlaylistPage() {
    const songsData = [
        { name: 'Song 1', url:'URL', votes: 0 },
        { name: 'Song 2', url:'URL', votes: 0 },
        { name: 'Song 3', url:'URL', votes: 0 },
        { name: 'Song 4', url:'URL', votes: 0 },
        { name: 'Song 5', url:'URL', votes: 0 },
    ];

    const [songs, setSongs] = useState(songsData);
    const [currentSong, setCurrentSong] = useState(songs[0]);

    // Function to handle upvoting/downvoting
    const handleVote = (songName, type) => {
        setSongs((prevSongs) => {
            return prevSongs.map(song => {
                if (song.name === songName) {
                    return {
                        ...song,
                        votes: type === 'upvote' ? song.votes + 1 : song.votes - 1
                    };
                }
                return song;
            }).sort((a, b) => b.votes - a.votes); // Sort by votes in descending order
        });
    };

    return (
        <div className='flex flex-col justify-center items-center w-full px-4'>
            <img src={assets.PlayListBackground} alt="Background Image" className='relative w-full h-screen con' />
            <h1 className='text-5xl text-center font-medium mb-10'>Play Lists</h1>

            {/* Currently Playing */}
            <div className='flex flex-col items-center p-10 w-full max-w-4xl'>
                <h1 className='text-2xl font-semibold mb-4'>Currently Playing Song</h1>
                <CurrentSong song={currentSong} /> 
            </div>

            {/* Upvote and Downvote */}
            <div className='flex flex-col items-center p-10 w-full max-w-4xl'>
                <h1 className='text-2xl font-semibold mb-4'>You can Upvote/Downvote here</h1>
                <AllSongs 
                    songs={songs} 
                    onVote={handleVote} 
                    setCurrentSong={setCurrentSong} 
                />
            </div>
        </div>
    );
}

export default PlaylistPage;
