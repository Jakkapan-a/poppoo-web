import {useEffect, useRef, useState} from 'react'
import {useNavigate} from "react-router-dom";
import Swal from "sweetalert2";

const rooms = [
    {
        id: 1,
        name: 'Room 1'
    },
    {
        id: 2,
        name: 'Room 2'
    },
    {
        id: 3,
        name: 'Room 3'
    },
    {
        id: 4,
        name: 'Room 4'
    },
    {
        id: 5,
        name: 'Room 5'
    },
    {
        id: 6,
        name: 'Room 6'
    },
    {
        id: 7,
        name: 'Room 7'
    },
    {
        id: 8,
        name: 'Room 8'
    },
    {
        id: 9,
        name: 'Room 9'
    },
    {
        id: 10,
        name: 'Room 10'
    }
];
export default function Rooms() {
    const [name, setName] = useState('');
    const navigate = useNavigate();
    const prevName = useRef(name);
    useEffect(() => {
        const init = () => {
            const _name = localStorage.getItem('name');
            prevName.current = _name || '';
            setName(_name || '');
        };
        init();

        return () => {
            // cleanup
            console.log('out of rooms');
        };
    }, []);

    useEffect(() => {
        if ((prevName.current === '' && name === '') || (prevName.current === null && name === null)) {
            navigate('/');
        }
        prevName.current = name; //
    }, [name]); //
    const logout = async () => {
        const btn = await  Swal.fire({
            title: 'คุณต้องการออกจากระบบใช่หรือไม่?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'ใช่',
            cancelButtonText: 'ไม่'
        });
        if (btn.isConfirmed) {
            localStorage.removeItem('name');
            navigate('/');
        }
    }


    return (
        <>
            <div>
                <div className={"container pt-5"}>

                    <div className="row">
                        <div className="col-md-12">
                            <div className="alert alert-primary" role="alert">
                                ยินดีต้อนรับคุณ <strong> {name} </strong> สู่เกมส์ Sake Game
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12 d-flex justify-content-between align-items-center  h-100">
                            <div>
                                <h1>เลือกห้อง</h1>
                            </div>
                            <div className="">
                                <button className="btn btn-primary me-2">สร้างห้อง</button>
                                <button className="btn btn-warning me-2" onClick={logout} >ออกจากระบบ</button>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {
                            rooms.map((room, index) => {
                                return (
                                    <div key={index} className="col-md-4 mt-3">
                                        <div className="card">
                                            <div className="card-body">
                                                <h5 className="card-title">{room.name}</h5>
                                                <p className="card-text">{room.name}</p>
                                                <a href="#" className="btn btn-primary">Join</a>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    {/* pagination */}
                    <div className="row">
                        <div className="col-md-12 d-flex justify-content-center align-items-center mt-5">
                            <nav aria-label="Page navigation example">
                                <ul className="pagination">
                                    <li className="page-item"><a className="page-link" href="#">Previous</a></li>
                                    <li className="page-item"><a className="page-link" href="#">1</a></li>
                                    <li className="page-item"><a className="page-link" href="#">2</a></li>
                                    <li className="page-item"><a className="page-link" href="#">3</a></li>
                                    <li className="page-item"><a className="page-link" href="#">Next</a></li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
