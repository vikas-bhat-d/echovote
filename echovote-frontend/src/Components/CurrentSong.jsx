import React,{useState,useEffect,useRef} from 'react';

function CurrentSong({song,socket,venueName}) {
  // console.log("socket:",socket)
  
  console.log("venueName outside:",venueName)
  console.log("component loaded again with song: ",song);
  // console.log(song)
  const [player, setPlayer] = useState(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    console.log("calling use effect with",song)
    // Load YouTube API script
    const loadYouTubeAPI = () => {
      if (window.YT) {
        return; // YouTube API is already loaded
      }
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      // script.onload = () => initializePlayer();
      document.body.appendChild(script);
    };

    const playVideo = () => {
      if (player) {
        player.playVideo();
      }
    };

    // Initialize YouTube player after API is ready
    const onYouTubeIframeAPIReady = () => {
      const newPlayer = new window.YT.Player(iframeRef.current, {
        height: '315',
        width: '560',
        videoId: song?song.trim():"",
        playerVars: {
          autoplay: 1,  // This ensures the video will autoplay when loaded
          controls: 1,  // You can also control whether the player controls are shown
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          mute:1
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
        autoplay:true
      });
      setPlayer(newPlayer);
    };


    // Event handler when player is ready
    const onPlayerReady = (event) => {
      playVideo();
      console.log("Player is ready!");
    };

    // Event handler for state change (detect when song changes)
    const onPlayerStateChange = (event) => {
      if (event.data === window.YT.PlayerState.ENDED) {
        console.log("venueName:",venueName);
        socket.emit("songEnded",{venueName:venueName});
        console.log("Song ended, change to next song");

      }
    };

    // Attach API script and initialize the player
    loadYouTubeAPI();
    // window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    // if (window.YT) {
    //   onYouTubeIframeAPIReady();
    //   player.loadVideoById(song.trim());
    // } else {
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    // }

    if(player){
      player.loadVideoById(song.trim());
    }



    return () => {
      // Cleanup if needed
      if (player) {
        player.destroy();
      }
    };
  }, [song,socket,venueName]);

  // Function to play the video
  

  // Function to pause the video
  const pauseVideo = () => {
    if (player) {
      player.pauseVideo();
    }
  };

  return (
    <div className="w-[800px] min-w-[300px] flex flex-col items-center p-5">
      {/* Video */}
      <div>
        <div ref={iframeRef}></div>
      </div>

      {/* Song Controls */}
      {/* <div className="flex-1 mx-6 text-center">
        <h1 className="text-lg font-semibold mt-2">Song Title</h1>
        <a href="#" className="underline">Song URL</a>
      </div> */}

      {/* Control Buttons */}
      {/* <div>
        <button onClick={playVideo} className="px-4 py-2 bg-blue-500 text-white">Play</button>
        <button onClick={pauseVideo} className="px-4 py-2 bg-red-500 text-white ml-4">Pause</button>
      </div> */}
    </div>
  );
}

export default CurrentSong;
