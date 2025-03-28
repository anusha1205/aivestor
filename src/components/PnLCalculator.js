import React, { useState } from "react";
import "../css/pnlcalculator.css";

const PnLCalculator = () => {
    const [trades, setTrades] = useState([]);
    const [form, setForm] = useState({ type: "buy", price: "", quantity: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const addTrade = () => {
        const newTrade = {
            type: form.type,
            price: parseFloat(form.price),
            quantity: parseInt(form.quantity),
        };
        setTrades([...trades, newTrade]);
        setForm({ type: "buy", price: "", quantity: "" });
    };

    const computePnL = () => {
        let totalBuy = 0;
        let totalSell = 0;

        trades.forEach((trade) => {
            if (trade.type === "buy") totalBuy += trade.price * trade.quantity;
            else if (trade.type === "sell") totalSell += trade.price * trade.quantity;
        });

        return totalSell - totalBuy;
    };

    const downloadCSV = () => {
        const header = "Type,Price,Quantity\n";
        const rows = trades
            .map((t) => `${t.type},${t.price},${t.quantity}`)
            .join("\n");
        const csv = header + rows;

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "PnL_Report.csv";
        a.click();
    };

    return (
        <div style={{
            background: "#ffffff",
            padding: "32px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            maxWidth: "600px",
            margin: "32px auto",
            fontFamily: "Segoe UI, sans-serif",
            transition: "all 0.3s ease"
        }}>
            <h2 style={{
                fontSize: "24px",
                fontWeight: "600",
                marginBottom: "20px",
                borderBottom: "1px solid #dee2e6",
                paddingBottom: "10px",
                color: "#333"
            }}>📊 Net Profit / Loss Calculator</h2>

            <div style={{
                display: "flex",
                gap: "12px",
                marginBottom: "16px",
                flexWrap: "wrap"
            }}>
                <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    style={{
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ced4da",
                        flex: "1"
                    }}
                >
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
                </select>
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={form.price}
                    onChange={handleChange}
                    style={{
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ced4da",
                        flex: "1"
                    }}
                />
                <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    style={{
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ced4da",
                        flex: "1"
                    }}
                />
                <button
                    onClick={addTrade}
                    style={{
                        background: "#007bff",
                        color: "#fff",
                        padding: "10px 16px",
                        borderRadius: "6px",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "500",
                        flexShrink: 0
                    }}
                >
                    ➕ Add Trade
                </button>
            </div>

            <div style={{
                marginBottom: "16px",
                fontSize: "16px",
                fontWeight: "500"
            }}>
                <span>Total Trades:</span> {trades.length}
            </div>

            <div style={{
                fontSize: "22px",
                fontWeight: "bold",
                color: computePnL() >= 0 ? "#198754" : "#dc3545",
                marginBottom: "20px"
            }}>
                Net PnL: ₹ {computePnL()}
            </div>

            <button
                onClick={downloadCSV}
                style={{
                    background: "#20c997",
                    color: "#fff",
                    padding: "12px 20px",
                    borderRadius: "6px",
                    border: "none",
                    fontWeight: "500",
                    cursor: "pointer"
                }}
            >
                📥 Download PnL Report
            </button>
        </div>

    );
};

export default PnLCalculator;
