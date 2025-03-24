import React from "react";
import '../Components.css'
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function UserNavigation() {
//     const isLogin = useSelector((state) => state.isAuth);
//   const navigate = useNavigate();
//   useEffect(() => {
//     if (!isLogin) {
//       navigate("/login");
//     }
//     console.log(isLogin);
//   }, [isLogin]);
  return (
    <aside class="aside">
      <h3>User Section</h3>
      <ul>
        <li>
          <Link to="/user">Explore</Link>
        </li>
        <li>
          <Link to="/user/watchlist">Watchlist</Link>
        </li>
        <li>
          <Link to="/user/balance">Balance</Link>
        </li>
        <li>
          <Link to="/user/holding">Holdings</Link>
        </li>
        <li>
          {/* <Link to="/user/my-account">My Account</Link> */}
        </li>
        <li>
          <Link to="/">Logout</Link>
        </li>
      </ul>
    </aside>
  );
}

export default UserNavigation;
