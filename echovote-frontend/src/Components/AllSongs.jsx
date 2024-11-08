import React, { useState } from 'react';

function AllSongs({ songs }) {
  return (
    <div className="flex flex-col items-center gap-4">
      {songs.map((song, index) => (
        <SongVote key={index} song={song} />
      ))}
    </div>
  );
}

function SongVote({ song }) {
  const [count, setCount] = useState(0);``

  const handleUpvote = () => setCount(count + 1);
  const handleDownvote = () => setCount(count - 1);

  return (
    <div className="min-w-[300px] w-[800px] h-28 rounded-2xl bg-transperent border flex items-center justify-center px-10 gap-6 " style={{backdropFilter:'blur(100px)'}}>
      {/* Thumbnail */}
      <div className="w-20 h-20 rounded-xl bg-gray-700 border"></div>

      {/* Song Details */}  
      <div className="flex-1 mx-6">
        <h1 className="text-lg font-semibold ">{song.name}</h1>
        <a href={song.url} className="underline">{song.url}</a>
      </div>

      {/* Upvote and Downvote Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleUpvote}
          className="bg-gray-500 w-16 h-12 rounded flex items-center justify-center text-lg font-bold"
        >
          <ion-icon name="arrow-up-outline"></ion-icon>
        </button>
        <button
          onClick={handleDownvote}
          className="bg-gray-500 w-16 h-12 rounded flex items-center justify-center text-lg font-bold"
        >
          <ion-icon name="arrow-down-outline"></ion-icon>
        </button>

        {/* Vote Count */}
        <div className="ml-4 text-lg font-semibold">
          <p>{count}</p>
        </div>
      </div>
    </div>
  );
}

export default AllSongs;
