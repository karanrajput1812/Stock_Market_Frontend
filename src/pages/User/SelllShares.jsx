import React from 'react'
import UserNavigation from '../../components/UserComponent/UserNavigation';
import { useState } from 'react';
import { useSelector } from 'react-redux';


function SelllShares() {
    const [selectedShare, setSelectedShare] = useState(null);
    const userId = useSelector((state) => state.user.id);; // Example userId (replace with actual logic)
    const shares = [
        { company: 'ABC Corp', available: 500, price: 120, flow: 'up' },
        { company: 'XYZ Ltd', available: 300, price: 80, flow: 'down' },
        { company: 'Tech Innovations', available: 200, price: 150, flow: 'up' },
        { company: 'Finance Solutions', available: 450, price: 95, flow: 'down' },
    ];

    const handleRowClick = (share) => {
        setSelectedShare(share);
    };

    const closeModal = () => {
        setSelectedShare(null);
    };

    return (
        <div className="container">
            <UserNavigation />
            <div className="main">
                <h2>Sell Shares</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Available Shares</th>
                            <th>Price/Share</th>
                            <th>Trend</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shares.map((share, index) => (
                            <tr key={index} onClick={() => handleRowClick(share)}>
                                <td>{share.company}</td>
                                <td>{share.available}</td>
                                <td>₹{share.price.toFixed(2)}</td>
                                <td 
                                    className={share.flow === 'up' ? 'upflow' : 'downflow'}
                                >
                                    {share.flow === 'up' ? '📈 Upward' : '📉 Downward'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal for Share Details */}
                {selectedShare && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h3>{selectedShare.company}</h3>
                            <p><strong>Available Shares:</strong> {selectedShare.available}</p>
                            <p><strong>Price per Share:</strong> ₹{selectedShare.price.toFixed(2)}</p>
                            <p><strong>Status:</strong> {selectedShare.flow === 'up' ? '📈 Upflow' : '📉 Downflow'}</p>
                            <button className="submit-btn" onClick={closeModal}>Sell Now</button>
                            <button className="confirm-btn" onClick={closeModal}>Close</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SelllShares