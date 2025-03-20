import React from 'react'
import { useState } from 'react';
import UserNavigation from '../../components/UserComponent/UserNavigation';
import { useEffect } from 'react';
import axios from 'axios';
function Watchlist() {
    const [watchlist, setWatchlist] = useState([]);
    const userId = 1; // Example user ID, adjust as needed

    // Fetch watchlist from the API
    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                const response = await axios.get(`https://<YOUR_NGROK_URL>/watchlist/${userId}`);
                setWatchlist(response.data); // Assuming response.data is the array of stocks
            } catch (error) {
                console.error('Error fetching watchlist:', error);
            }
        };

        fetchWatchlist();
    }, []);

    const [selectedShare, setSelectedShare] = useState(null);

    // Open Modal with Selected Share Details
    const openModal = (share) => setSelectedShare(share);

    // Close Modal
    const closeModal = () => setSelectedShare(null);

    const removeStock = async (id) => {
        try {
            await axios.delete(`/watchlist/remove/${id}`);
            setWatchlist(watchlist.filter((stock) => stock.id !== id));
            closeModal(); // Close modal after successful removal
            alert('Stock removed successfully!');
        } catch (error) {
            console.error('Error removing stock:', error);
            alert('Failed to remove stock. Please try again.');
        }
    };

    return (
        <div className="container">
            <UserNavigation />
            <div className="main">
                <h2>Watchlist</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Stock</th>
                            <th>Price ($)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {watchlist.map((stock) => (
                            <tr key={stock.id} onClick={() => openModal(stock)}>
                                <td>{stock.name}</td>
                                <td>{stock.price.toFixed(2)}</td>
                            </tr>
                        ))}
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
                                className="confirm-btn" 
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

export default Watchlist