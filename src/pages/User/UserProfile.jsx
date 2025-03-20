import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { AuthReducer } from '../../reduxContainer/AuthReducer';
import { useSelector } from 'react-redux';

function UserProfile() {
    const [userProfile, setUserProfile] = useState(null);
    const userId = useSelector((state) => state.user.id);; // Example userId (replace with actual logic)
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('https://44ea-14-142-39-150.ngrok-free.app/api/user-profile/' + userID); // Replace with your actual API endpoint
                const data = await response.json();
                setUserProfile(data);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, []);

    if (!userProfile) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <section className="main">
                <h2>User Profile</h2>
                <div className="form-container"></div>
                <div className="contact-form">
                    <form>
                        <h3>Your Profile</h3>
                        <div className="form-group">
                            <label htmlFor="id">ID</label>
                            <input
                                type="text"
                                id="id"
                                value={userProfile.id}
                                readOnly
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={userProfile.username}
                                readOnly
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="dob">Date Of Birth</label>
                            <input
                                type="date"
                                id="dob"
                                value={userProfile.dob}
                                readOnly
                            />
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}

export default UserProfile;