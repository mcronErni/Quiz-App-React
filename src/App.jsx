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
import IndividualQuiz from './pages/IndividualQuiz'
import CreateQuiz from './pages/CreateQuiz'
import UserLayout from './layouts/UserLayout'
import MentorLayout from './layouts/MentorLayout'
import ViewCreatedQuizzes from './pages/ViewCreatedQuizzes'

function App() {

  function handleClick(){
    console.log("hello")
  }

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Landing/>} />

      <Route path='user' element={<UserLayout/> }>
        <Route index element={<UserDashboard/>} />
        <Route path='available-quizzes' element={<AvailableQuizzes/>} />
        <Route path='available-quizzes/:id' element={<IndividualQuiz/>} />
      </Route>

      <Route path='mentor' element={<MentorLayout/>}>
        <Route index element={<MentorDashboard/>} />
        <Route path='create-quiz' element={<CreateQuiz/>} />
        <Route path='view-quiz' element={<ViewCreatedQuizzes/>} />
      </Route>
      <Route path='about' element={<p>this is about page</p>} />
      <Route path='*' element={<p>No</p>} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
