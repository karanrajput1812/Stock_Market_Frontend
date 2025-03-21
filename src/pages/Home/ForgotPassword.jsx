import React, { useState } from "react";
import Navigation from "../../components/Navigation";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
        `https://b90b-125-18-187-66.ngrok-free.app/api/users/forgetpassword`,
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
        console.log(res.data);
          setPassword(res.data);
          // setMsg("Password reset successful");
      })
      .catch((err) => {
        console.error(err);
        setMsg("Server Error");
      });
  };

  return (
    <div class="container">
      <Navigation />
      <section class="main">
        <h2>Forgot Password</h2>
        <div class="contact-form">
          <form action="">
            <h3>Enter the below Detail to reset your password</h3>
            <div class="form-group">
              <label for="name">Username</label>
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
                <label for="password">{password}</label>
              </div>
            <button type="submit" class="submit-btn" onClick={loginUser}>
              Reset Password
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
