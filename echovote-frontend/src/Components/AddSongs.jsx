import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { server } from '../environments';


function AddSongs({ songs, socket, venueName }) {
    console.log("songs:", songs);
    return (
        <div className="flex flex-col items-center gap-4">
            {songs.map((song, index) => (
                <SongVote key={index} song={song} socket={socket} venueName={venueName} />
            ))}
        </div>
    );
}

function SongVote({ song, socket, venueName }) {
    const [count, setCount] = useState(song.voteCount);
    const [videoId, setVideoId] = useState(song.videoId);
    useEffect(() => {
        if (socket) {
            const handleVoteChange = ({ inc }) => {
                console.log("vote change event:", inc);
                setCount((prev) => prev + inc);
            };

            socket.on("voteChange", handleVoteChange);

            // Clean up the listener on component unmount or re-render
            return () => {
                socket.off("voteChange", handleVoteChange);
            };
        }
    }, [socket]);

    const handleDelete = async () => {
        try {
            console.log("deleting song");
            console.log("venueName,",venueName);
            await axios.post(`${server}/api/v1/playlist/remove`, {videoId,venueName:venueName });
            socket.emit('playlistModified', { venueName, videoId: song.videoId });
            // setSearchResults([]);
            // setSearchTerm("");
        } catch (error) {
            console.error("Error removing song from playlist:", error);
        }
    }

    return (
        <div className="min-w-[300px] w-[800px] h-24 rounded-2xl flex items-center justify-center px-10 gap-6 relative scroll-container" style={{ backdropFilter: 'blur(1000px)' }}>
            {/* Thumbnail */}
            <div className="w-20 h-20 rounded-xl bg-gray-700 border">
                <img src={song.thumbnailUrl} className="w-20 h-20 rounded-xl" alt="" />
            </div>

            {/* Song Details */}
            <div className="flex-1 mx-6">
                <a href={`https://www.youtube.com/watch?v=${song.videoId}`} className="underline">
                    <h1 className="text-lg font-semibold ">{truncateText(song.title, 70)}</h1>
                </a>
            </div>

            {/* Add and Delete Songs Buttons */}
            <div className="flex items-center gap-2">

                <button
                    onClick={handleDelete}
                    className="bg-gray-500 w-16 h-12 rounded flex items-center justify-center text-lg font-bold "
                >
                    <ion-icon name="trash-outline"></ion-icon>
                </button>
                {/* <div className="ml-4 text-lg font-semibold">
                    <p>{count}</p>
                </div> */}
            </div>
        </div>
    );
}

function truncateText(text, maxLength) {
    return text.length > maxLength ? text.slice(0, maxLength - 3) + '...' : text;
}

export default AddSongs;