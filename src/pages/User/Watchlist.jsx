import React, { useState, useEffect, CSSProperties } from "react";
import UserNavigation from "../../components/UserComponent/UserNavigation";
import axios from "axios";
import { useSelector } from "react-redux";
import { useSubscription } from "react-stomp-hooks";
import { BACKEND_URL2 } from "../../config/backend";
import ClipLoader from "react-spinners/ClipLoader";


function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [allShares, setAllShares] = useState([]);
  // const userId = useSelector((state) => state.user.id);
  const userId = 1;

  // let [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#ffffff");

  // Fetch watchlist from the API
  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL2}/watchlist/` + userId,
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        setWatchlist(response.data); // Assuming response.data is the array of stocks
      } catch (error) {
        console.error("Error fetching watchlist:", error);
      }
    };

    fetchWatchlist();
  }, []);

  useSubscription("/topic/prices", (message) => {
    try {
      const data = JSON.parse(message.body);
      const shares = data.latestPrices;
      const priceHistory = data.priceHistory;

      setAllShares(shares);
      console.log(shares);
      setAllShares(shares);
    } catch (error) {
      console.error("Error parsing message body:", error);
    }
  });

  // Merge watchlist and allShares data
  const mergedData = watchlist.map((stock) => {
    const matchingShare = allShares.find(
      (share) => share.stockId === stock.stockId
    );
    return {
      ...stock,
      currentPrice: matchingShare ? matchingShare.currentPrice : "N/A",
      quantity: matchingShare ? matchingShare.quantity : "N/A",
    };
  });

  const [selectedShare, setSelectedShare] = useState(null);

  // Open Modal with Selected Share Details
  const openModal = (share) => setSelectedShare(share);

  // Close Modal
  const closeModal = () => setSelectedShare(null);

  const removeStock = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL2}/watchlist/remove/` + userId + "/3", {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      setWatchlist(watchlist.filter((stock) => stock.id !== id));
      closeModal(); // Close modal after successful removal
      alert("Stock removed successfully!");
    } catch (error) {
      console.error("Error removing stock:", error);
      alert("Failed to remove stock. Please try again.");
    }
  };

  return (
    <div className="container">
      <UserNavigation />
      <div className="main">
        <h2>Watchlist</h2>
        {allShares.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Stock ID</th>
                <th>Stock</th>
                <th>Price (₹)</th>
              </tr>
            </thead>
            <tbody>
              {mergedData.map((stock) => (
                <tr key={stock.stockId} onClick={() => openModal(stock)}>
                  <td>{stock.stockId}</td>
                  <td>{stock.stockName}</td>
                  <td>
                    {stock.currentPrice !== "N/A"
                      ? stock.currentPrice.toFixed(2)
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table >
          <ClipLoader />
          </table>
        )}
        <br></br>
      </div>

      {/* Modal for Share Details */}
      {selectedShare && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedShare.company}</h3>
            <p>
              <strong>Available Shares:</strong> {selectedShare.quantity}
            </p>
            <p>
              <strong>Price per Share:</strong> ₹
              {selectedShare.currentPrice.toFixed(2)}
            </p>
            <div className="modal-buttons">
              <button
                className="confirm-btn"
                onClick={() => removeStock(selectedShare.id)}
              >
                Remove
              </button>
              <button className="confirm-btn" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Watchlist;
