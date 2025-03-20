import React from 'react'
import { useState } from 'react';
import UserNavigation from '../../components/UserComponent/UserNavigation';
import { useEffect } from 'react';
import axios from 'axios';

function Holding() {
    const [holdings, setHoldings] = useState([]);
    const [selectedShare, setSelectedShare] = useState(null);

    // Fetch Holdings Data
    useEffect(() => {
        const fetchHoldings = async () => {
            try {
                const response = await axios.get(`https://your-ngrok-url.ngrok.io/holdings/123`); // Replace '123' with the userId
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
    const openModal = async (share) => {
        try {
            const response = await axios.get(`https://your-ngrok-url.ngrok.io/holdings/details/${share.id}`);
            setSelectedShare(response.data);
        } catch (error) {
            console.error('Error fetching share details:', error);
            alert('Failed to fetch share details. Please try again.');
        }
    };

    // Close Modal
    const closeModal = () => setSelectedShare(null);

    // Remove Stock from Holdings
    const removeStock = async (id) => {
        try {
            await axios.get(`https://your-ngrok-url.ngrok.io/holdings/details/${id}`);
            setHoldings(holdings.filter((stock) => stock.id !== id));
            closeModal(); // Close modal after successful removal
            alert('Holding removed successfully!');
        } catch (error) {
            console.error('Error removing holding:', error);
            alert('Failed to remove holding. Please try again.');
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
                            <th>Price ($)</th>
                            <th>Total Value ($)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {holdings.map((stock, index) => (
                            <tr key={index} onClick={() => openModal(stock)}>
                                <td>{stock.name} </td>
                                <td>{stock.quantity}</td>
                                <td>{stock.price.toFixed(2)}</td>
                                <td>{(stock.quantity * stock.price).toFixed(2)}</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan="3"><strong>Total Investment:</strong></td>
                            <td><strong>${totalInvestment.toFixed(2)}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Modal for Share Details */}
            {selectedShare && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>{selectedShare.company}</h3>
                        <p><strong>Available Shares:</strong> {selectedShare.available}</p>
                        <p><strong>Price per Share:</strong> ${selectedShare.price.toFixed(2)}</p>
                        <p>
                            <strong>Status:</strong> 
                            {selectedShare.flow === 'up' ? ' 📈 Upflow' : ' 📉 Downflow'}
                        </p>
                        <div className="modal-buttons">
                            <button 
                                className="remove-btn" 
                                onClick={() => removeStock(selectedShare.id)}
                            >
                                Remove
                            </button>
                            <button className="confirm-btn" onClick={closeModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Holding