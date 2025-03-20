import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserNavigation from '../../components/UserComponent/UserNavigation';
import { useSelector } from 'react-redux';


function Holding() {
    const [holdings, setHoldings] = useState([]);
    const [selectedShare, setSelectedShare] = useState(null);
    const [msg, setMsg] = useState('');
    const userId = useSelector((state) => state.user.id);; // Example userId (replace with actual logic)

    // Fetch Holdings Data
    useEffect(() => {
        const fetchHoldings = async () => {
            try {
                const response = await axios.get(
                    `https://44ea-14-142-39-150.ngrok-free.app/holdings/` + userId,
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

        fetchHoldings();
    }, []);

    // Calculate Total Investment
    const totalInvestment = holdings.reduce(
        (total, stock) => total + stock.quantity * stock.price,
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

            await axios
                .post(
                    `https://44ea-14-142-39-150.ngrok-free.app/holdings/sell`,
                    payload,
                    {
                        headers: {
                            "ngrok-skip-browser-warning": "true",
                        },
                    }
                )
                .then((res) => {
                    console.log(res.data);
                    if (res.data === "Not enough shares to sell") {
                        setMsg("Not enough shares to sell");
                    } else {
                        setMsg("Stock Sold Successfully");
                        setHoldings((prevHoldings) =>
                            prevHoldings.map((stock) =>
                                stock.id === id
                                    ? { ...stock, quantity: stock.quantity - quantity }
                                    : stock
                            )
                        );
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
                            <th>Price (₹)</th>
                            <th>Total Value (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {holdings.map((stock, index) => (
                            <tr key={index} onClick={() => openModal(stock)}>
                                <td>{stock.name}</td>
                                <td>{stock.quantity}</td>
                                <td>{stock.price.toFixed(2)}</td>
                                <td>{(stock.quantity * stock.price).toFixed(2)}</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan="3"><strong>Total Investment:</strong></td>
                            <td><strong>₹{totalInvestment.toFixed(2)}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Modal for Share Details */}
            {selectedShare && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>{selectedShare.name}</h3>
                        <p><strong>Available Shares:</strong> {selectedShare.quantity}</p>
                        <p><strong>Price per Share:</strong> ₹{selectedShare.price.toFixed(2)}</p>
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
                                    selectedShare.id,
                                    selectedShare.price,
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
            <h1 className="success">{msg}</h1>
        </div>
    );
}

export default Holding;