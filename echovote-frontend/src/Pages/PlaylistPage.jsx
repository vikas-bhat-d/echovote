import React, { useState } from 'react';  
import CurrentSong from '../Components/CurrentSong';
import AllSongs from '../Components/AllSongs';
import { assets } from '../assets/assets';
import { useParams } from 'react-router-dom';

function PlaylistPage() {
    const {venueName}=useParams(); 
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
        <div className='relative flex flex-col justify-center items-center w-full px-4 text-white'>
            {/* Background Image */}
            <img 
                src={assets.PlayListBackground} 
                alt="Background Image" 
                className='absolute top-0 left-0 w-full h-full object-cover z-[-1]' 
            />

            {/* Main Content */}
            <div className='relative z-10 flex flex-col justify-center items-center w-full'>
                <h1 className='text-5xl text-center font-medium mb-10'>{venueName}</h1>

                {/* Currently Playing */}
                <div className='flex flex-col items-center p-10 w-full max-w-4xl'>
                    <h1 className='text-2xl font-semibold mb-4'>Currently Playing Song</h1>
                    <CurrentSong song={currentSong} /> 
                </div>

                {/* Upvote and Downvote */}
                <div className='flex flex-col items-center p-10 w-full max-w-4xl '>
                    <h1 className='text-2xl font-semibold mb-4'>You can Vote here</h1>
                    <AllSongs 
                        songs={songs} 
                        onVote={handleVote} 
                        setCurrentSong={setCurrentSong} 
                    />
                </div>
            </div>
        </div>
    );
}

export default PlaylistPage;
