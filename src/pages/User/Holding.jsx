import React, { useState, useEffect } from "react";
import axios from "axios";
import UserNavigation from "../../components/UserComponent/UserNavigation";
// Removed unused import: useSelector
import { useSubscription } from "react-stomp-hooks";
import { BACKEND_URL1, BACKEND_URL2 } from "../../config/backend";
import { ClipLoader } from "react-spinners";
import { Line } from "react-chartjs-2";
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

function Holding() {
  const [holdings, setHoldings] = useState([]);
  const [stockName, setStockName] = useState("");
  const [currentPrice, setCurrentPrice] = useState();
  const [allPriceHistory, setAllPriceHistory] = useState([]);
  const [allShares, setAllShares] = useState([]);
  const [selectedShare, setSelectedShare] = useState(null);
  const [msg, setMsg] = useState("");
  const [handleZoomInOut, setHandleZoomInOut] = useState(true);

  // const userId = useSelector((state) => state.user.id);
  const userId = 1;

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
    },
    responsive: true,
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

  const fetchHoldings = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL2}/holdings/` + userId, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      console.log("Holding Data:", response.data);
      setHoldings(response.data);
    } catch (error) {
      console.error("Error fetching holdings:", error);
      alert("Failed to fetch holdings. Please try again.");
    }
  };

  useEffect(() => {
    fetchHoldings();
  }, []);

  useSubscription("/topic/prices", (message) => {
    try {
      const data = JSON.parse(message.body);
      const shares = data.latestPrices;
      const priceHistory = data.priceHistory;

      setAllShares(shares);
      console.log(shares);
      setAllShares(shares);
      setAllPriceHistory(priceHistory);
    } catch (error) {
      console.error("Error parsing message body:", error);
    }
  });

  const mergedData = holdings.map((stock) => {
    const matchingShare = allShares.find(
      (share) => share.stockId === stock.stockId
    );
    return {
      current: matchingShare ? matchingShare.currentPrice : "...",
      ...stock,
    };
  });

  // Calculate Total Investment
  const totalInvestment = holdings.reduce(
    (total, stock) => total + stock.quantity * stock.currentPrice,
    0
  );

  const currentInvestment = mergedData.reduce(
    (total, stock) => total + stock.quantity * stock.current,
    0
  );

  // Open Modal with Selected Share Details
  const openModal = (share) => {
    setStockName(share.stockName);
    setSelectedShare(share);
    setCurrentPrice(share.currentPrice.toFixed(2));
    handleGraph(share);
  };

  const handleGraph = (name) => {
    let selectedPriceHistory;

    if (
      handleZoomInOut
        ? (selectedPriceHistory = allPriceHistory[name])
        : (selectedPriceHistory = allPriceHistory[name].slice(0, 10))
    );

    console.log(selectedPriceHistory);
    if (selectedPriceHistory) {
      const isPriceHigher = currentPrice < selectedPriceHistory[0]?.price;

      setChartData({
        labels: selectedPriceHistory.map((data) => data.timestamp),
        datasets: [
          {
            label: `${name} Price History`,
            data: selectedPriceHistory.map((data) => data.price),
            borderColor: isPriceHigher ? "green" : "red",
            backgroundColor: isPriceHigher
              ? "rgba(0, 255, 0, 0.2)"
              : "rgba(255, 255, 255, 0.2)",
            tension: 0,
          },
        ],
      });
    }
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

  useEffect(() => {
    handleGraph(stockName);
  }, [allPriceHistory, stockName]);

  const closeModal = () => setSelectedShare(null);

  // Sell Stock
  const sellStock = async (id, price, quantity) => {
    console.log(id, price, quantity);
    try {
      const payload = {
        userId: 1,
        stockId: id,
        quantity: quantity,
        currentPrice: price,
        totalAmount: quantity * price,
      };

      const payload2 = {
        stockId: id,
        purchaseQuantity: quantity,
      };

      await axios
        .post(`${BACKEND_URL2}/holdings/sell/` + id, payload, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        })
        .then(async (res) => {
          console.log(res.data);
          if (res.data === "Insufficient stock quantity") {
            setMsg("Not enough shares to sell");
          } else {
            setMsg("Stock Sold Successfully");
            fetchHoldings();
            setHoldings((prevHoldings) =>
              prevHoldings.map((stock) =>
                stock.id === id
                  ? { ...stock, quantity: stock.quantity - quantity }
                  : stock
              )
            );
            await axios
              .put(`${BACKEND_URL1}/api/shares/sell`, payload2, {
                headers: {
                  "ngrok-skip-browser-warning": "true",
                },
              })
              .then((res) => {
                console.log(res.data);
                if (res.data === "Not enough Shares of Stock ID: " + id) {
                  setMsg("Not enough Shares of Stock ID: " + id);
                } else {
                  setMsg("Stock Sold Successfully");
                }
                closeModal();
              })
              .catch((err) => {
                console.log(err);
                setMsg("Failed to Register User");
              });
          }
          closeModal();
        })
        .catch((err) => {
          console.log(err);
          setMsg("Not enough shares to sell");
          closeModal();
        });
    } catch (error) {
      console.error("Error selling stock:", error);
    }
  };

return (
    <div className="container">
        <UserNavigation />
        <div className="main">
            <h2>Holdings</h2>
            <br></br>
            {allShares.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Stock</th>
                            <th>Quantity</th>
                            <th>Entry Price (₹)</th>
                            <th>Total Value (₹)</th>
                            <th>Listed Price</th>
                            <th>
                                Profit/Loss
                                <br></br> (Per Share)
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {mergedData.map((stock) => (
                            <tr key={stock.portfolioId} onClick={() => openModal(stock)}>
                                <td>{stock.stockName}</td>
                                <td>{stock.quantity}</td>
                                <td>{stock.currentPrice.toFixed(2)}</td>
                                <td>{(stock.quantity * stock.currentPrice).toFixed(2)}</td>
                                <td>
                                    {typeof stock.current === "number"
                                        ? stock.current.toFixed(2)
                                        : "..."}
                                </td>
                                <td
                                    style={{
                                        color:
                                            typeof stock.current === "number" &&
                                            stock.current - stock.currentPrice > 0
                                                ? "green"
                                                : "red",
                                    }}
                                >
                                    ₹
                                    {typeof stock.current === "number"
                                        ? (stock.current - stock.currentPrice).toFixed(2)
                                        : "..."}
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan="3">
                                <strong>Total Investment:</strong>
                            </td>
                            <td>
                                <strong>₹{totalInvestment.toFixed(2)}</strong>
                            </td>
                            <td>
                                <strong>₹{currentInvestment.toFixed(2)}</strong>
                            </td>
                            <td>
                                <strong
                                    style={{
                                        color:
                                            totalInvestment - currentInvestment < 0
                                                ? "green"
                                                : "red",
                                    }}
                                >
                                    ₹{(currentInvestment - totalInvestment).toFixed(2)}
                                </strong>
                            </td>
                        </tr>
                    </tbody>
                </table>
            ) : (
                <table>
                    <ClipLoader />
                </table>
            )}
            <h1 className="success">{msg}</h1>
        </div>

        {selectedShare && (
            <div className="modal-overlay" onClick={closeModal}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <h3>{selectedShare.stockName}</h3>
                    <p>
                        <strong>My Shares:</strong> {selectedShare.quantity}
                    </p>
                    <p>
                        <strong>Entry Price:</strong>{" "}
                        {selectedShare.currentPrice.toFixed(2)}
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
                            {/* <option value="candlestick">Candle</option> */}
                        </select>
                    </div>
                    {document.getElementById("type")?.value === "bar" ? (
                        <Bar data={chartData} options={barGraphOptions} />
                    ) : (
                        <Line data={chartData} options={chartOptions} />
                    )}

                    {handleZoomInOut ? (
                        <MdOutlineZoomIn className="zoom" onClick={zoomIn} />
                    ) : (
                        <MdOutlineZoomOut onClick={zoomOut} className="zoom" />
                    )}
                    <br></br>

                    <button
                        className="sell-btn"
                        onClick={() =>
                            sellStock(
                                selectedShare.portfolioId,
                                selectedShare.current,
                                document.getElementById("quantity").value
                            )
                        }
                    >
                        Sell Now
                    </button>
                    <button className="confirm-btn" onClick={closeModal}>
                        Close
                    </button>
                </div>
            </div>
        )}
    </div>
);
}

export default Holding;
