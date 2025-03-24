import React from "react";
import AdminNavigation from "../../components/AdminComponents/AdminNavigation";
import { useState } from "react";
import Navigation from "../../components/Navigation";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './admin.css'
import { BACKEND_URL1 } from "../../config/backend";

function DeleteShares() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [shareDetails, setShareDetails] = useState({
    id: '',

  });
  const assignData = (e) => {
    setShareDetails({ ...shareDetails, [e.target.name]: e.target.value });
  };

  const deleteShare = (e) => {
    e.preventDefault();
    console.log(shareDetails);
    axios
      .delete(`${BACKEND_URL1}/api/shares/delete/`+ shareDetails.id,
        {
                headers: {
                        "ngrok-skip-browser-warning": "true"
                }
        }
    )
      .then((res) => {
        console.log("Stock Deleted Successfully", res.data);
        setMsg("Stock Deleted Successfully");
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
      <h2>Delete Shares</h2>
        <div class="add-form">
          <h3>Enter Share Details</h3>
          <form >
            <div class="form-group">
              <label htmlFor="id">Share Id</label>
              <input
                type="text"
                id="id"
                name="id"
                value={shareDetails.id}
                onChange={assignData}
                placeholder="Enter Share Id"    
                required
              />
            </div>
            <button
              type="submit"
              class="submit-btn"
              onClick={deleteShare}
            >
              Delete Share
            </button>
          </form>
          <div class="message" id="msg">{msg}</div>
        </div>
      </div>
    </div>
  );
}

export default DeleteShares;
