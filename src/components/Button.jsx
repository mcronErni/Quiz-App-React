import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Button({label, navigateTo, onClick}) {
  return (
    navigateTo ?
    (<NavLink to={navigateTo}>
      <button
        type="button"
        className={`px-4 py-2 font-medium rounded-lg shadow-md transition duration-300 
                    focus:outline-none focus:ring-2 cursor-pointer bg-blue-300 m-0.5 text-black w-full `}
      >
        {label}
      </button>
    </NavLink>) :

    (
      <button
        type="button"
        onClick={onClick}
        className={`px-4 py-2 font-medium rounded-lg shadow-md transition duration-300 
                    focus:outline-none focus:ring-2 cursor-pointer bg-blue-300 m-0.5 text-black w-full `}
      >
        {label}
      </button>)
  )
}
