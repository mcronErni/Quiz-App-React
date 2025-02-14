import {React, useState, useRef, useEffect} from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import Button from '../components/Button'

export default function UserDashboard() {
  return (
    <>
      <h1 className="text-center">body of user dashboard</h1> 
      <ul>
        <li>list all the taken quiz by the user</li>
        <li>include score</li>
      </ul>
    </>
  )
}
