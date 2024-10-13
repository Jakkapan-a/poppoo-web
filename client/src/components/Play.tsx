import React, {useEffect, useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {TopScore, useAuth} from "../context/AuthContext.tsx";
import socket, {SERVER_URL} from "../socket.ts";
import './Play.css';
import CSS from "csstype";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Swal from "sweetalert2";
// background: rgb(238,208,174);
// background: radial-gradient(circle, rgba(238,208,174,1) 0%, rgba(233,189,148,1) 100%);
export default function Play() {
    const navigate = useNavigate();
    const [score, setScore] = useState(0);
    const {isAuth, logout, serverUrl, currentScore, topScore} = useAuth();
    const [isSound, setIsSound] = useState(true);
    const [isValidUsernameClass, setIsValidUsernameClass] = useState(''); // is-valid, is-invalid, ''
    const [validUsername, setValidUsername] = useState(''); // Username is available, Username is not available, ''
    const [user, setUser] = useState({
        id: '',
        name: ''
    });
    const [mooLv, setMooLv] = useState('moo-lv0');

    const [disabledButton, setDisabledButton] = useState(false);
    useEffect(() => {
        fetchScore()
            .then(r => {
                if (r !== null) {
                    console.log('score', r);
                    setScore(r.score);
                } else {
                    // logout();
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

    useEffect(() => {
        // moo-lv0, moo-lv1, moo-lv2
        let rank = topScore.findIndex((item: TopScore) => item.username === user.name);
        // console.log('rank', rank+1);
        if(rank >= 0 && rank <= 2){
            setMooLv(`moo-lv1`);
        }else if(rank > 2 && rank <= 4){
            setMooLv('moo-lv2');
        }else if(rank > 4 && rank <= 6){
            setMooLv('moo-lv3');
        }else{
            setMooLv('moo-lv0');
        }

    }, [topScore]);
    const handleIncrease = () => {
        setScore(score + 1);
        socket.emit('addScore', {score: score + 1, userId: user.id});
    };
    const fetchScore = async () => {
        try {
            const url = SERVER_URL + '/api/pop/score';
            console.log(url);

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
            // logout();
        }
    };
    const [isPressed, setIsPressed] = useState(false);
    const audio = new Audio('/sound/pop3.mp3');

    const [visibleButton, setVisibleButton] = useState('visible');
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

    const handleInputChange = (name: string) => (e: any) => {
        setUser({
            ...user,
            [name]: e.target.value
        });
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

    const model = ()=>{
        return (<>
            <div className="modal fade" id="manageUser" aria-hidden="true"
                 aria-labelledby="manageUserLabel" >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="manageUserLabel">จัดการผู้ใช้</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-12">
                                    <div className="form-group mb-2 ">
                                        <label htmlFor="validationUsername"
                                               className="form-label">ชื่อผู้ใช้</label>
                                        <input type="text" className={`form-control ${isValidUsernameClass}`}
                                               id="validationUsername"
                                               placeholder="ชื่อผู้ใช้" onChange={handleInputChange('name')} value={user.name}/>
                                        <div className="valid-feedback">
                                            {validUsername}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer d-flex justify-content-between">
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <button type="button" className="btn btn-danger sign-out" onClick={handleDeleteAccount}>ลบบัญชี</button>
                            </div>
                            <div>
                                <button type="button" className="btn btn-secondary me-3" data-bs-dismiss="modal">ปิด</button>
                                <button className="btn btn-primary" data-bs-dismiss="modal" disabled={disabledButton} onClick={handleSaveUser}>บันทึก</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>)
    };

    useEffect(() => {
        try {
            if(user.name){
                fetchCheckUsername(user.name, user.id).then(
                    res => {
                        if(res.status === false) {
                            // Username is available element is valid
                            setValidUsername('สามารถใช้ชื่อผู้ใช้นี้ได้');
                            setIsValidUsernameClass('is-valid');
                            setDisabledButton(false);

                        }else{
                            // Username is not available element is invalid
                            setValidUsername('ชื่อผู้ใช้นี้ถูกใช้แล้ว');
                            setIsValidUsernameClass('is-invalid');
                            setDisabledButton(true);
                        }
                    });
            }

        }catch (e){
            console.log(e);
        }

    }, [user.name]);
    const fetchCheckUsername = async (username: string, id: string) => {
        const url = SERVER_URL + '/api/auth/check-username';
        const body = {
            username: username,
            id: id
        }
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        return await res.json();
    };

    const handleSaveUser = async () => {
        if(user.name === ''){
            Swal.fire({
                icon: 'error',
                title: 'กรุณากรอกชื่อผู้ใช้',
                timer: 3000
            });
            return;
        }
        const url = SERVER_URL + '/api/auth/update-username';
        const body = {
            username: user.name,
            id: user.id
        }
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        console.log(data);
        if(res.ok){
            Swal.fire({
                icon: 'success',
                title: 'บันทึกสำเร็จ',
                timer: 3000
            });
            localStorage.setItem('user', JSON.stringify({id: user.id, username: user.name}));
        }
    };

    const handleDeleteAccount = async () => {
        const btn = await Swal.fire({
            title: 'คุณต้องการลบบัญชีหรือไม่',
            showDenyButton: true,
            confirmButtonText: `ลบ`,
            denyButtonText: `ยกเลิก`,
        });

        if (btn.isConfirmed) {
           await deleteAccount();
        }
    };

    const deleteAccount = async () => {
        const url = SERVER_URL + '/api/auth/delete-account';
        const body = {
            id: user.id
        }
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        console.log(data);
        if(res.ok){
            Swal.fire({
                icon: 'success',
                title: 'ลบบัญชีสำเร็จ',
                timer: 3000
            });
            logout();
            navigate('/');
        }
    };
    return (
        <div className="container poppoo"
             onKeyDown={handleKey}
             onKeyUp={handleKey}
        >
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <h1>POP POO</h1>
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
            <div className="d-flex justify-content-xl-center justify-content-start">
                <h1 className="pop-score">{score}</h1>
            </div>

                <div
                    className={`poppoo-container ${isPressed ? 'clicked' : ''} ${mooLv} `}
                    // onMouseDown={handleMouseDown}  // เมื่อกดปุ่ม
                    // onMouseUp={handleMouseUp}      // เมื่อปล่อยปุ่ม
                    onTouchStart={handleMouseDown} // เมื่อแตะปุ่มบนมือถือ
                    onTouchEnd={handleMouseUp}     // เมื่อปล่อยปุ่มบนมือถือ
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
                <a className="btn btn-primary" data-bs-toggle="modal" href="#manageUser" role="button">
                    <i className="bi bi-person-fill"/> จัดการผู้ใช้
                </a>
                {model()}
            </div>
            );
            }