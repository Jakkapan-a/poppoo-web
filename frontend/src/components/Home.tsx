import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import socket from "../socket.ts";
import {TopScore, useAuth} from "../context/AuthContext.tsx";

const initialScore = [
    { name: "User 1", score: 100, status: 'online' },
    { name: "User 2", score: 200, status: 'online' },
    { name: "User 3", score: 300, status: 'online' },
    { name: "User 4", score: 400, status: 'online' },
    { name: "User 5", score: 500, status: 'online' },
    { name: "User 6", score: 600, status: 'online' },
    { name: "User 7", score: 700, status: 'online' },
    { name: "User 8", score: 800, status: 'online' },
    { name: "User 9", score: 900, status: 'online' },
    { name: "User 10", score: 1000, status: 'online' },
];

export default function Home() {
    const [name, setName] = useState('');
    const [socketId, setSocketId] = useState('');
    const [scores, setScores] = useState(initialScore);
    const navigate = useNavigate();
    const {isAuth, serverUrl,topScore,setTopScore} = useAuth();
    useEffect(() => {

        const user = localStorage.getItem('user');
        if(user !== null){
            const userObj = JSON.parse(user);
            setName(userObj.username);
        }
    }, []);

    socket.on('topScoresA', (data) => {
        console.log('data', data);
    });
    socket.on('getTopScores', (data) => {
        if(data) {
            setTimeout(async () => {
                const fetchData = async () => {
                    try {
                        const res = await fetchTopScore();
                        if(res === null){
                            return;
                        }
                        handleTopScore(res);

                    } catch (error) {
                        console.error(error);
                    }
                };
                await fetchData();
            }, 1000);
        }
    });
    const handleTopScore = (data: TopScore[]) => {
        setTopScore(data.map((item, index) => ({
            ...item,
            no: index + 1
        })));
    };

    const fetchTopScore = async () => {
        const url = serverUrl + '/api/top-score';
        const token = localStorage.getItem('app_token');
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (res.ok) {
            const contentType = res.headers.get('content-type');

            if (contentType && contentType.includes('application/json')) {
                try {
                     // Directly use .json() instead of .text() if the content is JSON
                    return await res.json();
                } catch (err) {
                    console.error('Error parsing JSON:', err);
                    console.log('Response body:', await res.text());
                    return null;
                }
            } else {
                console.error('Expected JSON, but received:', contentType);
                const errorText = await res.text(); // Log the HTML or error
                console.error('Response body:', errorText);
                return null;
            }
        } else {
            console.error('Request failed with status:', res.status);
            const errorText = await res.text(); // Log the error response
            console.error('Error response body:', errorText);
            return null;
        }
    };
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('th-TH', { //
            year: 'numeric',
            month: 'long', // ใช้ '2-digit' สำหรับเดือนเป็นตัวเลข
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };
    const coreTable = () => {
        return topScore.map((item, index) => {
            return (
                <tr key={index}>
                    <td>{item.rank}</td>
                    <td>{item.username}</td>
                    <td>
                        <div className="badge bg-primary">
                            {item.score}
                        </div>
                    </td>
                    <td className="text-center">
                        <div className={`badge bg-${item.status === 'online' ? 'success' : 'danger'}`}>
                            {item.status}
                        </div>
                    </td>
                    <td className="text-center">
                        {formatDate(item.updatedAt)}
                    </td>
                </tr>
            )
        });
    }

    return (
        <>
            <div className="container d-flex justify-content-center align-items-center mt-4">
                <div className="card text-center w-100 p-3">
                    <div className="card-body text-center m-0">
                        <h5 className="card-title">POP POO</h5>
                        <p className="card-text">ยินดีต้อนรับ {name}</p>
                        {
                            isAuth ? (
                                <Link to="/play" className={"btn btn-warning"}>เริ่มเกมส์</Link>
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
                                <th className="text-center">สถานะ</th>
                                <th className="text-center" style={{width: '350px'}}>อัพเดทล่าสุด</th>
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
