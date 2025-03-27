import React, { useState } from "react";
import Navigation from "../../components/Navigation";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login_User } from "../../reduxContainer/AuthAction";
import { BACKEND_URL3 } from "../../config/backend";
import { useAuth } from "../../security/AuthContext";

function Login() {
  const authContext = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [msg, setMsg] = useState("");
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const assignData = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const loginUser = async (e) => {
    e.preventDefault();
    console.log("dsdsds");
    try {
      const success = await authContext.login(user.username, user.password);
      console.log(success);
      if (success) {
        try {
          navigate("/user");
          console.log("Login successful");
        } catch (err) {
          console.error(err);
          setMsg("Server Error");
        }
      } else {
        setMsg(true);
      }
    } catch (error) {
      setMsg(true);
    }
  };

  return (
    <div className="container">
      <Navigation />
      <section className="main">
        <h2>Login</h2>
        <div className="contact-form">
          <form action="">
            <h3>Login to Your Account</h3>
            <div className="form-group">
              <label htmlFor="name">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={user.username}
                onChange={assignData}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">Password</label>
              <input
                type="text"
                id="password"
                name="password"
                value={user.password}
                onChange={assignData}
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="submit-btn" onClick={loginUser}>
              Login
            </button>
            <br />
            <br />
            <p>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
            <p>
              <Link to="/forgot-password">Forgot Password</Link>
            </p>
            <h1 className="error">{msg}</h1>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Login;
