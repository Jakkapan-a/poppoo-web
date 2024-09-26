import './App.css'
import { Route, Routes,useNavigate} from 'react-router-dom'
// import { useState } from 'react'
import One from './components/One'
import Two from './components/Two'
import Home from './components/Home'
import 'bootstrap/dist/js/bootstrap.bundle.min'
import 'bootstrap/dist/css/bootstrap.min.css'
import {useEffect, useState} from "react";
import {isUserLoggedIn} from "./components/utils/helper.ts";
import SignIn from "./components/auth/SignIn.tsx";
import Signup from "./components/auth/Signup.tsx";
import Navber from "./components/layouts/Navber.tsx";

const App = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        setIsSignedIn(isUserLoggedIn());
        if(!isUserLoggedIn()){
            // Link to signin page
            navigate('/signin');
            console.log("not signed in");
        }
        return () => {
            // setIsSignedIn(false);
        }
    }, []);

    return (
        <>
        <div>
            {!isSignedIn ? <></>: <>
                <Navber/>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/one" element={<One/>}/>
                    <Route path="/two" element={<Two/>}/>
                </Routes>
            </>}
            <Routes>
                <Route path="/signin" element={<SignIn/>}/>
                <Route path="/signup" element={<Signup/>}/>
            </Routes>
        </div>
        </>
    )
}


export default App