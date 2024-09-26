// import React from 'react';

import {NavLink} from "react-router-dom";



export default (props: any) => {
    console.log(props);
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/One">One</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/Two">Two</NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}
;