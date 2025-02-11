import React from 'react'
import Button from '../components/Button'

export default function Landing() {
  return (
    <>
        <Button label="User" navigateTo={"user"}/>
        <Button label="Mentor" navigateTo={"mentor"}/>
    </>
  )
}
