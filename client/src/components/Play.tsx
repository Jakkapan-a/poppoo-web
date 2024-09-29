import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";

export default function Play() {
    const navigate = useNavigate();
    const [score, setScore] = useState(0);

    useEffect(() => {
        return () => {
            console.log('out of play');
        };
    }, []);
    return (
        <div className="container">
            <h1>Play</h1>
            <h2>Score: {score}</h2>
            <button onClick={() => setScore(score + 1)}>Increase</button>
            <button onClick={() => navigate('/')}>Back</button>
        </div>
    );
}