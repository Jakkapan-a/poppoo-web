import {Link, useNavigate} from "react-router-dom";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {useEffect, useState} from "react";
import getUrls from "./utils/config.ts";
import socket from "../socket.ts";
import {useAuth} from "../context/AuthContext.tsx";

const initialScore = [
    { name: "User 1", score: 100 },
    { name: "User 2", score: 200 },
    { name: "User 3", score: 300 },
    { name: "User 4", score: 400 },
    { name: "User 5", score: 500 },
    { name: "User 6", score: 600 },
    { name: "User 7", score: 700 },
    { name: "User 8", score: 800 },
    { name: "User 9", score: 900 },
    { name: "User 10", score: 1000 }
];

export default function Home() {
    const [name, setName] = useState('');
    const [socketId, setSocketId] = useState('');
    const [scores, setScores] = useState(initialScore);
    const navigate = useNavigate();
    const {isAuth, serverUrl} = useAuth();
    useEffect(() => {
        // const interval = setInterval(() => {
        //     setScores(prevScores =>
        //         prevScores.map(item => ({
        //             ...item,
        //             score: Math.floor(Math.random() * 1000) // Update score randomly
        //         }))
        //     );
        // }, 100);

        return () => {
            // clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        if (name.trim() !== '') {
            setLocalStorage().then(r => console.log('setLocalStorage', r));
        }
    }, [name, socketId]);

    const showSwal = () => {
        withReactContent(Swal).fire({
            title: <i>ใส่ชื่อเล่นของคุณ</i>,
            input: 'text',
            inputValue: '',
            preConfirm: () => {
                const inputName = Swal.getInput()?.value || '';
                if (inputName.trim() !== '') {
                    setName(inputName);
                }
            },
        });
    }

    const setLocalStorage = async () => {
        await fetchJoin();
        localStorage.setItem('name', name);
        if (name.trim() !== '') {
            navigate('/rooms');
        }
    }

    const fetchJoin = async () => {
        const body = JSON.stringify({
            username: name,
            socketId: socketId
        });
        const res = await fetch(getUrls()[0].ApiUrl + '/api/auth/join', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: body,
        });

        const data = await res.json();
        console.log('data', data);
    }

    const coreTable = () => {
        return scores.map((item, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.score}</td>
                    <td className="text-center">
                        <button className={"btn btn-primary"}>เล่นอีกครั้ง</button>
                    </td>
                </tr>
            )
        });
    }

    return (
        <>
            <div className="container d-flex justify-content-center align-items-center pt-5">
                <div className="card text-center w-100">
                    <div className="card-body text-center m-0">
                        <h5 className="card-title">Sake Game</h5>
                        <p className="card-text">ยินดีต้อนรับเข้าสู่เกมส์ Sake Game</p>
                        {
                            isAuth ? (
                                <Link to="/play" className={"btn btn-primary"}>เริ่มเกมส์</Link>
                            ) : (
                                <Link to="/signin" className={"btn btn-primary"}>เข้าสู่ระบบ</Link>
                            )
                        }
                    </div>
                </div>
            </div>

            <div className="container pt-5">
                <div className="row">
                    <div className="col-md-12">
                        <div className="alert alert-primary" role="alert">
                            คะแนนสูงสุด
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <table className="table table-hover">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>ชื่อ</th>
                                <th>คะแนน</th>
                                <th className="text-center" style={{width: '200px'}}>เล่นอีกครั้ง</th>
                            </tr>
                            </thead>
                            <tbody>
                            {coreTable()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}
