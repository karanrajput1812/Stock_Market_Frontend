import React from "react";
import AdminNavigation from "../../components/AdminComponents/AdminNavigation";
import { useState } from "react";
import Navigation from "../../components/Navigation";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './admin.css'
import { BACKEND_URL1 } from "../../config/backend";

function UpdateShares() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [shareDetails, setShareDetails] = useState({
    stockId: '',
    name: '',
    quantity: "",
    priceMin: '',
    priceMax: ""

  });
  const assignData = (e) => {
    setShareDetails({ ...shareDetails, [e.target.name]: e.target.value });
  };

  const addShare = (e) => {
    e.preventDefault();
    console.log(shareDetails);
    axios
      .put(`${BACKEND_URL1}/api/shares/update`, shareDetails,
        {
                headers: {
                        "ngrok-skip-browser-warning": "true"
                }
        }
    )
      .then((res) => {
        console.log("Stock Updated Successfully", res.data);
        setMsg("Stock Updated Successfully");
        // navigate('/net-banking');
      })
      .catch((err) => {
        console.log(err);
        setMsg("Failed to Register User");
      });
  };
  return (
    <div className="container">
       
      <AdminNavigation />
      <div class="main">
      <h2>Update Shares</h2>
        <div class="add-form">
          <h3>Enter Share Details</h3>
          <form >
          <div class="form-group">
              <label htmlFor="stockId">Share Id</label>
              <input
                type="text"
                id="stockId"
                name="stockId"
                value={shareDetails.stockId}
                onChange={assignData}
                placeholder="Enter Share Id"    
                required
              />
            </div>
            <div class="form-group">
              <label htmlFor="name">Share Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={shareDetails.name}
                onChange={assignData}
                placeholder="Enter Share Name"    
                required
              />
              {/* <small>
                Must start with capital letter and contain at least two words
              </small> */}
            </div>
            <div class="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={shareDetails.quantity}
                onChange={assignData}
                placeholder="Enter Share Quantity"
                required
              />
            </div>
            <div class="form-group">
              <label htmlFor="priceMin">Minimum Price</label>
              <input
                type="number"
                id="priceMin"
                name="priceMin"
                value={shareDetails.priceMin}
                onChange={assignData}
                placeholder="Enter Minimum Price"
                required
              />
            </div>
            <div class="form-group">
              <label htmlFor="priceMax">Maximum Price</label>
              <input
                type="number"
                id="priceMax"
                name="priceMax"
                value={shareDetails.priceMax}
                onChange={assignData}
                placeholder="Enter Maximum Price"
                required
              />
            </div>
            
            <button
              type="submit"
              class="submit-btn"
              onClick={addShare}
            >
              Add Share
            </button>
          </form>
          <div class="message" id="msg">{msg}</div>
        </div>
      </div>
    </div>
  );
}

export default UpdateShares;
