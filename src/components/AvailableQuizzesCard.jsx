import React from 'react'
import '../App.css'
import { NavLink } from 'react-router-dom'
import Button from './Button'

export default function AvailableQuizzesCard({quiz, role, onClick}) {
  return role === "mentor" 
  ? (
    <div className="border bg-indigo-200 border-gray-300 p-4 rounded-lg w-52 shadow-md 
                    hover:shadow-lg transition duration-300">
        <h3 className="text-lg font-semibold text-gray-900">{quiz.quizTitle}</h3>
        <h3 className="text-lg font-semibold text-gray-900">Score: {quiz.totalScore}</h3>
        <p className="text-sm text-gray-600 mt-2">ID: {quiz.quizId}</p>
        <Button label={"View"} navigateTo={`${quiz.quizId}`} />
        <Button label={"Edit"} navigateTo={`/mentor/view-quiz/edit/${quiz.quizId}`} />
        <Button label={"Delete"} onClick={onClick} />
    </div>
  )
  :(
    <div className="border bg-indigo-200 border-gray-300 p-4 rounded-lg w-52 shadow-md 
                    hover:shadow-lg transition duration-300 cursor-pointer">
        <h3 className="text-lg font-semibold text-gray-900">{quiz.quizTitle}</h3>
        <p className="text-sm text-gray-600 mt-2">ID: {quiz.quizId}</p>
    </div>
  )
}
