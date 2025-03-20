import React, { useState } from "react";
import Navigation from "../../components/Navigation";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login_User } from "../../reduxContainer/AuthAction";


function Login() {
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
        e.preventDefault();
        axios
        .post(
          `https://3545-2401-4900-4dd3-4525-a0f5-f8a9-298f-afe0.ngrok-free.app/login`,
          user,
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          }
        )
            .then((res) => {
                console.log(res.data);
                if (res.data.success === false) {
                    setMsg('Incorrect Username Or Password');
                } else {
                    dispatch(login_User(res.data));
                    navigate('/user');
                }
            })
            .catch((err) => {
                console.error(err);
                setMsg('Server Error');
            });
    }

  return (
    <div class="container">
      <Navigation />
      <section class="main">
        <h2>Login</h2>
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
                placeholder="Enter your username"
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
            <p>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
            <p><Link to="/forgot-password">Forgot Password</Link></p>
            <h1 className='error'>{msg}</h1>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Login;