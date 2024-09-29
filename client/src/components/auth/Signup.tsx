import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.tsx";

export default function Signup() {
    const navigate = useNavigate();
    const { isAuth, login, serverUrl  } = useAuth();
    const [userState, setUserState] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [isValidUsernameClass, setIsValidUsernameClass] = useState(''); // is-valid, is-invalid, ''
    const [validUsername, setValidUsername] = useState(''); // Username is available, Username is not available, ''

    const [isValidPasswordClass, setIsValidPasswordClass] = useState(''); // is-valid, is-invalid, ''
    const [validPassword, setValidPassword] = useState(''); // Password is valid, Password is invalid, ''

    const handleInputChange = (name: string) => (e: any) => {
        setUserState({
            ...userState,
            [name]: e.target.value
        });
    };
    useEffect(() => {
        if (isAuth) {
            navigate('/');
        }
    }, [isAuth]);

    useEffect(() => {
        if(userState.username){
            console.log("username", userState.username);
            fetchCheckUsername(userState.username).then(
                res => {
                    if(res.status === false) {
                        // Username is available element is valid
                        setValidUsername('สามารถใช้ชื่อผู้ใช้นี้ได้');
                        setIsValidUsernameClass('is-valid');

                    }else{
                        // Username is not available element is invalid
                        setValidUsername('ชื่อผู้ใช้นี้ถูกใช้แล้ว');
                        setIsValidUsernameClass('is-invalid');
                    }
                }
            )
        }else{
            setValidUsername('');
            setIsValidUsernameClass('');
        }
    }, [userState.username]);

    const fetchCheckUsername = async (username: string) => {
        const url = serverUrl + '/api/auth/check-username/' + username;
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return await res.json();
    };

    const handleSignUp = async () => {
        const {username, password, confirmPassword} = userState;
        const body = {
            username,
            password,
            confirmPassword
        };
        // validate
        if(!username || !password || !confirmPassword){
            console.error("All fields are required");
            if(!username){
                setIsValidUsernameClass('is-invalid');
                setValidUsername('ชื่อผู้ใช้จำเป็นต้องใส่');
            } // Username is required
            if(!password){
                setIsValidPasswordClass('is-invalid');
                setValidPassword('รหัสผ่านจำเป็นต้องใส่');
            } // Password is required
            if(!confirmPassword){
                setIsValidPasswordClass('is-invalid');
                setValidPassword('ยืนยันรหัสผ่านจำเป็นต้องใส่');
            } // Confirm Password is required
            return;
        }

        if (password !== confirmPassword) {
            setValidPassword('รหัสผ่านไม่ตรงกัน');
            setIsValidPasswordClass('is-invalid');
        }

        const data = await fetchSignUp(body);
        const {token,user} = data;
        if(token !== undefined){
            login(token,user);
            navigate('/', {replace: true, state: {from: '/signup'}});
        }
    };

    const fetchSignUp = async (body: any) => {
        const url = serverUrl + '/api/auth/signup';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        return await response.json();
    }

    return (
        <>
            <section className="py-3 py-md-5 py-xl-8 d-flex justify-content-center align-items-center mt-5">
                <div className="container">
                    <div className="row justify-content-center align-items-center">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div className="card card-lg">
                                <div className="card-body">
                                    <div className="text-center">
                                        <h1 className="display-5 mb-2">สมัครสมาชิก</h1>
                                        <p className="text-muted">----------</p>
                                    </div>
                                    <form className="needs-validation ">
                                        <div className="form-group mb-2 ">
                                            <label htmlFor="validationUsername"
                                                   className="form-label">ชื่อผู้ใช้</label>
                                            <input type="text" className={`form-control ${isValidUsernameClass}`} id="validationUsername"
                                                   placeholder="ชื่อผู้ใช้" onChange={handleInputChange('username')} />
                                                <div className="valid-feedback">
                                                    {validUsername}
                                                </div>


                                        </div>
                                        <div className="form-group mb-2">
                                            <label htmlFor="validationPassword"
                                                   className="form-label">รหัสผ่าน</label>
                                            <input type="password" className={`form-control ${isValidPasswordClass}`}
                                                   id="validationPassword" placeholder="รหัสผ่าน" onChange={handleInputChange('password')} autoComplete="new-password"/>
                                            <div className="valid-feedback">
                                                {validPassword}
                                            </div>
                                        </div>
                                        <div className="form-group mb-2">
                                        <label htmlFor="validationConfirmPassword"
                                                   className="form-label">ยืนยันรหัสผ่าน</label>
                                            <input type="password" className={`form-control ${isValidPasswordClass}`}
                                                   id="validationConfirmPassword" placeholder="ยืนยันรหัสผ่าน" onChange={handleInputChange('confirmPassword')} autoComplete="new-password"/>
                                            <div className="valid-feedback">
                                                {validPassword}
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center mt-3">
                                            <p></p>
                                            <Link className="nav-link " to="/signin"> มีบัญชีใช่หรือไม่? <span
                                                className="text-primary">เข้าสู่ระบบ</span></Link>
                                        </div>
                                        <div>
                                            <button type="button" onClick={handleSignUp}
                                                    className="btn btn-primary mt-3"> สมัครสมาชิก
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );

}
