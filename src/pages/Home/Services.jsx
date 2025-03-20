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
                <h3>Personal Banking</h3>
                <div class="contact-info">
                    <p>Manage your finances with ease using our personal banking solutions. </p>

                </div>
            </div>
            
            <div class="contact-card">
                <h3>Business Banking</h3>
                <div class="contact-info">
                    <p>Grow your business with our comprehensive business banking services.</p>

                </div>
            </div>
            <div class="contact-card">
                <h3>Mobile Banking</h3>
                <div class="contact-info">
                    <p>Bank on-the-go with our secure and user-friendly mobile app.</p>

                </div>
            </div>
            <div class="contact-card">
                <h3>Investment Services</h3>
                <div class="contact-info">
                    <p>Build your wealth with our expert investment advice and products.</p>

                </div>
            </div>
        </div>
    </main> 
</div>
  )
}

export default Services