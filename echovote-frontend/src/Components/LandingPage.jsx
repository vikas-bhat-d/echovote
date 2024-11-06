import React from 'react'
import { assets } from '../assets/assets'

function LandingPage() {
  return (
    <>
      <div className="relative flex flex-col items-center justify-center h-screen bg-gray-100"> 
      <div className="absolute w-full h-screen">
        <img className="w-full h-full object-cover md:h-full" src={assets.BackgroundImg}  alt="Landing page background" /> 
      </div>  
      <div className="Heading relative flex flex-col items-center text-center p-6 bg-opacity-50 bg-white rounded-lg max-w-lg md:max-w-2xl           lg:max-w-4xl mx-0 h-[50%] justify-center gap-3"> 

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1E8DD6ff] mb-4 ">Choose the music <span className='text-black'>that sets the mood! </span></h1> 
        <p className='text-lg sm:text-md'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nemo, cumque accusantium. Soluta quia nesciunt officia, nulla rerum repellendus </p>

        <div className='flex gap-3'> 
        <button className="mt-8 px-4 sm:px-6 py-3 bg-[#027ED1ff] text-white font-semibold rounded-full hover:bg-blue-700 transition duration-200 text-sm sm:text-base">Get Started</button>

        <button className="mt-8 px-4 sm:px-6 py-3 bg-[#027ED1ff] text-white font-semibold rounded-full hover:bg-blue-700 transition duration-200 text-sm sm:text-base">
            Log In / Sign Up
        </button> 
        </div>

      </div>
    </div>  
    </>
  )
}

export default LandingPage