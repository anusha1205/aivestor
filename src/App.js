import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { FaUserCircle } from "react-icons/fa";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import Education from './pages/Education/Education';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import PnLCalculator from "./components/PnLCalculator";
import GlobeConvert from "./components/GlobeConvert";
import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
const Dashboard = () => {
  const [btcData, setBtcData] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [niftyData, setNiftyData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState("");
  const [userName, setUserName] = useState(""); // Added state for userName
  const { user } = useAuth(); // Getting the user from AuthContext
  const navigate = useNavigate();

  const safeToFixed = (num, digits = 2) =>
    typeof num === "number" ? num.toFixed(digits) : "N/A";

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Signing out
      alert("Logged out");
      navigate("/login"); // Redirect to login
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  useEffect(() => {
    const fetchUserName = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserName(userSnap.data().name); // Setting username fetched from Firestore
        }
      }
    };

    fetchUserName();

    // Fetching Bitcoin data
    fetch("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=5")
      .then(res => res.json())
      .then(data => {
        const labels = data.prices.map(entry => new Date(entry[0]).toLocaleDateString());
        const prices = data.prices.map(entry => entry[1]);

        setBtcData({
          labels,
          datasets: [
            {
              label: "Bitcoin (USD)",
              data: prices,
              borderColor: "#007bff",
              backgroundColor: "rgba(0, 123, 255, 0.1)",
              tension: 0.4,
              fill: true,
              pointRadius: 0,
            },
          ],
        });
      });

    // Fetching Nifty data
    fetch("https://query1.finance.yahoo.com/v8/finance/chart/^NSEI?interval=1m&range=1d")
      .then(res => res.json())
      .then(json => {
        const result = json.chart?.result?.[0];
        if (!result) return;
        const meta = result.meta;
        const quote = result.indicators.quote?.[0] || {};
        const currentPrice = meta.regularMarketPrice;
        const prevClose = meta.chartPreviousClose;
        const change = currentPrice - prevClose;
        const changePercent = ((change / prevClose) * 100).toFixed(2);
        const open = quote.open?.[0] || 0;
        const high = Math.max(...(quote.high || []));
        const low = Math.min(...(quote.low || []));

        setNiftyData({
          currentPrice,
          prevClose,
          change,
          changePercent,
          open,
          high,
          low,
        });
        setLastUpdated(new Date().toLocaleString());
      });

    // Fetching Stock data
    fetch("https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=GZCFLPIXIOC0BXCC")
      .then(res => res.json())
      .then(data => {
        const gainers = data.top_gainers || [];
        setStockData(gainers.slice(0, 5));
      });
  }, [user]); // Re-fetch when the user changes

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div style={{ width: "220px", minHeight: "100vh", background: "#343a40", color: "#fff", padding: "20px" }}>
        <h2 style={{ color: "#fff" }}>AIVestor</h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "24px" }}>
          <Link to="/" style={{ color: "#adb5bd", textDecoration: "none" }}>Dashboard</Link>
          <Link to="/predict" style={{ color: "#adb5bd", textDecoration: "none" }}>UptiqPredict</Link>
          <Link to="/assistant" style={{ color: "#adb5bd", textDecoration: "none" }}>Investment Assistant</Link>
          <Link to="/tools" style={{ color: "#adb5bd", textDecoration: "none" }}>Tools</Link>
          <Link to="/insights" style={{ color: "#adb5bd", textDecoration: "none" }}>Insights</Link>
          <Link to="/education" style={{ color: "#adb5bd", textDecoration: "none" }}>Education Hub</Link>
          <Link to="/" style={{ color: "#adb5bd", textDecoration: "none" }}>User Dashboard</Link>
          <Link to="/pnl" style={{ color: "#adb5bd", textDecoration: "none" }}>PnL Calculator</Link>
          
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, background: "#f1f3f5", padding: "24px" }}>
        {/* Top Bar */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "16px" }}>
          {user && (
            <>
              <span style={{ marginRight: "12px", color: "#343a40", fontWeight: "500" }}>
                {user.email}
              </span>
              <FaUserCircle
                onClick={() => navigate(user ? "/profile" : "/login")}
                style={{ fontSize: "28px", cursor: "pointer", color: "#343a40", marginRight: "12px" }}
                title={user ? "Go to Profile" : "Login / Signup"}
              />
              <button
                onClick={handleLogout}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#dc3545",
                  border: "none",
                  borderRadius: "6px",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Top Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "24px" }}>
          {/* NIFTY BOX */}
          <div style={{ padding: "16px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
            <h2 style={{ marginBottom: "16px" }}>NIFTY 50 Details</h2>
            {niftyData ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div><strong>Current Price:</strong> {safeToFixed(niftyData.currentPrice)}</div>
                <div style={{ color: niftyData.change >= 0 ? "green" : "red" }}>
                  <strong>Change:</strong> {safeToFixed(niftyData.change)} ({safeToFixed(niftyData.changePercent)}%)
                </div>
                <div>
                  <strong>Open:</strong> {safeToFixed(niftyData.open)} |{" "}
                  <strong>High:</strong> {safeToFixed(niftyData.high)} |{" "}
                  <strong>Low:</strong> {safeToFixed(niftyData.low)}
                </div>
                <div style={{ fontSize: "12px", color: "#6c757d" }}>Last updated: {lastUpdated}</div>
              </div>
            ) : (<p>Loading NIFTY data...</p>)}
          </div>

          {/* STOCKS BOX */}
          <div style={{ background: "#fff", padding: "16px", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "12px" }}>Trending Stocks</h3>
            {stockData ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {stockData.map((stock, idx) => (
                  <div key={idx} style={{ backgroundColor: "#f8f9fa", borderRadius: "6px", padding: "10px 12px", border: "1px solid #dee2e6", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                    <div style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "4px" }}>
                      {stock.ticker} — {stock.name}
                    </div>
                    <div style={{ fontSize: "13px" }}>
                      <strong>Price:</strong> ${stock.price}{" "}
                      {stock.change_percentage && (
                        <span style={{ color: stock.change_percentage.startsWith("-") ? "red" : "green" }}>
                          (<strong>{stock.change_percentage}</strong>)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (<p>Loading stocks...</p>)}
          </div>
        </div>

        {/* Bitcoin Chart */}
        <div style={{ padding: "24px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>Bitcoin Chart</h2>
          {btcData ? (
            <div style={{ height: "300px" }}>
              <Line
                data={btcData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: true,
                      position: "bottom",
                      labels: { font: { size: 12 } },
                    },
                  },
                  scales: {
                    x: {
                      ticks: {
                        maxTicksLimit: 6,
                        maxRotation: 0,
                        minRotation: 0,
                      },
                    },
                    y: {
                      ticks: {
                        callback: value => `$${value.toLocaleString()}`,
                      },
                    },
                  },
                }}
              />
            </div>
          ) : (<p>Loading Bitcoin chart...</p>)}
        </div>
      </div>
    </div>
  );
};


const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/predict" element={<div style={{ padding: "24px" }}>UptiqPredict Coming Soon</div>} />
        <Route path="/assistant" element={<div style={{ padding: "24px" }}>Investment Assistant Coming Soon</div>} />
        <Route path="/tools" element={<GlobeConvert />} />
        <Route path="/insights" element={<div style={{ padding: "24px" }}>Insights Dashboard Coming Soon</div>} />
        <Route path="/education" element={<Education />} />
        <Route path="/profile" element={<div style={{ padding: "24px" }}>User Profile Dashboard Coming Soon</div>} />
        <Route path="/pnl" element={<PnLCalculator />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
