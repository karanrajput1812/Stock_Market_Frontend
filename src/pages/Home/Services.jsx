import React from 'react'
import '../pages.css'
import Navigation from '../../components/Navigation'

function Services() {
    return (
        <div class="container">
            <Navigation />
            <main class="main">
                <h2>Our Services</h2>
                <div class="contact-container">
                    <div class="contact-card">
                        <h3>Stock Market Services</h3>
                        <div class="contact-info">
                            <p>Stay ahead in the stock market with our real-time insights and trading tools.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Services
