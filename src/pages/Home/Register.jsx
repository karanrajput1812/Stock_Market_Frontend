import React, { useState } from "react";
import Navigation from "../../components/Navigation";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [user, setUser] = useState({
    // fname: '',
    username: "",
    // email: '',
    password: "",
    dob: "",
  });
  const assignData = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const registerUser = (e) => {
    e.preventDefault();
    console.log(user);
    axios
      .post(
        `https://3545-2401-4900-4dd3-4525-a0f5-f8a9-298f-afe0.ngrok-free.app/register`,
        user,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      )
      .then((res) => {
        console.log("User Register Successfully", res.data);
        setMsg("User Register Successfully");
        navigate('/login');
      })
      .catch((err) => {
        console.log(err);
        setMsg("Failed to Register User");
      });
  };

  return (
    <div className="container">
      <Navigation />
      <section className="main">
        <h2>Registration</h2>
        <div className="form-container"></div>
        <div className="contact-form">
          <form action="">
            <h3>Register to Herodha</h3>
            {/* <div className="form-group">
                    <label for="fname">Full Name</label>
                    <input type="text" id="fname" value={user.fname} onChange={assignData} name="fname" placeholder="Enter your full name" required />
                </div> */}
            <div className="form-group">
              <label for="username">Username</label>
              <input
                type="text"
                id="username"
                value={user.username}
                onChange={assignData}
                name="username"
                placeholder="Enter Username"
                required
              />
            </div>
            {/* <div className="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" value={user.email} onChange={assignData} name="email" placeholder="Enter your email address" required />
                </div> */}
            <div className="form-group">
              <label for="dob">Date Of Birth</label>
              <input
                type="date"
                id="dob"
                value={user.dob}
                onChange={assignData}
                name="dob"
                placeholder="Enter your date of birth"
                required
              />
            </div>
            <div className="form-group">
              <label for="password">Password</label>
              <input
                type="password"
                id="password"
                value={user.password}
                onChange={assignData}
                name="password"
                placeholder="Enter your password"
                required
              />
            </div>
            {/* <div className="form-group">
                    <label for="cpassword">Confirm Password</label>
                    <input type="password" id="cpassword" value={user.cpassword} onChange={assignData} name="cpassword" placeholder="Enter your confirm password" required />
                </div> */}
            <button type="submit" className="submit-btn" onClick={registerUser}>
              Register
            </button>
            <br />
            <br />
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
            <h1 className="error">{msg}</h1>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Register;
