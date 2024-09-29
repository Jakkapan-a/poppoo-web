import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useAuth} from "../../context/AuthContext.tsx";
import {Link, NavLink} from "react-router-dom";

export default function Navbar() {
    const {isAuth, login, logout} = useAuth();
    const handleLogout = () => {
        logout();
    };

    const handleLogin = () => {
        // login('token');
    };
    const showAuthMenu = () => {
        if (isAuth) {
            return (
                <>
                    <a className="nav-link" href="#" onClick={handleLogout}>ออกจากระบบ</a>
                </>
            );
        }
        return (
            <>
                <Link className="nav-link"  to="/signin">เข้าสู่ระบบ</Link>
            </>
        );
    };
    return (
        <>

            <nav className="navbar navbar-expand-lg navbar-light navbar-dark bg-primary">
                <div className="container">
                    <NavLink to="/" className="navbar-brand">Moo deng</NavLink>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse " id="navbarNav">
                        <ul className="navbar-nav me-auto text-center">
                            <li className="nav-item">
                                <NavLink to="/" className="nav-link" aria-activedescendant="active" aria-current="page">หน้าหลัก</NavLink>
                            </li>

                            {isAuth ? (
                                <li className="nav-item">
                                    <NavLink to="/play" className="nav-link" aria-activedescendant="active">เล่นเกมส์</NavLink>
                                </li>
                            ) : ''}
                        </ul>
                        <div className="navbar-text text-center">
                            {showAuthMenu()}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}