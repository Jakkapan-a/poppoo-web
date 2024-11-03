import React, {createContext, useContext, useEffect, useState} from 'react';
import {getAccessToken, setAccessToken} from "../components/utils/helper.ts";
import socket, {SERVER_URL} from "../socket.ts";
// import {useNavigate} from "react-router-dom";


interface UserContext
{
    username: string;
    id: number;
}
interface AuthContextType {
    isAuth: boolean;
    login: (token: string, user:UserContext) => void;
    logout: () => void;
    serverUrl: string;
    topScore: TopScore[];
    currentScore: number;
    setTopScore: (data:TopScore[]) => void;
}

export interface TopScore {
    rank: number,
    no: number,
    username: string,
    score: number,
    status:string,
    updatedAt: string
}


interface updateScore {
    id: number,
    score: number,
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuth, setIsAuth] = useState(false);
    const [serverUrl, setServerUrl] = useState("");
    const [topScore,setTopScore] = useState([] as TopScore[]);
    const [currentScore,setCurrentScore] = useState(0);

    const login = (token: string, user:UserContext) => {
        setAccessToken(token);
        localStorage.setItem('user', JSON.stringify(user));
        setIsAuth(true);
    };
    const logout = () => {
        localStorage.removeItem('app_token');
        localStorage.removeItem('user');
        setIsAuth(false);
        window.location.href = '/';
    };

    socket.on('connect', () => {


    });

    useEffect(() => {
        init();

        socket.connect();
        const _socketId = socket.id || '';
        const token = getAccessToken() || '';
        console.log("socket connected :", _socketId);

        socket.emit('identify', {socketId: _socketId, token});
        const handleTopScore = (data: TopScore[]) => {
            setTopScore(data.map((item, index) => ({
                ...item,
                no: index + 1
            })));
        };
        socket.on('topScore', handleTopScore);
        socket.on('updateScore', (data:updateScore) => {
            setCurrentScore(data.score);
        });


        const host = window.location.host;
        setServerUrl(SERVER_URL);
        console.log('host', SERVER_URL);
        return () => {
            socket.disconnect();
        }
    }, []);

    const init = ()=>{
        const token = localStorage.getItem('app_token');
        if (token) {
            setIsAuth(true);
        }else{
            setIsAuth(false);
        }
    }

    return (
        <AuthContext.Provider value={{ isAuth, serverUrl,topScore, currentScore,setTopScore, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
export default AuthContext;