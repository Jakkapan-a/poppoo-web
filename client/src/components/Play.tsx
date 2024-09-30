import React, {useEffect, useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {TopScore, useAuth} from "../context/AuthContext.tsx";
import socket from "../socket.ts";
import './Play.css';
import CSS from "csstype";
import 'bootstrap-icons/font/bootstrap-icons.css';
// background: rgb(238,208,174);
// background: radial-gradient(circle, rgba(238,208,174,1) 0%, rgba(233,189,148,1) 100%);
export default function Play() {
    const navigate = useNavigate();
    const [score, setScore] = useState(0);
    const {isAuth, logout, serverUrl, currentScore, topScore} = useAuth();
    const [isSound, setIsSound] = useState(true);

    const [user, setUser] = useState({
        id: '',
        name: ''
    });

    useEffect(() => {
        fetchScore()
            .then(r => {
                if (r !== null) {
                    // console.log('score', r.score);
                    setScore(r.score);
                } else {
                    logout();
                    navigate('/');
                }
            });

        const user = localStorage.getItem('user');
        if (user !== null) {
            const userObj = JSON.parse(user);
            setUser({
                id: userObj.id,
                name: userObj.username
            });
        }

        // body element
        const body = document.querySelector('body');
        if (body) {
            body.style.background = 'radial-gradient(circle, rgba(238,208,174,1) 0%, rgba(233,189,148,1) 100%)';
        }

        const signOutBtn = document.querySelector('.sign-out');
        signOutBtn?.classList.add('d-none');
        return () => {
            if (body) {
                body.style.background = '';
            }
            signOutBtn?.classList.remove('d-none');
            console.log('remove d-none');
        };
    }, []);

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
    const [isPressed, setIsPressed] = useState(false);
    const audio = new Audio('/sound/pop3.mp3');

    useEffect(() => {
        if (isPressed) {
            handleIncrease();
            // /sound/pop2.mp3
            if (isSound) {
                audio.play().then(() => {
                    // console.log('played');
                }).catch((e) => {
                    console.error(e);
                });
            }
        }
    }, [isPressed]);
    const handleMouseDown = () => {
        setIsPressed(true);  //
    };

    const handleMouseUp = () => {
        setIsPressed(false); //
    };

    const handleKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.code === 'Space') {
            if (event.type === 'keydown') {
                setIsPressed(true); //
            } else if (event.type === 'keyup') {
                setIsPressed(false); //
            }
        }
    };

    const handleCheckSound = () => {
        setIsSound(!isSound);
    };

    const popScore = () => {
        try{
        return topScore.map((item: TopScore) => (<>
            <li className="list-group-item d-flex justify-content-between align-items-center">
                # {item.rank} =
                {item.username}
                <span className="badge bg-primary rounded-pill ms-5">{item.score}</span>
            </li>
        </>));

        }catch (e){
            console.log(e);
        }
    };
    return (
        <div className="container poppoo"
             onKeyDown={handleKey}
             onKeyUp={handleKey}
        >
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <h1>POP POO : {score}</h1>
                    <p className="">
                        คุณ :
                        {user.name}
                    </p>
                </div>
                <div>
                    <Link to='/' className="btn btn-primary">
                        <i className="bi bi-house-door-fill"/> กลับหน้าหลัก</Link>
                </div>
            </div>


            <div
                className={`poppoo-container ${isPressed ? 'clicked' : ''}`}
                onMouseDown={handleMouseDown}  // เมื่อกดปุ่ม
                onMouseUp={handleMouseUp}      // เมื่อปล่อยปุ่ม
                tabIndex={10}
            />

            <div className={`popoo-score`}>
                <ul className="list-group">
                    {popScore()}
                </ul>
            </div>
            <div className={`popoo-play-sound`} style={{cursor: 'pointer'}} onClick={handleCheckSound}>
                {isSound ? <>
                    <i className="bi bi-volume-up-fill" style={{fontSize: '4rem'}}/>
                </> : <>
                    <i className="bi bi-volume-mute-fill" style={{fontSize: '4rem'}}/>
                </>}
            </div>
        </div>
    );
}