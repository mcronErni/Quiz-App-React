import {React, useState, useRef, useEffect} from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import Button from '../components/Button'

export default function UserDashboard() {
  return (
    <>
        <Button label="Take Quiz" navigateTo="available-quizzes"/>
        <Button label="Logout" navigateTo="/"/>
        <Outlet/>
    </>
  )
}
