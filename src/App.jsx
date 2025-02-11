import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Button from './components/Button'
import { NavLink, BrowserRouter, Routes, Route } from 'react-router-dom'
import UserDashboard from './pages/UserDashboard'
import MentorDashboard from './pages/MentorDashboard'
import Landing from './pages/Landing'
import AvailableQuizzes from './pages/AvailableQuizzes'

function App() {

  function handleClick(){
    console.log("hello")
  }

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Landing/>} />
      <Route path='user' element={<UserDashboard/> } >
        <Route index path='available-quizzes' element={<AvailableQuizzes/>} />
      </Route>
      <Route path='mentor' element={<MentorDashboard/>} />
      <Route path='about' element={<p>this is about page</p>} />
      <Route path='*' element={<p>No</p>} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
