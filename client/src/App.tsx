import './App.css'
import {Route, Routes} from 'react-router-dom'
// import { useState } from 'react'
import Rooms from './components/Rooms.tsx'
import Home from './components/Home'
import 'bootstrap/dist/js/bootstrap.bundle.min'
import 'bootstrap/dist/css/bootstrap.min.css'
import React, {useEffect, useState} from 'react'
import socket from "./socket.ts";
import Navbar from "./components/layouts/Navbar.tsx";
import SignIn from "./components/auth/SignIn.tsx";
import Signup from "./components/auth/Signup.tsx";
import {getAccessToken} from "./components/utils/helper.ts";
import Play from "./components/Play.tsx";

const App = () => {
    const [socketId, setSocketId] = useState('');
    socket.on('connect', () => {
        const _socketId = socket.id || '';
        setSocketId(_socketId);

        const token = getAccessToken() || '';

        socket.emit('identify', {socketId: _socketId, token});
    });
    useEffect(() => {
        return () => {
        };
    }, []);

    return (
        <>
            <Navbar/>
            <div>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/signin" element={<SignIn />}/>
                    <Route path="/signup" element={<Signup />}/>
                    <Route path="/play" element={<Play/>}/>
                </Routes>
            </div>
        </>
    )
}


export default App