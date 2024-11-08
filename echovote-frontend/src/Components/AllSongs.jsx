import React, { useEffect, useState } from 'react';

function AllSongs({ songs, socket, venueName }) {
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

  useEffect(()=>{
    setCount(song.voteCount);
  },[song.voteCount])
  console.log("component called with songs",song.title,song.voteCount,count);

  const handleUpvote = () => {
    socket.emit("upvote", { venueName, videoId: song.videoId });
    setCount(count + 1); // Optimistically update count locally
  };

  const handleDownvote = () => {
    socket.emit("downvote", { venueName, videoId: song.videoId });
    setCount(count - 1); // Optimistically update count locally
  };

  return (
    <div className="min-w-[300px] w-[800px] h-28 rounded-2xl bg-transparent border flex items-center justify-center px-10 gap-6" style={{ backdropFilter: 'blur(100px)' }}>
      <div className="w-20 h-20 rounded-xl bg-gray-700 border">
        <img src={song.thumbnailUrl} className="w-20 h-20 rounded-xl" alt="" />
      </div>
      <div className="flex-1 mx-6">
        <a href={`https://www.youtube.com/watch?v=${song.videoId}`} className="underline">
          <h1 className="text-lg font-semibold ">{truncateText(song.title, 70)}</h1>
        </a>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={handleUpvote} className="bg-gray-500 w-16 h-12 rounded flex items-center justify-center text-lg font-bold">
          <ion-icon name="arrow-up-outline"></ion-icon>
        </button>
        <button onClick={handleDownvote} className="bg-gray-500 w-16 h-12 rounded flex items-center justify-center text-lg font-bold">
          <ion-icon name="arrow-down-outline"></ion-icon>
        </button>
        <div className="ml-4 text-lg font-semibold">
          <p>{count}</p>
        </div>
      </div>
    </div>
  );
}

function truncateText(text, maxLength) {
  return text.length > maxLength ? text.slice(0, maxLength - 3) + '...' : text;
}

export default AllSongs;
