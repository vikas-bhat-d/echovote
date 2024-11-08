import React from 'react';

function CurrentSong() {
  return (
      <div className=" w-[800px] min-w-[300px] flex flex-col items-center p-5"> 

          {/* Video */} 
            <div>
              <iframe width="560" height="250" src="https://www.youtube.com/embed/jlXNjQxQMZo?si=_f3whpWMz77rMW7h" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"           referrerpolicy="strict-origin-when-cross-origin" ></iframe>
            </div>

          {/* Song Details */}
            <div className="flex-1 mx-6 text-center">
              <h1 className="text-lg font-semibold">Song Title</h1>
              <a href="#" className="underline">Song URL</a>
            </div> 
      
      </div>
  );
}

export default CurrentSong;
