import React, { useEffect } from "react";
import Navigation from "../../components/Navigation";
import '../Pages.css'
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
function Home() {
  return (
    <div>
      <div class="container">
        <Navigation />
        <main class="main">
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
          <Link to="/register" class="submit-btn">
            Sign Up For Free
          </Link>
        </main>
      </div>
    </div>
  );
}

export default Home;