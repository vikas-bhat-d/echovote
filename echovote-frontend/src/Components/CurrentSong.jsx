import React from 'react';

function CurrentSong() {
  return (
      <div className=" w-[800px] min-w-[300px] flex flex-col items-center p-5"> 

          {/* Video */} 
            <div>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/XO8wew38VM8?si=dYV-p4bQOsFV4sOW" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>

          {/* Song Details */}
            <div className="flex-1 mx-6 text-center">
              <h1 className="text-lg font-semibold mt-2">Song Title</h1>
              <a href="#" className="underline">Song URL</a>
            </div> 
      
      </div>
  );
}

export default CurrentSong;
