import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdminNavigation from "../../components/AdminComponents/AdminNavigation";
// import { useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { useSubscription } from "react-stomp-hooks";

function ViewShares() {
//   const User = useSelector((state) => state.user);
  const [allShares, setAllShares] = useState([]);

  useSubscription("/topic/prices", (message) => {
    try {
      const data = JSON.parse(message.body);
      const shares = data.latestPrices;

      setAllShares(shares);
      console.log(shares);
      setAllShares(shares);
    } catch (error) {
      console.error("Error parsing message body:", error);
    }
  });

  return (
    <div className="container">
      <AdminNavigation />
      <main className="main">
        <h2>All Shares</h2>

        <div className="contact-container">
          <div className="contact-card">
            <div className="contact-info">
              <table>
                      <thead>
                        <tr>
                          <th>Stock ID</th>
                          <th>Name</th>
                          <th>Quantity</th>
                          <th>Minimum Price</th>
                          <th>Maximum Price</th>
                          <th>Current Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allShares.map((share) => (
                          <tr key={share.stockId}>
                            <td>{share.stockId}</td>
                            <td>{share.name}</td>
                            <td>{share.quantity}</td>
                            <td>{share.priceMin}</td>
                            <td>{share.priceMax}</td>
                            <td>{share.currentPrice.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ViewShares;