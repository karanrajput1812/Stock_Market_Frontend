import React, { useState } from "react";
import Navigation from "../../components/Navigation";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login_Admin } from "../../reduxContainer/AuthAction";


function AdminLogin() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [msg, setMsg] = useState('');
    const [user, setUser] = useState({
        username: '',
        password: ''
    })

    const assignData = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value});
    }

    const loginUser = (e) => {

        console.log(user)
        e.preventDefault();
        if (user.username=='admin' && user.password=='admin') {
            dispatch(login_Admin(user));
            navigate('/admin');
        } else {
            setMsg('Incorrect Username Or Password');
        }
        
    }

  return (
    <div class="container">
      <Navigation />
      <section class="main">
        <h2>Admin Login</h2>
        <div class="contact-form">
          <form action="">
            <h3>Login to Your Account</h3>
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
            <div class="form-group">
              <label for="name">Password</label>
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
            <button type="submit" class="submit-btn" onClick={loginUser}>
              Login
            </button>
            <br />
            <br />
            <h1 className='error'>{msg}</h1>
          </form>
        </div>
      </section>
    </div>
  );
}

export default AdminLogin;