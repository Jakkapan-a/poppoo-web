import {Link, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {isUserLoggedIn} from "../utils/helper.ts";


export default function SignIn() {
    const navigate = useNavigate();

    useEffect(() => {
        if(isUserLoggedIn()){
            // Link to signin page
            navigate('/');
        }
        return () => {

        }
    }, []);
    return (
      <>
          <section className="py-3 py-md-5 py-xl-8 d-flex justify-content-center align-items-center mt-5">
              <div className="container">
                    <div className="row justify-content-center align-items-center">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div className="card card-lg">
                                <div className="card-body">
                                    <div className="text-center">
                                        <h1 className="display-4 mb-2">Sign in</h1>
                                        <p className="text-muted">Sign in to your account to continue</p>
                                    </div>
                                    <form>
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input type="email" className="form-control" placeholder="Email"/>
                                        </div>
                                        <div className="form-group">
                                            <label>Password</label>
                                            <input type="password" className="form-control" placeholder="Password"/>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center mt-2">

                                            <a className={"text-muted"} href="#">Forgot password?</a>
                                            <Link className="nav-link " to="/signup"> Don't have an account? <span className="text-primary">Sign up</span> </Link>
                                        </div>
                                        <div>
                                            <button type="button" className="btn btn-primary mt-3">Sign in</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
              </div>
          </section>
      </>
    )
}