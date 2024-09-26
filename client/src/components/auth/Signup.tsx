import {Link} from "react-router-dom";

export default function  Signup() {
        return (
            <>
                <section className="py-3 py-md-5 py-xl-8 d-flex justify-content-center align-items-center mt-5">
                    <div className="container">
                        <div className="row justify-content-center align-items-center">
                            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                                <div className="card card-lg">
                                    <div className="card-body">
                                        <div className="text-center">
                                            <h1 className="display-4 mb-2">Sign Up</h1>
                                            <p className="text-muted">Sign up to your account to continue</p>
                                        </div>
                                        <form>
                                            <div className="form-group mb-2">
                                                <label>Email</label>
                                                <input type="email" className="form-control" placeholder="Email"/>
                                            </div>
                                            <div className="form-group mb-2">
                                                <label>Password</label>
                                                <input type="password" className="form-control" placeholder="Password"/>
                                            </div>
                                            <div className="form-group mb-2">
                                                <label>Confirm Password</label>
                                                <input type="password" className="form-control" placeholder="Confirm Password"/>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center mt-3">
                                                <p></p>
                                                <Link className="nav-link " to="/SignIn"> Already have an account? <span className="text-primary">Sign in</span> </Link>
                                            </div>
                                            <div>
                                                <button type="button" className="btn btn-primary mt-3"> Sign Up</button>
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
