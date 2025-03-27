import React, { useState } from "react";
import Navigation from "../../components/Navigation";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL3 } from "../../config/backend";
// import { useDispatch, useSelector } from "react-redux";
// import { login_User } from "../reduxContainer/AuthAction";

function ForgotPassword() {
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const [msg, setMsg] = useState("");
  const [userFound, setUserFound] = useState(false);
  const [password, setPassword] = useState("");
  const [user, setUser] = useState({
    username: "",
    dob: "",
  });

  const assignData = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const loginUser = (e) => {
    e.preventDefault();
    axios
      .get(
        `${BACKEND_URL3}/api/users/forgetpassword`,
        {
          params: {
            username: user.username,
            dob: user.dob,
          },
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      )
      .then((res) => {
        console.log(res);
          setPassword(res.data);
          // setMsg("Password reset successful");
      })
      .catch((err) => {
        console.error(err);
        setMsg("Server Error");
      });
  };

  return (
    <div className="container">
      <Navigation />
      <section className="main">
        <h2>Forgot Password</h2>
        <div className="contact-form">
          <form action="">
            <h3>Enter the below Detail to reset your password</h3>
            <div className="form-group">
              <label htmlFor="name">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={user.username}
                onChange={assignData}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="dob">Date Of Birth</label>
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
                <label htmlFor="password">{password}</label>
              </div>
            <button type="submit" className="submit-btn" onClick={loginUser}>
              Get Password
            </button>
            <br />
            <br />
            <h1 className="error">{msg}</h1>
          </form>
        </div>
      </section>
    </div>
  );
}

export default ForgotPassword;
