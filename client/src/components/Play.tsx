import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext.tsx";
import socket from "../socket.ts";
import './Play.css';

export default function Play() {
    const navigate = useNavigate();
    const [score, setScore] = useState(0);
    const {isAuth, logout, serverUrl, currentScore} = useAuth();
    const [user, setUser] = useState({
        id: '',
        name: ''
    });
    useEffect(() => {
        fetchScore()
            .then(r => {
                if (r !== null) {
                    console.log('score', r.score);
                    setScore(r.score);
                } else {
                    logout();
                    navigate('/');
                }
            });

        const user = localStorage.getItem('user');
        if (user !== null) {
            const userObj = JSON.parse(user);
            setUser(userObj);
        }
        // console.log('user', user);
        return () => {
            // console.log('out of play');
        };
    }, []);

    useEffect(() => {
        if (!isAuth) {
            // navigate('/signin');
        }
    }, [isAuth]);
    useEffect(() => {
        if (currentScore !== null) {
            setScore(currentScore);
        }
    }, [currentScore]);

    const handleIncrease = () => {
        setScore(score + 1);
        socket.emit('addScore', {score: score + 1, userId: user.id});
    };
    const fetchScore = async () => {
        try {
            const url = serverUrl + '/api/pop/score';
            const token = localStorage.getItem('app_token');
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                }
            });
            if (res.ok) {
                return await res.json();
            }
            return null;
        } catch (error) {
            logout();
        }
    };


    return (
        <div className="container">
            <h1>Play</h1>
            <h2>Score: {score}</h2>
            <button onClick={handleIncrease}>Increase</button>
            <button onClick={() => navigate('/')}>Back</button>
        </div>
    );
}