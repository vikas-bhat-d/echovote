import React from 'react'
import LandingPage from './Components/LandingPage'
import LoginPage from './Components/LoginPage'
import {BrowserRouter,Routes,Route} from 'react-router-dom';


function App() { 

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage/>}/> 
          <Route path='/login' element={<LoginPage/>}/> 
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App