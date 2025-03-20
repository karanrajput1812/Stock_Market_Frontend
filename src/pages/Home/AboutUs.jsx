import React from "react";
import "../pages.css";
import Navigation from "../../components/Navigation";
function AboutUs() {
  return (
    <div class="container">
      <Navigation />
      <section class="main">
        <h2>About Us</h2>
        <div>
          <p>
            Herodha is a cutting-edge trading platform designed to empower investors with advanced tools and insights. Our mission is to make trading accessible, efficient, and transparent for everyone. Whether you're a seasoned trader or just starting your journey, Herodha provides the resources and support you need to succeed in the stock market.
          </p>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;