import React from 'react'
import LandingPage from './Pages/LandingPage'
import LoginPage from './Pages/LoginPage'
import Login from './Components/Login'
import Register from './Components/Register'
import {BrowserRouter,Routes,Route} from 'react-router-dom';


function App() { 

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage/>}/> 
          <Route path='/loginPage' element={<LoginPage/>}/> 
          <Route path='/login' element={<Login/>}/> 
          <Route path='/register' element={<Register/>}/> 
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App