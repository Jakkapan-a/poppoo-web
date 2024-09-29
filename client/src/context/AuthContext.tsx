import React, {createContext, useContext, useEffect, useState} from 'react';
import {getAccessToken, setAccessToken} from "../components/utils/helper.ts";


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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuth, setIsAuth] = useState(false);
    const serverUrl = 'http://localhost:3000';

    const login = (token: string, user:UserContext) => {
        setAccessToken(token);
        localStorage.setItem('user', JSON.stringify(user));
        setIsAuth(true);
        // console.log('login with token:', token);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuth(false);
    };

    useEffect(() => {
        init();
    }, []);
    useEffect(() => {
        console.log('isAuth', isAuth);
    }, [isAuth]);
    const init = ()=>{
        const token = localStorage.getItem('app_token');
        console.log('Token', token);

        if (token) {
            setIsAuth(true);
        }
        console.log('isAuth', isAuth);
    }

    return (
        <AuthContext.Provider value={{ isAuth, serverUrl: serverUrl, login, logout }}>
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