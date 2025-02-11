import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Button({label, navigateTo}) {
  return (
    <NavLink to={navigateTo}>
        <button type="button">
            {label}
        </button>
    </NavLink>
  )
}
