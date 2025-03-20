import React, { useState } from "react";
import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import UserNavigation from "../../components/UserComponent/UserNavigation";

function Trading() {
  //   const User = useSelector((state) => state.user);
  const [allShares, setAllShares] = useState([]);
  const [msg, setMsg] = useState("");

  function getShares() {
    axios
      .get(`https://c0a1-125-18-187-66.ngrok-free.app/api/shares/all`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      })
      .then((res) => {
        console.log(res.data);
        setAllShares(res.data);
      })
      .catch((err) => {
        console.error("Error fetching mini statement:", err);
      });
  }
  const [selectedShare, setSelectedShare] = useState(null);

  const handleRowClick = (share) => {
    setSelectedShare(share);
  };

  const closeModal = () => {
    setSelectedShare(null);
  };

  const buyStock = async (id, price, quantity) => {
    console.log(id, price, quantity);
    try {
        const payload = {
            stockId: id,
            purchaseQuantity: quantity,
        };
        await axios.put(`https://c0a1-125-18-187-66.ngrok-free.app/api/shares/purchase`, payload, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        })
        .then((res) => {
            console.log(res.data);
            if(res.data === "Not enough Shares of Stock ID: 3") {
                setMsg("Not enough Shares of Stock ID: 3")
            }
            else {
            setMsg("Stock Purchased Successfully");
            }
            closeModal();
        })
        .catch((err) => {
            console.log(err);
            setMsg("Failed to Register User");
        });
    } catch (error) {
        console.error("Error buying stock:", error);
    }
};


  useEffect(() => {
    const interval = setInterval(() => {
      getShares();
    }, 1000); // 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <UserNavigation />
      <main className="main">
        <h2>All Shares</h2>

        <div className="contact-container">
          <div className="contact-card">
            Note: Click On the Row To Buy The Stock
            <br></br>
            <br></br>
            <div className="contact-info">
              <table>
                <thead>
                  <tr>
                    <th>Stock ID</th>
                    <th>Name</th>
                    <th>Current Price</th>
                    <th>Add Watchlist</th>
                  </tr>
                </thead>
                <tbody>
                  {allShares.map((share) => (
                    <tr
                      key={share.stockId}
                      onClick={() => handleRowClick(share)}
                    >
                      <td>{share.stockId}</td>
                      <td>{share.name}</td>
                      <td>{share.currentPrice.toFixed(2)}</td>
                      <td>
                        <Link className="submit-btn">Watchlist</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <br></br>
              <h1 className="success">{msg}</h1>
              {selectedShare && (
                <div className="modal-overlay" onClick={closeModal}>
                  <div
                    className="modal-content"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3>{selectedShare.name}</h3>
                    <p>
                      Available Shares:{" "}
                      <strong>{selectedShare.quantity}</strong>
                    </p>
                    <p>
                      Price per Share:{" "}
                      <strong>₹{selectedShare.currentPrice.toFixed(2)}</strong>
                    </p>
                    <div className="form-group">
                    <label htmlFor="quantity">Enter Quantity:</label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      min="1"
                      max={selectedShare.quantity}
                      placeholder="Enter quantity"
                    />
                    </div>
                    
                    <button className="buy-btn" onClick={() => buyStock(selectedShare.stockId, selectedShare.currentPrice, document.getElementById("quantity").value)}>
                      Buy Now
                    </button>
                    <br></br>
                    <button className="confirm-btn" onClick={closeModal}>
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Trading;
