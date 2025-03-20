import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import UserNavigation from "../../components/UserComponent/UserNavigation";
import { useSelector } from 'react-redux';

function Trading() {
  const [allShares, setAllShares] = useState([]);
  const [filteredShares, setFilteredShares] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [msg, setMsg] = useState("");
  const [selectedShare, setSelectedShare] = useState(null);
  const userId = useSelector((state) => state.user.id);; // Example userId (replace with actual logic)

  function getShares() {
    axios
      .get(`https://ea81-125-18-187-66.ngrok-free.app/api/shares/all`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      })
      .then((res) => {
        setAllShares(res.data);
        setFilteredShares(res.data); // Initialize filteredShares with all shares
      })
      .catch((err) => {
        console.error("Error fetching mini statement:", err);
      });
  }

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
      const payload2 = {
        userId: 1,
        stockId: id,
        quantity: quantity,
        currentPrice: price,
        totalAmount: quantity * price,
      };

      await axios
        .post(
          `https://44ea-14-142-39-150.ngrok-free.app/holdings/buy`,
          payload2,
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          }
        )
        .then(async (res) => {
          console.log(res.data);
          if (res.data === "Not enough Shares of Stock ID: 3") {
            setMsg("Not enough Shares of Stock ID: 3");
          } else {
            setMsg("Stock Purchased Successfully");

            await axios
              .put(
                `https://ea81-125-18-187-66.ngrok-free.app/api/shares/purchase`,
                payload,
                {
                  headers: {
                    "ngrok-skip-browser-warning": "true",
                  },
                }
              )
              .then((res) => {
                console.log(res.data);
                if (res.data === "Not enough Shares of Stock ID: 3") {
                  setMsg("Not enough Shares of Stock ID: 3");
                } else {
                  setMsg("Stock Purchased Successfully");
                }
                closeModal();
              })
              .catch((err) => {
                console.log(err);
                setMsg("Failed to Register User");
              });
          }
        })
        .catch((err) => {
          console.log(err);
          setMsg("Failed to Register User");
        });
    } catch (error) {
      console.error("Error buying stock:", error);
    }
  };

  const addToWatchList = async (id,name) => {
    console.log("dfdd");
    const payload = {
      userId: 1,
      stockId: id,
      stockName: name
    };
    await axios
      .post(
        `https://44ea-14-142-39-150.ngrok-free.app/watchlist/add`,
        payload,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        if (res.data === "Not enough Shares of Stock ID: 3") {
          setMsg("Not enough Shares of Stock ID: 3");
        } else {
          setMsg("Stock Added To Watchlist Successfully");
        }
        closeModal();
      })
      .catch((err) => {
        console.log(err);
        setMsg("Failed to Register User");
      });
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = allShares.filter(
      (share) =>
        share.name.toLowerCase().includes(query) ||
        share.stockId.toString().includes(query)
    );
    setFilteredShares(filtered);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getShares();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <UserNavigation />
      <main className="main">
        <h2>All Shares</h2>

        <div className="contact-container">
          <div className="contact-card">
            <div className="form-group">
              <label for="">Search by Stock ID or Name</label>
              <input
              type="text"
              placeholder="Search by Stock ID or Name"
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
            />
            </div>
            Note: Click On the Row To Buy The Stock
            <br />
            <br />
            <div className="contact-info">
              <table>
                <thead>
                  <tr>
                    <th>Stock ID</th>
                    <th>Name</th>
                    <th>Current Price</th>
                    <th>Add To Watchlist</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShares.map((share) => (
                    <tr key={share.stockId}>
                      <td onClick={() => handleRowClick(share)}>
                        {share.stockId}
                      </td>
                      <td onClick={() => handleRowClick(share)}>
                        {share.name}
                      </td>
                      <td onClick={() => handleRowClick(share)}>
                        {share.currentPrice.toFixed(2)}
                      </td>
                      <td>
                        <button
                          className="submit-btn"
                          onClick={() => addToWatchList(share.stockId, share.name)}
                        >
                          Watchlist
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <br />
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

                    <button
                      className="buy-btn"
                      onClick={() =>
                        buyStock(
                          selectedShare.stockId,
                          selectedShare.currentPrice,
                          document.getElementById("quantity").value
                        )
                      }
                    >
                      Buy Now
                    </button>
                    <br />
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
