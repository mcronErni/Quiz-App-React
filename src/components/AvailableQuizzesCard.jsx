import React from 'react'
import '../App.css'
import { NavLink } from 'react-router-dom'

export default function AvailableQuizzesCard({quiz}) {
  return (
    <div className="border border-gray-300 p-4 rounded-lg w-52 shadow-md 
                    hover:shadow-lg transition duration-300 cursor-pointer">
        <h3 className="text-lg font-semibold text-gray-900">{quiz.quizTitle}</h3>
        <p className="text-sm text-gray-600 mt-2">ID: {quiz.quizId}</p>
    </div>
  )
}
