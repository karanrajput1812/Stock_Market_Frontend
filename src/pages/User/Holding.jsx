import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserNavigation from '../../components/UserComponent/UserNavigation';
import { useSelector } from 'react-redux';
import { useSubscription } from 'react-stomp-hooks';

function Holding() {
    const [holdings, setHoldings] = useState([]);
    const [allShares, setAllShares] = useState([]);
    const [selectedShare, setSelectedShare] = useState(null);
    const [msg, setMsg] = useState('');
    
    // const userId = useSelector((state) => state.user.id);
    const userId = 1;
    // Fetch Holdings Data

    const fetchHoldings = async () => {
        try {
            const response = await axios.get(
                `https://b90b-125-18-187-66.ngrok-free.app/holdings/` + userId,
                {
                    headers: {
                        "ngrok-skip-browser-warning": "true",
                    },
                }
            );
            console.log("Holding Data:", response.data);
            setHoldings(response.data);
        } catch (error) {
            console.error('Error fetching holdings:', error);
            alert('Failed to fetch holdings. Please try again.');
        }
    };

    useEffect(() => {
        fetchHoldings();
    }, []);

    useSubscription("/topic/prices", (message) => {
        try {
          const shares = JSON.parse(message.body);
          console.log(shares);
          setAllShares(shares);
        } catch (error) {
          console.error("Error parsing message body:", error);
        }
      });

      const mergedData = holdings.map((stock) => {
        const matchingShare = allShares.find(
          (share) => share.stockId === stock.stockId
        );
        return {
          ...stock,
          current: matchingShare ? matchingShare.currentPrice : "...",
        };
      });

    // Calculate Total Investment
    const totalInvestment = holdings.reduce(
        (total, stock) => total + stock.quantity * stock.currentPrice,
        0
    );

    const currentInvestment = mergedData.reduce(
        (total, stock) => total + stock.quantity * stock.current,
        0
    );



    // Open Modal with Selected Share Details
    const openModal = (share) => {
        setSelectedShare(share);
    };

    // Close Modal
    const closeModal = () => setSelectedShare(null);

    // Sell Stock
    const sellStock = async (id, price, quantity) => {
        console.log(id, price, quantity);
        try {
            const payload = {
                userId: 1,
                stockId: id,
                quantity: quantity,
                currentPrice: price,
                totalAmount: quantity * price,
            };

            const payload2 = {
                stockId: id,
                purchaseQuantity: quantity,
            };

            await axios
                .post(
                    `https://b90b-125-18-187-66.ngrok-free.app/holdings/sell`,
                    payload,
                    {
                        headers: {
                            "ngrok-skip-browser-warning": "true",
                        },
                    }
                )
                .then(async(res) => {
                    console.log(res.data);
                    if (res.data === "Insufficient stock quantity") {
                        setMsg("Not enough shares to sell");
                    } else {
                        setMsg("Stock Sold Successfully");
                        fetchHoldings();
                        setHoldings((prevHoldings) =>
                            prevHoldings.map((stock) =>
                                stock.id === id
                                    ? { ...stock, quantity: stock.quantity - quantity }
                                    : stock
                            )
                        );
                        await axios
              .put(
                `https://9a24-14-142-39-150.ngrok-free.app/api/shares/sell`,
                payload2,
                {
                  headers: {
                    "ngrok-skip-browser-warning": "true",
                  },
                }
              )
              .then((res) => {
                console.log(res.data);
                if (res.data === "Not enough Shares of Stock ID: " + id) {
                  setMsg("Not enough Shares of Stock ID: " + id);
                } else {
                    setMsg("Stock Sold Successfully");
                }
                closeModal();
              })
              .catch((err) => {
                console.log(err);
                setMsg("Failed to Register User");
              });
                        
                    }
                    closeModal();
                })
                .catch((err) => {
                    console.log(err);
                    setMsg("Failed to sell stock");
                });
        } catch (error) {
            console.error("Error selling stock:", error);
        }
    };

    return (
        <div className='container'>
            <UserNavigation />
            <div className="main">
                <h2>Holdings</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Stock</th>
                            <th>Quantity</th>
                            <th>Entry Price (₹)</th>
                            <th>Total Value (₹)</th>
                            <th>Listed Price</th>
                            <th>Profit/Loss</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mergedData.map((stock) => (
                            <tr key={stock.stockId} onClick={() => openModal(stock)}>
                                <td>{stock.stockName}</td>
                                <td>{stock.quantity}</td>
                                <td>{stock.currentPrice.toFixed(2)}</td>
                                <td>{(stock.quantity * stock.currentPrice).toFixed(2)}</td>
                                <td>{typeof stock.current === 'number' ? stock.current.toFixed(2) : "..."}</td>
                                <td style={{
                                        color: typeof stock.current === 'number' && stock.current - stock.currentPrice > 0 ? 'green' : 'red',
                                    }}>
                                        ₹{typeof stock.current === 'number' ? (stock.current - stock.currentPrice).toFixed(2) : "..."}
                                    </td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan="3"><strong>Total Investment:</strong></td>
                            <td><strong>₹{totalInvestment.toFixed(2)}</strong></td>
                            <td><strong>₹{currentInvestment.toFixed(2)}</strong></td>
                            <td>
                            <strong
                                    style={{
                                        color: totalInvestment - currentInvestment < 0 ? 'green' : 'red',
                                    }}
                                >
                                    ₹{(currentInvestment - totalInvestment).toFixed(2)}
                                </strong>
                                </td>
                            {/* <td><strong>₹ {(totalInvestment.toFixed(2) - currentInvestment.toFixed(2)).toFixed(2)}</strong></td> */}
                        </tr>

                    </tbody>
                </table>
            <h1 className="success">{msg}</h1>
            </div>

            {/* Modal for Share Details */}
            {selectedShare && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>{selectedShare.stockName}</h3>
                        <p><strong>Available Shares:</strong> {selectedShare.quantity}</p>
                        {/* <p><strong>Price per Share:</strong> ₹{selectedShare.price.toFixed(2)}</p> */}
                        <div className="form-group">
                            <label htmlFor="quantity">Enter Quantity to Sell:</label>
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
                            className="sell-btn"
                            onClick={() =>
                                sellStock(
                                    selectedShare.stockId,
                                    selectedShare.current,
                                    document.getElementById("quantity").value
                                )
                            }
                        >
                            Sell Now
                        </button>
                        <br />
                        <button className="confirm-btn" onClick={closeModal}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Holding;