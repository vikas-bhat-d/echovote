import React from 'react';
import { assets } from '../assets/assets';
import './Style.css';

function LoginPage() {
  return (
    <> 
      {/* Wrapper */}
      <div className='w-full h-screen relative flex justify-center items-center'>

        <img className='absolute w-full h-screen' src={assets.LoginBackground} alt="Background" />

        {/* Form Box */}
        <div className='relative h-[500px] w-[440px] bg-transparent border-2 border-solid border-[rgba(255,255,255,.5)] rounded-3xl flex flex-col items-center text-blue-300 p-20 justify-center' style={{backdropFilter: 'blur(20px)', boxShadow: '0 0 30px rgba(0,0,0,.5)'}}>
          
          {/* Login Form */}
          <h1 className='text-4xl font-bold text-center mb-8'>Login</h1>

          {/* Username */}
          <div className='input-box mb-4'>
            <span className='icon'><ion-icon name="person"></ion-icon></span>
            <input type='text' id="username" required/>
            <label className='form-label' htmlFor="username">Username</label>
          </div>

          {/* Email */}
          <div className='input-box mb-4'>
            <span className='icon'><ion-icon name="mail"></ion-icon></span>
            <input type="email" id="email" required/>
            <label className='form-label' htmlFor="email">Email</label>
          </div>
          
          {/* Password */}
          <div className='input-box mb-4'>
            <span className='icon'><ion-icon name="lock-closed"></ion-icon></span>
            <input type="password" id="password" required/>
            <label className='form-label' htmlFor="password">Password</label>
          </div>

          {/* Venue Name */}
          <div className='input-box mb-4'> 
            <input type="text" id="venueName" required/>
            <label className='form-label' htmlFor="venueName">Venue Name</label>
          </div>

          {/* Venue Type */}
          <div className='input-box mb-4'> 
            <input type="text" id="venueType" required/>
            <label className='form-label' htmlFor="venueType">Venue Type</label>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between items-center w-full mb-5">  
            <label htmlFor="remember"><input type="checkbox" id="remember" className='cursor-pointer'/> Remember me</label>
            <a href="#" className="text-blue-300">Forgot Password?</a>
          </div>

          {/* Submit */}
          <button type='submit' className='mb-4 px-[20%] py-2 border bg-[#027ED1ff] text-white font-semibold rounded-full hover:bg-blue-700 transition duration-200 text-sm sm:text-base'>Login</button>
          
          {/* Register Link */}
          <div>  
            <p>Don't have an account? <a href="#" className="text-blue-300">Register</a></p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
