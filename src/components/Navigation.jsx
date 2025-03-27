import React from 'react'
import './components.css'
import { Link } from 'react-router-dom'


function Navigation() {
  return (
    <aside className="aside">   
    <h3>Navigation</h3>
    <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about-us">About Us</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/change-password">Change Password</Link></li>
        <li><Link to="/admin-login">Admin Login</Link></li>
    </ul>
</aside>
  )
}

export default Navigation