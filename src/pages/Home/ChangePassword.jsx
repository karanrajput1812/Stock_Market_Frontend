import React, { useState } from "react";
import Navigation from "../../components/Navigation";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL3 } from "../../config/backend";
// import { useDispatch, useSelector } from "react-redux";
// import { login_User } from "../reduxContainer/AuthAction";

function ChangePassword() {
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const [msg, setMsg] = useState("");
  const [userFound, setUserFound] = useState(false);
  const [user, setUser] = useState({
    username: "",
    oldPassword: "",
    newPassword: "",
  });

  const assignData = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const loginUser = (e) => {
    console.log(user);
    e.preventDefault();
    axios
        .post(
          `${BACKEND_URL3}/api/users/changePassword`,
          user,
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          }
        )
      .then((res) => {
        console.log(res);
        if (res.data !== "Password changed successfully.") {
          setMsg("Incorrect Username Or Old Password");
        } else {
          // dispatch(login_User(res.data));
          navigate("/login");
        }
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
        <h2>Change Password</h2>
        <div className="contact-form">
          <form action="">
            <h3>Enter the below Detail to change your password</h3>
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
              <label htmlFor="oldPassword">Old Password</label>
              <input
                type="password"
                id="oldPassword"
                value={user.oldPassword}
                onChange={assignData}
                name="oldPassword"
                placeholder="Enter your old password"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={user.newPassword}
                onChange={assignData}
                name="newPassword"
                placeholder="Enter your new password"
                required
              />
            </div>
            <button type="submit" className="submit-btn" onClick={loginUser}>
              Change Password
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

export default ChangePassword;
