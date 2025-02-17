import {React, useState, useRef, useEffect} from 'react'
import { BrowserRouter, Routes, Route, Outlet, NavLink, useNavigate } from "react-router-dom";
import Button from '../components/Button'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import Logout from '../components/Logout';

export default function MentorLayout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const handleLogout = () => {
        dispatch(logout());
        navigate("/")
    }
return (
    <div className="w-screen h-screen">
        <header className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
                <h1 className="text-xl font-semibold">Mentor Dashboard</h1>
                <nav className="flex gap-4">
                <Button label={"Create Quiz"} navigateTo={"create-quiz"} />
                <Button label={"View Quizzes"} navigateTo={"view-quiz"} />
                {/* <Button label={"Logout"} onClick={handleLogout} /> */}
                <Logout/>
                </nav>
        </header>
        <main className="p-6">
            <Outlet />
        </main>
    </div>
    )
}
