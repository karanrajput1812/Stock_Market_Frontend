import React from 'react'
import AdminNavigation from '../../components/AdminComponents/AdminNavigation'
import { Link } from 'react-router-dom'
function AdminDashBoard() {
  return (
    <div>
      <div className="container">
        <AdminNavigation />
        <main className="main">
          <h2>Welcome to Herodha</h2>
          <p>
            Online Platform to invest in stocks, deliverables, mutual funds, ETF, bonds, and more.
          </p>
          <br></br>
          <br></br>
          <h2>Open a Herodha account</h2>
          <p>
          Modern platforms and apps, ₹0 investments, and flat ₹20 intraday and F&O trades.
          </p>
          <br></br>
          <br />
          <Link to="/net-banking" className="submit-btn">
            Sign Up For Free
          </Link>
        </main>
      </div>
    </div>
  )
}

export default AdminDashBoard