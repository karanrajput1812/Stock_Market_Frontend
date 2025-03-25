import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import UserNavigation from "../../components/UserComponent/UserNavigation";
import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { useSubscription } from "react-stomp-hooks";
import { BACKEND_URL1, BACKEND_URL2 } from "../../config/backend";
import { MdOutlineZoomIn, MdOutlineZoomOut } from "react-icons/md";

import {Bar} from 'react-chartjs-2'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement
);

function Trading() {
  const [allShares, setAllShares] = useState([]);
  const [stockName, setStockName] = useState("");
  const [allPriceHistory, setAllPriceHistory] = useState([]);
  const [filteredShares, setFilteredShares] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [msg, setMsg] = useState("");
  const [selectedShare, setSelectedShare] = useState(null);
  const userId = useSelector((state) => state.user.id); // Example userId (replace with actual logic)
  const [handleZoomInOut, setHandleZoomInOut] = useState(true);
  
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Price History",
      },
      legend: {
        display: true,
        position: "top",
      },
    }
  };

  const barGraphOptions = {
    responsive:true,
    title: { text: "THICCNESS SCALE", display: true },
    scales:{
        yAxes:[ {
            ticks:{
                beginAtZero: false
            }
        }
        ]
    }
}

  useSubscription("/topic/prices", (message) => {
    try {
      const data = JSON.parse(message.body);
      // console.log(data);

      const shares = data.latestPrices;
      // console.log(shares);

      const priceHistory = data.priceHistory;
      // console.log(priceHistory);

      setAllShares(shares);
      setAllPriceHistory(priceHistory);
      const filtered = shares.filter(
        (share) =>
          share.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          share.stockId.toString().includes(searchQuery)
      );
      setFilteredShares(filtered);
    } catch (error) {
      console.error("Error parsing message body:", error);
    }
  });

  const handleRowClick = (share) => {
    setStockName(share.name);
    setSelectedShare(share);
    handleGraph(share.name);
  };

  const handleGraph = (name) => {
    let selectedPriceHistory;
    if(handleZoomInOut ? 
      (selectedPriceHistory =  allPriceHistory[name])
       : (selectedPriceHistory = allPriceHistory[name].slice(0, 30)));

    console.log(selectedPriceHistory);
    if (selectedPriceHistory) {
      setChartData({
        labels: selectedPriceHistory.map((data) => data.timestamp),
        datasets: [
          {
            label: `${name} Price History`,
            data: selectedPriceHistory.map((data) => data.price),
            borderColor: "green",
            backgroundColor: "rgba(0, 255, 0, 0.2)",
            tension: 0,
          },
        ],
      });
    }
  };

  useEffect(() => {
    handleGraph(stockName);
  }, [allPriceHistory, stockName]);

  const closeModal = () => {
    setSelectedShare(null);
  };

  const buyStock = async (id, price, quantity, stockName) => {
    console.log(id, price, quantity, stockName);
    try {
      const payload = {
        stockId: id,
        purchaseQuantity: quantity,
      };
      const payload2 = {
        userId: 1,
        stockId: id,
        quantity: quantity,
        stockName: stockName,
        currentPrice: price,
        // totalAmount: quantity * price,
      };

      await axios
        .post(`${BACKEND_URL2}/holdings/buy`, payload2, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        })
        .then(async (res) => {
          console.log(res.data);
          if (res.data === "Insufficient balance") {
            setMsg(res.data);
            closeModal();
          } else {
            await axios
              .put(`${BACKEND_URL1}/api/shares/purchase`, payload, {
                headers: {
                  "ngrok-skip-browser-warning": "true",
                },
              })
              .then((res) => {
                console.log(res.data);
                if (res.data === "Not enough Shares of Stock ID: " + id) {
                  setMsg("Not enough Shares of Stock ID: " + id);
                } else {
                  setMsg("Stock Purchased Successfully");
                }
                closeModal();
              })
              .catch((err) => {
                console.log(err);
                setMsg("Failed to Get ");
              });
          }
        })
        .catch((err) => {
          console.log(err);
          setMsg("Failed to Register User");
        });
    } catch (error) {
      console.error("Error buying stock:", error);
    }
  };

  const addToWatchList = async (id, name) => {
    console.log("dfdd");
    const payload = {
      userId: 1,
      stockId: id,
      stockName: name,
    };
    await axios
      .post(`${BACKEND_URL2}/watchlist/add`, payload, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data === "Not enough Shares of Stock ID: 3") {
          setMsg("Not enough Shares of Stock ID: 3");
        } else {
          setMsg("Stock Added To Watchlist Successfully");
        }
        closeModal();
      })
      .catch((err) => {
        console.log(err);
        setMsg("Failed to Register User");
      });
  };

  const zoomIn = () => {
    setHandleZoomInOut(false);
    setChartData((prevData) => {
        const zoomedLabels = prevData.labels.slice(-30);
        const zoomedData = prevData.datasets.map((dataset) => ({
            ...dataset,
            data: dataset.data.slice(-30),
        }));
        return { labels: zoomedLabels, datasets: zoomedData };
    });
};

const zoomOut = () => {
    setHandleZoomInOut(true);
    handleGraph(stockName);
};

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = allShares.filter(
      (share) =>
        share.name.toLowerCase().includes(query) ||
        share.stockId.toString().includes(query)
    );
    setFilteredShares(filtered);
  };

  return (
    <div className="container">
      <UserNavigation />
      <main className="main">
        <h2>All Shares</h2>

        <div className="contact-container">
          <div className="contact-card">
            <div className="form-group">
              <label for="">Search by Stock ID or Name</label>
              <input
                type="text"
                placeholder="Search by Stock ID or Name"
                value={searchQuery}
                onChange={handleSearch}
                className="search-input"
              />
            </div>
            Note: Click On the Row To Buy The Stock
            <br />
            <br />
            <div className="contact-info">
              <table>
                <thead>
                  <tr>
                    <th>Stock ID</th>
                    <th>Name</th>
                    <th>Current Price</th>
                    <th>Add To Watchlist</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShares.map((share) => (
                    <tr key={share.stockId}>
                      <td onClick={() => handleRowClick(share)}>
                        {share.stockId}
                      </td>
                      <td onClick={() => handleRowClick(share)}>
                        {share.name}
                      </td>
                      <td onClick={() => handleRowClick(share)}>
                        {share.currentPrice.toFixed(2)}
                      </td>
                      <td>
                        <button
                          className="submit-btn"
                          onClick={() =>
                            addToWatchList(share.stockId, share.name)
                          }
                        >
                          Watchlist
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <br />
              <h1 className="success">{msg}</h1>
              {selectedShare && (
                <div className="modal-overlay" onClick={closeModal}>
                  <div
                    className="modal-content"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3>{selectedShare.name}</h3>
                    <p>
                      Available Shares:{" "}
                      <strong>{selectedShare.quantity}</strong>
                    </p>
                    <p>
                      Price per Share:{" "}
                      <strong>₹{selectedShare.currentPrice.toFixed(2)}</strong>
                    </p>
                    <div className="graph-form-group">
                        <label htmlFor="quantity">Enter Quantity to Sell: </label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            min="1"
                            max={selectedShare.quantity}
                            placeholder="Enter quantity"
                        />
                        <br></br>
                        <br></br>
                        <label htmlFor="type">Select Graph Type: </label>
                        <select
                            id="type"
                            name="type"
                            required
                            onChange={(e) => {
                                const graphType = e.target.value;
                                if (graphType === "line") {
                                    setChartData((prevData) => ({
                                        ...prevData,
                                        type: "line",
                                    }));
                                } else if (graphType === "bar") {
                                    setChartData((prevData) => ({
                                        ...prevData,
                                        type: "bar",
                                    }));
                                }
                            }}
                        >
                            <option value="">Select a type</option>
                            <option value="line">Line</option>
                            <option value="bar">Bar</option>
                            <option value="candlestick">Candle Stick</option>
                        </select>
                    </div>                    
                    {document.getElementById("type")?.value === "bar" ? (
                                            <Bar data={chartData} options={barGraphOptions} />
                                        ) : (
                                            <Line data={chartData} options={chartOptions} />
                                        )}
                    
                    {handleZoomInOut ? (<MdOutlineZoomIn className="zoom" onClick={zoomIn} />) : (<MdOutlineZoomOut onClick={zoomOut} className="zoom" />)}
                  
                    <br></br>
                    <button
                      className="buy-btn"
                      onClick={() =>
                        buyStock(
                          selectedShare.stockId,
                          selectedShare.currentPrice,
                          document.getElementById("quantity").value,
                          selectedShare.name
                        )
                      }
                    >
                      Buy Now
                    </button>
                    <br />
                    <button className="confirm-btn" onClick={closeModal}>
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Trading;
